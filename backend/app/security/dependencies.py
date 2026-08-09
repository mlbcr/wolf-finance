from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.security.jwt import decodificar_token


security = HTTPBearer()


def get_usuario_id(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    token = credentials.credentials

    print("TOKEN RECEBIDO:", token)

    payload = decodificar_token(token)

    print("PAYLOAD:", payload)

    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido ou expirado"
        )

    usuario_id = payload.get("sub")

    print("USUARIO ID:", usuario_id)

    if not usuario_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido"
        )

    return usuario_id