import pytest
from app.repositories.employee_repository import EmployeeRepository
from app.repositories.attendance_repository import AttendanceRepository
from app.repositories.knowledge_repository import KnowledgeRepository

@pytest.mark.asyncio
async def test_employee_repository():
    repo = EmployeeRepository()
    
    # Debe iniciar vacío
    all_emps = await repo.get_all()
    assert isinstance(all_emps, list)
    assert len(all_emps) == 0

    # Crear un empleado (campos en inglés)
    emp_data = {
        "first_names": "Test",
        "last_names": "User",
        "document_number": "12345678",
        "email": "test@compania.pe",
        "phone": "987654321",
        "has_children": False,
        "pension_system": "ONP"
    }
    new_id = await repo.create(emp_data)
    assert new_id is not None
    assert isinstance(new_id, int)

    # Verificar que existe
    all_emps = await repo.get_all()
    assert len(all_emps) == 1
    assert all_emps[0]["first_names"] == "Test"
    assert all_emps[0]["full_name"] == "Test User"

    # Buscar por documento (DNI)
    found = await repo.get_by_document("12345678")
    assert found is not None
    assert found["email"] == "test@compania.pe"

@pytest.mark.asyncio
async def test_attendance_repository():
    repo = AttendanceRepository()
    
    # Registrar fichada
    record = {
        "employee_id": 1,
        "timestamp": "2026-05-30 08:00:00",
        "method": "face"
    }
    creado = await repo.create(record)
    assert creado is not None

@pytest.mark.asyncio
async def test_knowledge_repository():
    repo = KnowledgeRepository()
    
    # Enseñar al chatbot
    exito = await repo.learn("what is hr email?", "hr@company.com")
    assert exito is True

    know = await repo.get_all()
    assert "what is hr email?" in know
    assert know["what is hr email?"] == "hr@company.com"
