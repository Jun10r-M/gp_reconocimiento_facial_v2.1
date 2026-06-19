from pydantic import BaseModel, Field, field_validator
from typing import Optional
from datetime import date as DateType

class JustificationBase(BaseModel):
    employee_id: int = Field(..., examples=[1], description="ID del empleado")
    date: DateType = Field(..., examples=["2026-05-30"], description="Fecha del día justificado")
    justification_type: str = Field(..., examples=["medical"], description="Tipo de justificación ('medical', 'license', 'permit')")
    description: Optional[str] = Field(None, examples=["Descanso médico certificado por Essalud"], description="Detalle o descripción sustentatoria")

    @field_validator("justification_type")
    def validate_type(cls, val):
        lower_val = val.lower().strip()
        if lower_val not in ["medical", "license", "permit"]:
            raise ValueError("El tipo de justificación debe ser 'medical', 'license' o 'permit'")
        return lower_val

class JustificationCreate(JustificationBase):
    pass

class JustificationResponse(JustificationBase):
    id: int
