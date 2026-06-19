from fastapi import APIRouter, HTTPException, Depends, status, Response, Header
import csv
import io
from app.models.payroll import PayrollCalculateRequest, PayrollResponse, AfpConfigResponse, AfpConfigUpdateRequest
from app.repositories.afp_repository import AfpRepository
from app.services.payroll_service import PayrollService
from app.services.auth_service import get_current_admin, require_permission
from typing import List

router = APIRouter(prefix="/payroll", tags=["Payrolls"], dependencies=[Depends(get_current_admin)])

def get_payroll_service() -> PayrollService:
    return PayrollService()

@router.post(
    "/calculate",
    response_model=List[PayrollResponse],
    summary="Process and calculate monthly payroll (CU-12)",
    description="Processes attendance logs against shift templates for a period (YYYY-MM), computing base salary, overtime (25%/35%), lateness deductions, absences, AFP/ONP retentions, and employer EsSalud costs."
)
async def calculate_payroll(
    request: PayrollCalculateRequest, 
    service: PayrollService = Depends(get_payroll_service),
    admin_session: dict = Depends(require_permission("payrolls", "create"))
):
    try:
        admin_user = admin_session["username"]
        results = await service.calculate_monthly_payroll(request.period, admin_user)

        # Log action to audit trail
        from app.services.audit_log_service import AuditLogService
        await AuditLogService().log_action(
            username=admin_user,
            action="CALCULAR_PLANILLA",
            description=f"Cálculo automatizado de la planilla mensual para el periodo {request.period} ({len(results)} colaboradores procesados)."
        )

        return results
    except Exception as e:
        print(f"[API ERROR] Error al procesar planilla: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error interno del servidor al procesar la planilla: {str(e)}"
        )

@router.get(
    "/period/{period}",
    response_model=List[PayrollResponse],
    summary="Get payroll history by period (CU-12)",
    description="Returns all processed payroll records for a specific month (YYYY-MM)."
)
async def get_payroll_by_period(period: str, service: PayrollService = Depends(get_payroll_service), admin_session: dict = Depends(require_permission("payrolls", "read"))):
    results = await service.get_payrolls_by_period(period)
    return results

@router.get(
    "/slip/employee/{employee_id}/period/{period}",
    response_model=PayrollResponse,
    summary="Generate employee payslip (CU-13)",
    description="Compiles and returns the detailed payslip for a worker containing legal concepts in Peru (Remuneración Bruta, AFP/ONP, EsSalud, Net Salary) for printing or delivery."
)
async def get_employee_payslip(employee_id: int, period: str, service: PayrollService = Depends(get_payroll_service), admin_session: dict = Depends(require_permission("payrolls", "read"))):
    slip = await service.get_payroll_slip(employee_id, period)
    if not slip:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Boleta de pago no encontrada para el periodo o colaborador indicado."
        )
    return slip

@router.get(
    "/export/{period}",
    summary="Export payroll batch file for bank transfers (CU-15)",
    description="Generates a downloadable CSV file containing employee bank details and net transfer amounts for the selected period."
)
async def export_payroll(
    period: str,
    service: PayrollService = Depends(get_payroll_service),
    admin_session: dict = Depends(require_permission("payrolls", "read"))
):
    payrolls = await service.get_payrolls_by_period(period)
    if not payrolls:
        raise HTTPException(
            status_code=404,
            detail="No hay registros de planilla procesados para este periodo. Primero debe calcular la planilla."
        )

    admin_user = admin_session["username"]

    # Log action to audit
    from app.services.audit_log_service import AuditLogService
    await AuditLogService().log_action(
        username=admin_user,
        action="EXPORTAR_PLANILLA",
        description=f"Exportación de lote de pago bancario en CSV para el periodo {period}."
    )

    output = io.StringIO()
    writer = csv.writer(output, delimiter=';')
    
    # Headers
    writer.writerow([
        "DNI", 
        "Colaborador", 
        "Periodo", 
        "Dias Trabajados", 
        "Minutos Tardanza", 
        "Sueldo Base (S/)", 
        "Asig. Familiar (S/)", 
        "Horas Extras (S/)", 
        "Descuento Tardanzas/Faltas (S/)", 
        "Retencion Pension (S/)", 
        "Sueldo Neto (S/)", 
        "EsSalud Empleador (S/)"
    ])
    
    for p in payrolls:
        deductions = float(p.get("lateness_deduction", 0.0)) + float(p.get("absence_deduction", 0.0))
        writer.writerow([
            p.get("document_number", ""),
            p.get("full_name", ""),
            p.get("period", ""),
            p.get("days_worked", 30),
            p.get("lateness_minutes", 0),
            f"{float(p.get('base_salary', 0.0)):.2f}",
            f"{float(p.get('family_allowance', 0.0)):.2f}",
            f"{float(p.get('overtime_pay', 0.0)):.2f}",
            f"{deductions:.2f}",
            f"{float(p.get('pension_deduction', 0.0)):.2f}",
            f"{float(p.get('net_salary', 0.0)):.2f}",
            f"{float(p.get('essalud_contribution', 0.0)):.2f}"
        ])
    
    csv_content = output.getvalue()
    output.close()
    
    # UTF-8 with BOM for Excel compat
    bom_content = b"\xef\xbb\xbf" + csv_content.encode("utf-8")
    
    return Response(
        content=bom_content,
        media_type="text/csv",
        headers={
            "Content-Disposition": f'attachment; filename="lote_pago_planilla_{period}.csv"'
        }
    )

@router.get(
    "/afp",
    response_model=List[AfpConfigResponse],
    summary="List all AFP configurations",
    description="Returns all registered AFP configurations (Integra, Habitat, Prima, Profuturo) with their contribution rates."
)
async def get_all_afp_configs(
    admin_session: dict = Depends(require_permission("payrolls", "read"))
):
    repo = AfpRepository()
    return await repo.get_all()

@router.put(
    "/afp/{afp_id}",
    response_model=AfpConfigResponse,
    summary="Update AFP configuration parameters",
    description="Modifies the mandatory contribution, insurance premium, or flow commission of a specific AFP."
)
async def update_afp_config(
    afp_id: int,
    request: AfpConfigUpdateRequest,
    admin_session: dict = Depends(require_permission("payrolls", "update"))
):
    repo = AfpRepository()
    existing = await repo.get_by_id(afp_id)
    if not existing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Configuración AFP no encontrada."
        )

    admin_user = admin_session["username"]
    update_data = {
        "mandatory_contribution": request.mandatory_contribution,
        "insurance_premium": request.insurance_premium,
        "flow_commission": request.flow_commission,
        "updated_by": admin_user
    }
    await repo.update(afp_id, update_data)
    
    # Audit log
    from app.services.audit_log_service import AuditLogService
    await AuditLogService().log_action(
        username=admin_user,
        action="CONFIGURAR_AFP",
        description=f"Actualización de tasas para AFP {existing['name']}: Aporte={request.mandatory_contribution*100}%, Prima={request.insurance_premium*100}%, Comisión={request.flow_commission*100}%."
    )
    
    updated = await repo.get_by_id(afp_id)
    return updated
