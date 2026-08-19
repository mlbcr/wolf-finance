from datetime import date, datetime, timedelta
from uuid import UUID

from sqlalchemy.orm import Session
from sqlalchemy import and_

from app.models.sala_presenca import SalaPresenca
from app.models.aluno import Aluno
from app.schemas.sala_presenca import SalaPresencaUpdate


def listar_presencas_aluno_service(
    db: Session,
    aluno_id: UUID,
    data_inicio: date | None = None,
    data_fim: date | None = None
):
    query = db.query(SalaPresenca).filter(
        SalaPresenca.aluno_id == aluno_id
    )
    
    if data_inicio:
        query = query.filter(SalaPresenca.data >= data_inicio)
    
    if data_fim:
        query = query.filter(SalaPresenca.data <= data_fim)
    
    return query.order_by(SalaPresenca.data.desc()).all()


def listar_presencas_por_data_service(
    db: Session,
    data: date,
    aluno_id: UUID | None = None
):
    query = db.query(SalaPresenca).filter(
        SalaPresenca.data == data
    )
    
    if aluno_id:
        query = query.filter(SalaPresenca.aluno_id == aluno_id)
    
    return query.all()


def buscar_presenca_service(
    db: Session,
    presenca_id: UUID
):
    presenca = db.query(SalaPresenca).filter(
        SalaPresenca.id == presenca_id
    ).first()
    
    if not presenca:
        raise ValueError("Presença não encontrada")
    
    return presenca


def atualizar_presenca_service(
    db: Session,
    presenca_id: UUID,
    dados: SalaPresencaUpdate
):
    presenca = db.query(SalaPresenca).filter(
        SalaPresenca.id == presenca_id
    ).first()
    
    if not presenca:
        raise ValueError("Presença não encontrada")
    
    if dados.hora_inicio is not None:
        presenca.hora_inicio = dados.hora_inicio
    
    if dados.hora_fim is not None:
        # Validar que hora_fim é posterior a hora_inicio
        if presenca.hora_inicio and dados.hora_fim <= presenca.hora_inicio:
            raise ValueError("Hora de fim deve ser posterior à hora de início")
        presenca.hora_fim = dados.hora_fim
    
    db.commit()
    db.refresh(presenca)
    
    return presenca


def calcular_horas_semana_service(
    db: Session,
    aluno_id: UUID,
    data: date | None = None
):
    """
    Calcula o total de horas de presença na semana
    Se data não for fornecida, usa a data atual
    """
    if not data:
        data = date.today()
    
    # Pega o primeiro dia da semana (segunda-feira)
    dias_semana = data.weekday()
    data_inicio_semana = data - timedelta(days=dias_semana)
    data_fim_semana = data_inicio_semana + timedelta(days=6)
    
    presencas = db.query(SalaPresenca).filter(
        and_(
            SalaPresenca.aluno_id == aluno_id,
            SalaPresenca.data >= data_inicio_semana,
            SalaPresenca.data <= data_fim_semana,
            SalaPresenca.hora_inicio.isnot(None),
            SalaPresenca.hora_fim.isnot(None)
        )
    ).all()
    
    total_horas = 0.0
    
    for presenca in presencas:
        if presenca.hora_inicio and presenca.hora_fim:
            # Converte times em segundos
            inicio_segundos = (
                presenca.hora_inicio.hour * 3600 +
                presenca.hora_inicio.minute * 60 +
                presenca.hora_inicio.second
            )
            fim_segundos = (
                presenca.hora_fim.hour * 3600 +
                presenca.hora_fim.minute * 60 +
                presenca.hora_fim.second
            )
            
            diferenca_segundos = fim_segundos - inicio_segundos
            horas = diferenca_segundos / 3600
            total_horas += horas
    
    return round(total_horas, 2)


def deletar_presenca_service(
    db: Session,
    presenca_id: UUID
):
    presenca = db.query(SalaPresenca).filter(
        SalaPresenca.id == presenca_id
    ).first()
    
    if not presenca:
        raise ValueError("Presença não encontrada")
    
    db.delete(presenca)
    db.commit()
