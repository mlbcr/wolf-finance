from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class ReuniaoPresencaResponse(BaseModel):
    id: UUID
    aluno_id: UUID
    reuniao_id: UUID
    registrada_em: datetime

    model_config = {
        "from_attributes": True
    }


class ReuniaoPresencaCreate(BaseModel):
    aluno_id: UUID
    reuniao_id: UUID