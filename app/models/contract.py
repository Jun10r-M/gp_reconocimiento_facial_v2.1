from pydantic import BaseModel, Field, field_validator
from typing import Optional
from datetime import date

class ContractBase(BaseModel):
    employee_id: int = Field(..., examples=[1], description="ID del empleado asociado al contrato")
    position: str = Field(..., min_length=2, examples=["Analista de Sistemas"], description="Puesto o cargo de trabajo")
    monthly_salary: float = Field(..., gt=0, examples=[2400.0], description="Sueldo base mensual (en soles S/.)")
    start_date: date = Field(..., examples=["2026-01-15"], description="Fecha de inicio de vigencia")
    end_date: Optional[date] = Field(None, examples=["2026-12-31"], description="Fecha de término (opcional)")
    is_active: bool = Field(default=True, examples=[True], description="Indica si es el contrato activo vigente")

class ContractCreate(ContractBase):
    pass

class ContractResponse(ContractBase):
    id: int
    hourly_wage: float = Field(..., examples=[10.0], description="Pago por hora calculado (sueldo_base / 240)")
