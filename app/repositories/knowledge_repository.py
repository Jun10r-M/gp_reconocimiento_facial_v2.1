from app.repositories.database import db

class KnowledgeRepository:
    async def get_all(self) -> dict:
        query = "SELECT * FROM knowledge WHERE deleted_at IS NULL"
        rows = db.execute_query(query)
        return {row["question"]: row["answer"] for row in rows}

    async def learn(self, question: str, answer: str, created_by: str = "system") -> bool:
        clean_question = question.lower().strip()
        # Soft delete anterior
        db.execute_write("UPDATE knowledge SET deleted_at = CURRENT_TIMESTAMP, deleted_by = %s WHERE question = %s AND deleted_at IS NULL", (created_by, clean_question))
        
        query = "INSERT INTO knowledge (question, answer, created_by) VALUES (%s, %s, %s)"
        db.execute_write(query, (clean_question, answer, created_by))
        return True
