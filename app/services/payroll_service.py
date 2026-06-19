import calendar
from datetime import datetime, date, timedelta, time
from typing import List, Optional
from app.repositories.payroll_repository import PayrollRepository
from app.repositories.employee_repository import EmployeeRepository
from app.repositories.contract_repository import ContractRepository
from app.repositories.attendance_repository import AttendanceRepository
from app.repositories.justification_repository import JustificationRepository
from app.repositories.shift_repository import ShiftRepository
from app.repositories.afp_repository import AfpRepository

class PayrollService:
    def __init__(
        self,
        payroll_repo: Optional[PayrollRepository] = None,
        employee_repo: Optional[EmployeeRepository] = None,
        contract_repo: Optional[ContractRepository] = None,
        attendance_repo: Optional[AttendanceRepository] = None,
        justification_repo: Optional[JustificationRepository] = None,
        shift_repo: Optional[ShiftRepository] = None,
        afp_repo: Optional[AfpRepository] = None
    ):
        self.payroll_repo = payroll_repo or PayrollRepository()
        self.employee_repo = employee_repo or EmployeeRepository()
        self.contract_repo = contract_repo or ContractRepository()
        self.attendance_repo = attendance_repo or AttendanceRepository()
        self.justification_repo = justification_repo or JustificationRepository()
        self.shift_repo = shift_repo or ShiftRepository()
        self.afp_repo = afp_repo or AfpRepository()

    async def get_payrolls_by_period(self, period: str) -> List[dict]:
        return await self.payroll_repo.get_by_period(period)

    async def get_payroll_slip(self, employee_id: int, period: str) -> Optional[dict]:
        """Obtiene la boleta de pago de un colaborador para un periodo."""
        payroll = await self.payroll_repo.get_by_employee_and_period(employee_id, period)
        if not payroll:
            return None
        
        emp = await self.employee_repo.get_by_id(employee_id)
        if emp:
            payroll_copy = dict(payroll)
            payroll_copy["full_name"] = emp["full_name"]
            payroll_copy["document_number"] = emp["document_number"]
            payroll_copy["pension_system"] = emp["pension_system"]
            
            # Buscar el puesto
            contract = await self.contract_repo.get_contract_for_period(employee_id, period)
            payroll_copy["position"] = contract["position"] if contract else "Sin Puesto"
            return payroll_copy
        return payroll

    async def calculate_monthly_payroll(self, period: str, admin_user: str = "system") -> List[dict]:
        """
        Calcula la planilla contable para todos los empleados en el periodo YYYY-MM
        siguiendo las regulaciones de la legislación laboral de Perú (D.L. 728).
        """
        employees = await self.employee_repo.get_all()
        calculated_payrolls = []

        year, month = map(int, period.split("-"))
        _, last_day = calendar.monthrange(year, month)
        start_date_str = f"{period}-01"
        end_date_str = f"{period}-{last_day}"

        # Asignación Familiar en el Perú: 10% de la Remuneración Mínima Vital (RMV = S/ 1025)
        FAMILY_ALLOWANCE_RATE = 102.50

        for emp in employees:
            employee_id = emp["id"]
            
            # 1. Resolver el contrato activo en el periodo
            contract = await self.contract_repo.get_contract_for_period(employee_id, period)
            if not contract:
                # Si el empleado no tiene un contrato activo en el periodo, se salta
                continue

            base_salary = float(contract["monthly_salary"])
            hourly_wage = float(contract["hourly_wage"])
            minute_wage = hourly_wage / 60.0

            # 2. Asignación familiar
            family_allowance = FAMILY_ALLOWANCE_RATE if emp["has_children"] else 0.0

            # 3. Cargar turnos y justificaciones
            shifts_list = await self.shift_repo.get_by_employee_id(employee_id)
            shifts_dict = {s["day_of_week"]: s for s in shifts_list}

            # Cargar marcaciones del mes
            logs = await self.attendance_repo.get_logs_by_period(employee_id, start_date_str, end_date_str)
            
            # Agrupar logs por día
            logs_by_date = {}
            for log in logs:
                # El campo timestamp viene de DB (String o datetime)
                ts = log["timestamp"]
                if isinstance(ts, str):
                    dt = datetime.strptime(ts, "%Y-%m-%d %H:%M:%S")
                else:
                    dt = ts
                
                date_key = dt.strftime("%Y-%m-%d")
                if date_key not in logs_by_date:
                    logs_by_date[date_key] = []
                logs_by_date[date_key].append(dt)

            absences_count = 0
            lateness_minutes = 0
            overtime_25_hours = 0.0
            overtime_35_hours = 0.0

            # 4. Iterar cada día del mes
            for d in range(1, last_day + 1):
                current_date = date(year, month, d)
                date_str = current_date.strftime("%Y-%m-%d")
                day_of_week = (current_date.weekday() + 1) % 7 # Python weekday 0=Lunes, ..., 6=Domingo -> Adaptar: 0=Domingo, 1=Lunes
                
                # ¿Tenía turno este día de la semana?
                if day_of_week not in shifts_dict:
                    continue  # Día libre

                shift = shifts_dict[day_of_week]
                
                # Formatear horas del turno
                # En SQLite TIME viene como string 'HH:MM:SS' o 'HH:MM'
                def parse_time_str(time_obj):
                    if isinstance(time_obj, str):
                        parts = time_obj.split(":")
                        return time(int(parts[0]), int(parts[1]))
                    return time_obj

                sh_start = parse_time_str(shift["start_time"])
                sh_end = parse_time_str(shift["end_time"])

                # Validar asistencia
                if date_str not in logs_by_date:
                    # Inasistencia
                    # Verificar si existe justificación
                    justification = await self.justification_repo.get_by_employee_and_date(employee_id, date_str)
                    if not justification:
                        absences_count += 1
                else:
                    # Registró asistencia
                    day_logs = sorted(logs_by_date[date_str])
                    entrance = day_logs[0]
                    
                    # Calcular tardanzas (Tolerancia dinámica del turno, por defecto 10 minutos)
                    shift_tolerance = float(shift.get("tolerance") if shift.get("tolerance") is not None else 10.0)
                    shift_start_dt = datetime.combine(current_date, sh_start)
                    if entrance > shift_start_dt:
                        diff = (entrance - shift_start_dt).total_seconds() / 60.0
                        if diff > shift_tolerance:
                            lateness_minutes += int(diff)

                    # Calcular horas extra o salidas tempranas si hay salida registrada (más de una marcación)
                    if len(day_logs) > 1:
                        exit_log = day_logs[-1]
                        shift_end_dt = datetime.combine(current_date, sh_end)
                        if exit_log > shift_end_dt:
                            ot_seconds = (exit_log - shift_end_dt).total_seconds()
                            ot_hours = max(0.0, ot_seconds / 3600.0)
                            
                            # En el Perú las primeras 2 horas extras diarias son al 25%, el resto al 35%
                            if ot_hours > 0:
                                ot_25 = min(ot_hours, 2.0)
                                ot_35 = max(0.0, ot_hours - 2.0)
                                overtime_25_hours += ot_25
                                overtime_35_hours += ot_35
                        elif exit_log < shift_end_dt:
                            # Salida Temprana (Early Exit)
                            # Verificar si existe justificación para no aplicar el descuento
                            justification = await self.justification_repo.get_by_employee_and_date(employee_id, date_str)
                            if not justification:
                                ee_seconds = (shift_end_dt - exit_log).total_seconds()
                                ee_minutes = max(0.0, ee_seconds / 60.0)
                                if ee_minutes >= 1.0:
                                    lateness_minutes += int(ee_minutes)

            # 5. Calcular remuneraciones y descuentos
            # Valor día = sueldo básico / 30
            absence_deduction = round(absences_count * (base_salary / 30.0), 2)
            lateness_deduction = round(lateness_minutes * minute_wage, 2)

            # Pagos extras con recargo
            overtime_pay = round(
                (overtime_25_hours * hourly_wage * 1.25) + 
                (overtime_35_hours * hourly_wage * 1.35), 2
            )

            # Sueldo Bruto (Gross Salary)
            gross_salary = base_salary + family_allowance + overtime_pay - lateness_deduction - absence_deduction
            gross_salary = max(0.0, gross_salary)

            # Retención de pensiones (ONP: 13.00%, AFP: Integra, Habitat, Prima, Profuturo)
            if emp["pension_system"] == "ONP":
                pension_deduction = round(gross_salary * 0.13, 2)
            else:
                afp_name = emp["pension_system"]
                if afp_name.upper() == "AFP":
                    afp_name = "Integra"
                
                afp_config = await self.afp_repo.get_by_name(afp_name)
                if afp_config:
                    rate = float(afp_config["mandatory_contribution"]) + float(afp_config["insurance_premium"]) + float(afp_config["flow_commission"])
                    pension_deduction = round(gross_salary * rate, 2)
                else:
                    pension_deduction = round(gross_salary * 0.1284, 2)

            # Neto a pagar
            net_salary = round(gross_salary - pension_deduction, 2)

            # Aportaciones Patronales (EsSalud: 9% pagado por la empresa, no descontado)
            essalud_contribution = round(gross_salary * 0.09, 2)

            # Consolidador de datos para registrar
            payroll_data = {
                "employee_id": employee_id,
                "period": period,
                "days_worked": 30 - absences_count,
                "lateness_minutes": lateness_minutes,
                "overtime_25_hours": round(overtime_25_hours, 2),
                "overtime_35_hours": round(overtime_35_hours, 2),
                "base_salary": base_salary,
                "family_allowance": family_allowance,
                "overtime_pay": overtime_pay,
                "lateness_deduction": lateness_deduction,
                "absence_deduction": absence_deduction,
                "gross_salary": gross_salary,
                "pension_deduction": pension_deduction,
                "net_salary": net_salary,
                "essalud_contribution": essalud_contribution,
                "created_by": admin_user
            }

            # Guardar en base de datos
            payroll_id = await self.payroll_repo.create_or_update(payroll_data)
            payroll_data["id"] = payroll_id
            payroll_data["full_name"] = emp["full_name"]
            payroll_data["document_number"] = emp["document_number"]
            payroll_data["position"] = contract["position"]
            payroll_data["pension_system"] = emp["pension_system"]
            
            calculated_payrolls.append(payroll_data)

        return calculated_payrolls
