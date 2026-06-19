from typing import Optional, List
from app.repositories.database import db

class BiometricsRepository:
    async def create(self, employee_id: int, biometric_type: str, pattern_data: str, created_by: str = "system") -> int:
        # Soft delete previo
        delete_query = "UPDATE biometrics SET deleted_at = CURRENT_TIMESTAMP, deleted_by = %s WHERE employee_id = %s AND biometric_type = %s AND deleted_at IS NULL"
        db.execute_write(delete_query, (created_by, employee_id, biometric_type))

        query = """
            INSERT INTO biometrics (employee_id, biometric_type, pattern_data, created_by)
            VALUES (%s, %s, %s, %s)
            RETURNING id
        """
        return db.execute_write(query, (employee_id, biometric_type, pattern_data, created_by))

    async def get_by_employee_and_type(self, employee_id: int, biometric_type: str) -> Optional[dict]:
        query = "SELECT * FROM biometrics WHERE employee_id = %s AND biometric_type = %s AND deleted_at IS NULL LIMIT 1"
        results = db.execute_query(query, (employee_id, biometric_type))
        return results[0] if results else None

    async def delete_all_by_employee_id(self, employee_id: int, deleted_by: str) -> bool:
        query = "UPDATE biometrics SET deleted_at = CURRENT_TIMESTAMP, deleted_by = %s WHERE employee_id = %s AND deleted_at IS NULL"
        db.execute_write(query, (deleted_by, employee_id))
        return True
