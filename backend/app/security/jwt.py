from datetime import datetime, timedelta, timezone
import os
import jwt
from dotenv import load_dotenv

load_dotenv()
SECRET_KEY = os.getenv("JWT_PASS")

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
from app.utils.fuso import agora, hoje

def criar_token(usuario_id: str):
    expiracao = agora()(timezone.utc) + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    payload = {
        "sub": usuario_id,
        "exp": expiracao
    }

    return jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM
    )


def decodificar_token(token: str):
    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        return payload

    except jwt.InvalidTokenError as e:
        print(
            "ERRO AO DECODIFICAR TOKEN:",
            type(e).__name__,
            str(e)
        )

        return None