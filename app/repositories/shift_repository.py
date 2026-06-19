from typing import List, Optional
from app.repositories.database import db

class ShiftRepository:
    async def get_by_employee_id(self, employee_id: int) -> List[dict]:
        query = "SELECT * FROM shifts WHERE employee_id = %s AND deleted_at IS NULL ORDER BY day_of_week ASC"
        return db.execute_query(query, (employee_id,))

    async def create_or_update(self, shift: dict) -> int:
        admin_user = shift.get("created_by", "system")
        tolerance = int(shift.get("tolerance", 10))
        
        # Eliminar registro previo físicamente debido a la restricción UNIQUE (employee_id, day_of_week)
        delete_query = "DELETE FROM shifts WHERE employee_id = %s AND day_of_week = %s"
        db.execute_write(delete_query, (shift["employee_id"], shift["day_of_week"]))

        insert_query = """
            INSERT INTO shifts (employee_id, day_of_week, start_time, end_time, tolerance, created_by)
            VALUES (%s, %s, %s, %s, %s, %s)
            RETURNING id
        """
        params = (
            shift["employee_id"],
            shift["day_of_week"],
            shift["start_time"],
            shift["end_time"],
            tolerance,
            admin_user
        )
        return db.execute_write(insert_query, params)

    async def get_by_employee_and_day(self, employee_id: int, day_of_week: int) -> Optional[dict]:
        query = "SELECT * FROM shifts WHERE employee_id = %s AND day_of_week = %s AND deleted_at IS NULL LIMIT 1"
        results = db.execute_query(query, (employee_id, day_of_week))
        return results[0] if results else None

    async def get_by_id(self, shift_id: int) -> Optional[dict]:
        query = "SELECT * FROM shifts WHERE id = %s AND deleted_at IS NULL LIMIT 1"
        results = db.execute_query(query, (shift_id,))
        return results[0] if results else None

    async def update(self, shift_id: int, start_time: str, end_time: str, tolerance: int = 10, updated_by: str = "system") -> bool:
        query = """
            UPDATE shifts
            SET start_time = %s, end_time = %s, tolerance = %s, updated_at = CURRENT_TIMESTAMP, updated_by = %s
            WHERE id = %s AND deleted_at IS NULL
        """
        db.execute_write(query, (start_time, end_time, int(tolerance), updated_by, shift_id))
        return True

    async def delete_all_by_employee_id(self, employee_id: int, deleted_by: str) -> bool:
        query = "UPDATE shifts SET deleted_at = CURRENT_TIMESTAMP, deleted_by = %s WHERE employee_id = %s AND deleted_at IS NULL"
        db.execute_write(query, (deleted_by, employee_id))
        return True
