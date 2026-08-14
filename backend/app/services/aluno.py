import secrets
from uuid import UUID
from sqlalchemy.orm import Session

from app.models.aluno import Aluno
from app.models.usuario import Usuario
from app.schemas.alunos import AlunoCreate, AlunoUpdate
from app.security.password import gerar_hash

def aluno_para_dict(aluno: Aluno):
    return {
        "id": str(aluno.id),
        "nome_completo": aluno.nome_completo.strip().upper(),
        "bairro": aluno.bairro,
        "curso": aluno.curso,
        "email": aluno.email,
        "telefone": aluno.telefone,
        "matricula": aluno.matricula.strip().upper(),
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

def cadastrar_aluno(
    aluno: AlunoCreate,
    db: Session
):
    senha_inicial = secrets.token_urlsafe(12)

    novo_aluno = Aluno(
        nome_completo=aluno.nome_completo,
        email=aluno.email,
        telefone=aluno.telefone,
        matricula=aluno.matricula,
        data_nascimento=aluno.data_nascimento,
        cargo=aluno.cargo,
        periodo_ingresso=aluno.periodo_ingresso,
        faz_estagio=aluno.faz_estagio
    )

    db.add(novo_aluno)
    db.flush()

    novo_usuario = Usuario(
        aluno_id=novo_aluno.id,
        senha_hash=gerar_hash(senha_inicial),
        tipo="MEMBRO",
        status="ATIVO"
    )

    db.add(novo_usuario)
    db.commit()
    db.refresh(novo_aluno)

    return novo_aluno, senha_inicial

def buscar_aluno(
    aluno_id: UUID,
    db: Session
):
    return db.query(Aluno).filter(
        Aluno.id == aluno_id
    ).first()


def atualizar_aluno(
    aluno_id: UUID,
    dados: AlunoUpdate,
    db: Session
):
    aluno = buscar_aluno(aluno_id, db)

    if not aluno:
        return None

    dados_atualizacao = dados.model_dump(
        exclude_unset=True
    )

    for campo, valor in dados_atualizacao.items():
        setattr(aluno, campo, valor)

    db.commit()
    db.refresh(aluno)

    return aluno_para_dict(aluno)