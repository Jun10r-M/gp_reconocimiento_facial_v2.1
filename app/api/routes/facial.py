from fastapi import APIRouter, File, UploadFile, HTTPException, status, Depends
from fastapi.responses import JSONResponse
from app.services.facial_service import FacialService
from app.services.attendance_service import AttendanceService
from app.services.employee_service import EmployeeService

router = APIRouter(tags=["Facial"])

def get_facial_service() -> FacialService:
    return FacialService()

def get_attendance_service() -> AttendanceService:
    return AttendanceService()

def get_employee_service() -> EmployeeService:
    return EmployeeService()

@router.post(
    "/recognize",
    summary="Recognize face and log attendance (CU-08)",
    description="Captures live webcam feed frame, performs CNN FaceNet embedding inference, compares it Euclidiana-wise, and registers an attendance log if successful."
)
async def recognize_face(
    file: UploadFile = File(..., description="Fotograma capturado por la cámara web"),
    facial_service: FacialService = Depends(get_facial_service),
    attendance_service: AttendanceService = Depends(get_attendance_service),
    employee_service: EmployeeService = Depends(get_employee_service)
):
    try:
        contents = await file.read()
        res = await facial_service.recognize(contents)

        if res.get("status") == "success":
            name = res["name"]
            # En la nueva base relacional, el nombre corresponde al full_name del empleado
            # Buscar empleado por full_name
            employees = await employee_service.repository.get_all()
            emp = next((e for e in employees if e["full_name"].lower() == name.lower()), None)
            
            if emp:
                employee_id = emp["id"]
                # Registrar marcación de asistencia (método: 'face')
                action, timestamp = await attendance_service.register_punch(employee_id, "face")
                
                # Cargar puesto activo y DNI del empleado
                active_emp = await employee_service.get_employee_by_id(employee_id)
                
                res["action"] = action
                res["time"] = timestamp
                res["puesto"] = active_emp.get("position", "Sin Cargo")
                res["documento"] = active_emp.get("documento", emp["document_number"])
            else:
                return {"status": "unknown", "message": "Empleado reconocido pero no registrado en base de datos."}

        return res
    except Exception as e:
        print(f"[API ERROR] Error en reconocimiento facial: {e}")
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"status": "error", "message": f"Error interno de autenticación: {str(e)}"}
        )
