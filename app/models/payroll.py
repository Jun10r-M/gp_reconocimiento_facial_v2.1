from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class PayrollCalculateRequest(BaseModel):
    period: str = Field(..., examples=["2026-05"], description="Periodo de cálculo en formato YYYY-MM")

class PayrollResponse(BaseModel):
    id: Optional[int] = None
    employee_id: int
    full_name: Optional[str] = Field(None, examples=["Junior Mendoza"])
    document_number: Optional[str] = Field(None, examples=["73364100"])
    position: Optional[str] = Field(None, examples=["Estudiante 1"])
    pension_system: Optional[str] = Field(None, examples=["ONP"])
    period: str
    days_worked: int
    lateness_minutes: int
    overtime_25_hours: float
    overtime_35_hours: float
    base_salary: float
    family_allowance: float
    overtime_pay: float
    lateness_deduction: float
    absence_deduction: float
    gross_salary: float
    pension_deduction: float
    net_salary: float
    essalud_contribution: float

class AfpConfigResponse(BaseModel):
    id: int
    name: str
    mandatory_contribution: float
    insurance_premium: float
    flow_commission: float
    updated_at: Optional[datetime] = None
    updated_by: Optional[str] = None

class AfpConfigUpdateRequest(BaseModel):
    mandatory_contribution: float = Field(..., ge=0.0, le=1.0, description="Tasa de aporte obligatorio (0.0 a 1.0)")
    insurance_premium: float = Field(..., ge=0.0, le=1.0, description="Tasa de prima de seguro (0.0 a 1.0)")
    flow_commission: float = Field(..., ge=0.0, le=1.0, description="Tasa de comisión sobre flujo (0.0 a 1.0)")
