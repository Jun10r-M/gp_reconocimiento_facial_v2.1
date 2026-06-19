from typing import List, Optional
from app.repositories.database import db

class AuditLogRepository:
    async def create(self, username: str, action: str, description: str) -> int:
        query = """
            INSERT INTO audit_logs (username, action, description, created_by)
            VALUES (%s, %s, %s, %s)
            RETURNING id
        """
        params = (username, action, description, username)
        return db.execute_write(query, params)

    async def get_all(self) -> List[dict]:
        query = "SELECT * FROM audit_logs WHERE deleted_at IS NULL ORDER BY timestamp DESC"
        return db.execute_query(query)

    async def get_paginated(self, limit: int, offset: int, search: Optional[str] = None) -> List[dict]:
        if search:
            query = """
                SELECT * FROM audit_logs 
                WHERE deleted_at IS NULL 
                  AND (username ILIKE %s OR action ILIKE %s OR description ILIKE %s)
                ORDER BY timestamp DESC
                LIMIT %s OFFSET %s
            """
            s_param = f"%{search}%"
            return db.execute_query(query, (s_param, s_param, s_param, limit, offset))
        else:
            query = "SELECT * FROM audit_logs WHERE deleted_at IS NULL ORDER BY timestamp DESC LIMIT %s OFFSET %s"
            return db.execute_query(query, (limit, offset))

    async def count(self, search: Optional[str] = None) -> int:
        if search:
            query = """
                SELECT COUNT(*) as count FROM audit_logs 
                WHERE deleted_at IS NULL 
                  AND (username ILIKE %s OR action ILIKE %s OR description ILIKE %s)
            """
            s_param = f"%{search}%"
            results = db.execute_query(query, (s_param, s_param, s_param))
        else:
            query = "SELECT COUNT(*) as count FROM audit_logs WHERE deleted_at IS NULL"
            results = db.execute_query(query)
        
        return results[0]["count"] if results else 0
