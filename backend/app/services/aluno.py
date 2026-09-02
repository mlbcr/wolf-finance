import secrets
from uuid import UUID
from sqlalchemy.orm import Session

from app.models.aluno import Aluno
from app.models.usuario import Usuario
from app.schemas.alunos import AlunoCreate, AlunoUpdate
from app.security.password import gerar_hash
import io
import pandas as pd
from fastapi import UploadFile
from sqlalchemy.orm import Session
from utils.tratar_arquivo import tratar_csv_alunos


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


async def importar_alunos(
    arquivo: UploadFile,
    db: Session,
    extensao: str
):
    """
    Importa alunos de um arquivo CSV ou Excel para o banco de dados.
    
    Args:
        arquivo: Arquivo enviado pelo frontend
        db: Sessão do banco de dados
        extensao: Extensão do arquivo (csv ou xlsx)
        
    Returns:
        Dict com resumo da importação
    """
    conteudo = await arquivo.read()

    # Trata o CSV usando a função específica
    if extensao == "csv":
        df = tratar_csv_alunos(io.BytesIO(conteudo))
    else:
        # Para Excel, também usa a função de tratamento do CSV (que lê como CSV)
        df = tratar_csv_alunos(io.BytesIO(conteudo))

    # Valida se as colunas obrigatórias existem
    colunas_obrigatorias = [
        "nome_completo",
        "email",
        "telefone",
        "matricula",
        "data_nascimento",
        "bairro",
        "curso",
        "cargo",
        "periodo_ingresso",
        "ingresso_liga",
        "faz_estagio",
        "status"
    ]

    colunas_faltando = [
        coluna
        for coluna in colunas_obrigatorias
        if coluna not in df.columns
    ]

    if colunas_faltando:
        db.rollback()
        raise ValueError(
            f"Colunas obrigatórias ausentes: {', '.join(colunas_faltando)}"
        )

    alunos_cadastrados = []
    erros = []

    for index, linha in df.iterrows():
        numero_linha = index + 1
        nome_completo = str(linha["nome_completo"]).strip().upper()
        
        # Cria um savepoint para cada aluno, permitindo rollback individual
        savepoint = db.begin_nested()

        try:
            # Valida e limpa dados
            email = str(linha["email"]).strip().lower()
            matricula = str(linha["matricula"]).strip().upper()
            telefone = str(linha["telefone"]).strip()
            bairro = str(linha["bairro"]).strip() if pd.notna(linha["bairro"]) else ""
            curso = str(linha["curso"]).strip() if pd.notna(linha["curso"]) else ""
            cargo = str(linha["cargo"]).strip().upper() if pd.notna(linha["cargo"]) else "MEMBRO"
            status_aluno = str(linha["status"]).strip().upper() if pd.notna(linha["status"]) else "ATIVO"
            
            # Trata booleano
            faz_estagio = bool(linha["faz_estagio"]) if pd.notna(linha["faz_estagio"]) else False

            # Valida dados críticos
            if not email or "@" not in email:
                raise ValueError("Email inválido ou vazio")
            
            if not telefone:
                raise ValueError("Telefone obrigatório")
            
            if not matricula:
                raise ValueError("Matrícula obrigatória")
            
            if not pd.notna(linha["data_nascimento"]):
                raise ValueError("Data de nascimento obrigatória")
            
            if not pd.notna(linha["periodo_ingresso"]):
                raise ValueError("Período de ingresso obrigatório")
                
            if not pd.notna(linha["ingresso_liga"]):
                raise ValueError("Data de ingresso na liga obrigatória")

            # Verifica se o aluno já existe
            aluno_existente = (
                db.query(Aluno)
                .filter(
                    (Aluno.email == email)
                    | (Aluno.matricula == matricula)
                    | (Aluno.telefone == telefone)
                )
                .first()
            )

            if aluno_existente:
                erros.append({
                    "linha": numero_linha,
                    "nome": nome_completo,
                    "erro": "Aluno já cadastrado no sistema"
                })
                savepoint.rollback()
                continue

            # Cria novo aluno
            senha_inicial = secrets.token_urlsafe(12)

            novo_aluno = Aluno(
                nome_completo=nome_completo,
                email=email,
                telefone=telefone,
                matricula=matricula,
                bairro=bairro,
                curso=curso,
                data_nascimento=linha["data_nascimento"],
                cargo=cargo,
                periodo_ingresso=linha["periodo_ingresso"],
                ingresso_liga=linha["ingresso_liga"],
                faz_estagio=faz_estagio,
                status=status_aluno
            )

            db.add(novo_aluno)
            db.flush()

            # Cria usuário associado
            novo_usuario = Usuario(
                aluno_id=novo_aluno.id,
                senha_hash=gerar_hash(senha_inicial),
                tipo="MEMBRO",
                status="ATIVO"
            )

            db.add(novo_usuario)
            db.flush()

            # Commit do savepoint
            savepoint.commit()

            alunos_cadastrados.append({
                "email": novo_aluno.email,
                "nome": novo_aluno.nome_completo,
                "matricula": novo_aluno.matricula,
                "senha_inicial": senha_inicial
            })

        except Exception as error:
            # Rollback apenas do savepoint desse aluno
            savepoint.rollback()
            
            erros.append({
                "linha": numero_linha,
                "nome": nome_completo,
                "erro": str(error)
            })

    # Commit final para salvar todos os alunos que conseguiram
    try:
        db.commit()
        status_retorno = "sucesso" if len(erros) == 0 else "parcial"
    except Exception as error:
        db.rollback()
        raise ValueError(f"Erro ao finalizar importação: {str(error)}")

    return {
        "total_linhas": len(df),
        "cadastrados": len(alunos_cadastrados),
        "alunos": alunos_cadastrados,
        "erros": erros,
        "status": status_retorno
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