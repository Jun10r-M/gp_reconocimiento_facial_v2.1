"""
    Servicio de asistencias para el registro y auditoría.
    Permite marcar mediante reconocimiento facial (face) o huella digital (fingerprint).
"""

from datetime import datetime
from typing import List, Tuple, Optional
from app.repositories.attendance_repository import AttendanceRepository

class AttendanceService:
    def __init__(self, repository: Optional[AttendanceRepository] = None):
        self.repository = repository or AttendanceRepository()

    async def get_all_records(self) -> List[dict]:
        records = await self.repository.get_all()
        formatted = []
        for r in records:
            ts = r["timestamp"]
            ts_str = ts.strftime("%Y-%m-%d %H:%M:%S") if isinstance(ts, datetime) else str(ts)
            formatted.append({
                "id": r["id"],
                "employee_id": r["employee_id"],
                "nombre": r["full_name"],
                "timestamp": ts_str,
                "method": r["method"]
            })
        return formatted

    async def get_paginated_records(self, page: int, limit: int, search: Optional[str] = None) -> dict:
        import math
        offset = (page - 1) * limit
        records = await self.repository.get_paginated(limit, offset, search)
        total = await self.repository.count(search)
        
        formatted = []
        for r in records:
            ts = r["timestamp"]
            ts_str = ts.strftime("%Y-%m-%d %H:%M:%S") if isinstance(ts, datetime) else str(ts)
            formatted.append({
                "id": r["id"],
                "employee_id": r["employee_id"],
                "nombre": r["full_name"],
                "timestamp": ts_str,
                "method": r["method"]
            })
            
        pages = math.ceil(total / limit) if limit > 0 else 0
        
        return {
            "items": formatted,
            "total": total,
            "page": page,
            "limit": limit,
            "pages": pages
        }

    # POST
    async def register_punch(self, employee_id: int, method: str, created_by: str = "system") -> Tuple[str, str]:
        now = datetime.now()
        current_time = now.strftime("%Y-%m-%d %H:%M:%S")
        
        log_data = {
            "employee_id": employee_id,
            "timestamp": now,
            "method": method,
            "created_by": created_by
        }
        await self.repository.create(log_data)
        
        print(f"[ASISTENCIA] Marcación registrada para Empleado ID: {employee_id} usando método: {method} a las {current_time}")
        return "Marcación", current_time

    # POST/attendance/punch-manual/bulk
    async def register_bulk_manual_punches(self, punches: List[dict], admin_user: str) -> int:
        count = 0
        for p in punches:
            emp_id = int(p["employee_id"])
            ts_str = p["timestamp"]
            
            # Formatear fecha y hora
            try:
                # Soporta formatos con T o espacio
                ts_str_clean = ts_str.replace("T", " ")
                if len(ts_str_clean) == 16:
                     ts_str_clean += ":00" # agregar segundos si faltan
                dt = datetime.strptime(ts_str_clean, "%Y-%m-%d %H:%M:%S")
            except Exception:
                dt = datetime.now()
                
            log_data = {
                "employee_id": emp_id,
                "timestamp": dt,
                "method": "manual",
                "created_by": admin_user
            }
            await self.repository.create(log_data)
            count += 1
            
        print(f"[ASISTENCIA MASIVA] {count} marcaciones manuales registradas en lote por {admin_user}")
        return count
