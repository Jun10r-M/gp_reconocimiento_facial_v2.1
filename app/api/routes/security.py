from fastapi import APIRouter, HTTPException, Depends, status
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
from app.services.security_service import SecurityService
from app.services.auth_service import require_permission

router = APIRouter(prefix="/security", tags=["Security"])

def get_security_service() -> SecurityService:
    return SecurityService()

class MenuUpdateRequest(BaseModel):
    label: str = Field(..., min_length=2, max_length=100, description="Nombre visual del menú (ej. Empleados)")
    icon: str = Field(..., min_length=2, max_length=100, description="Nombre del icono SVG a mostrar")
    parent_id: Optional[int] = Field(None, description="ID del menú padre para la estructura jerárquica")

class RoleAssignmentsUpdateRequest(BaseModel):
    menu_ids: List[int] = Field(..., description="Lista de identificadores de menús asignados al rol")
    permission_ids: List[int] = Field(..., description="Lista de identificadores de permisos asignados al rol")

@router.get(
    "/menus",
    summary="Get all menus",
    description="Returns a list of all menus registered in the system."
)
async def get_menus(
    service: SecurityService = Depends(get_security_service),
    admin_session: dict = Depends(require_permission("security", "read"))
):
    return await service.get_menus()

@router.put(
    "/menus/{menu_id}",
    summary="Update a menu",
    description="Updates metadata for a specific menu, including label, icon, and parent group."
)
async def update_menu(
    menu_id: int,
    data: MenuUpdateRequest,
    service: SecurityService = Depends(get_security_service),
    admin_session: dict = Depends(require_permission("security", "update"))
):
    try:
        await service.update_menu(
            menu_id=menu_id,
            label=data.label.strip(),
            icon=data.icon.strip(),
            parent_id=data.parent_id,
            username=admin_session["username"]
        )
        return {"status": "ok", "message": "Menú actualizado correctamente."}
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.get(
    "/permissions",
    summary="Get all system permissions",
    description="Returns a list of all dynamic CRUD module permissions generated automatically on start."
)
async def get_permissions(
    service: SecurityService = Depends(get_security_service),
    admin_session: dict = Depends(require_permission("security", "read"))
):
    return await service.get_permissions()

@router.get(
    "/roles",
    summary="Get all roles",
    description="Returns all roles registered in the system (super_admin, admin, operator)."
)
async def get_roles(
    service: SecurityService = Depends(get_security_service),
    admin_session: dict = Depends(require_permission("security", "read"))
):
    return await service.get_roles()

@router.get(
    "/roles/{role_id}/assignments",
    summary="Get assignments for a specific role",
    description="Fetches menu and permission IDs mapped to a role."
)
async def get_role_assignments(
    role_id: int,
    service: SecurityService = Depends(get_security_service),
    admin_session: dict = Depends(require_permission("security", "read"))
):
    return await service.get_role_assignments(role_id)

@router.post(
    "/roles/{role_id}/assignments",
    summary="Update assignments for a specific role",
    description="Saves new menu and permission configurations for a role."
)
async def update_role_assignments(
    role_id: int,
    data: RoleAssignmentsUpdateRequest,
    service: SecurityService = Depends(get_security_service),
    admin_session: dict = Depends(require_permission("security", "update"))
):
    await service.update_role_assignments(
        role_id=role_id,
        menu_ids=data.menu_ids,
        permission_ids=data.permission_ids,
        username=admin_session["username"]
    )
    return {"status": "ok", "message": "Matriz de seguridad actualizada correctamente."}
