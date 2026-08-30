import uuid

from datetime import date, datetime

from sqlalchemy import String, Date, DateTime, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column
from utils.fuso import agora, hoje
from database import Base


class Aluno(Base):
    __tablename__ = "alunos"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    nome_completo: Mapped[str] = mapped_column(
        String(150),
        nullable=False
    )

    bairro: Mapped[str] = mapped_column(
        String(100),
        nullable=False
    )

    curso: Mapped[str] = mapped_column(
        String(100),
        nullable=False
    )


    email: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
        unique=True
    )

    telefone:  Mapped[str] = mapped_column(
        String(150),
        nullable=False,
        unique=True
    )

    matricula: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        unique=True
    )

    data_nascimento: Mapped[date] = mapped_column(
        Date,
        nullable=False
    )

    cadastrado_em: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        default=agora()
    )
    ingresso_liga: Mapped[date] = mapped_column(
        Date,
        nullable=False
    )

    desligamento_liga: Mapped[date | None] = mapped_column(
        Date,
        nullable=True
    )


    cargo: Mapped[str] = mapped_column(
        String(50),
        nullable=False
    )

    periodo_ingresso: Mapped[date] = mapped_column(
        Date,
        nullable=False
    )

    faz_estagio: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False
    )

    status: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        default="ATIVO"
    )