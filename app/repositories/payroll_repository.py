from typing import List, Optional
from app.repositories.database import db

class PayrollRepository:
    async def get_by_employee_id(self, employee_id: int) -> List[dict]:
        query = "SELECT * FROM payrolls WHERE employee_id = %s AND deleted_at IS NULL ORDER BY period DESC"
        return db.execute_query(query, (employee_id,))

    async def get_by_period(self, period: str) -> List[dict]:
        query = """
            SELECT p.*, e.full_name, e.document_number
            FROM payrolls p
            JOIN employees e ON p.employee_id = e.id
            WHERE p.period = %s AND p.deleted_at IS NULL AND e.deleted_at IS NULL
            ORDER BY e.full_name ASC
        """
        return db.execute_query(query, (period,))

    async def get_by_employee_and_period(self, employee_id: int, period: str) -> Optional[dict]:
        query = "SELECT * FROM payrolls WHERE employee_id = %s AND period = %s AND deleted_at IS NULL LIMIT 1"
        results = db.execute_query(query, (employee_id, period))
        return results[0] if results else None

    async def create_or_update(self, payroll: dict) -> int:
        admin_user = payroll.get("created_by", "system")
        
        # Eliminar registro previo físicamente debido a la restricción UNIQUE (employee_id, period)
        delete_query = "DELETE FROM payrolls WHERE employee_id = %s AND period = %s"
        db.execute_write(delete_query, (payroll["employee_id"], payroll["period"]))

        query = """
            INSERT INTO payrolls (
                employee_id, period, days_worked, lateness_minutes,
                overtime_25_hours, overtime_35_hours, base_salary,
                family_allowance, overtime_pay, lateness_deduction,
                absence_deduction, gross_salary, pension_deduction,
                net_salary, essalud_contribution, created_by
            )
            VALUES (
                %s, %s, %s, %s,
                %s, %s, %s,
                %s, %s, %s,
                %s, %s, %s,
                %s, %s, %s
            )
            RETURNING id
        """
        params = (
            payroll["employee_id"],
            payroll["period"],
            payroll.get("days_worked", 30),
            payroll.get("lateness_minutes", 0),
            payroll.get("overtime_25_hours", 0.0),
            payroll.get("overtime_35_hours", 0.0),
            payroll["base_salary"],
            payroll.get("family_allowance", 0.0),
            payroll.get("overtime_pay", 0.0),
            payroll.get("lateness_deduction", 0.0),
            payroll.get("absence_deduction", 0.0),
            payroll["gross_salary"],
            payroll["pension_deduction"],
            payroll["net_salary"],
            payroll["essalud_contribution"],
            admin_user
        )
        return db.execute_write(query, params)

    async def delete_all_by_employee_id(self, employee_id: int, deleted_by: str) -> bool:
        query = "UPDATE payrolls SET deleted_at = CURRENT_TIMESTAMP, deleted_by = %s WHERE employee_id = %s AND deleted_at IS NULL"
        db.execute_write(query, (deleted_by, employee_id))
        return True
