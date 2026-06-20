import sqlite3
from typing import List, Dict, Any
from app.repositories.database import db
from app.config import settings

class RbacSyncService:
    """
    Servicio de sincronización idempotente para el Control de Acceso Basado en Roles (RBAC).
    Crea roles, permisos CRUD, menús maestros y sus asociaciones respectivas en el arranque.
    """
    def __init__(self):
        self.modules = [
            "employees", "contracts", "justifications", "attendance_logs", 
            "shifts", "payrolls", "knowledge", "administrators", "system", "security"
        ]
        self.actions = ["create", "read", "update", "delete"]

        # Definición de menús con soporte de árbol (parent_key)
        self.menus = [
            # Grupos principales (parent_key = None)
            {"key": "grupo_control", "label": "Panel de Control", "icon": "folder", "parent_key": None},
            {"key": "grupo_gestion", "label": "Gestión Interna", "icon": "users", "parent_key": None},
            {"key": "grupo_admin", "label": "Administración y TI", "icon": "settings", "parent_key": None},

            # Submenús vinculados
            {"key": "resumen", "label": "Resumen", "icon": "rect", "parent_key": "grupo_control"},
            {"key": "asistencia", "label": "Asistencia", "icon": "calendar", "parent_key": "grupo_control"},
            {"key": "justificaciones", "label": "Justificaciones", "icon": "alert", "parent_key": "grupo_control"},
            {"key": "turnos", "label": "Turnos", "icon": "clock", "parent_key": "grupo_control"},

            {"key": "empleados", "label": "Empleados", "icon": "users", "parent_key": "grupo_gestion"},
            {"key": "planilla", "label": "Planilla", "icon": "dollar", "parent_key": "grupo_gestion"},

            {"key": "prediccion", "label": "Predicción IA", "icon": "brain", "parent_key": "grupo_admin"},
            {"key": "terminales", "label": "Terminales", "icon": "cpu", "parent_key": "grupo_admin"},
            {"key": "auditoria", "label": "Auditoría", "icon": "file-text", "parent_key": "grupo_admin"},
            {"key": "administradores", "label": "Administradores", "icon": "user-check", "parent_key": "grupo_admin"},
            {"key": "seguridad", "label": "Seguridad y RBAC", "icon": "lock", "parent_key": "grupo_admin"}
        ]

    def _execute_write_sync(self, query: str, params: tuple = ()) -> Any:
        """Helper local para ejecutar escrituras relacionales."""
        if db.is_sqlite:
            query = query.replace("%s", "?")
            query_clean = query.split("RETURNING")[0].strip()
            with db.get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute(query_clean, params)
                return cursor.lastrowid
        else:
            with db.get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute(query, params)
                if "RETURNING" in query.upper():
                    res = cursor.fetchone()
                    return res[0] if res else None
                return None

    async def sync_database_rbac(self):
        """Ejecuta la sincronización completa del esquema de seguridad."""
        print("[RBAC SYNC] Iniciando sincronización de roles, permisos y menús...")

        # 1. Sincronizar Roles
        roles_data = [
            {"name": "super_admin", "description": "Administrador supremo con acceso a auditoría, periféricos y gestión de usuarios."},
            {"name": "admin", "description": "Gestor de Recursos Humanos. Acceso a empleados, planillas, asistencia y turnos."},
            {"name": "operator", "description": "Supervisor o consultor. Acceso de solo lectura a los módulos operativos."}
        ]
        
        roles_map = {}
        for r in roles_data:
            existing = db.execute_query("SELECT id FROM roles WHERE name = %s", (r["name"],))
            if existing:
                role_id = existing[0]["id"]
            else:
                role_id = self._execute_write_sync(
                    "INSERT INTO roles (name, description, created_by) VALUES (%s, %s, %s) RETURNING id",
                    (r["name"], r["description"], "system")
                )
                print(f"[RBAC SYNC] Creado rol: {r['name']} (ID: {role_id})")
            roles_map[r["name"]] = role_id

        # 2. Sincronizar Menús
        menus_map = {}
        for m in self.menus:
            existing = db.execute_query("SELECT id FROM menus WHERE key = %s", (m["key"],))
            if existing:
                menu_id = existing[0]["id"]
            else:
                menu_id = self._execute_write_sync(
                    "INSERT INTO menus (key, label, icon, created_by) VALUES (%s, %s, %s, %s) RETURNING id",
                    (m["key"], m["label"], m["icon"], "system")
                )
                print(f"[RBAC SYNC] Creado menú: {m['key']} (ID: {menu_id})")
            menus_map[m["key"]] = menu_id

        # Actualizar parent_id jerárquico en los menús en base a parent_key
        for m in self.menus:
            parent_key = m.get("parent_key")
            menu_id = menus_map[m["key"]]
            if parent_key and parent_key in menus_map:
                parent_id = menus_map[parent_key]
                self._execute_write_sync(
                    "UPDATE menus SET parent_id = %s WHERE id = %s",
                    (parent_id, menu_id)
                )

        # 3. Sincronizar Permisos CRUD para cada módulo
        permissions_map = {} # code -> id
        for module in self.modules:
            for action in self.actions:
                code = f"{module}:{action}"
                existing = db.execute_query("SELECT id FROM permissions WHERE code = %s", (code,))
                if existing:
                    perm_id = existing[0]["id"]
                else:
                    perm_id = self._execute_write_sync(
                        "INSERT INTO permissions (module, action, code, created_by) VALUES (%s, %s, %s, %s) RETURNING id",
                        (module, action, code, "system")
                    )
                    print(f"[RBAC SYNC] Creado permiso: {code} (ID: {perm_id})")
                permissions_map[code] = perm_id

        # 4. Comprobar si ya existen asociaciones en role_menus para decidir si inicializamos por defecto
        role_menus_count = db.execute_query("SELECT COUNT(*) as cnt FROM role_menus")[0]["cnt"]
        if role_menus_count == 0:
            print("[RBAC SYNC] Cargando asociaciones RBAC por defecto...")
            # --- A. SUPER_ADMIN ---
            # Menús: Todos
            for menu_id in menus_map.values():
                self._execute_write_sync("INSERT INTO role_menus (role_id, menu_id) VALUES (%s, %s)", (roles_map["super_admin"], menu_id))
            # Permisos: Todos
            for perm_id in permissions_map.values():
                self._execute_write_sync("INSERT INTO role_permissions (role_id, permission_id) VALUES (%s, %s)", (roles_map["super_admin"], perm_id))

            # --- B. ADMIN ---
            # Menús: Todos excepto terminales, auditoria, administradores, seguridad
            admin_menus = ["grupo_control", "grupo_gestion", "grupo_admin", "resumen", "asistencia", "planilla", "empleados", "justificaciones", "turnos", "prediccion"]
            for key in admin_menus:
                if key in menus_map:
                    self._execute_write_sync("INSERT INTO role_menus (role_id, menu_id) VALUES (%s, %s)", (roles_map["admin"], menus_map[key]))
            # Permisos: CRUD en todos excepto administradores, system y security
            for code, perm_id in permissions_map.items():
                mod = code.split(":")[0]
                if mod not in ["administrators", "system", "security"]:
                    self._execute_write_sync("INSERT INTO role_permissions (role_id, permission_id) VALUES (%s, %s)", (roles_map["admin"], perm_id))

            # --- C. OPERATOR ---
            # Menús: resumen, asistencia, empleados, justificaciones, turnos, prediccion
            operator_menus = ["grupo_control", "grupo_gestion", "grupo_admin", "resumen", "asistencia", "empleados", "justificaciones", "turnos", "prediccion"]
            for key in operator_menus:
                if key in menus_map:
                    self._execute_write_sync("INSERT INTO role_menus (role_id, menu_id) VALUES (%s, %s)", (roles_map["operator"], menus_map[key]))
            # Permisos: Solo 'read' en los módulos no financieros ni administrativos
            operator_allowed_modules = ["employees", "attendance_logs", "justifications", "shifts", "knowledge"]
            for code, perm_id in permissions_map.items():
                mod, act = code.split(":")
                if mod in operator_allowed_modules and act == "read":
                    self._execute_write_sync("INSERT INTO role_permissions (role_id, permission_id) VALUES (%s, %s)", (roles_map["operator"], perm_id))
        else:
            print("[RBAC SYNC] Se detectaron asignaciones existentes. Respetando modificaciones personalizadas de seguridad.")
            # Asegurar que super_admin siempre tenga todos los menús y permisos (por ejemplo, si agregamos nuevos menús)
            super_admin_id = roles_map["super_admin"]
            for menu_id in menus_map.values():
                existing = db.execute_query("SELECT 1 FROM role_menus WHERE role_id = %s AND menu_id = %s", (super_admin_id, menu_id))
                if not existing:
                    self._execute_write_sync("INSERT INTO role_menus (role_id, menu_id) VALUES (%s, %s)", (super_admin_id, menu_id))
            for perm_id in permissions_map.values():
                existing = db.execute_query("SELECT 1 FROM role_permissions WHERE role_id = %s AND permission_id = %s", (super_admin_id, perm_id))
                if not existing:
                    self._execute_write_sync("INSERT INTO role_permissions (role_id, permission_id) VALUES (%s, %s)", (super_admin_id, perm_id))

        print("[RBAC SYNC] Relaciones de roles, permisos y menús sincronizadas.")

        # 6. Sincronizar administradores existentes (asignarles su role_id correspondiente)
        admin_username = settings.INITIAL_ADMIN_USERNAME.strip()
        admins = db.execute_query("SELECT id, username, role FROM administrators")
        for adm in admins:
            role_name = "admin"
            if adm["username"] == admin_username or adm["role"] == "super_admin":
                role_name = "super_admin"
            elif adm["role"] == "operator":
                role_name = "operator"
            elif adm["role"] == "admin":
                role_name = "admin"
                
            role_id = roles_map[role_name]
            self._execute_write_sync(
                "UPDATE administrators SET role_id = %s WHERE id = %s",
                (role_id, adm["id"])
            )
        print(f"[RBAC SYNC] Cuentas de administradores sincronizadas con sus nuevos identificadores de roles.")
