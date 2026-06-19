from pydantic import BaseModel, Field, EmailStr
from typing import Optional

class AdminBase(BaseModel):
    username: str = Field(..., examples=["admin_perez"], description="Nombre de usuario del administrador")
    email: EmailStr = Field(..., examples=["perez@compania.com"], description="Correo electrónico del administrador")

class AdminCreate(AdminBase):
    password: str = Field(..., min_length=6, examples=["Password123!"], description="Contraseña de acceso seguro")
    role: str = Field(default="admin", examples=["admin"], description="Rol del usuario en el sistema ('admin', 'super_admin')")

class AdminLogin(BaseModel):
    username: str = Field(..., examples=["admin_perez"], description="Nombre de usuario")
    password: str = Field(..., examples=["Password123!"], description="Contraseña de acceso")

class AdminResponse(AdminBase):
    id: int
    role: str = Field(..., examples=["admin"], description="Rol del usuario en el sistema ('admin', 'super_admin')")
    is_active: bool

class TokenResponse(BaseModel):
    access_token: str = Field(..., description="Token JWT de acceso seguro")
    token_type: str = Field(default="bearer", description="Tipo de token")
    role: str = Field(..., description="Rol del administrador")

class PasswordRecoveryRequest(BaseModel):
    email: EmailStr = Field(..., examples=["perez@compania.com"], description="Correo electrónico asociado a la cuenta")
