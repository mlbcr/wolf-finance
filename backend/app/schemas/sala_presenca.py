from datetime import date, time
from uuid import UUID

from pydantic import BaseModel, field_validator


class SalaPresencaResponse(BaseModel):
    id: UUID
    aluno_id: UUID
    data: date
    hora_inicio: time | None
    hora_fim: time | None

    model_config = {
        "from_attributes": True
    }


class SalaPresencaUpdate(BaseModel):
    hora_inicio: time | None = None
    hora_fim: time | None = None

    @field_validator('hora_fim')
    @classmethod
    def hora_fim_valida(cls, v, info):
        if v is not None and info.data.get('hora_inicio') is not None:
            if v <= info.data.get('hora_inicio'):
                raise ValueError('Hora de fim deve ser posterior à hora de início')
        return v


class SalaPresencaComHoras(BaseModel):
    id: UUID
    aluno_id: UUID
    data: date
    hora_inicio: time | None
    hora_fim: time | None
    total_horas: float | None = None

    model_config = {
        "from_attributes": True
    }


class ReuniaoPresencaResponse(BaseModel):
    id: UUID
    aluno_id: UUID
    reuniao_id: UUID
    registrada_em: str

    model_config = {
        "from_attributes": True
    }


class ReuniaoPresencaCreate(BaseModel):
    aluno_id: UUID
    reuniao_id: UUID