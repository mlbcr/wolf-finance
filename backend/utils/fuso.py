from datetime import datetime, date
from zoneinfo import ZoneInfo


FUSO_BRASIL = ZoneInfo("America/Sao_Paulo")


def agora() -> datetime:
    """Retorna a data e hora atual no fuso de São Paulo."""
    return datetime.now(FUSO_BRASIL)


def hoje() -> date:
    """Retorna a data atual no fuso de São Paulo."""
    return agora().date()