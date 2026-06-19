import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.repositories.database import db

client = TestClient(app)

def get_auth_headers(role: str = "super_admin", username: str = "admin_pred_test", email: str = "pred_test@compania.com"):
    from app.services.auth_service import AuthService
    service = AuthService()
    hashed_password = service._hash_password("Password123!")
    
    with db.get_connection() as conn:
        cursor = conn.cursor()
        placeholder = "?" if db.is_sqlite else "%s"
        cursor.execute(f"SELECT id, role FROM administrators WHERE username = {placeholder}", (username,))
        row = cursor.fetchone()
        if not row:
            cursor.execute(f"SELECT id FROM roles WHERE name = {placeholder}", (role,))
            role_row = cursor.fetchone()
            role_id = role_row[0] if role_row else None
            
            cursor.execute(
                f"INSERT INTO administrators (username, email, password_hash, role, role_id, is_active) VALUES ({placeholder}, {placeholder}, {placeholder}, {placeholder}, {placeholder}, 1)",
                (username, email, hashed_password, role, role_id)
            )
            conn.commit()
        else:
            db_id, db_role = row
            if db_role != role:
                cursor.execute(f"SELECT id FROM roles WHERE name = {placeholder}", (role,))
                role_row = cursor.fetchone()
                role_id = role_row[0] if role_row else None
                cursor.execute(
                    f"UPDATE administrators SET role = {placeholder}, role_id = {placeholder} WHERE id = {placeholder}",
                    (role, role_id, db_id)
                )
                conn.commit()
                
    # Iniciar sesión para obtener el token JWT
    res = client.post("/auth/login", json={"username": username, "password": "Password123!"})
    token = res.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

def test_prediction_dashboard_stats():
    """Prueba que el endpoint del dashboard de predicción funcione y retorne métricas válidas."""
    headers = get_auth_headers()
    
    # Crear un empleado de prueba si no existe para que se puedan poblar datos
    placeholder = "?" if db.is_sqlite else "%s"
    with db.get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(f"SELECT id FROM employees LIMIT 1")
        if not cursor.fetchone():
            cursor.execute(
                f"INSERT INTO employees (first_names, last_names, document_number, email, phone, has_children, pension_system) VALUES ('Juan', 'Perez', '99887766', 'perez@compania.com', '999888777', 1, 'ONP')"
            )
            conn.commit()
            emp_id = cursor.lastrowid if db.is_sqlite else cursor.execute("SELECT currval(pg_get_serial_sequence('employees','id'))").fetchone()[0]
            cursor.execute(
                f"INSERT INTO contracts (employee_id, position, monthly_salary, hourly_wage, start_date, is_active) VALUES ({placeholder}, 'Operador', 1500.0, 6.25, '2025-01-01', 1)",
                (emp_id,)
            )
            conn.commit()
            
    res = client.get("/prediction/dashboard", headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert "payroll_forecast" in data
    assert "payroll_mae" in data
    assert "overtime_forecast" in data
    assert "absenteeism_forecast" in data
    assert "current_emp_count" in data
    assert data["payroll_r2"] <= 1.0

def test_prediction_simulate():
    """Prueba que el simulador presupuestario recalcule correctamente."""
    headers = get_auth_headers()
    payload = {
        "new_employees": 3,
        "target_overtime_hours": 30.0
    }
    res = client.post("/prediction/simulate", headers=headers, json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "simulated_payroll_cost" in data
    assert "variation_pct" in data
    assert data["simulated_employees"] >= 3

def test_chatbot_ask_public():
    """Prueba que el chatbot público responda a preguntas y bloquee predicciones a no autorizados."""
    # Pregunta sobre política de empresa general (debería dar respuesta por Jaccard o fallback)
    res = client.post("/knowledge/ask", json={"question": "hola cómo puedo registrar asistencia?"})
    assert res.status_code == 200
    data = res.json()
    assert "answer" in data
    
    # Pregunta sobre presupuesto sin autenticar (bloqueado por seguridad)
    res_budget = client.post("/knowledge/ask", json={"question": "dime el costo total de la planilla por favor"})
    assert res_budget.status_code == 200
    assert "confidencial" in res_budget.json()["answer"]

def test_chatbot_ask_admin():
    """Prueba que el chatbot responda con predicciones reales si se envía el token de administrador."""
    headers = get_auth_headers()
    
    # Pregunta sobre presupuesto con token de administrador (permitido)
    res = client.post("/knowledge/ask", headers=headers, json={"question": "dime el costo de la planilla del proximo mes"})
    assert res.status_code == 200
    answer = res.json()["answer"]
    assert "S/." in answer or "planilla" in answer.lower()
