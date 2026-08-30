from datetime import datetime
from zoneinfo import ZoneInfo

FUSO_BRASIL = ZoneInfo("America/Sao_Paulo")


def agora():
    return datetime.now(FUSO_BRASIL)


def hoje():
    return agora().date()