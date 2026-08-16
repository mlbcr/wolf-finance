from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.models.aluno import Aluno
from app.models.usuario import Usuario
from app.schemas.auth import LoginRequest, RecuperarSenhaRequest

from app.security.password import verificar_senha, gerar_hash
from app.security.jwt import criar_token

from utils.email.email_util import enviar_email
from utils.email.templates import template_recuperar_senha

import secrets
import string


def gerar_senha_temporaria(tamanho=10):
    caracteres = string.ascii_letters + string.digits

    return "".join(
        secrets.choice(caracteres)
        for _ in range(tamanho)
    )


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
        .filter(
            Usuario.aluno_id == aluno.id
        )
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

    usuario = (
        db.query(Usuario)
        .filter(
            Usuario.aluno_id == aluno.id
        )
        .first()
    )

    if not usuario:
        raise HTTPException(
            status_code=404,
            detail="Usuário não possui conta"
        )

    nova_senha = gerar_senha_temporaria()

    usuario.senha_hash = gerar_hash(nova_senha)

    corpo_html = template_recuperar_senha(
        nome=aluno.nome_completo,
        senha=nova_senha,
        logo_cid="logo-wolf",
        logo_text_cid="logo-wolf-text"
    )

    enviar_email(
        email=aluno.email,
        assunto="Nova senha — Wolf Finance",
        corpo_html=corpo_html
    )

    db.commit()

    return {
        "message": "Uma nova senha foi enviada para o e-mail cadastrado."
    }