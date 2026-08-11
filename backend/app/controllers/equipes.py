from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db

from app.schemas.equipes import (
    EquipeCreate,
    EquipeUpdate,
    EquipeResponse,
    MembroEquipeResponse
)
from app.schemas.equipes import (
    EquipeCreate,
    EquipeUpdate,
    EquipeResponse,
    MembroEquipeResponse,
    MembrosEquipeCreate
)
from app.security.dependencies import get_usuario_id
from app.services.equipe import (
    listar_equipes_service,
    minhas_equipes_service,
    buscar_equipe_service,
    criar_equipe_service,
    listar_membros_service,
    adicionar_membro_service,
    adicionar_membros_service,
    deletar_membro_service,
    atualizar_equipe_service
)

router = APIRouter(
    prefix="/equipes",
    tags=["Equipes"]
)


@router.get("/", response_model=list[EquipeResponse])
def listar_equipes(
    db: Session = Depends(get_db)
):
    return listar_equipes_service(db)


@router.get("/minhas", response_model=list[EquipeResponse])
def minhas_equipes(
    db: Session = Depends(get_db),
    usuario_id: str = Depends(get_usuario_id)
):
    return minhas_equipes_service(db, UUID(usuario_id))



@router.get("/{equipe_id}", response_model=EquipeResponse)
def buscar_equipe(
    equipe_id: UUID,
    db: Session = Depends(get_db)
):
    try:
        return buscar_equipe_service(db, equipe_id)

    except ValueError as error:
        raise HTTPException(
            status_code=404,
            detail=str(error)
        )


@router.post("/", response_model=EquipeResponse, status_code=201)
def criar_equipe(
    dados: EquipeCreate,
    db: Session = Depends(get_db)
):
    try:
        return criar_equipe_service(db, dados)

    except ValueError as error:
        raise HTTPException(
            status_code=404,
            detail=str(error)
        )


@router.get(
    "/{equipe_id}/membros",
    response_model=list[MembroEquipeResponse]
)
def listar_membros(
    equipe_id: UUID,
    db: Session = Depends(get_db)
):
    try:
        return listar_membros_service(db, equipe_id)

    except ValueError as error:
        raise HTTPException(
            status_code=404,
            detail=str(error)
        )

@router.post("/{equipe_id}/membros")
def adicionar_membros(
    equipe_id: UUID,
    dados: MembrosEquipeCreate,
    db: Session = Depends(get_db)
):
    try:
        return adicionar_membros_service(
            db,
            equipe_id,
            dados.aluno_ids
        )

    except ValueError as error:
        raise HTTPException(
            status_code=404,
            detail=str(error)
        )

@router.post("/{equipe_id}/membros/{aluno_id}")
def adicionar_membro(
    equipe_id: UUID,
    aluno_id: UUID,
    db: Session = Depends(get_db)
):
    try:
        return adicionar_membro_service(
            db,
            equipe_id,
            aluno_id
        )

    except ValueError as error:
        raise HTTPException(
            status_code=404,
            detail=str(error)
        )


@router.delete("/{equipe_id}/membros/{aluno_id}")
def deletar_membro(
    equipe_id: UUID,
    aluno_id: UUID,
    db: Session = Depends(get_db)
):
    try:
        return deletar_membro_service(
            db,
            equipe_id,
            aluno_id
        )

    except ValueError as error:
        raise HTTPException(
            status_code=404,
            detail=str(error)
        )

@router.put(
    "/{equipe_id}",
    response_model=EquipeResponse
)
def atualizar_equipe(
    equipe_id: UUID,
    dados: EquipeUpdate,
    db: Session = Depends(get_db)
):
    try:
        return atualizar_equipe_service(
            db,
            equipe_id,
            dados
        )

    except ValueError as error:
        raise HTTPException(
            status_code=404,
            detail=str(error)
        )