from fastapi import APIRouter, HTTPException, Depends, status, Header
from app.models.justification import JustificationCreate, JustificationResponse
from app.repositories.justification_repository import JustificationRepository
from app.services.auth_service import get_current_admin, require_permission
from typing import List

router = APIRouter(prefix="/justifications", tags=["Justifications"], dependencies=[Depends(get_current_admin)])

def get_justification_repository() -> JustificationRepository:
    return JustificationRepository()

@router.get(
    "",
    summary="Get all justifications (CU-10)",
    description="Returns a paginated list of all justifications joined with employee names."
)
async def get_all_justifications(
    page: Optional[int] = None,
    limit: Optional[int] = 10,
    search: Optional[str] = None,
    repo: JustificationRepository = Depends(get_justification_repository),
    admin_session: dict = Depends(require_permission("justifications", "read"))
):
    if page is not None:
        import math
        offset = (page - 1) * limit
        items = await repo.get_paginated(limit, offset, search)
        total = await repo.count(search)
        pages = math.ceil(total / limit) if limit > 0 else 0
        
        formatted_items = []
        for j in items:
            formatted_items.append({
                "id": j["id"],
                "employee_id": j["employee_id"],
                "full_name": j["full_name"],
                "date": j["date"],
                "justification_type": j["justification_type"],
                "description": j["description"]
            })
            
        return {
            "items": formatted_items,
            "total": total,
            "page": page,
            "limit": limit,
            "pages": pages
        }
    return []

@router.post(
    "",
    response_model=JustificationResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register an absence justification (CU-10)",
    description="Registers an approved license, permit, or medical leave for an employee on a specific date to prevent salary deductions."
)
async def create_justification(
    justification: JustificationCreate, 
    repo: JustificationRepository = Depends(get_justification_repository),
    admin_session: dict = Depends(require_permission("justifications", "create"))
):
    admin_user = admin_session["username"]

    just_id = await repo.create({
        "employee_id": justification.employee_id,
        "date": str(justification.date),
        "justification_type": justification.justification_type,
        "description": justification.description,
        "createdby": admin_user
    })

    # Log action to audit trail
    from app.services.audit_log_service import AuditLogService
    await AuditLogService().log_action(
        username=admin_user,
        action="CREAR_JUSTIFICACIÓN",
        description=f"Registro de justificación ({justification.justification_type}) para Empleado ID: {justification.employee_id} en la fecha {justification.date}."
    )

    return {
        "id": just_id,
        "employee_id": justification.employee_id,
        "date": justification.date,
        "justification_type": justification.justification_type,
        "description": justification.description
    }

@router.get(
    "/employee/{employee_id}",
    response_model=List[JustificationResponse],
    summary="Get employee justifications list",
    description="Returns all justifications and approved permits for a worker."
)
async def get_justifications_by_employee(
    employee_id: int, 
    repo: JustificationRepository = Depends(get_justification_repository),
    admin_session: dict = Depends(require_permission("justifications", "read"))
):
    justs = await repo.get_by_employee_id(employee_id)
    return [
        {
            "id": j["id"],
            "employee_id": j["employee_id"],
            "date": j["date"],
            "justification_type": j["justification_type"],
            "description": j["description"]
        } for j in justs
    ]

@router.delete(
    "/employee/{employee_id}/date/{date_str}",
    summary="Delete a justification",
    description="Deletes a justification, restoring potential lateness or absence deductions for that day."
)
async def delete_justification(
    employee_id: int, 
    date_str: str, 
    repo: JustificationRepository = Depends(get_justification_repository),
    admin_session: dict = Depends(require_permission("justifications", "delete"))
):
    admin_user = admin_session["username"]

    await repo.delete(employee_id, date_str, admin_user)

    # Log action to audit trail
    from app.services.audit_log_service import AuditLogService
    await AuditLogService().log_action(
        username=admin_user,
        action="ELIMINAR_JUSTIFICACIÓN",
        description=f"Eliminación lógica de justificación para Empleado ID: {employee_id} en la fecha {date_str}."
    )

    return {"status": "success", "message": "Justificación eliminada."}

from pydantic import BaseModel
from typing import Optional

class JustificationUpdate(BaseModel):
    justification_type: str
    description: Optional[str] = None

@router.put(
    "/{justification_id}",
    response_model=JustificationResponse,
    summary="Update a justification",
    description="Updates the justification type and description for a specific justification record."
)
async def update_justification(
    justification_id: int,
    data: JustificationUpdate,
    repo: JustificationRepository = Depends(get_justification_repository),
    admin_session: dict = Depends(require_permission("justifications", "update"))
):
    admin_user = admin_session["username"]
    just = await repo.get_by_id(justification_id)
    if not just:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Justificación no encontrada."
        )

    await repo.update(
        justification_id=justification_id,
        justification_type=data.justification_type,
        description=data.description,
        updated_by=admin_user
    )

    # Log action to audit trail
    from app.services.audit_log_service import AuditLogService
    await AuditLogService().log_action(
        username=admin_user,
        action="EDITAR_JUSTIFICACIÓN",
        description=f"Edición de justificación ID: {justification_id} (Nuevo tipo: {data.justification_type}) para Empleado ID: {just['employee_id']}."
    )

    return {
        "id": justification_id,
        "employee_id": just["employee_id"],
        "date": just["date"],
        "justification_type": data.justification_type,
        "description": data.description
    }
