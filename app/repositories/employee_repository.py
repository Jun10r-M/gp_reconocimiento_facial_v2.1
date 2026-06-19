from typing import Optional, List
from app.repositories.database import db

class EmployeeRepository:
    async def get_all(self) -> List[dict]:
        query = "SELECT * FROM employees WHERE deleted_at IS NULL ORDER BY id ASC"
        return db.execute_query(query)

    async def get_by_id(self, employee_id: int) -> Optional[dict]:
        query = "SELECT * FROM employees WHERE id = %s AND deleted_at IS NULL"
        results = db.execute_query(query, (employee_id,))
        return results[0] if results else None

    async def get_by_document(self, document_number: str) -> Optional[dict]:
        query = "SELECT * FROM employees WHERE document_number = %s AND deleted_at IS NULL"
        results = db.execute_query(query, (document_number,))
        return results[0] if results else None

    async def create(self, employee: dict) -> int:
        query = """
            INSERT INTO employees (first_names, last_names, document_number, email, phone, has_children, pension_system, created_by)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id
        """
        params = (
            employee["first_names"],
            employee["last_names"],
            employee["document_number"],
            employee["email"],
            employee.get("phone"),
            employee.get("has_children", False),
            employee.get("pension_system", "ONP"),
            employee.get("created_by", "system")
        )
        new_id = db.execute_write(query, params)
        
        # Sincronización de full_name en SQLite para pruebas unitarias
        if db.is_sqlite and new_id:
            full_name = f"{employee['first_names']} {employee['last_names']}"
            db.execute_write("UPDATE employees SET full_name = %s WHERE id = %s", (full_name, new_id))
            
        return new_id

    async def update(self, employee_id: int, employee: dict) -> bool:
        query = """
            UPDATE employees
            SET first_names = %s, last_names = %s, document_number = %s, email = %s, phone = %s, has_children = %s, pension_system = %s, updated_at = CURRENT_TIMESTAMP, updated_by = %s
            WHERE id = %s AND deleted_at IS NULL
        """
        params = (
            employee["first_names"],
            employee["last_names"],
            employee["document_number"],
            employee["email"],
            employee.get("phone"),
            employee.get("has_children", False),
            employee.get("pension_system", "ONP"),
            employee.get("updated_by", "system"),
            employee_id
        )
        db.execute_write(query, params)

        if db.is_sqlite:
            full_name = f"{employee['first_names']} {employee['last_names']}"
            db.execute_write("UPDATE employees SET full_name = %s WHERE id = %s", (full_name, employee_id))

        return True

    async def delete(self, employee_id: int, deleted_by: str = "system") -> bool:
        query = "UPDATE employees SET deleted_at = CURRENT_TIMESTAMP, deleted_by = %s WHERE id = %s"
        db.execute_write(query, (deleted_by, employee_id))
        return True

    async def get_paginated(self, limit: int, offset: int, search: Optional[str] = None) -> List[dict]:
        if search:
            query = """
                SELECT * FROM employees 
                WHERE deleted_at IS NULL 
                  AND (document_number ILIKE %s OR first_names ILIKE %s OR last_names ILIKE %s OR full_name ILIKE %s)
                ORDER BY id ASC 
                LIMIT %s OFFSET %s
            """
            s_param = f"%{search}%"
            return db.execute_query(query, (s_param, s_param, s_param, s_param, limit, offset))
        else:
            query = "SELECT * FROM employees WHERE deleted_at IS NULL ORDER BY id ASC LIMIT %s OFFSET %s"
            return db.execute_query(query, (limit, offset))

    async def count(self, search: Optional[str] = None) -> int:
        if search:
            query = """
                SELECT COUNT(*) as count FROM employees 
                WHERE deleted_at IS NULL 
                  AND (document_number ILIKE %s OR first_names ILIKE %s OR last_names ILIKE %s OR full_name ILIKE %s)
            """
            s_param = f"%{search}%"
            results = db.execute_query(query, (s_param, s_param, s_param, s_param))
        else:
            query = "SELECT COUNT(*) as count FROM employees WHERE deleted_at IS NULL"
            results = db.execute_query(query)
        
        return results[0]["count"] if results else 0
