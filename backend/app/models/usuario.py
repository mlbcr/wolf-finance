import uuid

from datetime import datetime

from sqlalchemy import String, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from utils.fuso import agora, hoje
from database import Base


class Usuario(Base):
    __tablename__ = "usuarios"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    aluno_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("alunos.id"),
        nullable=False,
        unique=True
    )

    senha_hash: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )

    # COMMON, DEV, ADMIN
    tipo: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        default="MEMBRO"
    )

    cadastrado_em: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=agora
    )

    status: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        default="ATIVO"
    )

    aluno = relationship("Aluno")
