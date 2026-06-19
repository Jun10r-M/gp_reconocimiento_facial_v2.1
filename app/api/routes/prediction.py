from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel, Field
from app.services.prediction_service import PredictionService
from app.services.auth_service import get_current_admin, require_permission

router = APIRouter(prefix="/prediction", tags=["AI Predictive Analysis & Planning"], dependencies=[Depends(get_current_admin)])

def get_prediction_service() -> PredictionService:
    return PredictionService()

class SimulationRequest(BaseModel):
    new_employees: int = Field(..., ge=0, description="Cantidad de nuevos empleados a contratar")
    target_overtime_hours: float = Field(..., ge=0.0, description="Horas extras totales proyectadas para simular")

@router.get(
    "/dashboard",
    summary="Get predictive dashboard forecasts and metrics",
    description="Trains time-series models on historical data and returns forecasts for next month's payroll budget, overtime volume, and absences, along with MAE, RMSE, and R2 evaluation metrics."
)
async def get_dashboard_forecasts(
    service: PredictionService = Depends(get_prediction_service),
    admin_session: dict = Depends(require_permission("payrolls", "read"))
):
    try:
        return await service.get_dashboard_stats()
    except Exception as e:
        print(f"[API ERROR] Error en pronóstico predictivo: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al calcular predicciones IA: {str(e)}"
        )

@router.post(
    "/simulate",
    summary="Simulate budget under different employee hires and overtime scenarios",
    description="Recalculates next month's projected budget based on simulated employee hiring and overtime hour constraints."
)
async def simulate_budget_scenario(
    request: SimulationRequest,
    service: PredictionService = Depends(get_prediction_service),
    admin_session: dict = Depends(require_permission("payrolls", "read"))
):
    try:
        return await service.simulate_budget(request.new_employees, request.target_overtime_hours)
    except Exception as e:
        print(f"[API ERROR] Error en simulación presupuestaria: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al procesar simulación: {str(e)}"
        )
