from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.schemas.auth import LoginRequest, RecuperarSenhaRequest
from app.services.auth import (
    autenticar_usuario,
    solicitar_recuperacao_senha
)
from app.security.dependencies import get_usuario_id

from app.models.usuario import Usuario
from app.models.aluno import Aluno

from database import SessionLocal


router = APIRouter(
    prefix="/auth",
    tags=["Autenticação"]
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@router.post("/login")
def login(
    dados: LoginRequest,
    db: Session = Depends(get_db)
):
    return autenticar_usuario(dados, db)


@router.get("/me")
def usuario_logado(
    usuario_id: str = Depends(get_usuario_id),
    db: Session = Depends(get_db)
):
    usuario = (
        db.query(Usuario)
        .filter(Usuario.id == usuario_id)
        .first()
    )

    if not usuario:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuário não encontrado"
        )

    aluno = (
        db.query(Aluno)
        .filter(Aluno.id == usuario.aluno_id)
        .first()
    )

    if not aluno:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Aluno não encontrado"
        )

    return {
        "id": usuario.id,
        "aluno_id": aluno.id,
        "nome_completo": aluno.nome_completo,
        "email": aluno.email,
        "telefone": aluno.telefone,
        "matricula": aluno.matricula,
        "data_nascimento": aluno.data_nascimento,
        "bairro": aluno.bairro,
        "curso": aluno.curso,
        "cargo": aluno.cargo,
        "ingresso_liga": aluno.ingresso_liga,
        "desligamento_liga": aluno.desligamento_liga,
        "faz_estagio": aluno.faz_estagio,
        "tipo": usuario.tipo,
        "status": usuario.status
    }


@router.post("/recuperar-senha")
def recuperar_senha(
    dados: RecuperarSenhaRequest,
    db: Session = Depends(get_db)
):
    return solicitar_recuperacao_senha(dados, db)