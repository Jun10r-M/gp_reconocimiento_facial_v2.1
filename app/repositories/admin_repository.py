from typing import Optional, List
from app.repositories.database import db

MAX_FAILED_ATTEMPTS = 3

class AdminRepository:
    async def get_by_username(self, username: str) -> Optional[dict]:
        query = "SELECT * FROM administrators WHERE username = %s AND deleted_at IS NULL"
        results = db.execute_query(query, (username,))
        return results[0] if results else None

    async def get_by_email(self, email: str) -> Optional[dict]:
        query = "SELECT * FROM administrators WHERE email = %s AND deleted_at IS NULL"
        results = db.execute_query(query, (email,))
        return results[0] if results else None

    async def create(self, admin: dict) -> int:
        role_name = admin.get("role", "admin")
        # Obtener el role_id correspondiente desde la tabla roles
        roles = db.execute_query("SELECT id FROM roles WHERE name = %s", (role_name,))
        role_id = roles[0]["id"] if roles else None

        query = """
            INSERT INTO administrators (username, password_hash, email, role, role_id, is_active, created_by)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            RETURNING id
        """
        params = (
            admin["username"],
            admin["password_hash"],
            admin["email"],
            role_name,
            role_id,
            admin.get("is_active", True),
            admin.get("created_by", "system")
        )
        return db.execute_write(query, params)

    async def get_all(self) -> List[dict]:
        query = """
            SELECT id, username, email, role, is_active,
                   failed_login_attempts, locked_at
            FROM administrators
            WHERE deleted_at IS NULL
            ORDER BY id ASC
        """
        return db.execute_query(query)

    async def update_password(self, username: str, password_hash: str, updated_by: str = "system") -> bool:
        query = "UPDATE administrators SET password_hash = %s, updated_at = CURRENT_TIMESTAMP, updated_by = %s WHERE username = %s AND deleted_at IS NULL"
        db.execute_write(query, (password_hash, updated_by, username))
        return True

    async def delete(self, admin_id: int, deleted_by: str) -> bool:
        query = "UPDATE administrators SET deleted_at = CURRENT_TIMESTAMP, deleted_by = %s WHERE id = %s"
        db.execute_write(query, (deleted_by, admin_id))
        return True

    async def update_role(self, admin_id: int, role: str, updated_by: str) -> bool:
        query = "UPDATE administrators SET role = %s, updated_at = CURRENT_TIMESTAMP, updated_by = %s WHERE id = %s"
        db.execute_write(query, (role, updated_by, admin_id))
        return True

    async def increment_failed_attempts(self, username: str) -> int:
        """
        Incrementa el contador de intentos fallidos. Si supera MAX_FAILED_ATTEMPTS,
        bloquea la cuenta estableciendo locked_at. Devuelve el nuevo conteo.
        """
        # Incrementar (compatible con SQLite y PostgreSQL)
        db.execute_write(
            "UPDATE administrators SET failed_login_attempts = failed_login_attempts + 1 WHERE username = %s AND deleted_at IS NULL",
            (username,)
        )

        # Leer el valor actualizado
        result = db.execute_query(
            "SELECT failed_login_attempts FROM administrators WHERE username = %s AND deleted_at IS NULL",
            (username,)
        )
        new_count = result[0]["failed_login_attempts"] if result else 1

        # Bloquear si alcanza el máximo
        if new_count >= MAX_FAILED_ATTEMPTS:
            db.execute_write(
                "UPDATE administrators SET locked_at = CURRENT_TIMESTAMP WHERE username = %s AND deleted_at IS NULL",
                (username,)
            )

        return new_count


    async def reset_failed_attempts(self, username: str) -> None:
        """Resetea el contador de intentos fallidos tras un login exitoso."""
        query = """
            UPDATE administrators
            SET failed_login_attempts = 0, locked_at = NULL
            WHERE username = %s AND deleted_at IS NULL
        """
        db.execute_write(query, (username,))

    async def unlock_account(self, admin_id: int, unlocked_by: str) -> bool:
        """Desbloquea manualmente una cuenta y reinicia el contador."""
        query = """
            UPDATE administrators
            SET failed_login_attempts = 0, locked_at = NULL,
                updated_at = CURRENT_TIMESTAMP, updated_by = %s
            WHERE id = %s AND deleted_at IS NULL
        """
        db.execute_write(query, (unlocked_by, admin_id))
        return True

