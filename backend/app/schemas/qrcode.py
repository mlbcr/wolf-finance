from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, field_validator


class QRCodeCreate(BaseModel):
    reuniao_id: UUID | None = None
    tipo: str


class QRCodeResponse(BaseModel):
    id: UUID
    codigo: str
    reuniao_id: UUID | None
    gerado_por: UUID
    tipo: str
    data_criacao: datetime
    data_limite: datetime
    status: str

    model_config = {
        "from_attributes": True
    }


class QRCodeComDetalhes(BaseModel):
    id: UUID
    codigo: str
    reuniao_id: UUID | None
    gerado_por: UUID
    tipo: str
    data_criacao: datetime
    data_limite: datetime
    status: str
    expirando: bool = False
    expirado: bool = False

    model_config = {
        "from_attributes": True
    }