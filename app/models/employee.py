from pydantic import BaseModel, Field, EmailStr, field_validator
from typing import Optional
from datetime import datetime

class EmployeeBase(BaseModel):
    first_names: str = Field(..., min_length=2, examples=["Junior"], description="Nombres del empleado")
    last_names: str = Field(..., min_length=2, examples=["Mendoza"], description="Apellidos del empleado")
    document_number: str = Field(..., min_length=8, max_length=8, examples=["73364100"], description="Número de DNI (8 dígitos)")
    email: EmailStr = Field(..., examples=["junior.mendoza@compania.pe"], description="Correo electrónico personal")
    phone: Optional[str] = Field(None, examples=["987654321"], description="Número de teléfono móvil")
    has_children: bool = Field(default=False, examples=[True], description="Indica si tiene hijos menores de edad (para Asignación Familiar)")
    pension_system: str = Field(default="ONP", examples=["AFP"], description="Sistema de pensiones ('ONP' o 'AFP')")

    @field_validator("document_number")
    def validate_dni(cls, val):
        if not val.isdigit():
            raise ValueError("El número de documento (DNI) debe contener solo dígitos")
        return val

    @field_validator("pension_system")
    def validate_pension(cls, val):
        clean_val = val.strip().title() if val.strip().upper() != "ONP" else "ONP"
        if clean_val.upper() not in ["ONP", "AFP", "INTEGRA", "HABITAT", "PRIMA", "PROFUTURO"]:
            raise ValueError("El sistema de pensiones debe ser 'ONP', 'Integra', 'Habitat', 'Prima' o 'Profuturo'")
        # Mapear 'AFP' a 'Integra' por defecto para compatibilidad
        if clean_val.upper() == "AFP":
            return "Integra"
        return clean_val

class EmployeeCreate(EmployeeBase):
    pass

class EmployeeResponse(EmployeeBase):
    id: int
    full_name: str = Field(..., examples=["Junior Mendoza"], description="Nombre completo autogenerado")
    created_at: datetime
    position: Optional[str] = Field(None, examples=["Supervisor"], description="Cargo activo o puesto actual")
    monthly_salary: Optional[float] = Field(None, examples=[3500.0], description="Sueldo base mensual activo")
    pago_hora: Optional[float] = Field(None, examples=[14.58], description="Pago por hora calculado activo")
