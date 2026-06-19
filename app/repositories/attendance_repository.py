from typing import List, Optional
from datetime import datetime
from app.repositories.database import db

class AttendanceRepository:
    async def get_all(self) -> List[dict]:
        query = """
            SELECT a.id, a.employee_id, a.timestamp, a.method, e.full_name
            FROM attendance_logs a
            JOIN employees e ON a.employee_id = e.id
            WHERE a.deleted_at IS NULL AND e.deleted_at IS NULL
            ORDER BY a.timestamp DESC
        """
        return db.execute_query(query)

    async def get_by_employee_id(self, employee_id: int) -> List[dict]:
        query = "SELECT * FROM attendance_logs WHERE employee_id = %s AND deleted_at IS NULL ORDER BY timestamp ASC"
        return db.execute_query(query, (employee_id,))

    async def create(self, log: dict) -> int:
        query = """
            INSERT INTO attendance_logs (employee_id, timestamp, method, created_by)
            VALUES (%s, %s, %s, %s)
            RETURNING id
        """
        params = (
            log["employee_id"],
            log["timestamp"],
            log["method"],
            log.get("created_by", "system")
        )
        return db.execute_write(query, params)

    async def delete_all_by_employee_id(self, employee_id: int, deleted_by: str) -> bool:
        query = "UPDATE attendance_logs SET deleted_at = CURRENT_TIMESTAMP, deleted_by = %s WHERE employee_id = %s AND deleted_at IS NULL"
        db.execute_write(query, (deleted_by, employee_id))
        return True

    async def get_logs_by_period(self, employee_id: int, start_date: str, end_date: str) -> List[dict]:
        start_ts = f"{start_date} 00:00:00"
        end_ts = f"{end_date} 23:59:59"
        
        query = """
            SELECT * FROM attendance_logs
            WHERE employee_id = %s
              AND timestamp >= %s
              AND timestamp <= %s
              AND deleted_at IS NULL
            ORDER BY timestamp ASC
        """
        return db.execute_query(query, (employee_id, start_ts, end_ts))

    async def get_paginated(self, limit: int, offset: int, search: Optional[str] = None) -> List[dict]:
        if search:
            query = """
                SELECT a.id, a.employee_id, a.timestamp, a.method, e.full_name
                FROM attendance_logs a
                JOIN employees e ON a.employee_id = e.id
                WHERE a.deleted_at IS NULL AND e.deleted_at IS NULL
                  AND (e.full_name ILIKE %s OR e.document_number ILIKE %s)
                ORDER BY a.timestamp DESC
                LIMIT %s OFFSET %s
            """
            s_param = f"%{search}%"
            return db.execute_query(query, (s_param, s_param, limit, offset))
        else:
            query = """
                SELECT a.id, a.employee_id, a.timestamp, a.method, e.full_name
                FROM attendance_logs a
                JOIN employees e ON a.employee_id = e.id
                WHERE a.deleted_at IS NULL AND e.deleted_at IS NULL
                ORDER BY a.timestamp DESC
                LIMIT %s OFFSET %s
            """
            return db.execute_query(query, (limit, offset))

    async def count(self, search: Optional[str] = None) -> int:
        if search:
            query = """
                SELECT COUNT(*) as count
                FROM attendance_logs a
                JOIN employees e ON a.employee_id = e.id
                WHERE a.deleted_at IS NULL AND e.deleted_at IS NULL
                  AND (e.full_name ILIKE %s OR e.document_number ILIKE %s)
            """
            s_param = f"%{search}%"
            results = db.execute_query(query, (s_param, s_param))
        else:
            query = """
                SELECT COUNT(*) as count
                FROM attendance_logs a
                JOIN employees e ON a.employee_id = e.id
                WHERE a.deleted_at IS NULL AND e.deleted_at IS NULL
            """
            results = db.execute_query(query)
        
        return results[0]["count"] if results else 0
