from typing import List, Optional
from datetime import date
from app.repositories.contract_repository import ContractRepository

class ContractService:
    def __init__(self, repository: Optional[ContractRepository] = None):
        self.repository = repository or ContractRepository()

    async def get_contracts_by_employee_id(self, employee_id: int) -> List[dict]:
        return await self.repository.get_by_employee_id(employee_id)

    async def get_paginated_contracts(self, employee_id: int, page: int, limit: int) -> dict:
        import math
        offset = (page - 1) * limit
        contracts = await self.repository.get_paginated_by_employee_id(employee_id, limit, offset)
        total = await self.repository.count_by_employee_id(employee_id)
        pages = math.ceil(total / limit) if limit > 0 else 0
        return {
            "items": contracts,
            "total": total,
            "page": page,
            "limit": limit,
            "pages": pages
        }

    async def get_active_contract(self, employee_id: int) -> Optional[dict]:
        return await self.repository.get_active_by_employee_id(employee_id)

    async def create_contract(
        self, 
        employee_id: int, 
        position: str, 
        monthly_salary: float, 
        start_date: date, 
        end_date: Optional[date] = None
    ) -> int:
        """
        Crea un nuevo contrato para el empleado.
        Desactiva automáticamente cualquier contrato previo del mismo empleado para mantener
        un único contrato activo vigente (trazabilidad y ascensos).
        """
        # Desactivar contratos anteriores
        await self.repository.deactivate_all_by_employee_id(employee_id)

        contract_data = {
            "employee_id": employee_id,
            "position": position.strip().title(),
            "monthly_salary": float(monthly_salary),
            "start_date": start_date,
            "end_date": end_date,
            "is_active": True
        }
        return await self.repository.create(contract_data)
