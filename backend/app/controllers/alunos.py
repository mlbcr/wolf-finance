from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.schemas.alunos import AlunoCreate, AlunoUpdate
from app.services.aluno import cadastrar_aluno, aluno_para_dict
from app.models.aluno import Aluno

from database import get_db
from utils.email.email_util import enviar_email


router = APIRouter(
    prefix="/alunos",
    tags=["Alunos"]
)


@router.post("/", status_code=201)
def criar_aluno(
    aluno: AlunoCreate,
    db: Session = Depends(get_db)
):
    try:
        aluno, senha_inicial = cadastrar_aluno(aluno, db)

        enviar_email(
            email=aluno.email,
            matricula=aluno.matricula,
            nome=aluno.nome_completo,
            senha=senha_inicial
        )

        return aluno_para_dict(aluno)

    except Exception as error:
        db.rollback()

        print("ERRO AO CADASTRAR ALUNO:", repr(error))

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error)
        )

@router.get("/")
def listar_alunos(
    db: Session = Depends(get_db)
):
    alunos = db.query(Aluno).all()

    result = []
    for a in alunos:
        result.append({
            "id": str(a.id),
            "nome_completo": a.nome_completo,
            "bairro": a.bairro,
            "curso": a.curso,
            "email": a.email,
            "telefone": a.telefone,
            "matricula": a.matricula,
            "data_nascimento": a.data_nascimento.isoformat() if a.data_nascimento else None,
            "cadastrado_em": a.cadastrado_em.isoformat() if a.cadastrado_em else None,
            "ingresso_liga": a.ingresso_liga.isoformat() if a.ingresso_liga else None,
            "desligamento_liga": a.desligamento_liga.isoformat() if a.desligamento_liga else None,
            "cargo": a.cargo,
            "periodo_ingresso": a.periodo_ingresso.isoformat() if a.periodo_ingresso else None,
            "faz_estagio": a.faz_estagio,
            "status": a.status
        })

    return result


@router.get("/{aluno_id}")
def listar_aluno(
    aluno_id: UUID,
    db: Session = Depends(get_db)
):
    aluno = db.query(Aluno).filter(Aluno.id == aluno_id).first()

    if not aluno:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Aluno não encontrado"
        )

    return {
        "id": str(aluno.id),
        "nome_completo": aluno.nome_completo,
        "bairro": aluno.bairro,
        "curso": aluno.curso,
        "email": aluno.email,
        "telefone": aluno.telefone,
        "matricula": aluno.matricula,
        "data_nascimento": aluno.data_nascimento.isoformat() if aluno.data_nascimento else None,
        "cadastrado_em": aluno.cadastrado_em.isoformat() if aluno.cadastrado_em else None,
        "ingresso_liga": aluno.ingresso_liga.isoformat() if aluno.ingresso_liga else None,
        "desligamento_liga": aluno.desligamento_liga.isoformat() if aluno.desligamento_liga else None,
        "cargo": aluno.cargo,
        "periodo_ingresso": aluno.periodo_ingresso.isoformat() if aluno.periodo_ingresso else None,
        "faz_estagio": aluno.faz_estagio,
        "status": aluno.status
    }

@router.put("/{aluno_id}")
def atualizar_aluno(
    aluno_id: UUID,
    dados: AlunoUpdate,
    db: Session = Depends(get_db)
):
    aluno = db.query(Aluno).filter(
        Aluno.id == aluno_id
    ).first()

    if not aluno:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Aluno não encontrado"
        )

    dados_atualizacao = dados.model_dump(
        exclude_unset=True
    )

    for campo, valor in dados_atualizacao.items():
        setattr(aluno, campo, valor)

    db.commit()
    db.refresh(aluno)

    return {
        "id": str(aluno.id),
        "nome_completo": aluno.nome_completo,
        "bairro": aluno.bairro,
        "curso": aluno.curso,
        "email": aluno.email,
        "telefone": aluno.telefone,
        "matricula": aluno.matricula,
        "data_nascimento": (
            aluno.data_nascimento.isoformat()
            if aluno.data_nascimento
            else None
        ),
        "cadastrado_em": (
            aluno.cadastrado_em.isoformat()
            if aluno.cadastrado_em
            else None
        ),
        "ingresso_liga": (
            aluno.ingresso_liga.isoformat()
            if aluno.ingresso_liga
            else None
        ),
        "desligamento_liga": (
            aluno.desligamento_liga.isoformat()
            if aluno.desligamento_liga
            else None
        ),
        "cargo": aluno.cargo,
        "periodo_ingresso": (
            aluno.periodo_ingresso.isoformat()
            if aluno.periodo_ingresso
            else None
        ),
        "faz_estagio": aluno.faz_estagio,
        "status": aluno.status
    }