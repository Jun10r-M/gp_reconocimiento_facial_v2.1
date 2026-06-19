from fastapi import APIRouter, HTTPException, Depends, status
from app.models.contract import ContractCreate, ContractResponse
from app.services.contract_service import ContractService
from app.services.auth_service import get_current_admin, require_permission
from typing import List, Optional

router = APIRouter(prefix="/contracts", tags=["Contracts"], dependencies=[Depends(get_current_admin)])

def get_contract_service() -> ContractService:
    return ContractService()

@router.get(
    "/employee/{employee_id}",
    summary="Get employment contracts history (CU-04)",
    description="Returns all historical and current contracts for a worker, providing a career progression trail (changes in salary or position). Supports optional pagination."
)
async def get_contracts_by_employee_id(
    employee_id: int,
    page: Optional[int] = None,
    limit: Optional[int] = 10,
    service: ContractService = Depends(get_contract_service),
    admin_session: dict = Depends(require_permission("employees", "read"))
):
    if page is not None:
        return await service.get_paginated_contracts(employee_id, page, limit)
    return await service.get_contracts_by_employee_id(employee_id)

@router.post(
    "",
    response_model=ContractResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new employment contract / Promotion (CU-04)",
    description="Registers a new contract (e.g. for promotions, salary increases, or changes in position) and deactivates any prior active contract."
)
async def create_contract(contract: ContractCreate, service: ContractService = Depends(get_contract_service), admin_session: dict = Depends(require_permission("employees", "create"))):
    contract_id = await service.create_contract(
        employee_id=contract.employee_id,
        position=contract.position,
        monthly_salary=contract.monthly_salary,
        start_date=contract.start_date,
        end_date=contract.end_date
    )
    
    if not contract_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No se pudo registrar el contrato. Verifique el ID del empleado."
        )
        
    return {
        "id": contract_id,
        "employee_id": contract.employee_id,
        "position": contract.position,
        "monthly_salary": contract.monthly_salary,
        "hourly_wage": round(contract.monthly_salary / 240, 2),
        "start_date": contract.start_date,
        "end_date": contract.end_date,
        "is_active": True
    }
