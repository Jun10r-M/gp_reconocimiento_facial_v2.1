import pytest
import io
from fastapi.testclient import TestClient
from app.main import app
from tests.integration.test_api import get_auth_headers
from app.repositories.database import db

client = TestClient(app)

def test_chatbot_dynamic_queries():
    # 1. Crear un colaborador para pruebas
    headers = get_auth_headers("admin")
    
    # Limpiar posibles residuos
    with db.get_connection() as conn:
        cursor = conn.cursor()
        placeholder = "?" if db.is_sqlite else "%s"
        cursor.execute(f"DELETE FROM employees WHERE document_number = {placeholder}", ("12345678",))
        conn.commit()

    foto_file = io.BytesIO(b"fake_photo_bytes")
    response_emp = client.post(
        "/employees",
        data={
            "first_names": "Roberto",
            "last_names": "Torres Peña",
            "document_number": "12345678",
            "email": "roberto.torres@compania.pe",
            "phone": "999888777",
            "has_children": False,
            "pension_system": "ONP",
            "position": "Analista de TI",
            "monthly_salary": 3000.0
        },
        files={"foto": ("roberto.jpg", foto_file, "image/jpeg")},
        headers=headers
    )
    assert response_emp.status_code == 200
    emp_id = response_emp.json()["employee_id"]

    # 2. Agregar registros de asistencia
    with db.get_connection() as conn:
        cursor = conn.cursor()
        placeholder = "?" if db.is_sqlite else "%s"
        # Insertar dos marcaciones para Roberto el 2026-06-15
        cursor.execute(
            f"INSERT INTO attendance_logs (employee_id, timestamp, method, created_by) VALUES ({placeholder}, '2026-06-15 08:00:00', 'face', 'system')",
            (emp_id,)
        )
        cursor.execute(
            f"INSERT INTO attendance_logs (employee_id, timestamp, method, created_by) VALUES ({placeholder}, '2026-06-15 17:00:00', 'face', 'system')",
            (emp_id,)
        )
        # Insertar una marcación para Roberto el 2026-06-16
        cursor.execute(
            f"INSERT INTO attendance_logs (employee_id, timestamp, method, created_by) VALUES ({placeholder}, '2026-06-16 08:05:00', 'face', 'system')",
            (emp_id,)
        )
        conn.commit()

    # 3. Probar consulta de asistencia de empleado específica (Sin cabecera de admin -> debe denegar de forma segura/cortés)
    response_unauth = client.post(
        "/knowledge/ask",
        json={"question": "cuantas asistencias tiene el colaborador Roberto Torres Peña"}
    )
    assert response_unauth.status_code == 200
    assert "inicia sesión" in response_unauth.json()["answer"].lower()

    # 4. Probar consulta de asistencia de empleado específica (Con cabecera de admin -> debe retornar datos reales)
    response_auth = client.post(
        "/knowledge/ask",
        json={"question": "cuantas asistencias tiene el colaborador Roberto Torres Peña"},
        headers=headers
    )
    assert response_auth.status_code == 200
    ans = response_auth.json()["answer"]
    assert "Roberto Torres Peña" in ans
    assert "3 marcaciones" in ans or "3" in ans
    assert "2 días" in ans or "2" in ans

    # 5. Probar consulta de asistencia mensual global
    response_month = client.post(
        "/knowledge/ask",
        json={"question": "total de asistencia del mes de junio de 2026"},
        headers=headers
    )
    assert response_month.status_code == 200
    ans_month = response_month.json()["answer"]
    assert "junio 2026" in ans_month.lower()
    assert "3 marcaciones" in ans_month.lower()

    # 6. Probar consulta de planilla mensual global cuando aún no se ha generado la planilla
    response_payroll_empty = client.post(
        "/knowledge/ask",
        json={"question": "total generado de planilla del mes de junio de 2026"},
        headers=headers
    )
    assert response_payroll_empty.status_code == 200
    assert "no se ha generado la planilla" in response_payroll_empty.json()["answer"].lower()

    # 7. Generar la planilla para junio 2026
    # Crear un turno y contrato para Roberto
    with db.get_connection() as conn:
        cursor = conn.cursor()
        placeholder = "?" if db.is_sqlite else "%s"
        # Lunes (1) turno de 8 a 17
        if db.is_sqlite:
            cursor.execute(
                f"INSERT OR IGNORE INTO shifts (employee_id, day_of_week, start_time, end_time, tolerance) VALUES (?, 1, '08:00:00', '17:00:00', 10)",
                (emp_id,)
            )
            cursor.execute(
                f"INSERT OR IGNORE INTO contracts (employee_id, position, monthly_salary, hourly_wage, start_date, is_active) VALUES (?, 'Analista de TI', 3000.0, 12.5, '2026-06-01', 1)",
                (emp_id,)
            )
        else:
            cursor.execute(
                f"INSERT INTO shifts (employee_id, day_of_week, start_time, end_time, tolerance) VALUES (%s, 1, '08:00:00', '17:00:00', 10) ON CONFLICT DO NOTHING",
                (emp_id,)
            )
            cursor.execute(
                f"INSERT INTO contracts (employee_id, position, monthly_salary, hourly_wage, start_date, is_active) VALUES (%s, 'Analista de TI', 3000.0, 12.5, '2026-06-01', TRUE)",
                (emp_id,)
            )
        conn.commit()

    response_calc = client.post(
        "/payroll/calculate",
        json={"period": "2026-06"},
        headers=headers
    )
    assert response_calc.status_code == 200

    # 8. Probar de nuevo la planilla mensual global ahora que está generada
    response_payroll = client.post(
        "/knowledge/ask",
        json={"question": "total generado de planilla del mes de junio de 2026"},
        headers=headers
    )
    assert response_payroll.status_code == 200
    ans_payroll = response_payroll.json()["answer"]
    assert "neto" in ans_payroll.lower()
    assert "bruto" in ans_payroll.lower()

    # 9. Probar planilla individual de empleado en un mes
    response_payroll_indiv = client.post(
        "/knowledge/ask",
        json={"question": "planilla de Roberto en junio de 2026"},
        headers=headers
    )
    assert response_payroll_indiv.status_code == 200
    ans_indiv = response_payroll_indiv.json()["answer"]
    assert "Roberto Torres Peña" in ans_indiv
    assert "sueldo neto" in ans_indiv.lower()

    # 10. Probar consulta de planilla del mes de Mayo (asegurar que no resuelva a Enero por culpa de la palabra 'generado' o 'genero')
    response_mayo = client.post(
        "/knowledge/ask",
        json={"question": "total generado en la planilla de mayo de 2026"},
        headers=headers
    )
    assert response_mayo.status_code == 200
    ans_mayo = response_mayo.json()["answer"].lower()
    assert "mayo" in ans_mayo
    assert "enero" not in ans_mayo

    # Limpieza final
    with db.get_connection() as conn:
        cursor = conn.cursor()
        placeholder = "?" if db.is_sqlite else "%s"
        cursor.execute(f"DELETE FROM employees WHERE document_number = {placeholder}", ("12345678",))
        conn.commit()
