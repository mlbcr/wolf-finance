from pydantic import BaseModel
from uuid import UUID

class LoginRequest(BaseModel):
    login: str
    senha: str

class UsuarioAtualResponse(BaseModel):
    id: UUID
    aluno_id: UUID
    nome_completo: str
    email: str
    matricula: str
    cargo: str
    tipo: str
    status: str