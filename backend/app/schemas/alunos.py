from datetime import date
from pydantic import BaseModel, EmailStr


class AlunoCreate(BaseModel):
    nome_completo: str
    email: EmailStr
    telefone: str
    matricula: str
    data_nascimento: date
    cargo: str
    periodo_ingresso: date
    faz_estagio: bool = False