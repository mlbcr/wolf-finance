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
import traceback


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
    print("========================================")
    print("INICIANDO RECUPERAÇÃO DE SENHA")
    print("LOGIN RECEBIDO:", dados.login)
    print("========================================")

    try:

        # =========================================
        # 1. BUSCAR ALUNO
        # =========================================

        print("1. Buscando aluno...")

        aluno = (
            db.query(Aluno)
            .filter(
                (Aluno.email == dados.login) |
                (Aluno.matricula == dados.login)
            )
            .first()
        )

        if not aluno:
            print("ERRO: aluno não encontrado")

            raise HTTPException(
                status_code=404,
                detail="Usuário não encontrado"
            )

        print("Aluno encontrado:", aluno.nome_completo)
        print("Email:", aluno.email)


        # =========================================
        # 2. BUSCAR USUARIO
        # =========================================

        print("2. Buscando usuário...")

        usuario = (
            db.query(Usuario)
            .filter(
                Usuario.aluno_id == aluno.id
            )
            .first()
        )

        if not usuario:
            print("ERRO: usuário não possui conta")

            raise HTTPException(
                status_code=404,
                detail="Usuário não possui conta"
            )

        print("Usuário encontrado:", usuario.id)


        # =========================================
        # 3. GERAR NOVA SENHA
        # =========================================

        print("3. Gerando nova senha...")

        nova_senha = gerar_senha_temporaria()

        print("Nova senha gerada")


        # =========================================
        # 4. GERAR HASH
        # =========================================

        print("4. Gerando hash...")

        novo_hash = gerar_hash(nova_senha)

        print("Hash gerado")


        # =========================================
        # 5. ALTERAR SENHA
        # =========================================

        print("5. Alterando senha no objeto...")

        usuario.senha_hash = novo_hash

        print("Senha alterada no objeto")


        # =========================================
        # 6. GERAR HTML
        # =========================================

        print("6. Gerando HTML do email...")

        corpo_html = template_recuperar_senha(
            nome=aluno.nome_completo,
            senha=nova_senha,
            logo_cid="logo-wolf",
            logo_text_cid="logo-wolf-text"
        )

        print("HTML gerado com sucesso")


        # =========================================
        # 7. ENVIAR EMAIL
        # =========================================

        print("7. Enviando email...")
        print("DESTINATÁRIO:", aluno.email)

        resposta_email = enviar_email(
            email=aluno.email,
            assunto="Nova senha — Wolf Finance",
            corpo_html=corpo_html
        )

        print("EMAIL ENVIADO")
        print("RESPOSTA RESEND:", resposta_email)


        # =========================================
        # 8. COMMIT
        # =========================================

        print("8. Salvando nova senha no banco...")

        db.commit()

        print("COMMIT REALIZADO")


        # =========================================
        # 9. RETORNO
        # =========================================

        print("RECUPERAÇÃO CONCLUÍDA COM SUCESSO")
        print("========================================")

        return {
            "message": "Uma nova senha foi enviada para o e-mail cadastrado."
        }

    except HTTPException:
        raise

    except Exception as e:

        print("========================================")
        print("ERRO NA RECUPERAÇÃO DE SENHA")
        print("TIPO:", type(e).__name__)
        print("ERRO:", str(e))
        print("========================================")

        traceback.print_exc()

        db.rollback()

        raise HTTPException(
            status_code=500,
            detail="Erro interno ao recuperar senha"
        )