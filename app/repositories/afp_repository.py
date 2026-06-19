from typing import List, Optional
from app.repositories.database import db

class AfpRepository:
    async def get_all(self) -> List[dict]:
        query = "SELECT * FROM afp_configs ORDER BY name ASC"
        return db.execute_query(query)

    async def get_by_id(self, afp_id: int) -> Optional[dict]:
        query = "SELECT * FROM afp_configs WHERE id = %s"
        results = db.execute_query(query, (afp_id,))
        return results[0] if results else None

    async def get_by_name(self, name: str) -> Optional[dict]:
        query = "SELECT * FROM afp_configs WHERE name = %s"
        results = db.execute_query(query, (name,))
        return results[0] if results else None

    async def update(self, afp_id: int, data: dict) -> bool:
        query = """
            UPDATE afp_configs
            SET mandatory_contribution = %s,
                insurance_premium = %s,
                flow_commission = %s,
                updated_at = CURRENT_TIMESTAMP,
                updated_by = %s
            WHERE id = %s
        """
        params = (
            data["mandatory_contribution"],
            data["insurance_premium"],
            data["flow_commission"],
            data.get("updated_by", "system"),
            afp_id
        )
        db.execute_write(query, params)
        return True
