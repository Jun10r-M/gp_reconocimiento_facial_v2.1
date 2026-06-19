import hashlib
import secrets
import os
from typing import Optional, Tuple
from app.repositories.admin_repository import AdminRepository

class AuthService:
    """
    Servicio de autenticación y seguridad para administradores del sistema.
    Implementa cifrado de contraseñas utilizando PBKDF2 con sal aleatoria (salts).
    """
    # En memoria (para simplificar sesiones temporales en desarrollo)
    active_tokens = {}

    def __init__(self, repository: Optional[AdminRepository] = None):
        self.repository = repository or AdminRepository()
        # Clave secreta para tokens de acceso
        self.jwt_secret = os.environ.get("JWT_SECRET", "super_secret_attendance_system_key")

    def _hash_password(self, password: str) -> str:
        """Crea un hash seguro de la contraseña usando PBKDF2 con una sal aleatoria."""
        salt = secrets.token_hex(16)
        h = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt.encode("utf-8"), 100000)
        return f"{salt}${h.hex()}"

    def _verify_password(self, password: str, hashed_password: str) -> bool:
        """Verifica la contraseña contra el hash almacenado."""
        try:
            salt, stored_hash = hashed_password.split("$")
            h = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt.encode("utf-8"), 100000)
            return h.hex() == stored_hash
        except Exception:
            return False

    async def authenticate_admin(self, username: str, password: str) -> Optional[dict]:
        """
        Autentica a un administrador. Implementa protección contra fuerza bruta:
        - Bloquea la cuenta tras MAX_FAILED_ATTEMPTS (3) intentos fallidos consecutivos.
        - Resetea el contador al lograr un acceso exitoso.
        Retorna None con una clave 'lock_reason' si la cuenta está bloqueada.
        """
        from app.repositories.admin_repository import MAX_FAILED_ATTEMPTS

        admin = await self.repository.get_by_username(username)
        if not admin:
            # No revelar si el usuario existe: respuesta genérica
            return None

        # Verificar si la cuenta está bloqueada
        if admin.get("locked_at"):
            return {"_locked": True, "username": username}

        # Verificar contraseña
        if self._verify_password(password, admin["password_hash"]):
            # Login exitoso: resetear contador
            await self.repository.reset_failed_attempts(username)
            return admin

        # Contraseña incorrecta: incrementar contador
        new_count = await self.repository.increment_failed_attempts(username)
        remaining = MAX_FAILED_ATTEMPTS - new_count

        if remaining <= 0:
            # Se acaba de bloquear con este intento
            return {"_locked": True, "username": username, "_just_locked": True}

        return {"_failed": True, "remaining_attempts": remaining}


    async def register_admin(self, username: str, email: str, password: str, role: str = "admin") -> Optional[int]:
        """Crea un nuevo administrador cifrando su contraseña."""
        # Verificar duplicados
        existing_username = await self.repository.get_by_username(username)
        existing_email = await self.repository.get_by_email(email)
        if existing_username or existing_email:
            return None

        password_hash = self._hash_password(password)
        admin_data = {
            "username": username,
            "email": email,
            "password_hash": password_hash,
            "role": role,
            "is_active": True
        }
        return await self.repository.create(admin_data)

    async def create_access_token(self, username: str, role: str) -> str:
        """Genera un token de acceso seguro y lo registra como sesión activa."""
        token = secrets.token_hex(32)
        # Registrar sesión asociada al token
        self.active_tokens[token] = {
            "username": username,
            "role": role
        }
        return token

    async def verify_token(self, token: str) -> Optional[dict]:
        """Valida que un token sea activo y devuelva los datos del usuario."""
        return self.active_tokens.get(token)

    async def recover_credentials(self, email: str) -> Tuple[bool, str]:
        """
        Simula la recuperación de contraseña.
        Genera una nueva contraseña temporal y la asocia al administrador.
        """
        admin = await self.repository.get_by_email(email)
        if not admin:
            return False, "Correo no registrado"
        
        # Generar contraseña temporal
        temp_password = f"Temp{secrets.token_hex(4).upper()}!"
        new_hash = self._hash_password(temp_password)
        
        # Actualizar en base de datos
        await self.repository.update_password(admin["username"], new_hash)
        
        print(f"[SEGURIDAD] Recuperación solicitada para {email}. Nueva contraseña temporal: {temp_password}")
        return True, temp_password

from fastapi import HTTPException, status, Security, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security_scheme = HTTPBearer(auto_error=False)

async def get_current_admin(credentials: Optional[HTTPAuthorizationCredentials] = Security(security_scheme)) -> dict:
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Acceso denegado: Token de seguridad ausente. Debe iniciar sesión como administrador."
        )
    
    token = credentials.credentials
    service = AuthService()
    session = await service.verify_token(token)
    if not session:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Acceso denegado: Token de seguridad inválido o expirado. Por favor, inicie sesión nuevamente."
        )
        
    # Consultar dinámicamente en base de datos para obtener el estado actual, el rol real y role_id
    from app.repositories.database import db
    user_query = """
        SELECT a.id, a.username, a.email, a.is_active, a.role_id, r.name as role_name 
        FROM administrators a
        LEFT JOIN roles r ON a.role_id = r.id
        WHERE a.username = %s AND a.deleted_at IS NULL
    """
    users = db.execute_query(user_query, (session["username"],))
    if not users or not users[0]["is_active"]:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Acceso denegado: Cuenta inactiva o eliminada."
        )
    
    user_data = users[0]
    return {
        "id": user_data["id"],
        "username": user_data["username"],
        "email": user_data["email"],
        "role_id": user_data["role_id"],
        "role": user_data["role_name"]
    }

def require_permission(module: str, action: str):
    async def dependency(session: dict = Depends(get_current_admin)) -> dict:
        role_id = session.get("role_id")
        if not role_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Acceso denegado: Privilegios insuficientes para la sección {module}."
            )
            
        from app.repositories.database import db
        perm_code = f"{module}:{action}"
        query = """
            SELECT rp.role_id 
            FROM role_permissions rp
            JOIN permissions p ON rp.permission_id = p.id
            WHERE rp.role_id = %s AND p.code = %s
        """
        has_perm = db.execute_query(query, (role_id, perm_code))
        if not has_perm:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Acceso denegado: Privilegios insuficientes para la sección {module} ({action})."
            )
        return session
    return dependency

