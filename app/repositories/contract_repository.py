from typing import List, Optional
from datetime import date
import calendar
from app.repositories.database import db

class ContractRepository:
    async def get_by_employee_id(self, employee_id: int) -> List[dict]:
        query = "SELECT * FROM contracts WHERE employee_id = %s AND deleted_at IS NULL ORDER BY start_date DESC"
        return db.execute_query(query, (employee_id,))

    async def get_paginated_by_employee_id(self, employee_id: int, limit: int, offset: int) -> List[dict]:
        query = "SELECT * FROM contracts WHERE employee_id = %s AND deleted_at IS NULL ORDER BY start_date DESC LIMIT %s OFFSET %s"
        return db.execute_query(query, (employee_id, limit, offset))

    async def count_by_employee_id(self, employee_id: int) -> int:
        query = "SELECT COUNT(*) as count FROM contracts WHERE employee_id = %s AND deleted_at IS NULL"
        results = db.execute_query(query, (employee_id,))
        return results[0]["count"] if results else 0

    async def get_active_by_employee_id(self, employee_id: int) -> Optional[dict]:
        query = "SELECT * FROM contracts WHERE employee_id = %s AND is_active = TRUE AND deleted_at IS NULL LIMIT 1"
        results = db.execute_query(query, (employee_id,))
        return results[0] if results else None

    async def deactivate_all_by_employee_id(self, employee_id: int, updated_by: str = "system") -> bool:
        query = "UPDATE contracts SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP, updated_by = %s WHERE employee_id = %s AND deleted_at IS NULL"
        db.execute_write(query, (updated_by, employee_id))
        return True

    async def create(self, contract: dict) -> int:
        query = """
            INSERT INTO contracts (employee_id, position, monthly_salary, hourly_wage, start_date, end_date, is_active, created_by)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id
        """
        hourly_wage = round(float(contract["monthly_salary"]) / 240, 2)
        params = (
            contract["employee_id"],
            contract["position"],
            contract["monthly_salary"],
            hourly_wage,
            contract["start_date"],
            contract.get("end_date"),
            contract.get("is_active", True),
            contract.get("created_by", "system")
        )
        return db.execute_write(query, params)

    async def delete_all_by_employee_id(self, employee_id: int, deleted_by: str) -> bool:
        query = "UPDATE contracts SET deleted_at = CURRENT_TIMESTAMP, deleted_by = %s WHERE employee_id = %s AND deleted_at IS NULL"
        db.execute_write(query, (deleted_by, employee_id))
        return True

    async def get_contract_for_period(self, employee_id: int, period: str) -> Optional[dict]:
        try:
            year, month = map(int, period.split("-"))
            _, last_day = calendar.monthrange(year, month)
            start_of_month = f"{period}-01"
            end_of_month = f"{period}-{last_day}"
        except Exception:
            start_of_month = f"{period}-01"
            end_of_month = f"{period}-30"

        query = """
            SELECT * FROM contracts
            WHERE employee_id = %s
              AND start_date <= %s
              AND (end_date IS NULL OR end_date >= %s)
              AND deleted_at IS NULL
            ORDER BY is_active DESC, start_date DESC LIMIT 1
        """
        results = db.execute_query(query, (employee_id, end_of_month, start_of_month))
        return results[0] if results else None
