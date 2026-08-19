from datetime import date, time
from uuid import UUID

from pydantic import BaseModel, field_validator


class ReuniaoCreate(BaseModel):
    numero: int
    hora: time
    data: date
    tipo: str
    equipe_id: UUID | None = None

    @field_validator('numero')
    @classmethod
    def numero_positivo(cls, v):
        if v <= 0:
            raise ValueError('Número da reunião deve ser positivo')
        return v

    @field_validator('tipo')
    @classmethod
    def tipo_valido(cls, v):
        tipos_validos = ['PRESENCIAL', 'ONLINE', 'HIBRIDA']
        if v.upper() not in tipos_validos:
            raise ValueError(f'Tipo deve ser um de: {", ".join(tipos_validos)}')
        return v.upper()


class ReuniaoUpdate(BaseModel):
    numero: int | None = None
    hora: time | None = None
    data: date | None = None
    tipo: str | None = None
    equipe_id: UUID | None = None

    @field_validator('numero')
    @classmethod
    def numero_positivo(cls, v):
        if v is not None and v <= 0:
            raise ValueError('Número da reunião deve ser positivo')
        return v

    @field_validator('tipo')
    @classmethod
    def tipo_valido(cls, v):
        if v is None:
            return v
        tipos_validos = ['PRESENCIAL', 'ONLINE', 'HIBRIDA']
        if v.upper() not in tipos_validos:
            raise ValueError(f'Tipo deve ser um de: {", ".join(tipos_validos)}')
        return v.upper()


class ReuniaoResponse(BaseModel):
    id: UUID
    numero: int
    hora: time
    data: date
    tipo: str
    equipe_id: UUID | None

    model_config = {
        "from_attributes": True
    }