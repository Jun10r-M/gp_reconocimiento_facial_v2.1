from fastapi import APIRouter, Depends
from app.services.audit_log_service import AuditLogService
from app.services.auth_service import get_current_admin, require_permission
from typing import List, Optional

router = APIRouter(prefix="/system", dependencies=[Depends(get_current_admin)])

def get_audit_log_service() -> AuditLogService:
    return AuditLogService()

# Base de datos simulada en memoria para terminales
terminals_db = [
    {
        "id": "1",
        "name": "Cámara Facial Principal (Webcam)",
        "type": "facial",
        "status": "online",
        "last_ping": "En línea"
    },
    {
        "id": "2",
        "name": "Lector Dactilar USB (Biométrico)",
        "type": "fingerprint",
        "status": "online",
        "last_ping": "En línea"
    },
    {
        "id": "3",
        "name": "Servidor de Reconocimiento Local",
        "type": "server",
        "status": "online",
        "last_ping": "En línea"
    }
]

@router.get(
    "/terminals",
    summary="Monitor terminal/hardware connection status (CU-16)",
    description="Supervises connectivity states of physical scanners (Webcam face scanner and USB fingerprint reader).",
    tags=["Terminals"]
)
async def get_terminals_status(admin_session: dict = Depends(require_permission("system", "read"))):
    return terminals_db

from pydantic import BaseModel

class TerminalUpdate(BaseModel):
    name: str
    status: str

@router.put(
    "/terminals/{terminal_id}",
    summary="Update terminal hardware settings",
    description="Updates the active name and status of a simulated biometric terminal.",
    tags=["Terminals"]
)
async def update_terminal(
    terminal_id: str,
    data: TerminalUpdate,
    admin_session: dict = Depends(require_permission("system", "update"))
):
    admin_user = admin_session["username"]
    found = None
    for t in terminals_db:
        if t["id"] == terminal_id:
            found = t
            break
            
    if not found:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Terminal no encontrada.")
        
    found["name"] = data.name
    found["status"] = data.status
    found["last_ping"] = "En línea" if data.status == "online" else "Desconectado"
    
    # Log audit
    await AuditLogService().log_action(
        username=admin_user,
        action="EDITAR_TERMINAL",
        description=f"Se editó la terminal ID {terminal_id}: nuevo nombre '{data.name}' y estado '{data.status}'."
    )
    
    return found

@router.get(
    "/audit-logs",
    summary="Get unified system audit trails (CU-17)",
    description="Returns the chronological bitacora of administrative events. Supports pagination with page, limit and search.",
    tags=["Security"]
)
async def get_audit_logs(
    page: Optional[int] = None,
    limit: Optional[int] = 10,
    search: Optional[str] = None,
    service: AuditLogService = Depends(get_audit_log_service),
    admin_session: dict = Depends(require_permission("system", "read"))
):
    if page is not None:
        return await service.get_paginated_logs(page, limit, search)
    return await service.get_all_logs()
