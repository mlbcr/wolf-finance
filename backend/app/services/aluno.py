import secrets

from sqlalchemy.orm import Session

from app.models.aluno import Aluno
from app.models.usuario import Usuario
from app.schemas.alunos import AlunoCreate
from app.security.password import gerar_hash


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

    return novo_aluno