import uuid
from datetime import datetime

from sqlalchemy import String, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import Base


class QRCode(Base):
    __tablename__ = "qrcodes"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    codigo: Mapped[str] = mapped_column(
        String,
        nullable=False,
        unique=True
    )

    reuniao_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("reunioes.id"),
        nullable=True
    )

    gerado_por: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("usuarios.id"),
        nullable=False
    )

    tipo: Mapped[str] = mapped_column(
        String,
        nullable=False
    )

    data_criacao: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        default=datetime.now
    )

    data_limite: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False
    )

    status: Mapped[str] = mapped_column(
        String,
        nullable=False,
        default="ATIVO"
    )

    usuario = relationship("Usuario")
    reuniao = relationship("Reuniao", back_populates="qrcode")