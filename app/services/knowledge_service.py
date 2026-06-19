from typing import Optional
from app.repositories.knowledge_repository import KnowledgeRepository

class KnowledgeService:
    """
    Servicio de base de conocimientos para la IA del Chatbot del panel.
    Permite obtener la memoria dinámica y registrar nuevas respuestas.
    """
    def __init__(self, repository: Optional[KnowledgeRepository] = None):
        self.repository = repository or KnowledgeRepository()

    async def get_all_knowledge(self) -> dict:
        return await self.repository.get_all()

    async def learn_question(self, question: str, answer: str) -> bool:
        clean_question = question.strip().lower()
        clean_answer = answer.strip()
        if not clean_question or not clean_answer:
            return False
        return await self.repository.learn(clean_question, clean_answer)
