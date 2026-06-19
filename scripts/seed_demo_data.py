import os
os.environ["DATABASE_URL"] = "sqlite:///data/db/attendance.db"

import asyncio
import sys
from datetime import datetime, date, timedelta, time

# Add project root to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.repositories.database import db
from app.services.rbac_sync_service import RbacSyncService
from app.services.auth_service import AuthService
from app.services.payroll_service import PayrollService

async def seed_data():
    print("Iniciando carga de datos de prueba...")
    
    # 1. Sincronizar roles y permisos
    sync_service = RbacSyncService()
    await sync_service.sync_database_rbac()
    
    # Obtener IDs de roles creados
    roles = db.execute_query("SELECT * FROM roles")
    roles_map = {r["name"]: r["id"] for r in roles}
    print(f"Roles encontrados en base de datos: {roles_map}")
    
    # 2. Limpiar tablas existentes para datos limpios
    tables_to_clear = [
        "payrolls",
        "attendance_logs",
        "justifications",
        "shifts",
        "contracts",
        "employees",
        "audit_logs"
    ]
    for table in tables_to_clear:
        db.execute_write(f"DELETE FROM {table}")
    
    # Borrar administradores creados que no sean el admin por defecto
    db.execute_write("DELETE FROM administrators WHERE username NOT IN ('admin')")
    
    # 3. Crear Administradores para cada rol
    auth = AuthService()
    admin_users = [
        {"username": "superadmin", "password": "superadmin", "email": "superadmin@sistema.com", "role": "super_admin"},
        {"username": "hr_manager", "password": "hr_manager", "email": "hr@sistema.com", "role": "admin"},
        {"username": "consultor", "password": "consultor", "email": "consultor@sistema.com", "role": "operator"}
    ]
    
    for adm in admin_users:
        # Si ya existe por algún motivo, borrarlo
        db.execute_write("DELETE FROM administrators WHERE username = %s", (adm["username"],))
        
        password_hash = auth._hash_password(adm["password"])
        role_id = roles_map[adm["role"]]
        db.execute_write(
            """
            INSERT INTO administrators (username, password_hash, email, role, role_id, is_active, created_by)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            """,
            (adm["username"], password_hash, adm["email"], adm["role"], role_id, True, "system")
        )
        print(f"Administrador creado: {adm['username']} con rol {adm['role']}")

    # 4. Registrar 15 empleados
    employees_data = [
        # Nombres, Apellidos, DNI, Email, Phone, has_children, pension_system, cargo, sueldo
        ("Juan", "Pérez Silva", "10000001", "juan.perez@empresa.com", "999888771", True, "Integra", "Gerente General", 12000.00),
        ("María", "Rodríguez Cueva", "10000002", "maria.rodriguez@empresa.com", "999888772", False, "ONP", "Contador", 4500.00),
        ("Carlos", "Mendoza Ramos", "10000003", "carlos.mendoza@empresa.com", "999888773", True, "Habitat", "Desarrollador Senior", 6800.00),
        ("Ana", "Gómez Torres", "10000004", "ana.gomez@empresa.com", "999888774", False, "Prima", "Desarrollador Junior", 2800.00),
        ("Luis", "Quispe Mamani", "10000005", "luis.quispe@empresa.com", "999888775", True, "ONP", "Especialista de RRHH", 3500.00),
        ("Sofía", "Flores Vega", "10000006", "sofia.flores@empresa.com", "999888776", False, "Profuturo", "Asistente Administrativo", 2200.00),
        ("Pedro", "Sánchez Ruiz", "10000007", "pedro.sanchez@empresa.com", "999888777", True, "ONP", "Recepcionista", 1500.00),
        ("Laura", "Díaz Benites", "10000008", "laura.diaz@empresa.com", "999888778", False, "Integra", "Analista de Sistemas", 5000.00),
        ("Jorge", "Huamán Castro", "10000009", "jorge.huaman@empresa.com", "999888779", True, "ONP", "Operador de Sistemas", 2500.00),
        ("Elena", "Castro López", "10000010", "elena.castro@empresa.com", "999888780", False, "Habitat", "Diseñador UI/UX", 4000.00),
        ("Roberto", "Torres Peña", "10000011", "roberto.torres@empresa.com", "999888781", True, "ONP", "Jefe de Seguridad", 3000.00),
        ("Lucía", "Ramos Espinoza", "10000012", "lucia.ramos@empresa.com", "999888782", False, "ONP", "Especialista de Limpieza", 1300.00),
        ("Miguel", "Alva Gutiérrez", "10000013", "miguel.alva@empresa.com", "999888783", True, "Prima", "Mensajero", 1200.00),
        ("Patricia", "Ortiz Meléndez", "10000014", "patricia.ortiz@empresa.com", "999888784", False, "Profuturo", "Asistente Comercial", 2000.00),
        ("Daniel", "Castillo Salazar", "10000015", "daniel.castillo@empresa.com", "999888785", True, "Integra", "Consultor Externo", 8000.00),
    ]

    employees_map = {} # document_number -> id
    for fn, ln, doc, email, phone, has_child, pension, position, salary in employees_data:
        emp_query = """
            INSERT INTO employees (first_names, last_names, document_number, email, phone, has_children, pension_system, created_by)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id
        """
        emp_id = db.execute_write(emp_query, (fn, ln, doc, email, phone, has_child, pension, "system"))
        
        if db.is_sqlite:
            db.execute_write("UPDATE employees SET full_name = %s WHERE id = %s", (f"{fn} {ln}", emp_id))
            
        employees_map[doc] = emp_id
        
        # Crear contrato
        hourly_wage = round(float(salary) / 240, 2)
        db.execute_write(
            """
            INSERT INTO contracts (employee_id, position, monthly_salary, hourly_wage, start_date, is_active, created_by)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            """,
            (emp_id, position, salary, hourly_wage, "2026-01-01", True, "system")
        )
        print(f"Empleado creado: {fn} {ln} - Cargo: {position} - Sueldo: S/. {salary}")

    # 5. Crear turnos semanales para todos los empleados
    for doc, emp_id in employees_map.items():
        work_days = [1, 2, 3, 4, 5]
        start_time = "08:00:00"
        end_time = "17:00:00"
        tolerance = 10
        
        # Casos especiales de turnos
        if doc == "10000007": # Pedro Sánchez 09:00 - 18:00
            start_time = "09:00:00"
            end_time = "18:00:00"
        elif doc == "10000009": # Jorge Huamán Tarde: 14:00 - 22:00
            start_time = "14:00:00"
            end_time = "22:00:00"
        elif doc == "10000011": # Roberto Torres Lunes-Sábado
            work_days = [1, 2, 3, 4, 5, 6]
            
        for day in work_days:
            db.execute_write(
                """
                INSERT INTO shifts (employee_id, day_of_week, start_time, end_time, tolerance, created_by)
                VALUES (%s, %s, %s, %s, %s, %s)
                """,
                (emp_id, day, start_time, end_time, tolerance, "system")
            )
            
    print("Turnos creados para todos los colaboradores.")

    # 6. Justificaciones
    luis_id = employees_map["10000005"]
    justifications = [
        {"date": "2026-05-11", "type": "license", "desc": "Permiso para trámites notariales de la empresa."},
        {"date": "2026-05-12", "type": "medical", "desc": "Descanso médico por faringitis aguda emitida por Essalud."},
        {"date": "2026-05-13", "type": "medical", "desc": "Descanso médico por faringitis aguda emitida por Essalud."}
    ]
    for just in justifications:
        db.execute_write(
            """
            INSERT INTO justifications (employee_id, date, justification_type, description, created_by)
            VALUES (%s, %s, %s, %s, %s)
            """,
            (luis_id, just["date"], just["type"], just["desc"], "system")
        )
    print("Justificaciones de inasistencia registradas.")

    # 7. Marcaciones (attendance_logs) para Mayo 2026 (del 1 al 31)
    start_date = date(2026, 5, 1)
    end_date = date(2026, 5, 31)
    
    current = start_date
    logs_count = 0
    
    while current <= end_date:
        date_str = current.strftime("%Y-%m-%d")
        day_of_week = (current.weekday() + 1) % 7
        
        for doc, emp_id in employees_map.items():
            is_workday = day_of_week in [1, 2, 3, 4, 5]
            if doc == "10000011" and day_of_week == 6:
                is_workday = True
                
            if not is_workday:
                continue
                
            method = "face" if int(doc) % 2 == 0 else "fingerprint"
            
            # Faltas del 11 al 13 de Mayo para Luis Quispe
            if doc == "10000005" and date_str in ["2026-05-11", "2026-05-12", "2026-05-13"]:
                continue
                
            # Falta INJUSTIFICADA el 20 de Mayo
            if doc == "10000005" and date_str == "2026-05-20":
                continue
                
            # Horas base
            base_in = time(8, 0)
            base_out = time(17, 0)
            
            if doc == "10000007":
                base_in = time(9, 0)
                base_out = time(18, 0)
            elif doc == "10000009":
                base_in = time(14, 0)
                base_out = time(22, 0)
                
            # Simulaciones de asistencia variadas
            # Juan Pérez (10000001): Siempre puntual (08:00 - 17:00)
            if doc == "10000001":
                in_time = f"{date_str} 07:55:10"
                out_time = f"{date_str} 17:10:15"
                
            # María Rodríguez (10000002): Tardanzas el 5 y 15 de Mayo (08:00 - 17:00)
            elif doc == "10000002" and date_str == "2026-05-05":
                in_time = f"{date_str} 08:15:12"
                out_time = f"{date_str} 17:00:45"
            elif doc == "10000002" and date_str == "2026-05-15":
                in_time = f"{date_str} 08:30:22"
                out_time = f"{date_str} 17:00:50"
                
            # Carlos Mendoza (10000003): Horas extras frecuentes los lunes y miércoles (08:00 - 17:00)
            elif doc == "10000003" and day_of_week in [1, 3]:
                in_time = f"{date_str} 07:56:05"
                out_time = f"{date_str} 19:30:00"
                
            # Ana Gómez (10000004): Salida temprana el 18 de Mayo (08:00 - 17:00)
            elif doc == "10000004" and date_str == "2026-05-18":
                in_time = f"{date_str} 07:58:15"
                out_time = f"{date_str} 15:30:10"
                
            # Jorge Huamán (10000009): Tardanza el 25 de Mayo (14:00 - 22:00)
            elif doc == "10000009" and date_str == "2026-05-25":
                in_time = f"{date_str} 14:45:00"
                out_time = f"{date_str} 22:05:00"
            elif doc == "10000009": # General Jorge Huamán
                in_time = f"{date_str} 13:57:40"
                out_time = f"{date_str} 22:05:30"
                
            # Pedro Sánchez (10000007): 09:00 - 18:00
            elif doc == "10000007":
                in_time = f"{date_str} 08:57:40"
                out_time = f"{date_str} 18:05:30"
                
            # Por defecto puntual (08:00 - 17:00)
            else:
                in_time = f"{date_str} 07:57:40"
                out_time = f"{date_str} 17:05:30"
                
            db.execute_write(
                "INSERT INTO attendance_logs (employee_id, timestamp, method, created_by) VALUES (%s, %s, %s, %s)",
                (emp_id, in_time, method, "system")
            )
            db.execute_write(
                "INSERT INTO attendance_logs (employee_id, timestamp, method, created_by) VALUES (%s, %s, %s, %s)",
                (emp_id, out_time, method, "system")
            )
            logs_count += 2
            
        current += timedelta(days=1)
        
    print(f"Total de {logs_count} marcaciones biométricas simuladas en Mayo 2026.")

    # 8. Calcular Planillas con PayrollService para el periodo 2026-05
    payroll_service = PayrollService()
    payrolls = await payroll_service.calculate_monthly_payroll("2026-05", "hr_manager")
    print(f"Planillas contables calculadas y registradas para {len(payrolls)} empleados en el periodo '2026-05'.")
    
    # 9. Crear algunos Logs de Auditoría
    audit_logs = [
        ("superadmin", "SINC_SEGURIDAD", "Sincronización inicial y configuración de privilegios RBAC."),
        ("hr_manager", "CREAR_COLABORADOR", "Registro inicial del colaborador Juan Pérez Silva."),
        ("hr_manager", "CREAR_CONTRATO", "Registro de contrato de Gerente General para Juan Pérez Silva."),
        ("hr_manager", "MARCACIÓN_MANUAL_MASIVA", "Carga de logs de asistencia para simulación de planilla mensual."),
        ("hr_manager", "CALCULAR_PLANILLA", "Ejecución del cierre contable de planillas para el periodo 2026-05.")
    ]
    for user, action, desc in audit_logs:
        db.execute_write(
            "INSERT INTO audit_logs (username, action, description, created_by) VALUES (%s, %s, %s, %s)",
            (user, action, desc, "system")
        )
    print("Logs de auditoría simulados registrados.")
    print("Seeding de datos completado exitosamente.")

if __name__ == "__main__":
    if not os.environ.get("DATABASE_URL"):
        os.environ["DATABASE_URL"] = "sqlite:///data/db/attendance.db"
        
    asyncio.run(seed_data())
