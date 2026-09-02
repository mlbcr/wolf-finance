from datetime import date
from pydantic import BaseModel, EmailStr


class AlunoCreate(BaseModel):
    nome_completo: str
    bairro: str
    curso: str
    email: EmailStr
    telefone: str
    matricula: str
    data_nascimento: date
    ingresso_liga: date
    cargo: str
    periodo_ingresso: date
    faz_estagio: bool = False


class AlunoUpdate(BaseModel):
    nome_completo: str | None = None
    bairro: str | None = None
    curso: str | None = None
    email: EmailStr | None = None
    telefone: str | None = None
    matricula: str | None = None
    data_nascimento: date | None = None
    ingresso_liga: date | None = None
    desligamento_liga: date | None = None
    cargo: str | None = None
    periodo_ingresso: date | None = None
    faz_estagio: bool | None = None
    status: str | None = None