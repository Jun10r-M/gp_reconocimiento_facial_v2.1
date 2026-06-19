import pytest
from unittest.mock import MagicMock, AsyncMock
from app.services.employee_service import EmployeeService
from app.services.attendance_service import AttendanceService
from app.services.knowledge_service import KnowledgeService
from app.services.biometrics_service import BiometricsService

@pytest.mark.asyncio
async def test_employee_service_register():
    # Instanciamos con mocks de dependencias para aislar la lógica
    mock_repo = MagicMock()
    mock_repo.get_by_document = AsyncMock(return_value=None)
    mock_repo.create = AsyncMock(return_value=1)
    
    mock_contract = MagicMock()
    mock_contract.create_contract = AsyncMock(return_value=1)
    
    mock_facial = MagicMock()
    
    service = EmployeeService(
        repository=mock_repo, 
        contract_service=mock_contract, 
        facial_service=mock_facial
    )
    
    resultado = await service.register_employee(
        first_names="Juan",
        last_names="Perez",
        document_number="87654321",
        email="juan@compania.pe",
        phone="987654321",
        has_children=False,
        pension_system="ONP",
        position="Desarrollador",
        monthly_salary=2400.0,
        photo_bytes=b"fake_image_bytes"
    )
    
    assert resultado["status"] == "success"
    assert resultado["employee_id"] == 1
    assert resultado["contract_id"] == 1

@pytest.mark.asyncio
async def test_attendance_service_register_punch():
    # Instanciar servicio real sobre DB SQLite temporal
    service = AttendanceService()
    
    action, timestamp = await service.register_punch(1, "face")
    assert action == "Marcación"
    assert timestamp is not None
    
    # En esta DB en memoria no hay empleado con ID 1 en la tabla 'employees' para el JOIN de get_all(),
    # pero el registro fue guardado correctamente en la tabla logs.

@pytest.mark.asyncio
async def test_knowledge_service_learning():
    service = KnowledgeService()
    
    exito = await service.learn_question(" what is hr email? ", " hr@company.com ")
    assert exito is True
    
    know = await service.get_all_knowledge()
    assert "what is hr email?" in know
    assert know["what is hr email?"] == "hr@company.com"

@pytest.mark.asyncio
async def test_biometrics_service_fingerprint():
    service = BiometricsService()
    
    # Registrar huella
    reg_exito = await service.register_fingerprint(1, "hash_abc_123")
    assert reg_exito is True
    
    # Verificar huella válida
    ver_exito = await service.verify_fingerprint(1, "hash_abc_123")
    assert ver_exito is True
    
    # Verificar huella inválida
    ver_fallido = await service.verify_fingerprint(1, "hash_wrong")
    assert ver_fallido is False
