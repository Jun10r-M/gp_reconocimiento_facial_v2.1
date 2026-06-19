import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field

class Settings(BaseSettings):
    # Directorio base y directorios de datos
    BASE_DIR: str = Field(default_factory=lambda: os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
    
    @property
    def DATA_DIR(self) -> str:
        return os.path.join(self.BASE_DIR, "data")
        
    @property
    def DB_DIR(self) -> str:
        return os.path.join(self.DATA_DIR, "db")
        
    @property
    def KNOWN_FACES_DIR(self) -> str:
        return os.path.join(self.DATA_DIR, "known_faces")
        
    @property
    def EMPLOYEES_FILE(self) -> str:
        return os.path.join(self.DB_DIR, "empleados.json")
        
    @property
    def ATTENDANCE_FILE(self) -> str:
        return os.path.join(self.DB_DIR, "asistencia.json")
        
    @property
    def KNOWLEDGE_FILE(self) -> str:
        return os.path.join(self.DB_DIR, "knowledge.json")
        
    @property
    def STATIC_DIR(self) -> str:
        return os.path.join(self.BASE_DIR, "frontend", "dist")

    # Configuración de OpenCV
    FACE_RECOGNITION_THRESHOLD: float = 90.0
    FACE_SIZE_WIDTH: int = 200
    FACE_SIZE_HEIGHT: int = 200

    # Configuración de Servidor
    HOST: str = "127.0.0.1"
    PORT: int = 8080

    # Administrador inicial auto-provisión
    INITIAL_ADMIN_USERNAME: str = Field(default="", description="Nombre de usuario del administrador inicial")
    INITIAL_ADMIN_EMAIL: str = Field(default="", description="Correo electrónico del administrador inicial")
    INITIAL_ADMIN_PASSWORD: str = Field(default="", description="Contraseña del administrador inicial")

    model_config = SettingsConfigDict(env_prefix="APP_", env_file=".env", env_file_encoding="utf-8", extra="ignore")

settings = Settings()

# Inicialización automática de carpetas requeridas
os.makedirs(settings.DATA_DIR, exist_ok=True)
os.makedirs(settings.DB_DIR, exist_ok=True)
os.makedirs(settings.KNOWN_FACES_DIR, exist_ok=True)
