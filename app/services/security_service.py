from typing import List, Dict, Any
from app.repositories.database import db
from app.services.audit_log_service import AuditLogService

class SecurityService:
    def __init__(self, audit_service: AuditLogService = None):
        self.audit_service = audit_service or AuditLogService()

    async def get_menus(self) -> List[Dict[str, Any]]:
        """Retorna todos los menús de la base de datos."""
        return db.execute_query("SELECT id, key, label, icon, parent_id FROM menus ORDER BY id ASC")

    async def update_menu(self, menu_id: int, label: str, icon: str, parent_id: Any, username: str) -> bool:
        """Actualiza un menú existente en el sistema (etiqueta, icono y parent_id)."""
        # Validar referencia circular
        if parent_id is not None:
            try:
                p_id = int(parent_id)
                if p_id == menu_id:
                    raise ValueError("Un menú no puede ser su propio padre.")
                
                # Verificar que el parent_id exista
                parent_exists = db.execute_query("SELECT id FROM menus WHERE id = %s", (p_id,))
                if not parent_exists:
                    raise ValueError("El menú padre especificado no existe.")
                parent_id = p_id
            except (TypeError, ValueError) as e:
                if str(e) == "Un menú no puede ser su propio padre.":
                    raise e
                parent_id = None
        else:
            parent_id = None

        db.execute_write(
            "UPDATE menus SET label = %s, icon = %s, parent_id = %s, updated_at = CURRENT_TIMESTAMP, updated_by = %s WHERE id = %s",
            (label, icon, parent_id, username, menu_id)
        )
        await self.audit_service.log_action(
            username=username,
            action="UPDATE_MENU",
            description=f"Modificado menú ID {menu_id}: nueva etiqueta '{label}', icono '{icon}', parent_id {parent_id}"
        )
        return True

    async def get_permissions(self) -> List[Dict[str, Any]]:
        """Retorna todos los permisos registrados en el sistema."""
        return db.execute_query("SELECT id, module, action, code FROM permissions ORDER BY module ASC, action ASC")

    async def get_roles(self) -> List[Dict[str, Any]]:
        """Retorna los roles registrados en el sistema."""
        return db.execute_query("SELECT id, name, description FROM roles ORDER BY id ASC")

    async def get_role_assignments(self, role_id: int) -> Dict[str, List[int]]:
        """Obtiene las asignaciones de menús y permisos para un rol específico."""
        menus = db.execute_query("SELECT menu_id FROM role_menus WHERE role_id = %s", (role_id,))
        perms = db.execute_query("SELECT permission_id FROM role_permissions WHERE role_id = %s", (role_id,))
        
        return {
            "menu_ids": [m["menu_id"] for m in menus],
            "permission_ids": [p["permission_id"] for p in perms]
        }

    async def update_role_assignments(self, role_id: int, menu_ids: List[int], permission_ids: List[int], username: str):
        """Actualiza en una sola transacción las asignaciones de menús y permisos para un rol."""
        # Obtener información del rol para el log
        role_info = db.execute_query("SELECT name FROM roles WHERE id = %s", (role_id,))
        role_name = role_info[0]["name"] if role_info else f"ID {role_id}"

        # Realizar transacciones de escritura limpia
        with db.get_connection() as conn:
            cursor = conn.cursor()
            
            # Limpiar asignaciones previas de este rol
            cursor.execute("DELETE FROM role_menus WHERE role_id = %s" if not db.is_sqlite else "DELETE FROM role_menus WHERE role_id = ?", (role_id,))
            cursor.execute("DELETE FROM role_permissions WHERE role_id = %s" if not db.is_sqlite else "DELETE FROM role_permissions WHERE role_id = ?", (role_id,))
            
            # Insertar nuevos menús
            for m_id in menu_ids:
                cursor.execute(
                    "INSERT INTO role_menus (role_id, menu_id) VALUES (%s, %s)" if not db.is_sqlite else "INSERT INTO role_menus (role_id, menu_id) VALUES (?, ?)",
                    (role_id, m_id)
                )
                
            # Insertar nuevos permisos
            for p_id in permission_ids:
                cursor.execute(
                    "INSERT INTO role_permissions (role_id, permission_id) VALUES (%s, %s)" if not db.is_sqlite else "INSERT INTO role_permissions (role_id, permission_id) VALUES (?, ?)",
                    (role_id, p_id)
                )
                
            conn.commit()

        await self.audit_service.log_action(
            username=username,
            action="UPDATE_RBAC",
            description=f"Modificada matriz del rol '{role_name}': {len(menu_ids)} menús y {len(permission_ids)} permisos asignados."
        )
