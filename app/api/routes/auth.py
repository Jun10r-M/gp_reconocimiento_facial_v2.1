from fastapi import APIRouter, HTTPException, Depends, status, Header
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from app.models.auth import AdminCreate, AdminLogin, AdminResponse, TokenResponse, PasswordRecoveryRequest
from app.services.auth_service import AuthService, get_current_admin, require_permission
from typing import List, Optional
from app.repositories.database import db

router = APIRouter(prefix="/auth", tags=["Administrators"])

def get_auth_service() -> AuthService:
    return AuthService()

@router.post(
    "/register",
    response_model=AdminResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new administrator account (CU-03)",
    description="Registers a new administrator account with encrypted password hashes (PBKDF2) and system privileges."
)
async def register(admin: AdminCreate, service: AuthService = Depends(get_auth_service), admin_session: dict = Depends(require_permission("administrators", "create"))):
    admin_id = await service.register_admin(admin.username, admin.email, admin.password, admin.role)
    if not admin_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El nombre de usuario o correo electrónico ya se encuentran registrados."
        )
    return {
        "id": admin_id,
        "username": admin.username,
        "email": admin.email,
        "role": admin.role,
        "is_active": True
    }

@router.post(
    "/login",
    response_model=TokenResponse,
    summary="Administrator Login (CU-01)",
    description="Validates administrative credentials and generates a secure session token. Blocks the account after 3 consecutive failed login attempts."
)
async def login(credentials: AdminLogin, service: AuthService = Depends(get_auth_service)):
    result = await service.authenticate_admin(credentials.username, credentials.password)

    # Cuenta no encontrada
    if not result:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales de acceso inválidas."
        )

    # Cuenta bloqueada
    if result.get("_locked"):
        msg = (
            "Cuenta bloqueada por exceso de intentos fallidos. "
            "Contacte al administrador del sistema para desbloquearla."
        )
        raise HTTPException(status_code=423, detail=msg)

    # Contraseña incorrecta con intentos restantes
    if result.get("_failed"):
        remaining = result.get("remaining_attempts", 0)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Credenciales inválidas. Intentos restantes antes del bloqueo: {remaining}."
        )

    token = await service.create_access_token(result["username"], result["role"])
    return {
        "access_token": token,
        "token_type": "bearer",
        "role": result["role"]
    }

@router.post(
    "/recover",
    summary="Recover credentials (CU-02)",
    description="Generates a secure temporary password and registers it for the administrator in case of credentials loss."
)
async def recover_password(request: PasswordRecoveryRequest, service: AuthService = Depends(get_auth_service)):
    success, result = await service.recover_credentials(request.email)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="El correo electrónico provisto no coincide con ninguna cuenta activa."
        )
    return {
        "status": "success",
        "message": "Se ha restablecido la contraseña. Por seguridad de demostración, la contraseña temporal es expuesta en la respuesta.",
        "temporary_password": result
    }

@router.get(
    "/profile",
    summary="Get active user profile and RBAC permissions",
    description="Returns the profile details of the logged admin, along with authorized menus and permissions from database."
)
async def get_profile(admin_session: dict = Depends(get_current_admin)):
    from app.repositories.database import db
    role_id = admin_session["role_id"]
    
    # Query menus
    menus_query = """
        SELECT m.key 
        FROM role_menus rm
        JOIN menus m ON rm.menu_id = m.id
        WHERE rm.role_id = %s
    """
    menus_res = db.execute_query(menus_query, (role_id,))
    menus = [row["key"] for row in menus_res]
    
    # Query menu details (id, key, label, icon, parent_id)
    menu_details_query = """
        SELECT m.id, m.key, m.label, m.icon, m.parent_id
        FROM role_menus rm
        JOIN menus m ON rm.menu_id = m.id
        WHERE rm.role_id = %s
    """
    menu_details = db.execute_query(menu_details_query, (role_id,))
    
    # Query permissions (scopes)
    perms_query = """
        SELECT p.code 
        FROM role_permissions rp
        JOIN permissions p ON rp.permission_id = p.id
        WHERE rp.role_id = %s
    """
    perms_res = db.execute_query(perms_query, (role_id,))
    scopes = [row["code"] for row in perms_res]
    
    return {
        "username": admin_session["username"],
        "email": admin_session["email"],
        "role": admin_session["role"],
        "menus": menus,
        "menu_details": menu_details,
        "scopes": scopes
    }

@router.get(
    "/users",
    response_model=List[AdminResponse],
    summary="List all administrative accounts (CU-03)",
    description="Returns all administrative users in the system with their status and privilege levels."
)
async def get_users(service: AuthService = Depends(get_auth_service), admin_session: dict = Depends(require_permission("administrators", "read"))):
    users = await service.repository.get_all()
    return [
        {
            "id": u["id"],
            "username": u["username"],
            "email": u["email"],
            "role": u["role"],
            "is_active": bool(u["is_active"])
        } for u in users
    ]

@router.delete(
    "/users/{user_id}",
    summary="Delete an administrative account (CU-03)",
    description="Logical deletion (soft delete) of a system administrator."
)
async def delete_user(
    user_id: int,
    service: AuthService = Depends(get_auth_service),
    admin_session: dict = Depends(require_permission("administrators", "delete"))
):
    admin_user = admin_session["username"]
            
    users = await service.repository.get_all()
    target_username = None
    for u in users:
        if u["id"] == user_id:
            target_username = u["username"]
            break
            
    if not target_username:
        raise HTTPException(status_code=404, detail="Administrador no encontrado.")
        
    if target_username == admin_user:
        raise HTTPException(status_code=400, detail="No puede eliminarse a sí mismo.")

    await service.repository.delete(user_id, admin_user)

    # Log to audit trail
    from app.services.audit_log_service import AuditLogService
    await AuditLogService().log_action(
        username=admin_user,
        action="ELIMINAR_ADMINISTRADOR",
        description=f"Eliminación lógica del administrador: {target_username}."
    )

    return {"status": "success", "message": f"Administrador {target_username} eliminado correctamente."}

class AdminUpdateRequest(BaseModel):
    email: str = Field(..., description="Correo electrónico del administrador")
    role: str = Field(..., description="Nombre del rol asignado")
    password: Optional[str] = Field(None, min_length=6, description="Opcional. Contraseña a restablecer")

@router.put(
    "/users/{user_id}",
    summary="Update an administrative account",
    description="Updates administrative email, role, and optionally changes the password."
)
async def update_user(
    user_id: int,
    data: AdminUpdateRequest,
    service: AuthService = Depends(get_auth_service),
    admin_session: dict = Depends(require_permission("administrators", "update"))
):
    admin_user = admin_session["username"]
    
    # Verificar que el usuario exista
    users = await service.repository.get_all()
    target_username = None
    for u in users:
        if u["id"] == user_id:
            target_username = u["username"]
            break
            
    if not target_username:
        raise HTTPException(status_code=404, detail="Administrador no encontrado.")

    # Sincronizar role_id
    role_info = db.execute_query("SELECT id FROM roles WHERE name = %s", (data.role,))
    role_id = role_info[0]["id"] if role_info else None
    
    if data.password:
        hashed_password = service._hash_password(data.password)
        query = """
            UPDATE administrators
            SET email = %s, role = %s, role_id = %s, password_hash = %s, updated_at = CURRENT_TIMESTAMP, updated_by = %s
            WHERE id = %s AND deleted_at IS NULL
        """
        db.execute_write(query, (data.email, data.role, role_id, hashed_password, admin_user, user_id))
    else:
        query = """
            UPDATE administrators
            SET email = %s, role = %s, role_id = %s, updated_at = CURRENT_TIMESTAMP, updated_by = %s
            WHERE id = %s AND deleted_at IS NULL
        """
        db.execute_write(query, (data.email, data.role, role_id, admin_user, user_id))

    # Registrar log de auditoría
    from app.services.audit_log_service import AuditLogService
    await AuditLogService().log_action(
        username=admin_user,
        action="EDITAR_ADMINISTRADOR",
        description=f"Edición de los datos de cuenta del administrador: {target_username}."
    )

    return {"status": "success", "message": "Cuenta administrativa actualizada con éxito."}

@router.put(
    "/users/{user_id}/unlock",
    summary="Unlock a blocked administrator account",
    description="Resets failed login attempts and removes the account lock for the specified administrator."
)
async def unlock_user(
    user_id: int,
    service: AuthService = Depends(get_auth_service),
    admin_session: dict = Depends(require_permission("administrators", "update"))
):
    admin_user = admin_session["username"]

    # Verificar que el usuario exista
    users = await service.repository.get_all()
    target = next((u for u in users if u["id"] == user_id), None)
    if not target:
        raise HTTPException(status_code=404, detail="Administrador no encontrado.")

    await service.repository.unlock_account(user_id, admin_user)

    from app.services.audit_log_service import AuditLogService
    await AuditLogService().log_action(
        username=admin_user,
        action="DESBLOQUEAR_ADMINISTRADOR",
        description=f"Desbloqueo manual de cuenta del administrador: {target['username']}."
    )

    return {"status": "success", "message": f"Cuenta de '{target['username']}' desbloqueada correctamente."}
