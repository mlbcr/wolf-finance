from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from database import get_db

from app.models.usuario import Usuario
from app.services.qrcode import (
    criar_qrcode_sala,
    criar_qrcode_reuniao,
    listar_qrcodes_ativos_service,
    buscar_qrcode_service,
    invalidar_qrcode_service
)
from app.security.dependencies import get_usuario_id


router = APIRouter(
    prefix="/qrcodes",
    tags=["QR Codes"]
)


def validar_admin(
    usuario_id: str,
    db: Session
):
    """Valida se o usuário é admin"""
    usuario = db.query(Usuario).filter(
        Usuario.id == usuario_id
    ).first()

    if not usuario:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuário não encontrado"
        )

    if usuario.tipo != "ADMIN":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Apenas administradores podem acessar este recurso"
        )

    return usuario


# ============================================================
# SALA - QR Code
# ============================================================

@router.post(
    "/sala",
    status_code=status.HTTP_200_OK
)
def gerar_qrcode_sala(
    db: Session = Depends(get_db),
    usuario_id: str = Depends(get_usuario_id)
):
    """Gera um QR code para registrar presença na sala (duração: 5 minutos)"""
    validar_admin(usuario_id, db)
    
    qrcode_db, imagem = criar_qrcode_sala(db, UUID(usuario_id))

    return StreamingResponse(
        imagem,
        media_type="image/png",
        headers={
            "X-QRCode-ID": str(qrcode_db.id),
            "X-QRCode-Codigo": qrcode_db.codigo,
            "X-QRCode-Data-Limite": qrcode_db.data_limite.isoformat()
        }
    )


# ============================================================
# REUNIÃO - QR Code
# ============================================================

@router.post(
    "/reuniao/{reuniao_id}",
    status_code=status.HTTP_200_OK
)
def gerar_qrcode_reuniao(
    reuniao_id: UUID,
    db: Session = Depends(get_db),
    usuario_id: str = Depends(get_usuario_id)
):
    """Gera um QR code para uma reunião específica (duração: 60 minutos)"""
    validar_admin(usuario_id, db)
    
    try:
        qrcode_db, imagem = criar_qrcode_reuniao(
            db,
            reuniao_id,
            UUID(usuario_id)
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )

    return StreamingResponse(
        imagem,
        media_type="image/png",
        headers={
            "X-QRCode-ID": str(qrcode_db.id),
            "X-QRCode-Codigo": qrcode_db.codigo,
            "X-QRCode-Data-Limite": qrcode_db.data_limite.isoformat()
        }
    )


# ============================================================
# LISTAR E GERENCIAR QR CODES
# ============================================================

@router.get(
    "/",
    response_model=list[dict]
)
def listar_qrcodes_ativos(
    db: Session = Depends(get_db),
    usuario_id: str = Depends(get_usuario_id)
):
    """Lista todos os QR codes ativos"""
    validar_admin(usuario_id, db)
    
    qrcodes = listar_qrcodes_ativos_service(db)
    
    return [
        {
            "id": str(qr.id),
            "codigo": qr.codigo,
            "reuniao_id": str(qr.reuniao_id) if qr.reuniao_id else None,
            "tipo": qr.tipo,
            "data_criacao": qr.data_criacao.isoformat(),
            "data_limite": qr.data_limite.isoformat(),
            "status": qr.status
        }
        for qr in qrcodes
    ]


@router.post(
    "/{codigo}/invalidar",
    status_code=status.HTTP_200_OK
)
def invalidar_qrcode(
    codigo: str,
    db: Session = Depends(get_db),
    usuario_id: str = Depends(get_usuario_id)
):
    """Invalida um QR code antes da expiração"""
    validar_admin(usuario_id, db)
    
    try:
        qrcode_db = invalidar_qrcode_service(db, codigo)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )

    return {
        "id": str(qrcode_db.id),
        "codigo": qrcode_db.codigo,
        "status": qrcode_db.status,
        "message": "QR Code invalidado com sucesso"
    }