from uuid import UUID
from datetime import datetime

from pydantic import BaseModel, ConfigDict


class EquipeCreate(BaseModel):
    nome: str
    descricao: str | None = None
    lider_id: UUID | None = None
    icone: str = "fa-users"
    cor: str = "#ffffff"


class EquipeResponse(BaseModel):
    id: UUID
    nome: str
    descricao: str | None
    lider_id: UUID | None
    criado_em: datetime
    atualizado_em: datetime
    status: str
    icone: str
    cor: str

    model_config = ConfigDict(from_attributes=True)


class MembroEquipeResponse(BaseModel):
    id: UUID
    nome_completo: str
    email: str
    matricula: str
    cargo: str

class EquipeUpdate(BaseModel):
    nome: str
    descricao: str | None = None
    lider_id: UUID | None = None
    icone: str
    cor: str