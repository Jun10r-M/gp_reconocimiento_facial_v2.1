from pydantic import BaseModel, Field, field_validator
from typing import Optional
from datetime import datetime, time

class ShiftBase(BaseModel):
    employee_id: int = Field(..., examples=[1], description="ID del empleado")
    day_of_week: int = Field(..., ge=0, le=6, examples=[1], description="Día de la semana (0=Domingo, 1=Lunes, ..., 6=Sábado)")
    start_time: str = Field(..., examples=["08:00"], description="Hora de entrada (HH:MM)")
    end_time: str = Field(..., examples=["17:00"], description="Hora de salida (HH:MM)")
    tolerance: Optional[int] = Field(10, ge=0, examples=[10], description="Tolerancia de entrada en minutos")

    @field_validator("start_time", "end_time")
    def validate_time_format(cls, val):
        try:
            parts = val.split(":")
            if len(parts) >= 2:
                # Comprobar si parsea a time
                time(int(parts[0]), int(parts[1]))
            return val
        except Exception:
            raise ValueError("El formato de hora debe ser HH:MM")

class ShiftCreate(ShiftBase):
    pass

class ShiftResponse(ShiftBase):
    id: int

class AttendanceLogBase(BaseModel):
    employee_id: int = Field(..., examples=[1], description="ID del empleado")
    timestamp: datetime = Field(..., examples=["2026-05-30T08:02:15"], description="Fecha y hora de la fichada")
    method: str = Field(..., examples=["face"], description="Método biométrico de marcación ('face' o 'fingerprint')")

class AttendanceLogCreate(AttendanceLogBase):
    pass

class AttendanceLogResponse(AttendanceLogBase):
    id: int
    full_name: Optional[str] = Field(None, examples=["Junior Mendoza"], description="Nombre del empleado (opcional)")

class BulkManualPunchItem(BaseModel):
    employee_id: int = Field(..., description="ID del colaborador")
    timestamp: str = Field(..., description="Fecha y hora en formato YYYY-MM-DD HH:MM:SS o YYYY-MM-DDTHH:MM")

class BulkManualPunchRequest(BaseModel):
    punches: list[BulkManualPunchItem] = Field(..., description="Listado de marcaciones a registrar")
