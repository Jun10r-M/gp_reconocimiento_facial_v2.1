import pytest
from datetime import date, datetime
from app.services.employee_service import EmployeeService
from app.services.contract_service import ContractService
from app.services.payroll_service import PayrollService
from app.repositories.shift_repository import ShiftRepository
from app.repositories.attendance_repository import AttendanceRepository
from app.repositories.justification_repository import JustificationRepository

@pytest.mark.asyncio
async def test_peruvian_payroll_calculations():
    # Instanciar repositorios y servicios reales sobre la DB SQLite en memoria
    employee_service = EmployeeService()
    shift_repo = ShiftRepository()
    attendance_repo = AttendanceRepository()
    justification_repo = JustificationRepository()
    payroll_service = PayrollService()

    # 1. Registrar colaborador con hijos e ONP
    emp_res = await employee_service.register_employee(
        first_names="Junior",
        last_names="Mendoza",
        document_number="73364100",
        email="junior@compania.pe",
        phone="987654321",
        has_children=True, # Tiene hijos -> Recibe Asignación Familiar (S/ 102.50)
        pension_system="ONP", # Descuento 13.00%
        position="Desarrollador Senior",
        monthly_salary=2400.0, # Pago por hora: S/ 10.00, minuto: S/ 0.1667
        photo_bytes=b"fake_image_content"
    )
    assert emp_res["status"] == "success"
    employee_id = emp_res["employee_id"]

    # Ajustar la fecha de inicio del contrato para que sea válido en mayo 2026
    from app.repositories.database import db
    db.execute_write("UPDATE contracts SET start_date = %s WHERE employee_id = %s", ("2026-05-01", employee_id))


    # 2. Configurar horario: Lunes (1), Martes (2), Miércoles (3) de 08:00 a 17:00
    await shift_repo.create_or_update({
        "employee_id": employee_id,
        "day_of_week": 1,
        "start_time": "08:00:00",
        "end_time": "17:00:00"
    })
    await shift_repo.create_or_update({
        "employee_id": employee_id,
        "day_of_week": 2,
        "start_time": "08:00:00",
        "end_time": "17:00:00"
    })
    await shift_repo.create_or_update({
        "employee_id": employee_id,
        "day_of_week": 3,
        "start_time": "08:00:00",
        "end_time": "17:00:00"
    })

    # Rango de fechas de prueba: Mayo 2026
    # 2026-05-04 (Lunes) -> Marcación a tiempo (08:00 a 17:00)
    await attendance_repo.create({"employee_id": employee_id, "timestamp": datetime(2026, 5, 4, 8, 0, 0), "method": "face"})
    await attendance_repo.create({"employee_id": employee_id, "timestamp": datetime(2026, 5, 4, 17, 0, 0), "method": "face"})

    # 2026-05-05 (Martes) -> Marcación con tardanza (08:45 a 17:00) -> 45 minutos tarde
    # Lateness deduction = 45 * (10.0 / 60) = S/ 7.50
    await attendance_repo.create({"employee_id": employee_id, "timestamp": datetime(2026, 5, 5, 8, 45, 0), "method": "face"})
    await attendance_repo.create({"employee_id": employee_id, "timestamp": datetime(2026, 5, 5, 17, 0, 0), "method": "face"})

    # 2026-05-06 (Miércoles) -> Marcación con Horas Extra (08:00 a 20:30) -> 3.5 horas extra
    # Primeras 2 horas al 25%: 2 * 10 * 1.25 = S/ 25.00
    # Siguiente 1.5 horas al 35%: 1.5 * 10 * 1.35 = S/ 27.25
    # Total Overtime pay = S/ 52.25
    await attendance_repo.create({"employee_id": employee_id, "timestamp": datetime(2026, 5, 6, 8, 0, 0), "method": "face"})
    await attendance_repo.create({"employee_id": employee_id, "timestamp": datetime(2026, 5, 6, 20, 30, 0), "method": "face"})

    # 2026-05-11 (Lunes) -> Inasistencia Injustificada (Día laborable sin marcas ni justificación)
    # Deduction = 2400 / 30 = S/ 80.00

    # 2026-05-12 (Martes) -> Inasistencia Justificada (Día laborable sin marcas pero con justificación aprobada)
    await justification_repo.create({
        "employee_id": employee_id,
        "date": "2026-05-12",
        "justification_type": "medical",
        "description": "Fiebre y descanso certificado"
    })

    # Registrar asistencias a tiempo para el resto de días laborables del mes
    # para evitar acumular inasistencias injustificadas adicionales
    for day in [13, 18, 19, 20, 25, 26, 27]:
        await attendance_repo.create({"employee_id": employee_id, "timestamp": datetime(2026, 5, day, 8, 0, 0), "method": "face"})
        await attendance_repo.create({"employee_id": employee_id, "timestamp": datetime(2026, 5, day, 17, 0, 0), "method": "face"})

    # 3. Procesar planilla del periodo '2026-05'
    results = await payroll_service.calculate_monthly_payroll("2026-05")
    assert len(results) == 1
    payroll = results[0]

    # 4. Validar fórmulas contables bajo la legislación del Perú
    assert payroll["base_salary"] == 2400.0
    assert payroll["family_allowance"] == 102.50  # 10% RMV (hijos)
    assert payroll["overtime_pay"] == 45.25       # 2h al 25% + 1.5h al 35% (2*10*1.25 + 1.5*10*1.35 = 25.0 + 20.25 = 45.25)
    assert payroll["lateness_deduction"] == 7.50   # 45 min de retraso
    assert payroll["absence_deduction"] == 80.00   # 1 día injustificado (S/ 2400 / 30)
    
    # Gross Salary = 2400 + 102.50 + 45.25 - 7.50 - 80.00 = S/ 2460.25
    assert payroll["gross_salary"] == 2460.25
    
    # Retención Jubilación ONP = 13% de Sueldo Bruto = 2460.25 * 0.13 = S/ 319.83
    assert payroll["pension_deduction"] == 319.83
    
    # Sueldo Neto (Net Salary) = 2460.25 - 319.83 = S/ 2140.42
    assert payroll["net_salary"] == 2140.42

    # Aporte EsSalud (Costo Empleador) = 9% de Sueldo Bruto = 2460.25 * 0.09 = S/ 221.42
    assert payroll["essalud_contribution"] == 221.42
