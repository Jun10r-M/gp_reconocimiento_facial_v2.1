from typing import Optional
from app.repositories.audit_log_repository import AuditLogRepository

class AuditLogService:
    def __init__(self, repository: Optional[AuditLogRepository] = None):
        self.repository = repository or AuditLogRepository()

    async def log_action(self, username: str, action: str, description: str):
        """Registra un evento de auditoría en la base de datos."""
        try:
            await self.repository.create(username, action, description)
            print(f"[AUDITORÍA] Admin: {username} | Acción: {action} | Detalle: {description}")
        except Exception as e:
            print(f"[AUDITORÍA ERROR] No se pudo registrar log: {e}")

    async def get_all_logs(self) -> list:
        """Retorna la lista de logs de auditoría formateados."""
        logs = await self.repository.get_all()
        formatted = []
        for l in logs:
            ts = l["timestamp"]
            ts_str = ts.strftime("%Y-%m-%d %H:%M:%S") if hasattr(ts, "strftime") else str(ts)
            formatted.append({
                "id": l["id"],
                "username": l["username"],
                "action": l["action"],
                "description": l["description"],
                "timestamp": ts_str
            })
        return formatted

    async def get_paginated_logs(self, page: int, limit: int, search: Optional[str] = None) -> dict:
        import math
        offset = (page - 1) * limit
        logs = await self.repository.get_paginated(limit, offset, search)
        total = await self.repository.count(search)
        
        formatted = []
        for l in logs:
            ts = l["timestamp"]
            ts_str = ts.strftime("%Y-%m-%d %H:%M:%S") if hasattr(ts, "strftime") else str(ts)
            formatted.append({
                "id": l["id"],
                "username": l["username"],
                "action": l["action"],
                "description": l["description"],
                "timestamp": ts_str
            })
            
        pages = math.ceil(total / limit) if limit > 0 else 0
        
        return {
            "items": formatted,
            "total": total,
            "page": page,
            "limit": limit,
            "pages": pages
        }
