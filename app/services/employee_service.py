import os
from typing import List, Optional
from datetime import date
from app.config import settings
from app.repositories.employee_repository import EmployeeRepository
from app.services.contract_service import ContractService
from app.services.facial_service import FacialService

class EmployeeService:
    def __init__(
        self, 
        repository: Optional[EmployeeRepository] = None, 
        contract_service: Optional[ContractService] = None,
        facial_service: Optional[FacialService] = None
    ):
        self.repository = repository or EmployeeRepository()
        self.contract_service = contract_service or ContractService()
        self.facial_service = facial_service or FacialService()

    async def get_all_employees(self) -> List[dict]:
        employees = await self.repository.get_all()
        # Enriquecer cada empleado con los datos de su contrato activo
        enriched_employees = []
        for emp in employees:
            active_contract = await self.contract_service.get_active_contract(emp["id"])
            emp_copy = dict(emp)
            if active_contract:
                emp_copy["position"] = active_contract["position"]
                emp_copy["monthly_salary"] = float(active_contract["monthly_salary"])
                emp_copy["pago_hora"] = float(active_contract["hourly_wage"])
            else:
                emp_copy["position"] = "Sin Contrato Activo"
                emp_copy["monthly_salary"] = 0.0
                emp_copy["pago_hora"] = 0.0
            enriched_employees.append(emp_copy)
        return enriched_employees

    async def get_paginated_employees(self, page: int, limit: int, search: Optional[str] = None) -> dict:
        import math
        offset = (page - 1) * limit
        employees = await self.repository.get_paginated(limit, offset, search)
        total = await self.repository.count(search)
        
        enriched_employees = []
        for emp in employees:
            active_contract = await self.contract_service.get_active_contract(emp["id"])
            emp_copy = dict(emp)
            if active_contract:
                emp_copy["position"] = active_contract["position"]
                emp_copy["monthly_salary"] = float(active_contract["monthly_salary"])
                emp_copy["pago_hora"] = float(active_contract["hourly_wage"])
            else:
                emp_copy["position"] = "Sin Contrato Activo"
                emp_copy["monthly_salary"] = 0.0
                emp_copy["pago_hora"] = 0.0
            enriched_employees.append(emp_copy)
            
        pages = math.ceil(total / limit) if limit > 0 else 0
        
        return {
            "items": enriched_employees,
            "total": total,
            "page": page,
            "limit": limit,
            "pages": pages
        }

    async def get_employee_by_id(self, employee_id: int) -> Optional[dict]:
        emp = await self.repository.get_by_id(employee_id)
        if emp:
            active_contract = await self.contract_service.get_active_contract(emp["id"])
            emp_copy = dict(emp)
            if active_contract:
                emp_copy["position"] = active_contract["position"]
                emp_copy["monthly_salary"] = float(active_contract["monthly_salary"])
                emp_copy["pago_hora"] = float(active_contract["hourly_wage"])
            return emp_copy
        return None

    async def get_employee_by_document(self, document_number: str) -> Optional[dict]:
        emp = await self.repository.get_by_document(document_number)
        if emp:
            active_contract = await self.contract_service.get_active_contract(emp["id"])
            emp_copy = dict(emp)
            if active_contract:
                emp_copy["position"] = active_contract["position"]
                emp_copy["monthly_salary"] = float(active_contract["monthly_salary"])
                emp_copy["pago_hora"] = float(active_contract["hourly_wage"])
            return emp_copy
        return None

    async def register_employee(
        self, 
        first_names: str, 
        last_names: str, 
        document_number: str, 
        email: str, 
        phone: Optional[str], 
        has_children: bool, 
        pension_system: str,
        position: Optional[str] = None, 
        monthly_salary: Optional[float] = None, 
        photo_bytes: Optional[bytes] = None
    ) -> dict:
        """
        Registra un empleado con su contrato inicial opcional y guarda su foto para reconocimiento facial CNN.
        """
        # Formatear entradas
        clean_first_names = first_names.strip().title()
        clean_last_names = last_names.strip().title()
        clean_doc = document_number.strip()
        clean_email = email.strip().lower()

        # Verificar si el DNI ya existe
        existing = await self.repository.get_by_document(clean_doc)
        if existing:
            return {"status": "error", "message": f"El DNI {clean_doc} ya se encuentra registrado."}

        employee_data = {
            "first_names": clean_first_names,
            "last_names": clean_last_names,
            "document_number": clean_doc,
            "email": clean_email,
            "phone": phone.strip() if phone else None,
            "has_children": has_children,
            "pension_system": pension_system
        }

        # 1. Crear el empleado en la base de datos
        employee_id = await self.repository.create(employee_data)
        if not employee_id:
            return {"status": "error", "message": "Error al registrar el perfil del empleado."}

        # 2. Crear su contrato inicial activo (si se provee)
        contract_id = None
        if position and monthly_salary is not None:
            contract_id = await self.contract_service.create_contract(
                employee_id=employee_id,
                position=position,
                monthly_salary=monthly_salary,
                start_date=date.today()
            )

        # 3. Guardar foto física para el reconocimiento facial (si se provee)
        if photo_bytes:
            full_name = f"{clean_first_names} {clean_last_names}"
            employee_dir = os.path.join(settings.KNOWN_FACES_DIR, full_name)
            os.makedirs(employee_dir, exist_ok=True)
            
            existing_files = [f for f in os.listdir(employee_dir) if os.path.isfile(os.path.join(employee_dir, f))]
            next_idx = len(existing_files) + 1
            photo_path = os.path.join(employee_dir, f"{next_idx}.jpg")

            try:
                with open(photo_path, "wb") as f:
                    f.write(photo_bytes)
            except Exception as e:
                # Revertir inserciones si falla guardado físico de la foto
                await self.repository.delete(employee_id)
                return {"status": "error", "message": f"Fallo al escribir el archivo de fotografía: {str(e)}"}

            # 4. Reentrenar modelo de reconocimiento facial CNN
            self.facial_service.train_model()

        return {
            "status": "success",
            "message": "Empleado registrado correctamente en el sistema.",
            "employee_id": employee_id,
            "contract_id": contract_id
        }

    async def update_employee(
        self,
        employee_id: int,
        first_names: str,
        last_names: str,
        document_number: str,
        email: str,
        phone: Optional[str],
        has_children: bool,
        pension_system: str,
        photo_bytes: Optional[bytes] = None,
        updated_by: str = "system"
    ) -> dict:
        """
        Actualiza los datos personales de un empleado y opcionalmente re-enrola su fotografía.
        """
        # Verificar existencia
        emp = await self.repository.get_by_id(employee_id)
        if not emp:
            return {"status": "error", "message": "Empleado no encontrado."}

        # Formatear entradas
        clean_first_names = first_names.strip().title()
        clean_last_names = last_names.strip().title()
        clean_doc = document_number.strip()
        clean_email = email.strip().lower()

        # Verificar DNI duplicado
        existing = await self.repository.get_by_document(clean_doc)
        if existing and existing["id"] != employee_id:
            return {"status": "error", "message": f"El DNI {clean_doc} ya se encuentra registrado en otro empleado."}

        employee_data = {
            "first_names": clean_first_names,
            "last_names": clean_last_names,
            "document_number": clean_doc,
            "email": clean_email,
            "phone": phone.strip() if phone else None,
            "has_children": has_children,
            "pension_system": pension_system,
            "updated_by": updated_by
        }

        # Actualizar en repositorio
        await self.repository.update(employee_id, employee_data)

        # Si cambió el nombre completo, renombrar la carpeta de fotos para mantener consistencia
        old_full_name = f"{emp['first_names']} {emp['last_names']}"
        new_full_name = f"{clean_first_names} {clean_last_names}"
        old_dir = os.path.join(settings.KNOWN_FACES_DIR, old_full_name)
        new_dir = os.path.join(settings.KNOWN_FACES_DIR, new_full_name)

        if old_full_name != new_full_name and os.path.exists(old_dir):
            try:
                os.rename(old_dir, new_dir)
            except Exception as e:
                print(f"[SERVICE WARNING] No se pudo renombrar el directorio del empleado: {e}")

        # Guardar nueva foto (si se provee)
        if photo_bytes:
            target_dir = new_dir if old_full_name != new_full_name else old_dir
            os.makedirs(target_dir, exist_ok=True)
            existing_files = [f for f in os.listdir(target_dir) if os.path.isfile(os.path.join(target_dir, f))]
            next_idx = len(existing_files) + 1
            photo_path = os.path.join(target_dir, f"{next_idx}.jpg")
            
            with open(photo_path, "wb") as f:
                f.write(photo_bytes)
            
            # Reentrenar modelo de reconocimiento facial
            self.facial_service.train_model()

        return {
            "status": "success",
            "message": "Ficha de empleado actualizada correctamente."
        }

    async def delete_employee(self, employee_id: int, deleted_by: str = "system") -> bool:
        # Soft delete the employee
        ok = await self.repository.delete(employee_id, deleted_by)
        if ok:
            # Cascading soft delete on related tables
            from app.repositories.contract_repository import ContractRepository
            from app.repositories.biometrics_repository import BiometricsRepository
            from app.repositories.shift_repository import ShiftRepository
            from app.repositories.attendance_repository import AttendanceRepository
            from app.repositories.justification_repository import JustificationRepository
            from app.repositories.payroll_repository import PayrollRepository

            await ContractRepository().delete_all_by_employee_id(employee_id, deleted_by)
            await BiometricsRepository().delete_all_by_employee_id(employee_id, deleted_by)
            await ShiftRepository().delete_all_by_employee_id(employee_id, deleted_by)
            await AttendanceRepository().delete_all_by_employee_id(employee_id, deleted_by)
            await JustificationRepository().delete_all_by_employee_id(employee_id, deleted_by)
            await PayrollRepository().delete_all_by_employee_id(employee_id, deleted_by)
            
            # Reentrenar modelo facial para excluir al empleado eliminado
            self.facial_service.train_model()
            return True
        return False
