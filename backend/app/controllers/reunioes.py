from datetime import date
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db

from app.models.usuario import Usuario
from app.models.reuniao import Reuniao

from app.schemas.reuniao import (
    ReuniaoCreate,
    ReuniaoUpdate,
    ReuniaoResponse
)

from app.services.reuniao import (
    listar_reunioes_service,
    listar_reunioes_por_data_service,
    buscar_reuniao_service,
    criar_reuniao_service,
    atualizar_reuniao_service,
    deletar_reuniao_service,
    listar_presencas_reuniao_service
)

from app.security.dependencies import get_usuario_id


router = APIRouter(
    prefix="/reunioes",
    tags=["Reuniões"]
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
# LISTAR REUNIÕES
# ============================================================

@router.get(
    "/",
    response_model=list[ReuniaoResponse]
)
def listar_reunioes(
    equipe_id: UUID | None = None,
    db: Session = Depends(get_db),
    usuario_id: str = Depends(get_usuario_id)
):
    """Lista todas as reuniões ou reuniões de uma equipe específica"""
    return listar_reunioes_service(db, equipe_id)


@router.get(
    "/data",
    response_model=list[ReuniaoResponse]
)
def listar_reunioes_por_data(
    data_inicio: date,
    data_fim: date,
    equipe_id: UUID | None = None,
    db: Session = Depends(get_db),
    usuario_id: str = Depends(get_usuario_id)
):
    """Lista reuniões em um período específico"""
    return listar_reunioes_por_data_service(db, data_inicio, data_fim, equipe_id)


@router.get(
    "/{reuniao_id}",
    response_model=ReuniaoResponse
)
def obter_reuniao(
    reuniao_id: UUID,
    db: Session = Depends(get_db),
    usuario_id: str = Depends(get_usuario_id)
):
    """Obtém detalhes de uma reunião específica"""
    try:
        return buscar_reuniao_service(db, reuniao_id)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )


# ============================================================
# CRIAR REUNIÃO (ADMIN)
# ============================================================

@router.post(
    "/",
    response_model=ReuniaoResponse,
    status_code=status.HTTP_201_CREATED
)
def criar_reuniao(
    dados: ReuniaoCreate,
    db: Session = Depends(get_db),
    usuario_id: str = Depends(get_usuario_id)
):
    """Cria uma nova reunião (apenas admin)"""
    validar_admin(usuario_id, db)

    try:
        return criar_reuniao_service(db, dados)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


# ============================================================
# ATUALIZAR REUNIÃO (ADMIN)
# ============================================================

@router.put(
    "/{reuniao_id}",
    response_model=ReuniaoResponse
)
def atualizar_reuniao(
    reuniao_id: UUID,
    dados: ReuniaoUpdate,
    db: Session = Depends(get_db),
    usuario_id: str = Depends(get_usuario_id)
):
    """Atualiza uma reunião existente (apenas admin)"""
    validar_admin(usuario_id, db)

    try:
        return atualizar_reuniao_service(db, reuniao_id, dados)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )


# ============================================================
# DELETAR REUNIÃO (ADMIN)
# ============================================================

@router.delete(
    "/{reuniao_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
def deletar_reuniao(
    reuniao_id: UUID,
    db: Session = Depends(get_db),
    usuario_id: str = Depends(get_usuario_id)
):
    """Deleta uma reunião (apenas admin)"""
    validar_admin(usuario_id, db)

    try:
        deletar_reuniao_service(db, reuniao_id)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )


# ============================================================
# PRESENÇAS NA REUNIÃO
# ============================================================

@router.get(
    "/{reuniao_id}/presencas",
    response_model=list[dict]
)
def listar_presencas_reuniao(
    reuniao_id: UUID,
    db: Session = Depends(get_db),
    usuario_id: str = Depends(get_usuario_id)
):
    """Lista as presenças registradas em uma reunião"""
    validar_admin(usuario_id, db)

    try:
        presencas = listar_presencas_reuniao_service(db, reuniao_id)
        return [
            {
                "id": str(p.id),
                "aluno_id": str(p.aluno_id),
                "reuniao_id": str(p.reuniao_id),
                "registrada_em": p.registrada_em.isoformat()
            }
            for p in presencas
        ]
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )