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

    # =========================================
    # 1. GERAR SENHA
    # =========================================

    nova_senha = gerar_senha_temporaria()

    print("========================================")
    print("RECUPERAÇÃO DE SENHA")
    print("NOVA SENHA:", nova_senha)


    # =========================================
    # 2. GERAR HASH
    # =========================================

    novo_hash = gerar_hash(nova_senha)

    print("HASH GERADO:", novo_hash)


    # =========================================
    # 3. ALTERAR SENHA
    # =========================================

    usuario.senha_hash = novo_hash

    print("HASH NO OBJETO:", usuario.senha_hash)


    # =========================================
    # 4. SALVAR NO BANCO
    # =========================================

    try:

        db.commit()

        print("COMMIT REALIZADO")

    except Exception as erro:

        db.rollback()

        print("ERRO NO COMMIT:", repr(erro))

        raise HTTPException(
            status_code=500,
            detail="Erro ao salvar nova senha"
        )


    # =========================================
    # 5. GERAR EMAIL
    # =========================================

    corpo_html = template_recuperar_senha(
        nome=aluno.nome_completo,
        senha=nova_senha,
        logo_cid="logo-wolf",
        logo_text_cid="logo-wolf-text"
    )


    # =========================================
    # 6. ENVIAR EMAIL
    # =========================================

    try:

        resposta = enviar_email(
            email=aluno.email,
            assunto="Nova senha — Wolf Finance",
            corpo_html=corpo_html
        )

        print("EMAIL ENVIADO:", resposta)

    except Exception as erro:

        print("ERRO AO ENVIAR EMAIL:", repr(erro))

        # A senha JÁ foi salva.
        # Não fazemos rollback aqui.

        raise HTTPException(
            status_code=500,
            detail="Senha alterada, mas houve erro ao enviar o e-mail"
        )


    print("RECUPERAÇÃO CONCLUÍDA")
    print("========================================")


    return {
        "message": "Uma nova senha foi enviada para o e-mail cadastrado."
    }