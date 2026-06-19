from fastapi import APIRouter, Form, File, UploadFile, HTTPException, Depends, status
from fastapi.responses import JSONResponse
from app.models.employee import EmployeeResponse
from app.services.employee_service import EmployeeService
from app.services.auth_service import get_current_admin, require_permission
from typing import List, Optional

router = APIRouter(prefix="/employees", tags=["Employees"], dependencies=[Depends(get_current_admin)])

def get_employee_service() -> EmployeeService:
    return EmployeeService()

@router.get(
    "",
    summary="List all employees (CU-04)",
    description="Returns all registered workers with their personal details, contractual parameters, and pension systems. Supports pagination with page, limit and search."
)
async def get_all_employees(
    page: Optional[int] = None,
    limit: Optional[int] = 10,
    search: Optional[str] = None,
    service: EmployeeService = Depends(get_employee_service),
    admin_session: dict = Depends(require_permission("employees", "read"))
):
    if page is not None:
        return await service.get_paginated_employees(page, limit, search)
    return await service.get_all_employees()

@router.get(
    "/{employee_id}",
    response_model=EmployeeResponse,
    summary="Get employee profile by ID",
    description="Returns personal and contractual details for a specific worker."
)
async def get_employee_by_id(employee_id: int, service: EmployeeService = Depends(get_employee_service), admin_session: dict = Depends(require_permission("employees", "read"))):
    emp = await service.get_employee_by_id(employee_id)
    if not emp:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Empleado no encontrado."
        )
    return emp

@router.post(
    "",
    summary="Register a new employee and contract (CU-04, CU-05)",
    description="Performs employee signup, registers the initial employment contract if parameters are provided, uploads the face photo and trains the CNN."
)
async def create_employee(
    first_names: str = Form(..., description="Nombres del empleado"),
    last_names: str = Form(..., description="Apellidos del empleado"),
    document_number: str = Form(..., description="Número de DNI (8 dígitos)"),
    email: str = Form(..., description="Correo electrónico personal"),
    phone: str = Form(None, description="Número telefónico"),
    has_children: bool = Form(False, description="¿Tiene hijos menores?"),
    pension_system: str = Form("ONP", description="Sistema de pensiones ('ONP' o 'AFP')"),
    position: Optional[str] = Form(None, description="Puesto o cargo inicial"),
    monthly_salary: Optional[float] = Form(None, description="Sueldo base mensual en soles (S/.)"),
    foto: UploadFile = File(..., description="Fotografía para reconocimiento facial CNN"),
    admin_session: dict = Depends(require_permission("employees", "create"))
):
    try:
        service = get_employee_service()
        foto_bytes = await foto.read()
        
        admin_user = admin_session["username"]

        result = await service.register_employee(
            first_names=first_names,
            last_names=last_names,
            document_number=document_number,
            email=email,
            phone=phone,
            has_children=has_children,
            pension_system=pension_system,
            position=position,
            monthly_salary=monthly_salary,
            photo_bytes=foto_bytes
        )
        
        if result["status"] == "error":
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=result["message"])

        # Registrar log de auditoria
        from app.services.audit_log_service import AuditLogService
        await AuditLogService().log_action(
            username=admin_user,
            action="REGISTRAR_EMPLEADO",
            description=f"Registro del colaborador: {first_names} {last_names} (DNI: {document_number})."
        )
        
        return result
    except HTTPException:
        raise
    except Exception as e:
        print(f"[API ERROR] Error en registro de empleado: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error interno del servidor: {str(e)}"
        )

@router.put(
    "/{employee_id}",
    summary="Update employee details",
    description="Updates personal information and optionally re-enrolls the face photo."
)
async def update_employee(
    employee_id: int,
    first_names: str = Form(..., description="Nombres del empleado"),
    last_names: str = Form(..., description="Apellidos del empleado"),
    document_number: str = Form(..., description="DNI"),
    email: str = Form(..., description="Email"),
    phone: str = Form(None, description="Teléfono"),
    has_children: bool = Form(False, description="Hijos"),
    pension_system: str = Form("ONP", description="ONP/AFP"),
    foto: Optional[UploadFile] = File(None, description="Nueva foto opcional"),
    admin_session: dict = Depends(require_permission("employees", "update")),
    service: EmployeeService = Depends(get_employee_service)
):
    try:
        admin_user = admin_session["username"]
        foto_bytes = None
        if foto:
            foto_bytes = await foto.read()

        result = await service.update_employee(
            employee_id=employee_id,
            first_names=first_names,
            last_names=last_names,
            document_number=document_number,
            email=email,
            phone=phone,
            has_children=has_children,
            pension_system=pension_system,
            photo_bytes=foto_bytes,
            updated_by=admin_user
        )

        if result["status"] == "error":
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=result["message"])

        # Registrar log de auditoria
        from app.services.audit_log_service import AuditLogService
        await AuditLogService().log_action(
            username=admin_user,
            action="EDITAR_EMPLEADO",
            description=f"Edición del colaborador: {first_names} {last_names} (DNI: {document_number})."
        )

        return result
    except HTTPException:
        raise
    except Exception as e:
        print(f"[API ERROR] Error en actualización de empleado: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error interno del servidor: {str(e)}"
        )

@router.delete(
    "/{employee_id}",
    summary="Delete an employee (CU-04)",
    description="Deletes employee personal record, all active contracts, and associated biometric signatures."
)
async def delete_employee(
    employee_id: int, 
    admin_session: dict = Depends(require_permission("employees", "delete")),
    service: EmployeeService = Depends(get_employee_service)
):
    # Buscar si existe
    emp = await service.get_employee_by_id(employee_id)
    if not emp:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Empleado no encontrado.")
    
    admin_user = admin_session["username"]

    await service.delete_employee(employee_id, admin_user)

    # Audit trail entry
    from app.services.audit_log_service import AuditLogService
    await AuditLogService().log_action(
        username=admin_user,
        action="ELIMINAR_EMPLEADO",
        description=f"Eliminación lógica (Soft Delete) del colaborador: {emp['full_name']} (DNI: {emp['document_number']})."
    )

    return {"status": "success", "message": "Registro de empleado eliminado del sistema."}

from app.services.biometrics_service import BiometricsService

def get_biometrics_service() -> BiometricsService:
    return BiometricsService()

@router.post(
    "/{employee_id}/fingerprint",
    summary="Register worker fingerprint (CU-06)",
    description="Registers the worker's fingerprint template hash in the biometrics table for contingency verification."
)
async def register_fingerprint(
    employee_id: int,
    fingerprint_data: str,
    admin_session: dict = Depends(require_permission("employees", "update")),
    biometrics_service: BiometricsService = Depends(get_biometrics_service),
    employee_service: EmployeeService = Depends(get_employee_service)
):
    emp = await employee_service.get_employee_by_id(employee_id)
    if not emp:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Empleado no encontrado.")
        
    admin_user = admin_session["username"]

    success = await biometrics_service.register_fingerprint(employee_id, fingerprint_data)
    if not success:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Error al registrar la huella biométrica.")
        
    # Log in audit
    from app.services.audit_log_service import AuditLogService
    await AuditLogService().log_action(
        username=admin_user,
        action="ENROLAR_HUELLA",
        description=f"Enrolamiento de huella dactilar para el colaborador: {emp['full_name']}."
    )

    return {"status": "success", "message": "Huella dactilar registrada exitosamente."}

