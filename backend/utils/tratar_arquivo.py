import pandas as pd
from datetime import datetime
import io
from typing import Dict, List, Tuple


def tratar_csv_alunos(arquivo) -> pd.DataFrame:
    """
    Trata o CSV de membros da Wolf Finance e retorna um dataframe com as colunas esperadas pelo backend.
    
    Args:
        arquivo: Caminho do arquivo CSV ou BytesIO
        
    Returns:
        pd.DataFrame: DataFrame com as colunas mapeadas e validadas
    """
    # Lê o CSV pulando as primeiras 4 linhas (headers/títulos)
    df = pd.read_csv(
        arquivo,
        header=4,
        encoding="utf-8"
    )

    # Remove linhas completamente vazias
    df = df.dropna(how="all")
    
    # Remove coluna de índice se existir
    df = df.drop(columns=["Unnamed: 0"], errors="ignore")

    # Mapeamento de colunas do CSV para o modelo de Aluno
    # Usa um dicionário para renomear as colunas existentes
    rename_dict = {}
    
    for col in df.columns:
        col_stripped = col.strip() if isinstance(col, str) else col
        
        if col_stripped == "Nome":
            rename_dict[col] = "nome_completo"
        elif col_stripped == "Data de nascimento":
            rename_dict[col] = "data_nascimento"
        elif col_stripped == "Bairro/cidade que reside":
            rename_dict[col] = "bairro"
        elif col_stripped == "Celular":
            rename_dict[col] = "telefone"
        elif col_stripped == "E-mail institucional":
            rename_dict[col] = "email"
        elif col_stripped == "Matrícula":
            rename_dict[col] = "matricula"
        elif col_stripped == "Período de ingresso na liga":
            rename_dict[col] = "periodo_ingresso"
        elif col_stripped == "Situação atual":
            rename_dict[col] = "status"
        elif col_stripped == "Unnamed: 9" or col_stripped == "":
            # Coluna do curso (sem nome no CSV)
            if "curso" not in rename_dict.values():
                rename_dict[col] = "curso"
    
    # Aplica o mapeamento
    df = df.rename(columns=rename_dict)

    # Remove espaços em branco em colunas de texto
    for coluna in df.select_dtypes("object"):
        df[coluna] = df[coluna].str.strip()

    # Trata data de nascimento
    df["data_nascimento"] = pd.to_datetime(
        df["data_nascimento"],
        dayfirst=True,
        errors="coerce"
    ).dt.date

    # Extrai o semestre do período de ingresso (ex: "2025.1" de "2025.1" ou "2025.1 (Sup.)")
    df["periodo_ingresso"] = (
        df["periodo_ingresso"]
        .astype(str)
        .str.extract(r'(\d{4}\.\d)', expand=False)
    )
    
    # Converte para data usando o semestre
    df["periodo_ingresso"] = df["periodo_ingresso"].apply(
        lambda x: semestre_para_data(x) if pd.notna(x) and x else None
    )

    # Define data de ingresso na liga igual ao período de ingresso na liga
    # Se não houver período de ingresso, usa a data de hoje como fallback
    from datetime import datetime as dt_datetime
    hoje = dt_datetime.now().date()
    
    # Se periodo_ingresso for None, usa hoje
    df["periodo_ingresso"] = df["periodo_ingresso"].apply(
        lambda x: x if pd.notna(x) else hoje
    )
    
    # ingresso_liga recebe o valor de periodo_ingresso (que agora sempre tem valor)
    df["ingresso_liga"] = df["periodo_ingresso"]

    # Trata telefone - remove caracteres especiais, mas mantém números
    df["telefone"] = df["telefone"].apply(limpar_telefone)

    # Define cargo padrão se não existir
    if "cargo" not in df.columns:
        df["cargo"] = "MEMBRO"
    else:
        df["cargo"] = df["cargo"].fillna("MEMBRO").str.upper()

    # Define faz_estagio baseado no motivo de desligamento
    if "Motivo de desligamento" in df.columns:
        df["faz_estagio"] = df["Motivo de desligamento"].str.contains(
            "estágio|estágio", case=False, na=False
        )
    else:
        df["faz_estagio"] = False

    # Converte status para caixa alta (ATIVO/DESLIGADO)
    df["status"] = df["status"].str.upper()
    df["status"] = df["status"].replace({
        "ATIVO": "ATIVO",
        "DESLIGADO": "DESLIGADO",
        "INATIVO": "DESLIGADO"
    })

    # Seleciona apenas as colunas necessárias
    colunas_necessarias = [
        "nome_completo",
        "data_nascimento",
        "bairro",
        "telefone",
        "email",
        "curso",
        "matricula",
        "periodo_ingresso",
        "ingresso_liga",
        "cargo",
        "faz_estagio",
        "status"
    ]
    
    # Filtra apenas as colunas que existem
    colunas_existentes = [col for col in colunas_necessarias if col in df.columns]
    df = df[colunas_existentes]

    # Remove linhas onde o nome está vazio
    df = df[df["nome_completo"].notna() & (df["nome_completo"] != "")]
    
    # Remove linhas com dados críticos faltando
    df = df.dropna(subset=["nome_completo", "email", "data_nascimento", "matricula"])

    return df.reset_index(drop=True)


def semestre_para_data(semestre_str: str) -> datetime.date:
    """
    Converte um semestre (ex: "2025.1") para uma data.
    
    Args:
        semestre_str: String no formato YYYY.S (S = 1 ou 2)
        
    Returns:
        datetime.date: Data do primeiro dia do semestre
    """
    try:
        if pd.isna(semestre_str) or semestre_str == "":
            return None
            
        partes = str(semestre_str).strip().split(".")
        ano = int(partes[0])
        semestre = int(partes[1])
        
        # Semestre 1 = janeiro (01), Semestre 2 = julho (07)
        mes = 1 if semestre == 1 else 7
        return pd.to_datetime(f"{ano}-{mes:02d}-01").date()
    except (ValueError, IndexError, AttributeError):
        return None


def limpar_telefone(telefone_str: str) -> str:
    """
    Limpa o número de telefone, mantendo números e parênteses.
    
    Args:
        telefone_str: Número de telefone
        
    Returns:
        str: Telefone formatado
    """
    if pd.isna(telefone_str) or telefone_str == "":
        return ""
    
    telefone = str(telefone_str).strip()
    return telefone


def validar_csv(df: pd.DataFrame) -> Tuple[bool, List[str]]:
    """
    Valida se o dataframe possui as colunas obrigatórias.
    
    Args:
        df: DataFrame a validar
        
    Returns:
        Tuple[bool, List[str]]: (válido, lista de erros)
    """
    colunas_obrigatorias = [
        "nome_completo",
        "email",
        "telefone",
        "data_nascimento",
        "bairro",
        "curso",
        "matricula",
        "periodo_ingresso",
        "ingresso_liga",
        "cargo",
        "faz_estagio",
        "status"
    ]
    
    erros = []
    for coluna in colunas_obrigatorias:
        if coluna not in df.columns:
            erros.append(f"Coluna obrigatória ausente: {coluna}")
    
    return len(erros) == 0, erros


def analisar_csv(arquivo) -> None:
    """
    Trata o CSV e exibe análise dos dados.
    
    Args:
        arquivo: Caminho do arquivo CSV
    """
    df = tratar_csv_alunos(arquivo)
    
    print("\n" + "="*80)
    print("ANÁLISE DO CSV - MEMBROS DA WOLF FINANCE")
    print("="*80)
    print(f"\nTotal de registros: {len(df)}")
    print(f"Colunas: {list(df.columns)}")
    
    print(f"\n{'='*80}")
    print("PRIMEIROS 5 REGISTROS:")
    print("="*80)
    print(df.head().to_string())
    
    print(f"\n{'='*80}")
    print("INFORMAÇÕES DO DATAFRAME:")
    print("="*80)
    print(df.info())
    
    print(f"\n{'='*80}")
    print("DISTRIBUIÇÃO POR STATUS:")
    print("="*80)
    print(df["status"].value_counts())
    
    print(f"\n{'='*80}")
    print("VALORES FALTANTES:")
    print("="*80)
    print(df.isnull().sum())
    
    # Valida o CSV
    valido, erros = validar_csv(df)
    print(f"\n{'='*80}")
    print(f"VALIDAÇÃO: {'✓ APROVADO' if valido else '✗ FALHOU'}")
    print("="*80)
    if erros:
        for erro in erros:
            print(f"  - {erro}")
    else:
        print("  - Todos os campos obrigatórios estão presentes")


if __name__ == "__main__":
    arquivo = "Membros da Wolf Finance  - Visão Geral.csv"
    analisar_csv(arquivo)