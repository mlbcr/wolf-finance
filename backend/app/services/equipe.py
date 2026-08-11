from uuid import UUID

from sqlalchemy.orm import Session

from app.models.aluno import Aluno
from app.models.equipe import Equipe, AlunoEquipe
from app.schemas.equipes import EquipeCreate

from app.models.usuario import Usuario

def listar_equipes_service(db: Session):

    return (
        db.query(Equipe)
        .filter(Equipe.status == "ATIVA")
        .all()
    )


def buscar_equipe_service(
    db: Session,
    equipe_id: UUID
):

    equipe = (
        db.query(Equipe)
        .filter(Equipe.id == equipe_id)
        .first()
    )

    if not equipe:
        raise ValueError("Equipe não encontrada")

    return equipe


def criar_equipe_service(
    db: Session,
    dados: EquipeCreate
):

    lider = (
        db.query(Aluno)
        .filter(Aluno.id == dados.lider_id)
        .first()
    )

    if not lider:
        raise ValueError("Aluno líder não encontrado")

    equipe = Equipe(
        nome=dados.nome,
        descricao=dados.descricao,
        lider_id=dados.lider_id
    )

    db.add(equipe)
    db.commit()
    db.refresh(equipe)

    return equipe


def listar_membros_service(
    db: Session,
    equipe_id: UUID
):

    equipe = (
        db.query(Equipe)
        .filter(Equipe.id == equipe_id)
        .first()
    )

    if not equipe:
        raise ValueError("Equipe não encontrada")

    return (
        db.query(Aluno)
        .join(
            AlunoEquipe,
            Aluno.id == AlunoEquipe.aluno_id
        )
        .filter(
            AlunoEquipe.equipe_id == equipe_id
        )
        .all()
    )

def adicionar_membro_service(
    db: Session,
    equipe_id: UUID,
    aluno_id: UUID
):
    equipe = db.query(Equipe).filter(
        Equipe.id == equipe_id
    ).first()

    if not equipe:
        raise ValueError("Equipe não encontrada")

    aluno = db.query(Aluno).filter(
        Aluno.id == aluno_id
    ).first()

    if not aluno:
        raise ValueError("Aluno não encontrado")

    membro = db.query(AlunoEquipe).filter(
        AlunoEquipe.equipe_id == equipe_id,
        AlunoEquipe.aluno_id == aluno_id
    ).first()

    if membro:
        raise ValueError("Aluno já pertence à equipe")

    membro = AlunoEquipe(
        equipe_id=equipe_id,
        aluno_id=aluno_id
    )

    db.add(membro)
    db.commit()

    return membro

def deletar_membro_service(
    db: Session,
    equipe_id: UUID,
    aluno_id: UUID
):
    membro = (
        db.query(AlunoEquipe)
        .filter(
            AlunoEquipe.equipe_id == equipe_id,
            AlunoEquipe.aluno_id == aluno_id
        )
        .first()
    )

    if not membro:
        raise ValueError(
            "Aluno não pertence a esta equipe"
        )

    db.delete(membro)
    db.commit()

    return {
        "message": "Membro removido da equipe"
    }

def minhas_equipes_service(
    db: Session,
    usuario_id: UUID
):
    usuario = (
        db.query(Usuario)
        .filter(Usuario.id == usuario_id)
        .first()
    )

    if not usuario:
        raise ValueError("Usuário não encontrado")

    equipes = (
        db.query(Equipe)
        .join(
            AlunoEquipe,
            AlunoEquipe.equipe_id == Equipe.id
        )
        .filter(
            AlunoEquipe.aluno_id == usuario.aluno_id,
            Equipe.status == "ATIVA"
        )
        .all()
    )

    return equipes

def atualizar_equipe_service(
    db: Session,
    equipe_id: UUID,
    dados: EquipeUpdate
):
    equipe = (
        db.query(Equipe)
        .filter(Equipe.id == equipe_id)
        .first()
    )

    if not equipe:
        raise ValueError("Equipe não encontrada")

    if dados.lider_id:
        lider = (
            db.query(Aluno)
            .filter(Aluno.id == dados.lider_id)
            .first()
        )

        if not lider:
            raise ValueError("Aluno líder não encontrado")

    equipe.nome = dados.nome
    equipe.descricao = dados.descricao
    equipe.lider_id = dados.lider_id
    equipe.icone = dados.icone
    equipe.cor = dados.cor

    db.commit()
    db.refresh(equipe)

    return equipe

def adicionar_membros_service(
    db: Session,
    equipe_id: UUID,
    aluno_ids: list[UUID]
):
    equipe = (
        db.query(Equipe)
        .filter(Equipe.id == equipe_id)
        .first()
    )

    if not equipe:
        raise ValueError("Equipe não encontrada")

    membros_adicionados = []

    for aluno_id in aluno_ids:

        aluno = (
            db.query(Aluno)
            .filter(Aluno.id == aluno_id)
            .first()
        )

        if not aluno:
            raise ValueError(
                f"Aluno {aluno_id} não encontrado"
            )

        membro_existente = (
            db.query(AlunoEquipe)
            .filter(
                AlunoEquipe.equipe_id == equipe_id,
                AlunoEquipe.aluno_id == aluno_id
            )
            .first()
        )

        if membro_existente:
            continue

        membro = AlunoEquipe(
            equipe_id=equipe_id,
            aluno_id=aluno_id
        )

        db.add(membro)
        membros_adicionados.append(membro)

    db.commit()

    return {
        "message": "Membros adicionados com sucesso",
        "quantidade": len(membros_adicionados)
    }