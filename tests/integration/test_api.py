import pytest
import io
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def get_auth_headers(role: str = "super_admin", username: str = "admin_test", email: str = "test@compania.com"):
    from app.repositories.database import db
    from app.services.auth_service import AuthService
    service = AuthService()
    hashed_password = service._hash_password("Password123!")
    
    with db.get_connection() as conn:
        cursor = conn.cursor()
        placeholder = "?" if db.is_sqlite else "%s"
        cursor.execute(f"SELECT id, role FROM administrators WHERE username = {placeholder}", (username,))
        row = cursor.fetchone()
        if not row:
            # Obtener el ID del rol de base de datos
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
            
    response = client.post(
        "/auth/login",
        json={
            "username": username,
            "password": "Password123!"
        }
    )
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

def test_api_dashboard_data_empty():
    headers = get_auth_headers("admin")
    response = client.get("/data", headers=headers)
    assert response.status_code == 200
    json_data = response.json()
    assert "attendance" in json_data
    assert "employees" in json_data
    assert len(json_data["attendance"]) == 0
    assert len(json_data["employees"]) == 0

def test_auth_workflow():
    headers = get_auth_headers("super_admin", username="super_admin_workflow", email="super_workflow@test.com")
    # Registrar administrador (requiere super_admin: write permission en administradores)
    response = client.post(
        "/auth/register",
        json={
            "username": "new_admin",
            "email": "new@compania.com",
            "password": "Password123!",
            "role": "admin"
        },
        headers=headers
    )
    assert response.status_code == 201
    assert response.json()["username"] == "new_admin"

    # Login
    response_login = client.post(
        "/auth/login",
        json={
            "username": "new_admin",
            "password": "Password123!"
        }
    )
    assert response_login.status_code == 200
    assert "access_token" in response_login.json()

def test_create_employee_via_api():
    headers = get_auth_headers("admin")
    # Simular una foto en memoria
    foto_file = io.BytesIO(b"fake_photo_bytes")
    
    response = client.post(
        "/employees",
        data={
            "first_names": "Junior",
            "last_names": "Mendoza",
            "document_number": "73364100",
            "email": "junior@compania.pe",
            "phone": "987654321",
            "has_children": True,
            "pension_system": "ONP",
            "position": "Estudiante 1",
            "monthly_salary": 1500.0
        },
        files={"foto": ("junior.jpg", foto_file, "image/jpeg")},
        headers=headers
    )
    
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["status"] == "success"
    assert "employee_id" in json_data

    # Verificar que ahora aparece en el dashboard (/data)
    response_data = client.get("/data", headers=headers)
    assert response_data.status_code == 200
    db_data = response_data.json()
    assert len(db_data["employees"]) == 1
    assert db_data["employees"][0]["first_names"] == "Junior"
    assert db_data["employees"][0]["monthly_salary"] == 1500.0

def test_justifications_workflow():
    headers = get_auth_headers("admin")
    # Crear justificación
    response = client.post(
        "/justifications",
        json={
            "employee_id": 1,
            "date": "2026-05-30",
            "justification_type": "medical",
            "description": "Certificado médico"
        },
        headers=headers
    )
    assert response.status_code == 201
    assert response.json()["justification_type"] == "medical"

def test_chatbot_knowledge_via_api():
    headers = get_auth_headers("admin")
    # Registrar conocimiento
    response_post = client.post(
        "/knowledge",
        json={"question": "what is hr email?", "answer": "hr@company.com"},
        headers=headers
    )
    assert response_post.status_code == 201

    # Obtener conocimiento
    response_get = client.get("/knowledge", headers=headers)
    assert response_get.status_code == 200
    json_data = response_get.json()
    assert "what is hr email?" in json_data
    assert json_data["what is hr email?"] == "hr@company.com"

def test_unauthorized_custom_messages():
    # 1. Sin cabecera
    response = client.get("/data")
    assert response.status_code == 401
    assert response.json()["detail"] == "Acceso denegado: Token de seguridad ausente. Debe iniciar sesión como administrador."
    
    # 2. Con token inválido
    response_invalid = client.get("/data", headers={"Authorization": "Bearer invalid_token_123"})
    assert response_invalid.status_code == 401
    assert response_invalid.json()["detail"] == "Acceso denegado: Token de seguridad inválido o expirado. Por favor, inicie sesión nuevamente."

def test_rbac_permissions_blocking():
    headers_operator = get_auth_headers("operator", "operator_test", "operator@test.com")
    headers_admin = get_auth_headers("admin", "admin_test_rbac", "admin_rbac@test.com")
    headers_super = get_auth_headers("super_admin", "super_test_rbac", "super_rbac@test.com")

    # 1. Verificar GET /auth/profile
    profile_op = client.get("/auth/profile", headers=headers_operator).json()
    assert "resumen" in profile_op["menus"]
    assert "planilla" not in profile_op["menus"]
    assert "employees:read" in profile_op["scopes"]
    assert "employees:create" not in profile_op["scopes"]

    profile_adm = client.get("/auth/profile", headers=headers_admin).json()
    assert "planilla" in profile_adm["menus"]
    assert "terminales" not in profile_adm["menus"]
    assert "employees:create" in profile_adm["scopes"]
    assert "system:read" not in profile_adm["scopes"]

    # 2. Probar bloqueo de escritura en /employees para OPERATOR (debe dar 403)
    foto_file = io.BytesIO(b"fake_photo_bytes")
    res_op_post = client.post(
        "/employees",
        data={
            "first_names": "Blocked",
            "last_names": "User",
            "document_number": "99999999",
            "email": "blocked@compania.pe",
            "phone": "999999999",
            "has_children": False,
            "pension_system": "ONP",
            "position": "Blocked Position",
            "monthly_salary": 1000.0
        },
        files={"foto": ("blocked.jpg", foto_file, "image/jpeg")},
        headers=headers_operator
    )
    assert res_op_post.status_code == 403
    assert "Privilegios insuficientes" in res_op_post.json()["detail"]

    # 3. Probar bloqueo de lectura en /system/audit-logs para ADMIN (debe dar 403)
    res_adm_audit = client.get("/system/audit-logs", headers=headers_admin)
    assert res_adm_audit.status_code == 403
    assert "Privilegios insuficientes" in res_adm_audit.json()["detail"]

    # 4. Verificar que SUPER_ADMIN sí puede ver /system/audit-logs (debe dar 200)
    res_super_audit = client.get("/system/audit-logs", headers=headers_super)
    assert res_super_audit.status_code == 200
