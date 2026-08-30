from datetime import date, datetime
from zoneinfo import ZoneInfo
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db

from app.models.sala_presenca import SalaPresenca
from app.models.qrcode import QRCode
from app.models.usuario import Usuario
from app.models.reuniao_presenca import ReuniaoPresenca
from app.models.reuniao import Reuniao
from utils.fuso import agora, hoje

from app.schemas.sala_presenca import (
    SalaPresencaResponse,
    SalaPresencaUpdate,
    SalaPresencaComHoras,
    ReuniaoPresencaResponse,
    ReuniaoPresencaCreate
)

from app.services.presenca import (
    listar_presencas_aluno_service,
    listar_presencas_por_data_service,
    buscar_presenca_service,
    atualizar_presenca_service,
    calcular_horas_semana_service,
    deletar_presenca_service
)

from app.services.reuniao import (
    registrar_presenca_reuniao_service,
    listar_presencas_reuniao_service
)

from app.security.dependencies import get_usuario_id

FUSO_BRASIL = ZoneInfo("America/Sao_Paulo")

router = APIRouter(
    prefix="/presencas",
    tags=["Presenças"]
)

def buscar_usuario(
    usuario_id: str,
    db: Session
):
    print("USUARIO ID:", usuario_id)

    usuario = db.query(Usuario).filter(
        Usuario.id == usuario_id
    ).first()

    print("USUARIO:", usuario)

    if not usuario:
        raise HTTPException(
            status_code=404,
            detail="Usuário não encontrado"
        )

    print("ALUNO:", usuario.aluno)

    if not usuario.aluno:
        raise HTTPException(
            status_code=400,
            detail="Usuário não possui aluno associado"
        )

    return usuario

# ============================================================
# SALA - Presença
# ============================================================

@router.post(
    "/sala/{codigo}",
    response_model=SalaPresencaResponse
)
def registrar_presenca_sala(
    codigo: str,
    db: Session = Depends(get_db),
    usuario_id: str = Depends(get_usuario_id)
):
    """Registra presença na sala escaneando QR code"""
    usuario = buscar_usuario(usuario_id, db)
    aluno = usuario.aluno

    qrcode = db.query(QRCode).filter(
        QRCode.codigo == codigo
    ).first()

    if not qrcode:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="QR Code não encontrado"
        )

    if qrcode.tipo != "SALA":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Este QR Code não é de sala"
        )

    momento = agora()

    print("MOMENTO:", momento)
    print("TZ MOMENTO:", momento.tzinfo)

    print("LIMITE:", qrcode.data_limite)
    print("TZ LIMITE:", qrcode.data_limite.tzinfo)

    if momento > qrcode.data_limite:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="QR Code expirado"
        )

    if qrcode.status != "ATIVO":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="QR Code inativo"
        )

    presenca = db.query(SalaPresenca).filter(
        SalaPresenca.aluno_id == aluno.id,
        SalaPresenca.data == hoje(),
        SalaPresenca.hora_fim.is_(None)
    ).first()

    momento = agora()

    if presenca:
        # Já entrou → registra saída
        presenca.hora_fim = momento.time()

        db.commit()
        db.refresh(presenca)

        return presenca

    presenca = SalaPresenca(
        aluno_id=aluno.id,
        data=hoje(),
        hora_inicio=momento.time(),
        hora_fim=None
    )

    db.add(presenca)
    db.commit()
    db.refresh(presenca)

    return presenca


@router.get(
    "/sala/minhas",
    response_model=list[SalaPresencaComHoras]
)
def listar_minhas_presencas(
    db: Session = Depends(get_db),
    usuario_id: str = Depends(get_usuario_id)
):
    """Lista todas as presenças do usuário logado"""
    usuario = buscar_usuario(usuario_id, db)
    aluno = usuario.aluno

    presencas = listar_presencas_aluno_service(db, aluno.id)
    
    resultado = []
    for presenca in presencas:
        item = {
            "id": presenca.id,
            "aluno_id": presenca.aluno_id,
            "data": presenca.data,
            "hora_inicio": presenca.hora_inicio,
            "hora_fim": presenca.hora_fim,
            "total_horas": None
        }
        
        if presenca.hora_inicio and presenca.hora_fim:
            inicio_segundos = (
                presenca.hora_inicio.hour * 3600 +
                presenca.hora_inicio.minute * 60 +
                presenca.hora_inicio.second
            )
            fim_segundos = (
                presenca.hora_fim.hour * 3600 +
                presenca.hora_fim.minute * 60 +
                presenca.hora_fim.second
            )
            diferenca_segundos = fim_segundos - inicio_segundos
            item["total_horas"] = round(diferenca_segundos / 3600, 2)
        
        resultado.append(item)
    
    return resultado


@router.get(
    "/sala/semana",
    response_model=dict
)
def obter_horas_semana(
    db: Session = Depends(get_db),
    usuario_id: str = Depends(get_usuario_id)
):
    """Obtém total de horas de presença na semana"""
    usuario = buscar_usuario(usuario_id, db)
    aluno = usuario.aluno

    total_horas = calcular_horas_semana_service(db, aluno.id)

    if aluno.faz_estagio:
        meta_horas = 3
    else:
        meta_horas = 4

    return {
        "total_horas": total_horas,
        "meta_horas": meta_horas,
        "percentual": round((total_horas / meta_horas) * 100, 2) if total_horas > 0 else 0
    }


@router.get(
    "/sala/{presenca_id}",
    response_model=SalaPresencaComHoras
)
def obter_presenca(
    presenca_id: UUID,
    db: Session = Depends(get_db),
    usuario_id: str = Depends(get_usuario_id)
):
    """Obtém detalhes de uma presença específica"""
    usuario = buscar_usuario(usuario_id, db)
    aluno = usuario.aluno

    try:
        presenca = buscar_presenca_service(db, presenca_id)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )

    if presenca.aluno_id != aluno.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Não autorizado"
        )

    total_horas = None
    if presenca.hora_inicio and presenca.hora_fim:
        inicio_segundos = (
            presenca.hora_inicio.hour * 3600 +
            presenca.hora_inicio.minute * 60 +
            presenca.hora_inicio.second
        )
        fim_segundos = (
            presenca.hora_fim.hour * 3600 +
            presenca.hora_fim.minute * 60 +
            presenca.hora_fim.second
        )
        diferenca_segundos = fim_segundos - inicio_segundos
        total_horas = round(diferenca_segundos / 3600, 2)

    return {
        "id": presenca.id,
        "aluno_id": presenca.aluno_id,
        "data": presenca.data,
        "hora_inicio": presenca.hora_inicio,
        "hora_fim": presenca.hora_fim,
        "total_horas": total_horas
    }


@router.put(
    "/sala/{presenca_id}",
    response_model=SalaPresencaComHoras
)
def atualizar_presenca(
    presenca_id: UUID,
    dados: SalaPresencaUpdate,
    db: Session = Depends(get_db),
    usuario_id: str = Depends(get_usuario_id)
):
    """Atualiza horário de uma presença (hora de início e/ou fim)"""
    usuario = buscar_usuario(usuario_id, db)
    aluno = usuario.aluno

    try:
        presenca = buscar_presenca_service(db, presenca_id)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )

    if presenca.aluno_id != aluno.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Não autorizado"
        )

    try:
        presenca = atualizar_presenca_service(db, presenca_id, dados)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

    total_horas = None
    if presenca.hora_inicio and presenca.hora_fim:
        inicio_segundos = (
            presenca.hora_inicio.hour * 3600 +
            presenca.hora_inicio.minute * 60 +
            presenca.hora_inicio.second
        )
        fim_segundos = (
            presenca.hora_fim.hour * 3600 +
            presenca.hora_fim.minute * 60 +
            presenca.hora_fim.second
        )
        diferenca_segundos = fim_segundos - inicio_segundos
        total_horas = round(diferenca_segundos / 3600, 2)

    return {
        "id": presenca.id,
        "aluno_id": presenca.aluno_id,
        "data": presenca.data,
        "hora_inicio": presenca.hora_inicio,
        "hora_fim": presenca.hora_fim,
        "total_horas": total_horas
    }


@router.delete(
    "/sala/{presenca_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
def deletar_presenca(
    presenca_id: UUID,
    db: Session = Depends(get_db),
    usuario_id: str = Depends(get_usuario_id)
):
    """Deleta uma presença (apenas próprias presenças ou admin)"""
    usuario = buscar_usuario(usuario_id, db)
    aluno = usuario.aluno

    try:
        presenca = buscar_presenca_service(db, presenca_id)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )

    if presenca.aluno_id != aluno.id and usuario.tipo != "ADMIN":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Não autorizado"
        )

    deletar_presenca_service(db, presenca_id)


# ============================================================
# REUNIÃO - Presença
# ============================================================

@router.post(
    "/reuniao/{codigo}",
    response_model=ReuniaoPresencaResponse
)
def registrar_presenca_reuniao(
    codigo: str,
    db: Session = Depends(get_db),
    usuario_id: str = Depends(get_usuario_id)
):
    """Registra presença em reunião escaneando QR code"""
    usuario = buscar_usuario(usuario_id, db)
    aluno = usuario.aluno

    qrcode = db.query(QRCode).filter(
        QRCode.codigo == codigo
    ).first()

    if not qrcode:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="QR Code não encontrado"
        )

    if qrcode.tipo != "REUNIAO":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Este QR Code não é de reunião"
        )

    momento = agora()

    print("MOMENTO:", momento)
    print("TZ MOMENTO:", momento.tzinfo)

    print("LIMITE:", qrcode.data_limite)
    print("TZ LIMITE:", qrcode.data_limite.tzinfo)

    if momento > qrcode.data_limite:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="QR Code expirado"
        )

    if qrcode.status != "ATIVO":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="QR Code inativo"
        )

    try:
        presenca = registrar_presenca_reuniao_service(
            db,
            aluno.id,
            qrcode.reuniao_id
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(e)
        )

    return {
        "id": presenca.id,
        "aluno_id": presenca.aluno_id,
        "reuniao_id": presenca.reuniao_id,
        "registrada_em": presenca.registrada_em.isoformat()
    }