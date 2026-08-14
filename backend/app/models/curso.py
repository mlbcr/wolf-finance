from sqlalchemy import String, Boolean
from sqlalchemy.orm import Mapped, mapped_column
import uuid
from database import Base
from sqlalchemy.dialects.postgresql import UUID

class Curso(Base):
    __tablename__ = "cursos"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    nome: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
        unique=True
    )

    sigla: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        unique=True
    )

    status: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        default="ATIVO"
    )
