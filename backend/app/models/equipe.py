import uuid

from datetime import datetime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import String, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column
from utils.fuso import agora, hoje
from database import Base


class Equipe(Base):
    __tablename__ = "equipes"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    nome: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        unique=True
    )

    descricao: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True
    )

    lider_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("alunos.id"),
        nullable=True
    )

    vice_lider_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("alunos.id"),
        nullable=True
    )

    criado_em: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        default=agora()
    )

    atualizado_em: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        default=agora(),
        onupdate=agora()
    )

    status: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        default="ATIVA"
    )

    icone: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="fa-users"
    )

    cor: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        default="#ffffff"
    )

class AlunoEquipe(Base):
    __tablename__ = "alunos_equipes"

    aluno_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("alunos.id"),
        primary_key=True
    )

    equipe_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("equipes.id"),
        primary_key=True
    )