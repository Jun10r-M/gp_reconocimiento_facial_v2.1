"""
    Servicio de control biométrico para el enrolamiento y verificación de huella dactilar.
    Conecta la persistencia relacional en la tabla 'biometrics' y simula el escaneo físico.
"""

from typing import Optional
from app.repositories.biometrics_repository import BiometricsRepository

class BiometricsService:
  
    def __init__(self, repository: Optional[BiometricsRepository] = None):
        self.repository = repository or BiometricsRepository()

    async def verify_fingerprint(self, employee_id: int, input_fingerprint_data: str) -> bool:
        biometric = await self.repository.get_by_employee_and_type(employee_id, "fingerprint")
        if not biometric:
            return False
        return biometric["pattern_data"] == input_fingerprint_data

    async def register_fingerprint(self, employee_id: int, fingerprint_data: str) -> bool:
        if not employee_id or not fingerprint_data:
            return False
        new_id = await self.repository.create(
            employee_id=employee_id,
            biometric_type="fingerprint",
            pattern_data=fingerprint_data
        )
        return new_id is not None
