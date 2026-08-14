from uuid import UUID

from sqlalchemy.orm import Session

from app.models.aluno import Aluno
from app.models.projeto import (
    Projeto,
    AlunoProjeto,
    EquipeProjeto
)
from app.models.equipe import Equipe
from app.schemas.projetos import (
    ProjetoCreate,
    ProjetoUpdate
)


def listar_projetos_service(
    db: Session
):
    return (
        db.query(Projeto)
        .filter(Projeto.status != "CANCELADO")
        .all()
    )

def atualizar_projeto_service(
    db: Session,
    projeto_id: UUID,
    dados: ProjetoUpdate,
    usuario_id: UUID
):
    projeto = (
        db.query(Projeto)
        .filter(Projeto.id == projeto_id)
        .first()
    )

    if not projeto:
        raise ValueError("Projeto não encontrado")

    usuario = (
        db.query(Usuario)
        .filter(Usuario.id == usuario_id)
        .first()
    )

    if not usuario:
        raise ValueError("Usuário não encontrado")

    pode_editar = (
        usuario.tipo == "ADMIN"
        or projeto.lider_id == usuario.aluno_id
    )

    if not pode_editar:
        raise PermissionError(
            "Você não tem permissão para alterar este projeto"
        )

    if dados.nome is not None:
        projeto.nome = dados.nome

    if dados.descricao is not None:
        projeto.descricao = dados.descricao

    if dados.data_inicio is not None:
        projeto.data_inicio = dados.data_inicio

    if dados.data_fim is not None:
        projeto.data_fim = dados.data_fim

    if dados.status is not None:
        projeto.status = dados.status

    db.commit()
    db.refresh(projeto)

    return projeto

def adicionar_aluno_service(
    db: Session,
    projeto_id: UUID,
    aluno_id: UUID
):
    projeto = (
        db.query(Projeto)
        .filter(Projeto.id == projeto_id)
        .first()
    )

    if not projeto:
        raise ValueError("Projeto não encontrado")

    aluno = (
        db.query(Aluno)
        .filter(Aluno.id == aluno_id)
        .first()
    )

    if not aluno:
        raise ValueError("Aluno não encontrado")

    aluno_projeto = (
        db.query(AlunoProjeto)
        .filter(
            AlunoProjeto.projeto_id == projeto_id,
            AlunoProjeto.aluno_id == aluno_id
        )
        .first()
    )

    if aluno_projeto:
        raise ValueError(
            "Aluno já pertence ao projeto"
        )

    aluno_projeto = AlunoProjeto(
        projeto_id=projeto_id,
        aluno_id=aluno_id
    )

    db.add(aluno_projeto)
    db.commit()

    return aluno_projeto

def buscar_projeto_service(
    db: Session,
    projeto_id: UUID
):
    projeto = (
        db.query(Projeto)
        .filter(Projeto.id == projeto_id)
        .first()
    )

    if not projeto:
        raise ValueError("Projeto não encontrado")

    return projeto


def criar_projeto_service(
    db: Session,
    dados: ProjetoCreate
):
    lider = (
        db.query(Aluno)
        .filter(Aluno.id == dados.lider_id)
        .first()
    )

    if not lider:
        raise ValueError("Aluno líder não encontrado")

    projeto = Projeto(
        nome=dados.nome,
        descricao=dados.descricao,
        lider_id=dados.lider_id,
        data_inicio=dados.data_inicio,
        data_fim=dados.data_fim
    )

    db.add(projeto)
    db.commit()
    db.refresh(projeto)

    return projeto

def listar_alunos_service(
    db: Session,
    projeto_id: UUID
):
    projeto = (
        db.query(Projeto)
        .filter(Projeto.id == projeto_id)
        .first()
    )

    if not projeto:
        raise ValueError("Projeto não encontrado")

    return (
        db.query(Aluno)
        .join(
            AlunoProjeto,
            Aluno.id == AlunoProjeto.aluno_id
        )
        .filter(
            AlunoProjeto.projeto_id == projeto_id
        )
        .all()
    )

def deletar_aluno_service(
    db: Session,
    projeto_id: UUID,
    aluno_id: UUID
):
    aluno_projeto = (
        db.query(AlunoProjeto)
        .filter(
            AlunoProjeto.projeto_id == projeto_id,
            AlunoProjeto.aluno_id == aluno_id
        )
        .first()
    )

    if not aluno_projeto:
        raise ValueError(
            "Aluno não pertence a este projeto"
        )

    db.delete(aluno_projeto)
    db.commit()

    return {
        "message": "Aluno removido do projeto"
    }

def listar_equipes_projeto_service(
    db: Session,
    projeto_id: UUID
):
    projeto = (
        db.query(Projeto)
        .filter(Projeto.id == projeto_id)
        .first()
    )

    if not projeto:
        raise ValueError("Projeto não encontrado")

    return (
        db.query(Equipe)
        .join(
            EquipeProjeto,
            Equipe.id == EquipeProjeto.equipe_id
        )
        .filter(
            EquipeProjeto.projeto_id == projeto_id
        )
        .all()
    )

def adicionar_equipe_service(
    db: Session,
    projeto_id: UUID,
    equipe_id: UUID
):
    projeto = (
        db.query(Projeto)
        .filter(Projeto.id == projeto_id)
        .first()
    )

    if not projeto:
        raise ValueError("Projeto não encontrado")

    equipe = (
        db.query(Equipe)
        .filter(Equipe.id == equipe_id)
        .first()
    )

    if not equipe:
        raise ValueError("Equipe não encontrada")

    existente = (
        db.query(EquipeProjeto)
        .filter(
            EquipeProjeto.projeto_id == projeto_id,
            EquipeProjeto.equipe_id == equipe_id
        )
        .first()
    )

    if existente:
        raise ValueError(
            "Equipe já pertence ao projeto"
        )

    equipe_projeto = EquipeProjeto(
        projeto_id=projeto_id,
        equipe_id=equipe_id
    )

    db.add(equipe_projeto)
    db.commit()

    return equipe_projeto

def deletar_equipe_service(
    db: Session,
    projeto_id: UUID,
    equipe_id: UUID
):
    equipe_projeto = (
        db.query(EquipeProjeto)
        .filter(
            EquipeProjeto.projeto_id == projeto_id,
            EquipeProjeto.equipe_id == equipe_id
        )
        .first()
    )

    if not equipe_projeto:
        raise ValueError(
            "Equipe não pertence a este projeto"
        )

    db.delete(equipe_projeto)
    db.commit()

    return {
        "message": "Equipe removida do projeto"
    }