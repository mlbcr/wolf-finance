import uuid
from datetime import date, time

from sqlalchemy import Date, Time, ForeignKey, Integer, String
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

    numero: Mapped[int] = mapped_column(
        Integer,
        nullable=False
    )

    hora: Mapped[time] = mapped_column(
        Time,
        nullable=False
    )

    data: Mapped[date] = mapped_column(
        Date,
        nullable=False
    )

    tipo: Mapped[str] = mapped_column(
        String,
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
        back_populates="reuniao"
    )

    qrcode = relationship(
        "QRCode",
        back_populates="reuniao",
        uselist=False
    )