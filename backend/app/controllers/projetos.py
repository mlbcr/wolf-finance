from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db

from app.schemas.projetos import (
    ProjetoCreate,
    ProjetoUpdate,
    ProjetoResponse
)

from app.security.dependencies import get_usuario_id

from app.services.projeto import (
    listar_projetos_service,
    buscar_projeto_service,
    criar_projeto_service,
    atualizar_projeto_service,
    listar_alunos_service,
    adicionar_aluno_service,
    deletar_aluno_service,
    listar_equipes_projeto_service,
    adicionar_equipe_service,
    deletar_equipe_service
)


router = APIRouter(
    prefix="/projetos",
    tags=["Projetos"]
)

@router.get(
    "/",
    response_model=list[ProjetoResponse]
)
def listar_projetos(
    db: Session = Depends(get_db)
):
    return listar_projetos_service(db)

@router.get(
    "/{projeto_id}",
    response_model=ProjetoResponse
)
def buscar_projeto(
    projeto_id: UUID,
    db: Session = Depends(get_db)
):
    try:
        return buscar_projeto_service(
            db,
            projeto_id
        )

    except ValueError as error:
        raise HTTPException(
            status_code=404,
            detail=str(error)
        )

@router.post(
    "/",
    response_model=ProjetoResponse,
    status_code=201
)
def criar_projeto(
    dados: ProjetoCreate,
    db: Session = Depends(get_db)
):
    try:
        return criar_projeto_service(
            db,
            dados
        )

    except ValueError as error:
        raise HTTPException(
            status_code=404,
            detail=str(error)
        )


@router.put(
    "/{projeto_id}",
    response_model=ProjetoResponse
)
def atualizar_projeto(
    projeto_id: UUID,
    dados: ProjetoUpdate,
    db: Session = Depends(get_db),
    usuario_id: str = Depends(get_usuario_id)
):
    try:
        return atualizar_projeto_service(
            db,
            projeto_id,
            dados,
            UUID(usuario_id)
        )

    except ValueError as error:
        raise HTTPException(
            status_code=404,
            detail=str(error)
        )

    except PermissionError as error:
        raise HTTPException(
            status_code=403,
            detail=str(error)
        )


@router.get(
    "/{projeto_id}/alunos"
)
def listar_alunos(
    projeto_id: UUID,
    db: Session = Depends(get_db)
):
    try:
        return listar_alunos_service(
            db,
            projeto_id
        )

    except ValueError as error:
        raise HTTPException(
            status_code=404,
            detail=str(error)
        )

@router.post(
    "/{projeto_id}/alunos/{aluno_id}"
)
def adicionar_aluno(
    projeto_id: UUID,
    aluno_id: UUID,
    db: Session = Depends(get_db)
):
    try:
        return adicionar_aluno_service(
            db,
            projeto_id,
            aluno_id
        )

    except ValueError as error:
        raise HTTPException(
            status_code=404,
            detail=str(error)
        )

@router.delete(
    "/{projeto_id}/alunos/{aluno_id}"
)
def deletar_aluno(
    projeto_id: UUID,
    aluno_id: UUID,
    db: Session = Depends(get_db)
):
    try:
        return deletar_aluno_service(
            db,
            projeto_id,
            aluno_id
        )

    except ValueError as error:
        raise HTTPException(
            status_code=404,
            detail=str(error)
        )

@router.get(
    "/{projeto_id}/equipes"
)
def listar_equipes(
    projeto_id: UUID,
    db: Session = Depends(get_db)
):
    try:
        return listar_equipes_projeto_service(
            db,
            projeto_id
        )

    except ValueError as error:
        raise HTTPException(
            status_code=404,
            detail=str(error)
        )

@router.post(
    "/{projeto_id}/equipes/{equipe_id}"
)
def adicionar_equipe(
    projeto_id: UUID,
    equipe_id: UUID,
    db: Session = Depends(get_db)
):
    try:
        return adicionar_equipe_service(
            db,
            projeto_id,
            equipe_id
        )

    except ValueError as error:
        raise HTTPException(
            status_code=404,
            detail=str(error)
        )

