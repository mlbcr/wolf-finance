from datetime import date, time
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class ReuniaoCreate(BaseModel):

    titulo: str

    descricao: str | None = None

    data: date

    hora_inicio: time

    hora_fim: time

    equipe_id: UUID | None = None


class ReuniaoUpdate(BaseModel):

    titulo: str | None = None

    descricao: str | None = None

    data: date | None = None

    hora_inicio: time | None = None

    hora_fim: time | None = None

    equipe_id: UUID | None = None


class ReuniaoResponse(BaseModel):

    id: UUID

    titulo: str

    descricao: str | None

    data: date

    hora_inicio: time

    hora_fim: time

    equipe_id: UUID | None

    model_config = ConfigDict(
        from_attributes=True
    )