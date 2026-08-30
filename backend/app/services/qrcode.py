import secrets
import os
from datetime import datetime, timedelta
from io import BytesIO
from uuid import UUID

import qrcode
from sqlalchemy.orm import Session

from utils.fuso import agora
from app.models.qrcode import QRCode
from app.models.reuniao import Reuniao


def gerar_codigo():
    return secrets.token_urlsafe(32)


def obter_url_base():
    """Retorna a URL base baseado no ambiente"""
    env = os.getenv("ENV", "dev")

    if env == "prod":
        return "https://gowolffinance.vercel.app"
    else:
        return "http://localhost:5173"


def criar_qrcode_sala(
    db: Session,
    usuario_id: UUID,
    duracao_minutos: int = 5
):
    """Cria um QR code para registrar presença na sala"""

    codigo = gerar_codigo()
    momento = agora()

    qrcode_db = QRCode(
        codigo=codigo,
        reuniao_id=None,
        gerado_por=usuario_id,
        tipo="SALA",
        data_criacao=momento,
        data_limite=momento + timedelta(minutes=duracao_minutos),
        status="ATIVO"
    )

    db.add(qrcode_db)
    db.commit()
    db.refresh(qrcode_db)

    url_base = obter_url_base()
    url = f"{url_base}/presenca/sala/{codigo}"

    imagem = qrcode.make(url)

    arquivo = BytesIO()
    imagem.save(arquivo, format="PNG")
    arquivo.seek(0)

    return qrcode_db, arquivo


def criar_qrcode_reuniao(
    db: Session,
    reuniao_id: UUID,
    usuario_id: UUID,
    duracao_minutos: int = 60
):
    """Cria um QR code para uma reunião específica"""

    codigo = gerar_codigo()
    momento = agora()

    reuniao = db.query(Reuniao).filter(
        Reuniao.id == reuniao_id
    ).first()

    if not reuniao:
        raise ValueError("Reunião não encontrada")

    qrcode_db = QRCode(
        codigo=codigo,
        reuniao_id=reuniao_id,
        gerado_por=usuario_id,
        tipo="REUNIAO",
        data_criacao=momento,
        data_limite=momento + timedelta(minutes=duracao_minutos),
        status="ATIVO"
    )

    db.add(qrcode_db)
    db.commit()
    db.refresh(qrcode_db)

    url_base = obter_url_base()
    url = f"{url_base}/presenca/reuniao/{codigo}"

    imagem = qrcode.make(url)

    arquivo = BytesIO()
    imagem.save(arquivo, format="PNG")
    arquivo.seek(0)

    return qrcode_db, arquivo


def listar_qrcodes_ativos_service(
    db: Session
):
    """Lista todos os QR codes ativos"""

    momento = agora()

    return db.query(QRCode).filter(
        QRCode.status == "ATIVO",
        QRCode.data_limite > momento
    ).order_by(
        QRCode.data_criacao.desc()
    ).all()


def buscar_qrcode_service(
    db: Session,
    codigo: str
):
    """Busca um QR code pelo código"""

    qrcode_db = db.query(QRCode).filter(
        QRCode.codigo == codigo
    ).first()

    if not qrcode_db:
        raise ValueError("QR Code não encontrado")

    return qrcode_db


def invalidar_qrcode_service(
    db: Session,
    codigo: str
):
    """Invalida um QR code"""

    qrcode_db = db.query(QRCode).filter(
        QRCode.codigo == codigo
    ).first()

    if not qrcode_db:
        raise ValueError("QR Code não encontrado")

    qrcode_db.status = "INATIVO"

    db.commit()
    db.refresh(qrcode_db)

    return qrcode_db