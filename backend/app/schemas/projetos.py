from datetime import date, datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class ProjetoCreate(BaseModel):

    nome: str
    descricao: str | None = None

    lider_id: UUID

    data_inicio: date | None = None
    data_fim: date | None = None

    status: str = "ATIVO"


class ProjetoUpdate(BaseModel):

    nome: str
    descricao: str | None = None

    data_inicio: date | None = None
    data_fim: date | None = None

    status: str


class ProjetoResponse(BaseModel):

    id: UUID

    nome: str
    descricao: str | None

    lider_id: UUID

    data_inicio: date | None
    data_fim: date | None

    status: str

    criado_em: datetime
    atualizado_em: datetime

    model_config = ConfigDict(
        from_attributes=True
    )