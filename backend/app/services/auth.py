from sqlalchemy.orm import Session

from app.models.aluno import Aluno
from app.models.usuario import Usuario
from app.schemas.auth import LoginRequest
from app.security.password import verificar_senha
from app.security.jwt import criar_token

from utils.email.email_util import enviar_email
from utils.email.templates import template_recuperar_senha

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


from app.schemas.auth import RecuperarSenhaRequest


def solicitar_recuperacao_senha(
    dados: RecuperarSenhaRequest,
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
        raise HTTPException(
            status_code=404,
            detail="Usuário não encontrado"
        )

    # Por enquanto, apenas para testar o template.
    # Depois vamos gerar o token de recuperação.
    link_recuperacao = (
        "https://gowolffinance.vercel.app/redefinir-senha"
    )

    corpo_html = template_recuperar_senha(
        nome=aluno.nome_completo,
        link_recuperacao=link_recuperacao,
        logo_cid="logo_cid",
        logo_text_cid="logo_text_cid"
    )

    enviar_email(
        email=aluno.email,
        assunto="Recuperação de senha — Wolf Finance",
        corpo_html=corpo_html
    )

    return {
        "message": (
            "Se os dados estiverem cadastrados, "
            "um e-mail será enviado."
        )
    }