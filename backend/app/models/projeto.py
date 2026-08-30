import uuid

from datetime import datetime, date

from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import String, DateTime, Date, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from utils.fuso import agora, hoje
from database import Base
from utils.fuso import agora, hoje

class Projeto(Base):
    __tablename__ = "projetos"

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
        nullable=False
    )

    data_inicio: Mapped[date] = mapped_column(
        Date,
        nullable=False
    )

    data_fim: Mapped[date | None] = mapped_column(
        Date,
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
        default="ATIVO"
    )


class AlunoProjeto(Base):
    __tablename__ = "alunos_projetos"

    aluno_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey(
            "alunos.id",
            ondelete="CASCADE"
        ),
        primary_key=True
    )

    projeto_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey(
            "projetos.id",
            ondelete="CASCADE"
        ),
        primary_key=True
    )

class EquipeProjeto(Base):
    __tablename__ = "equipes_projetos"

    equipe_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey(
            "equipes.id",
            ondelete="CASCADE"
        ),
        primary_key=True
    )

    projeto_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey(
            "projetos.id",
            ondelete="CASCADE"
        ),
        primary_key=True
    )