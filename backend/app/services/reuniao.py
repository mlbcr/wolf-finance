from datetime import date, datetime
from uuid import UUID

from sqlalchemy.orm import Session
from app.utils.fuso import agora, hoje
from app.models.reuniao import Reuniao
from app.models.equipe import Equipe
from app.models.reuniao_presenca import ReuniaoPresenca
from app.schemas.reuniao import ReuniaoCreate, ReuniaoUpdate


def listar_reunioes_service(
    db: Session,
    equipe_id: UUID | None = None
):
    query = db.query(Reuniao)
    
    if equipe_id:
        query = query.filter(Reuniao.equipe_id == equipe_id)
    
    return query.order_by(Reuniao.data.desc()).all()


def listar_reunioes_por_data_service(
    db: Session,
    data_inicio: date,
    data_fim: date,
    equipe_id: UUID | None = None
):
    query = db.query(Reuniao).filter(
        Reuniao.data >= data_inicio,
        Reuniao.data <= data_fim
    )
    
    if equipe_id:
        query = query.filter(Reuniao.equipe_id == equipe_id)
    
    return query.order_by(Reuniao.data.asc()).all()


def buscar_reuniao_service(
    db: Session,
    reuniao_id: UUID
):
    reuniao = db.query(Reuniao).filter(
        Reuniao.id == reuniao_id
    ).first()
    
    if not reuniao:
        raise ValueError("Reunião não encontrada")
    
    return reuniao


def criar_reuniao_service(
    db: Session,
    dados: ReuniaoCreate
):

    if dados.equipe_id:

        equipe = db.query(Equipe).filter(
            Equipe.id == dados.equipe_id
        ).first()

        if not equipe:
            raise ValueError(
                "Equipe não encontrada"
            )

    if dados.hora_fim <= dados.hora_inicio:
        raise ValueError(
            "O horário de fim deve ser posterior ao horário de início"
        )

    reuniao = Reuniao(
        titulo=dados.titulo,
        descricao=dados.descricao,
        data=dados.data,
        hora_inicio=dados.hora_inicio,
        hora_fim=dados.hora_fim,
        equipe_id=dados.equipe_id
    )

    db.add(reuniao)

    db.commit()

    db.refresh(reuniao)

    return reuniao

def atualizar_reuniao_service(
    db: Session,
    reuniao_id: UUID,
    dados: ReuniaoUpdate
):

    reuniao = db.query(Reuniao).filter(
        Reuniao.id == reuniao_id
    ).first()

    if not reuniao:
        raise ValueError(
            "Reunião não encontrada"
        )

    if dados.titulo is not None:
        reuniao.titulo = dados.titulo

    if dados.descricao is not None:
        reuniao.descricao = dados.descricao

    if dados.data is not None:
        reuniao.data = dados.data

    if dados.hora_inicio is not None:
        reuniao.hora_inicio = dados.hora_inicio

    if dados.hora_fim is not None:
        reuniao.hora_fim = dados.hora_fim

    if dados.equipe_id is not None:

        equipe = db.query(Equipe).filter(
            Equipe.id == dados.equipe_id
        ).first()

        if not equipe:
            raise ValueError(
                "Equipe não encontrada"
            )

        reuniao.equipe_id = dados.equipe_id

    if reuniao.hora_fim <= reuniao.hora_inicio:
        raise ValueError(
            "O horário de fim deve ser posterior ao horário de início"
        )

    db.commit()

    db.refresh(reuniao)

    return reuniao


def deletar_reuniao_service(
    db: Session,
    reuniao_id: UUID
):

    reuniao = db.query(Reuniao).filter(
        Reuniao.id == reuniao_id
    ).first()

    if not reuniao:
        raise ValueError(
            "Reunião não encontrada"
        )

    db.delete(reuniao)

    db.commit()


def listar_presencas_reuniao_service(
    db: Session,
    reuniao_id: UUID
):
    reuniao = db.query(Reuniao).filter(
        Reuniao.id == reuniao_id
    ).first()
    
    if not reuniao:
        raise ValueError("Reunião não encontrada")
    
    presencas = db.query(ReuniaoPresenca).filter(
        ReuniaoPresenca.reuniao_id == reuniao_id
    ).all()
    
    return presencas


def registrar_presenca_reuniao_service(
    db: Session,
    aluno_id: UUID,
    reuniao_id: UUID
):
    reuniao = db.query(Reuniao).filter(
        Reuniao.id == reuniao_id
    ).first()
    
    if not reuniao:
        raise ValueError("Reunião não encontrada")
    
    presenca_existente = db.query(ReuniaoPresenca).filter(
        ReuniaoPresenca.aluno_id == aluno_id,
        ReuniaoPresenca.reuniao_id == reuniao_id
    ).first()
    
    if presenca_existente:
        raise ValueError("Aluno já registrado nesta reunião")
    
    presenca = ReuniaoPresenca(
        aluno_id=aluno_id,
        reuniao_id=reuniao_id,
        registrada_em=agora()
    )
    
    db.add(presenca)
    db.commit()
    db.refresh(presenca)
    
    return presenca
