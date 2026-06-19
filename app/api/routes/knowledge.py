from fastapi import APIRouter, HTTPException, Depends, status, Header
from typing import Optional
import re
import unicodedata
import calendar
from datetime import datetime

from app.models.knowledge import KnowledgeRequest, ChatRequest
from app.services.knowledge_service import KnowledgeService
from app.services.auth_service import get_current_admin, require_permission
from app.repositories.employee_repository import EmployeeRepository
from app.repositories.attendance_repository import AttendanceRepository
from app.repositories.payroll_repository import PayrollRepository

# El enrutador no tiene dependencias a nivel global para permitir consultas públicas al chatbot.
# Sin embargo, los endpoints administrativos ('read' / 'create') siguen protegidos por require_permission.
router = APIRouter(prefix="/knowledge", tags=["Knowledge"])

def get_knowledge_service() -> KnowledgeService:
    return KnowledgeService()

def normalize_string(s: str) -> str:
    s = s.lower().strip()
    s = ''.join(c for c in unicodedata.normalize('NFD', s) if unicodedata.category(c) != 'Mn')
    return s

def parse_period_from_query(query: str) -> Optional[str]:
    normalized_query = normalize_string(query)
    
    # 1. Buscar patrón YYYY-MM o YYYY/MM o MM-YYYY o MM/YYYY
    match = re.search(r"\b(20\d{2})[-/](0[1-9]|1[0-2])\b", normalized_query)
    if match:
        return f"{match.group(1)}-{match.group(2)}"
    
    match_rev = re.search(r"\b(0[1-9]|1[0-2])[-/](20\d{2})\b", normalized_query)
    if match_rev:
        return f"{match_rev.group(2)}-{match_rev.group(1)}"
    
    # 2. Mapear meses en español
    months_map = {
        "enero": "01", "febrero": "02", "marzo": "03", "abril": "04", "mayo": "05", "junio": "06",
        "julio": "07", "agosto": "08", "septiembre": "09", "setiembre": "09", "octubre": "10",
        "noviembre": "11", "diciembre": "12"
    }
    
    found_month = None
    for m_name, m_num in months_map.items():
        if re.search(rf"\b{m_name}\b", normalized_query):
            found_month = m_num
            break
            
    if not found_month:
        # Buscar "mes X" o "mes de X"
        mes_match = re.search(r"mes\s+(?:de\s+)?(1[0-2]|[1-9])\b", normalized_query)
        if mes_match:
            found_month = f"{int(mes_match.group(1)):02d}"
            
    if found_month:
        # Buscar año de 4 dígitos
        year_match = re.search(r"\b(20\d{2})\b", normalized_query)
        year = year_match.group(1) if year_match else str(datetime.now().year)
        return f"{year}-{found_month}"
        
    return None

async def find_employee_in_query(query: str) -> Optional[dict]:
    # 1. Buscar si hay un número de 8 dígitos (DNI) en la consulta
    dni_match = re.search(r"\b(\d{8})\b", query)
    if dni_match:
        emp = await EmployeeRepository().get_by_document(dni_match.group(1))
        if emp:
            return emp

    # 2. Buscar por coincidencia de nombre
    employees = await EmployeeRepository().get_all()
    normalized_query = normalize_string(query)
    query_words = set(normalized_query.split())
    
    best_emp = None
    best_score = 0.0
    
    for emp in employees:
        emp_name = normalize_string(emp["full_name"])
        emp_words = [w for w in emp_name.split() if len(w) >= 3]
        if not emp_words:
            continue
        
        matches = sum(1 for w in emp_words if w in query_words)
        score = matches / len(emp_words)
        
        if matches > 0 and score > best_score:
            best_score = score
            best_emp = emp
            
    if best_score >= 0.3:
        return best_emp
        
    return None


@router.get(
    "",
    summary="Get chatbot knowledge base",
    description="Returns all registered chatbot facts (questions and answers) learned over time."
)
async def get_all_knowledge(
    service: KnowledgeService = Depends(get_knowledge_service),
    admin_session: dict = Depends(require_permission("knowledge", "read"))
):
    return await service.get_all_knowledge()

@router.post(
    "",
    status_code=status.HTTP_201_CREATED,
    summary="Train/Teach chatbot a new fact",
    description="Registers a new question-answer pair in the dynamic knowledge base for the AI Assistant."
)
async def learn_question(
    data: KnowledgeRequest,
    service: KnowledgeService = Depends(get_knowledge_service),
    admin_session: dict = Depends(require_permission("knowledge", "create"))
):
    success = await service.learn_question(data.question, data.answer)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Pregunta o respuesta inválidas."
        )
    return {"status": "ok"}

@router.post(
    "/ask",
    summary="Ask the AI Chatbot a question",
    description="Queries the AI Chatbot using token-similarity matching against the knowledge base, or requests OLS Ridge predictions (confidential admin-only) for monthly payroll, overtime, and absenteeism forecasting."
)
async def ask_chatbot(
    data: ChatRequest,
    authorization: Optional[str] = Header(None),
    service: KnowledgeService = Depends(get_knowledge_service)
):
    question = data.question.strip().lower()
    
    # 1. Verificar si el token provisto es de administrador para desbloquear predicciones
    is_admin = False
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ")[1]
        from app.services.auth_service import AuthService
        try:
            payload = await AuthService().verify_token(token)
            if payload:
                is_admin = True
        except:
            pass

    # 2. Identificar consultas de base de datos dinámicas (Prioritarias)
    normalized_query = normalize_string(question)
    period = parse_period_from_query(question)
    employee = await find_employee_in_query(question)
    
    is_payroll_query = any(k in normalized_query for k in ["planilla", "neto", "bruto", "sueldo", "salario", "pago", "pagos", "cobro", "cobre", "generado"])
    is_attendance_query = any(k in normalized_query for k in ["asistencia", "asistencias", "marcacion", "marcaciones", "fichada", "fichadas", "registro", "registros", "ficho", "asistio", "fichó", "asistió"])

    # A. CONSULTA DE PLANILLA DINÁMICA
    if is_payroll_query and (period or employee):
        if not is_admin:
            return {"answer": "Lo siento, la información de planillas es confidencial y solo está disponible para administradores autorizados en el panel privado. Por favor, inicia sesión para realizar esta consulta."}
        
        if not period:
            period = datetime.now().strftime("%Y-%m")
            
        year, month = map(int, period.split("-"))
        month_names = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
        month_name = month_names[month - 1]
            
        if employee:
            payroll = await PayrollRepository().get_by_employee_and_period(employee["id"], period)
            if not payroll:
                return {
                    "answer": f"No se encontró un registro de planilla generado para **{employee['full_name']}** (DNI: {employee['document_number']}) en el periodo **{month_name} {year}** ({period})."
                }
            
            pension_sys = payroll.get("pension_system", employee["pension_system"])
            base_sal = float(payroll["base_salary"])
            gross_sal = float(payroll["gross_salary"])
            net_sal = float(payroll["net_salary"])
            days_wk = payroll.get("days_worked", 30)
            lateness_min = payroll.get("lateness_minutes", 0)
            
            pension_ded = float(payroll["pension_deduction"])
            late_ded = float(payroll["lateness_deduction"])
            abs_ded = float(payroll["absence_deduction"])
            overtime_pay = float(payroll.get("overtime_pay", 0.0))
            family_allow = float(payroll.get("family_allowance", 0.0))
            
            return {
                "answer": (
                    f"Los detalles de la planilla para el colaborador **{employee['full_name']}** en el periodo **{month_name} {year}** ({period}) son:\n\n"
                    f"* **Sueldo Básico:** S/. {base_sal:,.2f}\n"
                    f"* **Asignación Familiar:** S/. {family_allow:,.2f}\n"
                    f"* **Pago por Horas Extra:** S/. {overtime_pay:,.2f}\n"
                    f"* **Días Trabajados:** {days_wk} días\n"
                    f"* **Tardanzas:** {lateness_min} minutos (Descuento: S/. {late_ded:,.2f})\n"
                    f"* **Descuento por Inasistencia:** S/. {abs_ded:,.2f}\n"
                    f"* **Sueldo Bruto:** S/. {gross_sal:,.2f}\n"
                    f"* **Retención Jubilación ({pension_sys}):** S/. {pension_ded:,.2f}\n"
                    f"* **Sueldo Neto a Pagar:** S/. {net_sal:,.2f}\n"
                    f"* **Aporte EsSalud (Costo Empleador):** S/. {float(payroll['essalud_contribution']):,.2f}"
                )
            }
        else:
            payrolls = await PayrollRepository().get_by_period(period)
            if not payrolls:
                return {
                    "answer": f"Aún no se ha generado la planilla para el periodo **{month_name} {year}** ({period}). Puedes generarla desde la pestaña 'Planilla' en el panel administrativo."
                }
            
            total_net = sum(float(p["net_salary"]) for p in payrolls)
            total_gross = sum(float(p["gross_salary"]) for p in payrolls)
            total_essalud = sum(float(p["essalud_contribution"]) for p in payrolls)
            total_employees = len(payrolls)
            
            return {
                "answer": (
                    f"El total generado de la planilla para el periodo **{month_name} {year}** ({period}) es el siguiente:\n\n"
                    f"* **Monto Neto Total a Pagar:** S/. {total_net:,.2f}\n"
                    f"* **Monto Bruto Total:** S/. {total_gross:,.2f}\n"
                    f"* **Aportaciones EsSalud (Costo Empleador):** S/. {total_essalud:,.2f}\n"
                    f"* **Colaboradores Procesados:** {total_employees} colaboradores."
                )
            }

    # B. CONSULTAS DE ASISTENCIA DINÁMICAS
    elif is_attendance_query and (period or employee):
        if not is_admin:
            return {"answer": "Lo siento, el acceso al registro de asistencia es de uso administrativo. Por favor, inicia sesión con una cuenta autorizada para consultar esta información."}
            
        if employee:
            if period:
                year, month = map(int, period.split("-"))
                _, last_day = calendar.monthrange(year, month)
                start_date = f"{period}-01"
                end_date = f"{period}-{last_day}"
                
                logs = await AttendanceRepository().get_logs_by_period(employee["id"], start_date, end_date)
                total_logs = len(logs)
                unique_days = len(set(log["timestamp"][:10] if isinstance(log["timestamp"], str) else log["timestamp"].strftime("%Y-%m-%d") for log in logs))
                
                month_names = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
                month_name = month_names[month - 1]
                
                return {
                    "answer": f"Para el colaborador **{employee['full_name']}** (DNI: {employee['document_number']}), en el periodo **{month_name} {year}** ({period}) se registraron **{total_logs} marcaciones de asistencia**, correspondientes a **{unique_days} días de asistencia** efectivos."
                }
            else:
                logs = await AttendanceRepository().get_by_employee_id(employee["id"])
                total_logs = len(logs)
                unique_days = len(set(log["timestamp"][:10] if isinstance(log["timestamp"], str) else log["timestamp"].strftime("%Y-%m-%d") for log in logs))
                
                last_log_str = "No hay registros"
                if logs:
                    last_ts = logs[-1]["timestamp"]
                    if isinstance(last_ts, datetime):
                        last_log_str = last_ts.strftime("%d/%m/%Y %H:%M:%S")
                    else:
                        last_log_str = str(last_ts)
                
                return {
                    "answer": f"El colaborador **{employee['full_name']}** (DNI: {employee['document_number']}) tiene un total de **{total_logs} marcaciones de asistencia** en el sistema histórico, distribuidas en **{unique_days} días distintos**. Su última marcación registrada fue el **{last_log_str}**."
                }
        else:
            year, month = map(int, period.split("-"))
            _, last_day = calendar.monthrange(year, month)
            start_date = f"{period}-01"
            end_date = f"{period}-{last_day}"
            
            from app.repositories.database import db
            query = """
                SELECT a.timestamp, e.full_name
                FROM attendance_logs a
                JOIN employees e ON a.employee_id = e.id
                WHERE a.timestamp >= %s AND a.timestamp <= %s
                  AND a.deleted_at IS NULL AND e.deleted_at IS NULL
            """
            logs = db.execute_query(query, (f"{start_date} 00:00:00", f"{end_date} 23:59:59"))
            
            total_logs = len(logs)
            unique_days_set = set()
            for log in logs:
                ts = log["timestamp"]
                date_key = ts[:10] if isinstance(ts, str) else ts.strftime("%Y-%m-%d")
                unique_days_set.add(date_key)
            unique_days = len(unique_days_set)
            
            active_employees_set = set(log["full_name"] for log in logs)
            count_employees = len(active_employees_set)
            
            month_names = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
            month_name = month_names[month - 1]
            
            return {
                "answer": f"Para el periodo **{month_name} {year}** ({period}), se registraron un total de **{total_logs} marcaciones de asistencia** en la empresa, correspondientes a **{unique_days} días** con actividad laboral. Un total de **{count_employees} colaboradores** registraron asistencia en este periodo."
            }

    # 3. Identificar consultas predictivas
    # A. Consulta de costo de planilla
    if any(k in question for k in ["planilla", "costo", "presupuesto", "gasto", "budget"]):
        if not is_admin:
            return {"answer": "Lo siento, la predicción de costos y presupuestos de la planilla es información confidencial y solo está disponible para administradores autorizados en el panel privado."}
        from app.services.prediction_service import PredictionService
        stats = await PredictionService().get_dashboard_stats()
        cost = stats["payroll_forecast"]
        mae = stats["payroll_mae"]
        return {"answer": f"De acuerdo al modelo predictivo de regresión Ridge IA, se estima que el costo total de la planilla para el próximo mes ({stats['next_period']}) será de S/. {cost:,.2f} con un error absoluto medio (MAE) de S/. {mae:,.2f}."}

    # B. Consulta de horas extras
    elif any(k in question for k in ["horas extra", "horas extras", "sobrecosto"]):
        if not is_admin:
            return {"answer": "Lo siento, la proyección del volumen de horas extras solo está disponible para usuarios administradores en el panel."}
        from app.services.prediction_service import PredictionService
        stats = await PredictionService().get_dashboard_stats()
        ot = stats["overtime_forecast"]
        mae = stats["overtime_mae"]
        return {"answer": f"El modelo de Inteligencia Artificial prevé que se generarán aproximadamente {ot:,.1f} horas extras totales el próximo mes, con un margen de error (MAE) de {mae:,.1f} horas."}

    # C. Consulta de ausentismo y planificación
    elif any(k in question for k in ["ausencia", "ausentismo", "inasistencia", "reemplazo", "personal"]):
        if not is_admin:
            return {"answer": "Lo siento, el análisis de tendencias de ausentismo y planificación de reemplazos es de uso administrativo."}
        from app.services.prediction_service import PredictionService
        stats = await PredictionService().get_dashboard_stats()
        absences = stats["absenteeism_forecast"]
        mae = stats["absenteeism_mae"]
        rec = "Dado el nivel proyectado, se sugiere coordinar 1 o 2 reemplazos temporales para el área operativa." if absences >= 5.0 else "El volumen proyectado es bajo, no se requieren reemplazos."
        return {"answer": f"El modelo estima un total de {absences:,.1f} días de ausencia acumulada para el próximo mes (MAE de {mae:,.1f} días). {rec}"}

    # 3. Consultas generales contra la base de conocimientos usando Similitud Jaccard
    kb = await service.get_all_knowledge()
    
    best_match = None
    best_score = 0.0
    
    user_words = set(question.split())
    for q, a in kb.items():
        q_words = set(q.split())
        if not user_words or not q_words:
            continue
        intersection = user_words.intersection(q_words)
        union = user_words.union(q_words)
        score = len(intersection) / len(union)
        if score > best_score:
            best_score = score
            best_match = a

    # Si la similitud supera el umbral del 25%, responder
    if best_score >= 0.25:
        return {"answer": best_match}

    return {"answer": "Lo siento, no he podido comprender tu consulta. Puedes preguntarme sobre políticas de la empresa (ej. 'correo de rrhh', 'justificar faltas') o, si eres administrador, consultarme por las predicciones de planilla, horas extras o ausentismo."}
