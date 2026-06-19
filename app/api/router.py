import os
import signal
from fastapi import APIRouter
from app.api.routes import auth, employees, contracts, attendance, justifications, payroll, knowledge, facial, system, prediction, security

api_router = APIRouter()

# Registrar todas las rutas de los casos de uso
api_router.include_router(auth.router)
api_router.include_router(employees.router)
api_router.include_router(contracts.router)
api_router.include_router(attendance.router)
api_router.include_router(justifications.router)
api_router.include_router(payroll.router)
api_router.include_router(knowledge.router)
api_router.include_router(facial.router)
api_router.include_router(system.router)
api_router.include_router(prediction.router)
api_router.include_router(security.router)

@api_router.post("/shutdown", tags=["System Utilities"])
async def shutdown():
    """Detiene ordenadamente el servidor FastAPI enviando SIGINT."""
    print("[SERVIDOR] Petición de apagado recibida. Deteniendo proceso...")
    os.kill(os.getpid(), signal.SIGINT)
    return {"status": "ok", "message": "Servidor deteniéndose..."}
