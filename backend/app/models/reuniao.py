import uuid
from datetime import date, time

from sqlalchemy import Date, Time, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import Base


class Reuniao(Base):
    __tablename__ = "reunioes"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    titulo: Mapped[str] = mapped_column(
        String,
        nullable=False
    )

    descricao: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    data: Mapped[date] = mapped_column(
        Date,
        nullable=False
    )

    hora_inicio: Mapped[time] = mapped_column(
        Time,
        nullable=False
    )

    hora_fim: Mapped[time] = mapped_column(
        Time,
        nullable=False
    )

    equipe_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("equipes.id"),
        nullable=True
    )

    equipe = relationship("Equipe")

    presencas = relationship(
        "ReuniaoPresenca",
        back_populates="reuniao",
        cascade="all, delete-orphan"
    )

    qrcode = relationship(
        "QRCode",
        back_populates="reuniao",
        uselist=False,
        cascade="all, delete-orphan"
    )