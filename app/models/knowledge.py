from pydantic import BaseModel, Field

class KnowledgeRequest(BaseModel):
    question: str = Field(..., examples=["what is the hr email?"], description="La pregunta enviada por el usuario")
    answer: str = Field(..., examples=["hr@company.com"], description="La respuesta correspondiente a registrar")

class ChatRequest(BaseModel):
    question: str = Field(..., examples=["cuánto costará la planilla el próximo mes?"], description="La pregunta enviada al chatbot")
