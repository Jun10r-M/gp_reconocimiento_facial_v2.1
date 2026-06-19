import os
import sqlite3
import psycopg2
from contextlib import contextmanager
from typing import Generator, Any
from app.config import settings

class Database:
    """
    Gestor de base de datos unificado.
    Detecta automáticamente si el entorno está usando PostgreSQL o un fallback de SQLite.
    Soporta traducción automática de placeholders de consulta (%s -> ?) en SQLite para QA/Tests.
    """
    _instance = None

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super(Database, cls).__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self):
        if self._initialized:
            return
        
        # URL de conexión (puede configurarse mediante variables de entorno)
        # Formato esperado: postgresql://username:password@host:port/dbname
        self.db_url = os.environ.get("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/asistencia_db")
        
        # Determinar si usamos SQLite (fallback para pruebas locales y unitarias)
        # Si la URL contiene sqlite o si estamos ejecutando pruebas unitarias de pytest
        self.is_sqlite = "sqlite" in self.db_url or "pytest" in os.environ.get("PYTEST_CURRENT_TEST", "")
        
        if self.is_sqlite:
            # Archivo SQLite local en la carpeta de base de datos estructurada
            self.sqlite_path = os.path.join(settings.DB_DIR, "attendance.db")
            # Inicializar tablas locales para SQLite
            self._initialize_sqlite()
        
        # Ejecutar migración automática de la columna 'tolerance' en la tabla 'shifts'
        self._migrate_shifts_tolerance()
        # Asegurar tabla de AFP configs
        self._migrate_afp_configs()
        
        self._initialized = True

    def _initialize_sqlite(self):
        """Inicializa la base de datos SQLite ejecutando el archivo schema.sql adaptado."""
        # Comprobar si la base de datos existente tiene el esquema antiguo
        db_needs_recreate = False
        if os.path.exists(self.sqlite_path):
            try:
                conn = sqlite3.connect(self.sqlite_path)
                cursor = conn.cursor()
                # 1. Verificar columnas de auditoria
                cursor.execute("PRAGMA table_info(employees)")
                cols = [c[1] for c in cursor.fetchall()]
                if cols and "created_by" not in cols:
                    db_needs_recreate = True
                
                # 2. Verificar existencia de la tabla roles (RBAC)
                if not db_needs_recreate:
                    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='roles'")
                    if not cursor.fetchone():
                        db_needs_recreate = True
                
                # 3. Verificar si la columna parent_id existe en menus
                if not db_needs_recreate:
                    cursor.execute("PRAGMA table_info(menus)")
                    cols_menus = [c[1] for c in cursor.fetchall()]
                    if cols_menus and "parent_id" not in cols_menus:
                        db_needs_recreate = True
                conn.close()
            except Exception:
                db_needs_recreate = True

        if db_needs_recreate:
            print("[BASE DE DATOS] Detectado esquema de base de datos antiguo. Recreando base de datos con columnas de auditoría...")
            try:
                if os.path.exists(self.sqlite_path):
                    os.remove(self.sqlite_path)
            except Exception as e:
                print(f"[BASE DE DATOS ERROR] No se pudo borrar base de datos antigua: {e}")

        print(f"[BASE DE DATOS] Inicializando SQLite local de fallback en: {self.sqlite_path}")
        project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        schema_path = os.path.join(project_root, "schema.sql")
        
        if not os.path.exists(schema_path):
            print("[BASE DE DATOS ERROR] No se encontró schema.sql en la raíz.")
            return

        with open(schema_path, "r", encoding="utf-8") as f:
            sql_script = f.read()

        # Adaptar dialecto PostgreSQL a SQLite para pruebas locales
        sql_script = sql_script.replace("SERIAL PRIMARY KEY", "INTEGER PRIMARY KEY AUTOINCREMENT")
        sql_script = sql_script.replace("GENERATED ALWAYS AS (first_names || ' ' || last_names) STORED", "")
        sql_script = sql_script.replace("full_name VARCHAR(200) ,", "full_name VARCHAR(200),")
        # Quitar validaciones CHECK de TIME y otros detalles
        
        conn = sqlite3.connect(self.sqlite_path)
        try:
            # En SQLite, full_name debe crearse como columna normal si no soporta GENERATED
            # y lo manejaremos mediante un trigger o cálculo en el repositorio.
            conn.executescript(sql_script)
            
            # Crear columna full_name de forma explícita si no se creó
            cursor = conn.cursor()
            cursor.execute("PRAGMA table_info(employees)")
            cols = [c[1] for c in cursor.fetchall()]
            if cols and "full_name" not in cols:
                conn.execute("ALTER TABLE employees ADD COLUMN full_name VARCHAR(200)")
            conn.commit()
        except Exception as e:
            print(f"[BASE DE DATOS ERROR] No se pudo inicializar esquema SQLite: {e}")
        finally:
            conn.close()

    def _migrate_shifts_tolerance(self):
        """Asegura que la columna 'tolerance' existe en la tabla 'shifts'."""
        try:
            with self.get_connection() as conn:
                cursor = conn.cursor()
                if self.is_sqlite:
                    cursor.execute("PRAGMA table_info(shifts)")
                    cols = [c[1] for c in cursor.fetchall()]
                    if cols and "tolerance" not in cols:
                        print("[MIGRACIÓN] Agregando columna 'tolerance' a tabla 'shifts' (SQLite)...")
                        cursor.execute("ALTER TABLE shifts ADD COLUMN tolerance INTEGER DEFAULT 10")
                        conn.commit()
                else:
                    cursor.execute("""
                        SELECT column_name 
                        FROM information_schema.columns 
                        WHERE table_name='shifts' AND column_name='tolerance'
                    """)
                    if not cursor.fetchone():
                        print("[MIGRACIÓN] Agregando columna 'tolerance' a tabla 'shifts' (PostgreSQL)...")
                        cursor.execute("ALTER TABLE shifts ADD COLUMN tolerance INTEGER DEFAULT 10")
                        conn.commit()
        except Exception as e:
            print(f"[BASE DE DATOS ERROR] Error al migrar columna 'tolerance' en 'shifts': {e}")

    def _migrate_afp_configs(self):
        """Asegura que existe la tabla 'afp_configs' y la puebla si está vacía."""
        try:
            with self.get_connection() as conn:
                cursor = conn.cursor()
                if self.is_sqlite:
                    cursor.execute("""
                        CREATE TABLE IF NOT EXISTS afp_configs (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            name VARCHAR(50) UNIQUE NOT NULL,
                            mandatory_contribution DECIMAL(5, 4) DEFAULT 0.1000,
                            insurance_premium DECIMAL(5, 4) NOT NULL,
                            flow_commission DECIMAL(5, 4) DEFAULT 0.0100,
                            updated_at TIMESTAMP,
                            updated_by VARCHAR(50)
                        )
                    """)
                else:
                    cursor.execute("""
                        CREATE TABLE IF NOT EXISTS afp_configs (
                            id SERIAL PRIMARY KEY,
                            name VARCHAR(50) UNIQUE NOT NULL,
                            mandatory_contribution DECIMAL(5, 4) DEFAULT 0.1000,
                            insurance_premium DECIMAL(5, 4) NOT NULL,
                            flow_commission DECIMAL(5, 4) DEFAULT 0.0100,
                            updated_at TIMESTAMP,
                            updated_by VARCHAR(50)
                        )
                    """)
                conn.commit()

                # Sembrar datos si está vacía
                cursor.execute("SELECT COUNT(*) as cnt FROM afp_configs")
                count_res = cursor.fetchone()
                count = count_res["cnt"] if self.is_sqlite or isinstance(count_res, dict) else count_res[0]

                if count == 0:
                    print("[MIGRACIÓN] Sembrando configuraciones AFP por defecto...")
                    afps = [
                        ("Integra", 0.1000, 0.0184, 0.0100),
                        ("Habitat", 0.1000, 0.0182, 0.0100),
                        ("Prima", 0.1000, 0.0186, 0.0100),
                        ("Profuturo", 0.1000, 0.0184, 0.0100)
                    ]
                    for name, contribution, premium, commission in afps:
                        if self.is_sqlite:
                            cursor.execute("""
                                INSERT INTO afp_configs (name, mandatory_contribution, insurance_premium, flow_commission, updated_at, updated_by)
                                VALUES (?, ?, ?, ?, datetime('now'), 'system')
                            """, (name, contribution, premium, commission))
                        else:
                            cursor.execute("""
                                INSERT INTO afp_configs (name, mandatory_contribution, insurance_premium, flow_commission, updated_at, updated_by)
                                VALUES (%s, %s, %s, %s, CURRENT_TIMESTAMP, 'system')
                            """, (name, contribution, premium, commission))
                    conn.commit()
        except Exception as e:
            print(f"[BASE DE DATOS ERROR] Error al migrar e inicializar tabla 'afp_configs': {e}")

    @contextmanager
    def get_connection(self) -> Generator[Any, None, None]:
        """Provee una conexión activa a la base de datos (PostgreSQL o SQLite)."""
        if self.is_sqlite:
            conn = sqlite3.connect(self.sqlite_path)
            conn.row_factory = sqlite3.Row  # Devolver filas como diccionarios
            try:
                yield conn
                conn.commit()
            except Exception as e:
                conn.rollback()
                raise e
            finally:
                conn.close()
        else:
            try:
                conn = psycopg2.connect(self.db_url)
            except Exception as e:
                error_msg = str(e)
                if isinstance(e, UnicodeDecodeError) or "decode" in type(e).__name__.lower():
                    error_msg = "Error de decodificación en Windows. El servidor PostgreSQL probablemente está inactivo o las credenciales son incorrectas."
                
                print("\n" + "="*80)
                print(f"[ERROR DE BASE DE DATOS] No se pudo conectar a PostgreSQL: {error_msg}")
                print("-"*80)
                print("COMO SOLUCIONARLO:")
                print("1. Si estás usando PowerShell (PS), ejecuta:")
                print("   $env:DATABASE_URL=\"sqlite:///data/db/attendance.db\"")
                print("2. Si estás usando el Símbolo del Sistema (cmd), ejecuta:")
                print("   set DATABASE_URL=sqlite:///data/db/attendance.db")
                print("3. Si deseas usar PostgreSQL, verifica que el servicio esté corriendo y la base de datos exista.")
                print("="*80 + "\n")
                raise RuntimeError(f"Error de conexion a la base de datos: {error_msg}") from e

            try:
                yield conn
                conn.commit()
            except Exception as e:
                conn.rollback()
                raise e
            finally:
                conn.close()

    def execute_query(self, query: str, params: tuple = ()) -> list:
        """Ejecuta una consulta SELECT y devuelve los resultados formateados como lista de dicts."""
        # Traducir sintaxis de placeholder si es SQLite (%s -> ?)
        if self.is_sqlite:
            query = query.replace("%s", "?")

        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(query, params)
            
            if self.is_sqlite:
                # SQLite devuelve objetos Row
                rows = cursor.fetchall()
                return [dict(row) for row in rows]
            else:
                # PostgreSQL requiere mapeo manual del cursor a dicts
                try:
                    columns = [desc[0] for desc in cursor.description]
                    return [dict(zip(columns, row)) for row in cursor.fetchall()]
                except TypeError:
                    return []

    def execute_write(self, query: str, params: tuple = ()) -> Any:
        """Ejecuta una operación de escritura (INSERT, UPDATE, DELETE) y devuelve el ID insertado."""
        if self.is_sqlite:
            query = query.replace("%s", "?")
            # SQLite no soporta RETURNING id directamente de la misma forma en algunas versiones,
            # pero sqlite3 nos da lastrowid
            # Limpiar RETURNING id de la consulta
            query_clean = query.split("RETURNING")[0].strip()
            with self.get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute(query_clean, params)
                return cursor.lastrowid
        else:
            with self.get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute(query, params)
                try:
                    # Devolver el id retornado
                    result = cursor.fetchone()
                    return result[0] if result else None
                except Exception:
                    return None

db = Database()
