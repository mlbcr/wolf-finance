import os
import smtplib

from email.message import EmailMessage
from email.utils import make_msgid
from dotenv import load_dotenv

load_dotenv()


def enviar_email(
    email: str,
    assunto: str,
    corpo_html: str
):
    remetente = os.getenv("EMAIL_REMETENTE")
    senha = os.getenv("EMAIL_SENHA")

    mensagem = EmailMessage()

    mensagem["From"] = remetente
    mensagem["To"] = email
    mensagem["Subject"] = assunto

    mensagem.set_content(
        "Seu cliente de e-mail não suporta HTML."
    )

    # Gera os Content-ID das imagens
    logo_cid = make_msgid()
    logo_text_cid = make_msgid()

    # Remove < > para usar no HTML como cid:xxx
    logo_cid = logo_cid[1:-1]
    logo_text_cid = logo_text_cid[1:-1]

    # Aqui o template precisa receber os CIDs
    corpo_html = corpo_html(
        logo_cid=logo_cid,
        logo_text_cid=logo_text_cid
    )

    mensagem.add_alternative(
        corpo_html,
        subtype="html"
    )

    # Caminhos das imagens
    caminho_logo = os.path.join(
        os.path.dirname(__file__),
        "logo.png"
    )

    caminho_logo_texto = os.path.join(
        os.path.dirname(__file__),
        "logo_texto.png"
    )

    with open(caminho_logo, "rb") as arquivo:
        mensagem.get_payload()[1].add_related(
            arquivo.read(),
            maintype="image",
            subtype="png",
            cid=f"<{logo_cid}>"
        )

    with open(caminho_logo_texto, "rb") as arquivo:
        mensagem.get_payload()[1].add_related(
            arquivo.read(),
            maintype="image",
            subtype="png",
            cid=f"<{logo_text_cid}>"
        )

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
        smtp.login(remetente, senha)
        smtp.send_message(mensagem)