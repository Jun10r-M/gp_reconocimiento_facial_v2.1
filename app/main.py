import os
import shutil
import json
from datetime import datetime, date
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from app.config import settings
from app.api.router import api_router
from app.repositories.database import db
from app.services.facial_service import FacialService

async def provision_initial_admin():
    username = settings.INITIAL_ADMIN_USERNAME.strip()
    email = settings.INITIAL_ADMIN_EMAIL.strip()
    password = settings.INITIAL_ADMIN_PASSWORD
    
    if username and email and password:
        from app.services.auth_service import AuthService
        service = AuthService()
        existing = await service.repository.get_by_username(username)
        if not existing:
            print(f"[PROVISIÓN] Detectada configuración de administrador inicial. Creando cuenta: {username}...")
            admin_id = await service.register_admin(username, email, password, role="super_admin")
            if admin_id:
                print(f"[PROVISIÓN] Administrador inicial creado con ID: {admin_id} y rol 'super_admin'.")
                from app.services.audit_log_service import AuditLogService
                await AuditLogService().log_action(
                    username="system",
                    action="PROVISIÓN_ADMINISTRADOR",
                    description=f"Auto-provisión de cuenta administrativa inicial '{username}' ({email})."
                )
            else:
                print("[PROVISIÓN] Advertencia: No se pudo auto-proveer el usuario administrador.")
        else:
            print(f"[PROVISIÓN] La cuenta administrativa '{username}' ya existe. Omitiendo.")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # 1. Correr migración automática de datos JSON a base relacional SQL
    run_legacy_migration_to_sql()
    
    # 2. Inicializar y entrenar modelo facial CNN
    facial_service = FacialService()
    print("[SERVIDOR] Módulos de IA inicializados y listos.")
    
    # 3. Provisión automática de administrador inicial
    await provision_initial_admin()
    
    # 4. Sincronizar roles, permisos y menús en base de datos (RBAC)
    from app.services.rbac_sync_service import RbacSyncService
    await RbacSyncService().sync_database_rbac()
    
    yield

app = FastAPI(
    title="Sistema de Asistencia y Planilla IA - API",
    version="2.0.0",
    lifespan=lifespan,
    openapi_tags=[
        {"name": "Administrators", "description": "Gestión de cuentas administrativas y perfiles."},
        {"name": "Employees", "description": "Fichas de personal y datos de trabajadores."},
        {"name": "Contracts", "description": "Contratos laborales y sueldos."},
        {"name": "Attendance", "description": "Bitácora de asistencia y marcaciones."},
        {"name": "Justifications", "description": "Licencias y justificaciones médicas."},
        {"name": "Payrolls", "description": "Planillas de remuneración."},
        {"name": "Shifts", "description": "Horarios y turnos de colaboradores."},
        {"name": "Terminals", "description": "Dispositivos físicos y hardware."},
        {"name": "Knowledge", "description": "Base de conocimiento de IA."},
        {"name": "Facial", "description": "Reconocimiento facial."},
        {"name": "Security", "description": "Control de acceso y RBAC."}
    ],
    docs_url="/docs",
    redoc_url="/redoc"
)

def run_legacy_migration_to_sql():
    """
    Lee los antiguos archivos JSON heredados y los migra a la base de datos relacional (PostgreSQL/SQLite).
    Previene pérdida de datos históricos de empleados, asistencias y conocimiento del chatbot.
    """
    # Rutas heredadas (buscamos en la raíz o en data/db/ si ya fueron movidos)
    legacy_paths = {
        "employees": [os.path.join(settings.DB_DIR, "empleados.json"), "empleados.json"],
        "attendance": [os.path.join(settings.DB_DIR, "asistencia.json"), "asistencia.json"],
        "knowledge": [os.path.join(settings.DB_DIR, "knowledge.json"), "knowledge.json"]
    }

    # Helper para traducir placeholders SQL si usamos SQLite
    def cursor_execute(cursor, query, params=()):
        if db.is_sqlite:
            query = query.replace("%s", "?")
            query = query.replace("ILIKE", "LIKE")
        cursor.execute(query, params)

    # Helper para buscar y abrir archivo existente
    def load_legacy_json(keys):
        for path in keys:
            if os.path.exists(path):
                try:
                    with open(path, "r", encoding="utf-8") as f:
                        return json.load(f), path
                except Exception as e:
                    print(f"[MIGRACIÓN ERROR] Fallo al leer {path}: {e}")
        return None, None

    # 1. Migrar Empleados y Contratos
    employees_data, emp_path = load_legacy_json(legacy_paths["employees"])
    if employees_data:
        print(f"[MIGRACIÓN] Iniciando migración de empleados desde {emp_path}...")
        with db.get_connection() as conn:
            cursor = conn.cursor()
            for emp in employees_data:
                doc = emp["documento"]
                # Comprobar si ya existe en la DB SQL
                cursor_execute(cursor, "SELECT id FROM employees WHERE document_number = %s", (doc,))
                if cursor.fetchone():
                    continue

                # Separar nombre en nombres y apellidos
                full = emp["nombre"].strip()
                parts = full.split(" ", 1)
                first = parts[0]
                last = parts[1] if len(parts) > 1 else "-"

                # Insertar en employees
                insert_emp = """
                    INSERT INTO employees (first_names, last_names, document_number, email, phone, has_children, pension_system)
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                """
                cursor_execute(cursor, insert_emp, (
                    first, 
                    last, 
                    doc, 
                    f"{first.lower()}@compania.pe", 
                    None, 
                    False, 
                    "ONP"
                ))
                
                # Obtener ID insertado
                if db.is_sqlite:
                    employee_id = cursor.lastrowid
                    # Actualizar full_name en SQLite
                    cursor_execute(cursor, "UPDATE employees SET full_name = %s WHERE id = %s", (full, employee_id))
                else:
                    # En Postgres RETURNING id se evalúa
                    cursor_execute(cursor, "SELECT currval(pg_get_serial_sequence('employees','id'))")
                    employee_id = cursor.fetchone()[0]

                # Insertar su contrato inicial en la tabla contracts
                insert_contract = """
                    INSERT INTO contracts (employee_id, position, monthly_salary, hourly_wage, start_date, is_active)
                    VALUES (%s, %s, %s, %s, %s, %s)
                """
                salary = float(emp.get("sueldo", 1500.0))
                hourly = round(salary / 240, 2)
                cursor_execute(cursor, insert_contract, (
                    employee_id,
                    emp.get("puesto", "Estudiante"),
                    salary,
                    hourly,
                    date.today(),
                    True
                ))
            conn.commit()
        print("[MIGRACIÓN] Empleados y contratos migrados correctamente a SQL.")

    # 2. Migrar Asistencias
    attendance_data, att_path = load_legacy_json(legacy_paths["attendance"])
    if attendance_data:
        print(f"[MIGRACIÓN] Iniciando migración de asistencias desde {att_path}...")
        with db.get_connection() as conn:
            cursor = conn.cursor()
            for log in attendance_data:
                name = log["nombre"]
                # Resolver ID del empleado
                # Primero separar el nombre para buscar
                parts = name.strip().split(" ", 1)
                first = parts[0]
                
                cursor_execute(cursor, "SELECT id FROM employees WHERE first_names ILIKE %s OR full_name ILIKE %s LIMIT 1" if not db.is_sqlite else 
                               "SELECT id FROM employees WHERE first_names LIKE %s OR full_name LIKE %s LIMIT 1", 
                               (first, name))
                row = cursor.fetchone()
                if not row:
                    continue
                
                employee_id = row[0]
                timestamp_str = log.get("timestamp") or log.get("entrada")
                if not timestamp_str:
                    continue

                # Comprobar si ya existe esta marcación exacta
                cursor_execute(cursor, 
                    "SELECT id FROM attendance_logs WHERE employee_id = %s AND timestamp = %s",
                    (employee_id, timestamp_str)
                )
                if cursor.fetchone():
                    continue

                insert_log = "INSERT INTO attendance_logs (employee_id, timestamp, method) VALUES (%s, %s, %s)"
                cursor_execute(cursor, insert_log, (employee_id, timestamp_str, "face"))
            conn.commit()
        print("[MIGRACIÓN] Bitácora de asistencia migrada correctamente a SQL.")

    # 3. Migrar Chatbot
    knowledge_data, kn_path = load_legacy_json(legacy_paths["knowledge"])
    if knowledge_data:
        print(f"[MIGRACIÓN] Iniciando migración del chatbot desde {kn_path}...")
        with db.get_connection() as conn:
            cursor = conn.cursor()
            # knowledge_data es dict {question: answer}
            for q, a in knowledge_data.items():
                clean_q = q.lower().strip()
                cursor_execute(cursor, "SELECT question FROM knowledge WHERE question = %s", (clean_q,))
                if cursor.fetchone():
                    continue
                cursor_execute(cursor, "INSERT INTO knowledge (question, answer) VALUES (%s, %s)", (clean_q, a))
            conn.commit()
        print("[MIGRACIÓN] Conocimiento del chatbot migrado a SQL.")

    # Eliminar/Renombrar archivos JSON de respaldo para evitar segundas migraciones
    for key, paths in legacy_paths.items():
        for path in paths:
            if os.path.exists(path):
                try:
                    os.rename(path, f"{path}.backup")
                except:
                    pass

# Registrar routers con documentación Swagger
app.include_router(api_router)

# Enrutamiento de páginas limpias (Clean URLs)
from fastapi.responses import FileResponse, RedirectResponse

@app.get("/login")
async def login_page():
    return FileResponse(
        os.path.join(settings.STATIC_DIR, "login.html"),
        headers={"Cache-Control": "no-store, no-cache, must-revalidate, max-age=0"}
    )

@app.get("/admin")
@app.get("/admin/{path:path}")
async def admin_page(path: str = ""):
    return FileResponse(
        os.path.join(settings.STATIC_DIR, "admin.html"),
        headers={"Cache-Control": "no-store, no-cache, must-revalidate, max-age=0"}
    )

@app.get("/")
async def root():
    return RedirectResponse(url="/login")

# Servir archivos estáticos del frontend
os.makedirs(settings.STATIC_DIR, exist_ok=True)
app.mount("/", StaticFiles(directory=settings.STATIC_DIR, html=True), name="static")
