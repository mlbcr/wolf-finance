import uuid
from datetime import date, time

from sqlalchemy import Date, Time, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import Base

class SalaPresenca(Base):
    __tablename__ = "sala_presencas"

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

    data: Mapped[date] = mapped_column(
        Date,
        nullable=False
    )

    hora_inicio: Mapped[time | None] = mapped_column(
        Time,
        nullable=True
    )

    hora_fim: Mapped[time | None] = mapped_column(
        Time,
        nullable=True
    )

    aluno = relationship("Aluno")