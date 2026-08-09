from sqlalchemy.orm import Session

from app.models.aluno import Aluno
from app.models.usuario import Usuario
from app.schemas.auth import LoginRequest
from app.security.password import verificar_senha
from app.security.jwt import criar_token


def autenticar_usuario(
    dados: LoginRequest,
    db: Session
):
    aluno = (
        db.query(Aluno)
        .filter(
            (Aluno.email == dados.login) |
            (Aluno.matricula == dados.login)
        )
        .first()
    )

    if not aluno:
        return None

    usuario = (
        db.query(Usuario)
        .filter(Usuario.aluno_id == aluno.id)
        .first()
    )

    if not usuario:
        return None

    if usuario.status != "ATIVO":
        return None

    if not verificar_senha(
        dados.senha,
        usuario.senha_hash
    ):
        return None

    token = criar_token(str(usuario.id))

    return {
        "access_token": token,
        "token_type": "bearer"
    }