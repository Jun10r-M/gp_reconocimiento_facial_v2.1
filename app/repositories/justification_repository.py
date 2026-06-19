from typing import List, Optional
from app.repositories.database import db

class JustificationRepository:
    async def get_by_employee_id(self, employee_id: int) -> List[dict]:
        query = "SELECT * FROM justifications WHERE employee_id = %s AND deleted_at IS NULL ORDER BY date DESC"
        return db.execute_query(query, (employee_id,))

    async def get_by_employee_and_date(self, employee_id: int, date_str: str) -> Optional[dict]:
        query = "SELECT * FROM justifications WHERE employee_id = %s AND date = %s AND deleted_at IS NULL LIMIT 1"
        results = db.execute_query(query, (employee_id, date_str))
        return results[0] if results else None

    async def create(self, justification: dict) -> int:
        # Eliminar registro previo físicamente debido a la restricción UNIQUE (employee_id, date)
        delete_query = "DELETE FROM justifications WHERE employee_id = %s AND date = %s"
        db.execute_write(delete_query, (justification["employee_id"], justification["date"]))

        query = """
            INSERT INTO justifications (employee_id, date, justification_type, description, created_by)
            VALUES (%s, %s, %s, %s, %s)
            RETURNING id
        """
        params = (
            justification["employee_id"],
            justification["date"],
            justification["justification_type"],
            justification.get("description"),
            justification.get("created_by", "system")
        )
        return db.execute_write(query, params)

    async def delete(self, employee_id: int, date_str: str, deleted_by: str = "system") -> bool:
        query = "UPDATE justifications SET deleted_at = CURRENT_TIMESTAMP, deleted_by = %s WHERE employee_id = %s AND date = %s AND deleted_at IS NULL"
        db.execute_write(query, (deleted_by, employee_id, date_str))
        return True

    async def get_by_id(self, justification_id: int) -> Optional[dict]:
        query = "SELECT * FROM justifications WHERE id = %s AND deleted_at IS NULL LIMIT 1"
        results = db.execute_query(query, (justification_id,))
        return results[0] if results else None

    async def update(self, justification_id: int, justification_type: str, description: Optional[str], updated_by: str = "system") -> bool:
        query = """
            UPDATE justifications 
            SET justification_type = %s, description = %s, updated_at = CURRENT_TIMESTAMP, updated_by = %s
            WHERE id = %s AND deleted_at IS NULL
        """
        db.execute_write(query, (justification_type, description, updated_by, justification_id))
        return True

    async def delete_all_by_employee_id(self, employee_id: int, deleted_by: str) -> bool:
        query = "UPDATE justifications SET deleted_at = CURRENT_TIMESTAMP, deleted_by = %s WHERE employee_id = %s AND deleted_at IS NULL"
        db.execute_write(query, (deleted_by, employee_id))
        return True

    async def get_paginated(self, limit: int, offset: int, search: Optional[str] = None) -> List[dict]:
        if search:
            query = """
                SELECT j.*, e.full_name
                FROM justifications j
                JOIN employees e ON j.employee_id = e.id
                WHERE j.deleted_at IS NULL AND e.deleted_at IS NULL
                  AND (e.full_name ILIKE %s OR e.document_number ILIKE %s)
                ORDER BY j.date DESC, j.id DESC
                LIMIT %s OFFSET %s
            """
            s_param = f"%{search}%"
            return db.execute_query(query, (s_param, s_param, limit, offset))
        else:
            query = """
                SELECT j.*, e.full_name
                FROM justifications j
                JOIN employees e ON j.employee_id = e.id
                WHERE j.deleted_at IS NULL AND e.deleted_at IS NULL
                ORDER BY j.date DESC, j.id DESC
                LIMIT %s OFFSET %s
            """
            return db.execute_query(query, (limit, offset))

    async def count(self, search: Optional[str] = None) -> int:
        if search:
            query = """
                SELECT COUNT(*) as count
                FROM justifications j
                JOIN employees e ON j.employee_id = e.id
                WHERE j.deleted_at IS NULL AND e.deleted_at IS NULL
                  AND (e.full_name ILIKE %s OR e.document_number ILIKE %s)
            """
            s_param = f"%{search}%"
            results = db.execute_query(query, (s_param, s_param))
        else:
            query = """
                SELECT COUNT(*) as count
                FROM justifications j
                JOIN employees e ON j.employee_id = e.id
                WHERE j.deleted_at IS NULL AND e.deleted_at IS NULL
            """
            results = db.execute_query(query)
        
        return results[0]["count"] if results else 0
