import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from utils.fuso import agora, hoje
from database import Base


class ReuniaoPresenca(Base):
    __tablename__ = "reunioes_presencas"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    aluno_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("alunos.id"),
        nullable=False
    )

    reuniao_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("reunioes.id"),
        nullable=False
    )

    registrada_em: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        default=agora()
    )

    aluno = relationship("Aluno")

    reuniao = relationship(
        "Reuniao",
        back_populates="presencas"
    )