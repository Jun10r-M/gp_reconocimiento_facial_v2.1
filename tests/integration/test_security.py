import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.repositories.database import db

client = TestClient(app)

def get_auth_headers(role: str = "super_admin", username: str = "admin_sec_test", email: str = "sec_test@compania.com"):
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
                
    res = client.post("/auth/login", json={"username": username, "password": "Password123!"})
    token = res.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

def test_get_menus_authorized():
    """Verifica que el super_admin pueda listar los menús del sistema."""
    headers = get_auth_headers(role="super_admin")
    res = client.get("/security/menus", headers=headers)
    assert res.status_code == 200
    menus = res.json()
    assert len(menus) > 0
    assert any(m["key"] == "resumen" for m in menus)
    assert any(m["key"] == "seguridad" for m in menus)

def test_get_menus_unauthorized_operator():
    """Verifica que un operador común no tenga permisos de lectura para el módulo de seguridad."""
    headers = get_auth_headers(role="operator", username="operator_sec_test", email="opsec@compania.com")
    res = client.get("/security/menus", headers=headers)
    # Debería retornar 403 Forbidden por no tener el permiso 'security:read'
    assert res.status_code == 403

def test_create_menu_disabled():
    """Verifica que la creación de menús esté deshabilitada y retorne 405."""
    headers = get_auth_headers(role="super_admin")
    new_menu = {
        "key": "test_menu",
        "label": "Menú de Pruebas",
        "icon": "shield-check"
    }
    res = client.post("/security/menus", headers=headers, json=new_menu)
    assert res.status_code == 405

def test_update_menu():
    """Prueba el flujo de actualización de un menú existente."""
    headers = get_auth_headers(role="super_admin")
    
    # 1. Obtener los menús existentes
    res_list = client.get("/security/menus", headers=headers)
    assert res_list.status_code == 200
    menus = res_list.json()
    menu_to_update = menus[0]
    menu_id = menu_to_update["id"]
    
    # 2. Actualizar el menú
    update_payload = {
        "label": "Etiqueta Modificada",
        "icon": "lock",
        "parent_id": None
    }
    res_update = client.put(f"/security/menus/{menu_id}", headers=headers, json=update_payload)
    assert res_update.status_code == 200
    assert res_update.json()["status"] == "ok"
    
    # 3. Verificar que se actualizó
    res_list_after = client.get("/security/menus", headers=headers)
    menus_after = res_list_after.json()
    updated_menu = next(m for m in menus_after if m["id"] == menu_id)
    assert updated_menu["label"] == "Etiqueta Modificada"

def test_get_permissions():
    """Verifica la obtención de todos los permisos del sistema."""
    headers = get_auth_headers(role="super_admin")
    res = client.get("/security/permissions", headers=headers)
    assert res.status_code == 200
    perms = res.json()
    assert len(perms) > 0
    # Verificar que existan códigos CRUD de módulos
    assert any(p["code"] == "employees:read" for p in perms)
    assert any(p["code"] == "security:read" for p in perms)

def test_get_roles():
    """Verifica la obtención de roles del sistema."""
    headers = get_auth_headers(role="super_admin")
    res = client.get("/security/roles", headers=headers)
    assert res.status_code == 200
    roles = res.json()
    assert len(roles) >= 3
    assert any(r["name"] == "super_admin" for r in roles)
    assert any(r["name"] == "operator" for r in roles)

def test_role_assignments_workflow():
    """Prueba completa del flujo de actualización de la matriz RBAC."""
    headers = get_auth_headers(role="super_admin")
    
    # 1. Obtener ID del rol 'operator'
    res_roles = client.get("/security/roles", headers=headers)
    roles = res_roles.json()
    op_role = next(r for r in roles if r["name"] == "operator")
    role_id = op_role["id"]
    
    # 2. Consultar asignaciones iniciales
    res_initial = client.get(f"/security/roles/{role_id}/assignments", headers=headers)
    assert res_initial.status_code == 200
    initial_data = res_initial.json()
    
    # 3. Obtener menús y permisos de ejemplo para asignar
    res_menus = client.get("/security/menus", headers=headers)
    menu_ids = [m["id"] for m in res_menus.json()[:2]] # Asignar los 2 primeros menús
    
    res_perms = client.get("/security/permissions", headers=headers)
    perm_ids = [p["id"] for p in res_perms.json()[:3]] # Asignar los 3 primeros permisos
    
    # 4. Actualizar asignaciones
    update_payload = {
        "menu_ids": menu_ids,
        "permission_ids": perm_ids
    }
    res_update = client.post(f"/security/roles/{role_id}/assignments", headers=headers, json=update_payload)
    assert res_update.status_code == 200
    assert res_update.json()["status"] == "ok"
    
    # 5. Volver a consultar y validar cambios
    res_final = client.get(f"/security/roles/{role_id}/assignments", headers=headers)
    final_data = res_final.json()
    assert set(final_data["menu_ids"]) == set(menu_ids)
    assert set(final_data["permission_ids"]) == set(perm_ids)

def test_update_admin():
    headers = get_auth_headers(role="super_admin")
    reg_res = client.post(
        "/auth/register",
        json={
            "username": "temp_admin_to_edit",
            "email": "temp_edit@compania.com",
            "password": "Password123!",
            "role": "admin"
        },
        headers=headers
    )
    assert reg_res.status_code == 201
    user_id = reg_res.json()["id"]
    
    update_res = client.put(
        f"/auth/users/{user_id}",
        json={
            "email": "updated_temp@compania.com",
            "role": "operator",
            "password": "NewPassword123!"
        },
        headers=headers
    )
    assert update_res.status_code == 200
    assert update_res.json()["status"] == "success"

def test_update_employee():
    headers = get_auth_headers(role="super_admin")
    from app.repositories.database import db
    with db.get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO employees (first_names, last_names, document_number, email, phone, has_children, pension_system) VALUES ('Temp', 'Emp', '88887777', 'temp@emp.com', '999999999', 0, 'ONP')"
        )
        conn.commit()
        if db.is_sqlite:
            employee_id = cursor.lastrowid
        else:
            cursor.execute("SELECT currval(pg_get_serial_sequence('employees','id'))")
            employee_id = cursor.fetchone()[0]

    res = client.put(
        f"/employees/{employee_id}",
        data={
            "first_names": "Temp Updated",
            "last_names": "Emp Updated",
            "document_number": "88887777",
            "email": "temp_updated@emp.com",
            "phone": "999999999",
            "has_children": True,
            "pension_system": "AFP"
        },
        headers=headers
    )
    assert res.status_code == 200
    assert res.json()["status"] == "success"

def test_update_justification():
    headers = get_auth_headers(role="super_admin")
    from app.repositories.database import db
    with db.get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO employees (first_names, last_names, document_number, email, phone, has_children, pension_system) VALUES ('TempJust', 'Emp', '77776666', 'tempjust@emp.com', '999999999', 0, 'ONP')"
        )
        conn.commit()
        if db.is_sqlite:
            emp_id = cursor.lastrowid
        else:
            cursor.execute("SELECT currval(pg_get_serial_sequence('employees','id'))")
            emp_id = cursor.fetchone()[0]

        cursor.execute(
            f"INSERT INTO justifications (employee_id, date, justification_type, description, created_by) VALUES ({emp_id}, '2026-06-02', 'medical', 'Certificado', 'admin')"
        )
        conn.commit()
        if db.is_sqlite:
            just_id = cursor.lastrowid
        else:
            cursor.execute("SELECT currval(pg_get_serial_sequence('justifications','id'))")
            just_id = cursor.fetchone()[0]

    res = client.put(
        f"/justifications/{just_id}",
        json={
            "justification_type": "permit",
            "description": "Permiso de paternidad"
        },
        headers=headers
    )
    assert res.status_code == 200
    assert res.json()["justification_type"] == "permit"

def test_update_shift():
    headers = get_auth_headers(role="super_admin")
    from app.repositories.database import db
    with db.get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO employees (first_names, last_names, document_number, email, phone, has_children, pension_system) VALUES ('TempShift', 'Emp', '66665555', 'tempshift@emp.com', '999999999', 0, 'ONP')"
        )
        conn.commit()
        if db.is_sqlite:
            emp_id = cursor.lastrowid
        else:
            cursor.execute("SELECT currval(pg_get_serial_sequence('employees','id'))")
            emp_id = cursor.fetchone()[0]
        
        cursor.execute(
            f"INSERT INTO shifts (employee_id, day_of_week, start_time, end_time, created_by) VALUES ({emp_id}, 1, '08:00:00', '17:00:00', 'admin')"
        )
        conn.commit()
        if db.is_sqlite:
            shift_id = cursor.lastrowid
        else:
            cursor.execute("SELECT currval(pg_get_serial_sequence('shifts','id'))")
            shift_id = cursor.fetchone()[0]

    res = client.put(
        f"/attendance/shifts/{shift_id}",
        json={
            "start_time": "09:00:00",
            "end_time": "18:00:00"
        },
        headers=headers
    )
    assert res.status_code == 200
    assert res.json()["start_time"] == "09:00:00"
    assert res.json()["end_time"] == "18:00:00"

def test_update_terminal():
    headers = get_auth_headers(role="super_admin")
    res = client.put(
        "/system/terminals/1",
        json={
            "name": "Updated Camera Name",
            "status": "offline"
        },
        headers=headers
    )
    assert res.status_code == 200
    assert res.json()["name"] == "Updated Camera Name"
    assert res.json()["status"] == "offline"
