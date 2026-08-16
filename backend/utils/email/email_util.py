import os
import json
import base64

from email.message import EmailMessage

from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from googleapiclient.discovery import build


SCOPES = [
    "https://www.googleapis.com/auth/gmail.send"
]


def obter_credentials():

    token_json = os.getenv("GMAIL_TOKEN")

    if not token_json:
        raise RuntimeError(
            "GMAIL_TOKEN não configurada"
        )

    creds = Credentials.from_authorized_user_info(
        json.loads(token_json),
        SCOPES
    )

    if creds.expired and creds.refresh_token:
        creds.refresh(Request())

    return creds


def enviar_email(
    email: str,
    assunto: str,
    corpo_html: str
):
    email_enabled = os.getenv("EMAIL_ENABLED", "false").lower() == "true"

    if not email_enabled:
        print("Envio de e-mail desativado neste ambiente.")
        return

    creds = obter_credentials()

    service = build(
        "gmail",
        "v1",
        credentials=creds
    )

    mensagem = EmailMessage()

    mensagem["To"] = email
    mensagem["From"] = os.getenv("EMAIL_REMETENTE")
    mensagem["Subject"] = assunto

    mensagem.set_content(
        "Este e-mail contém conteúdo HTML. "
        "Abra-o em um cliente de e-mail compatível."
    )

    mensagem.add_alternative(
        corpo_html,
        subtype="html"
    )

    pasta_email = os.path.dirname(__file__)

    caminho_logo = os.path.join(
        pasta_email,
        "logo.png"
    )

    caminho_logo_texto = os.path.join(
        pasta_email,
        "logo-text.png"
    )

    with open(caminho_logo, "rb") as arquivo:
        mensagem.get_payload()[1].add_related(
            arquivo.read(),
            maintype="image",
            subtype="png",
            cid="<logo-wolf>"
        )

    with open(caminho_logo_texto, "rb") as arquivo:
        mensagem.get_payload()[1].add_related(
            arquivo.read(),
            maintype="image",
            subtype="png",
            cid="<logo-wolf-text>"
        )

    raw_message = base64.urlsafe_b64encode(
        mensagem.as_bytes()
    ).decode()

    resultado = (
        service.users()
        .messages()
        .send(
            userId="me",
            body={
                "raw": raw_message
            }
        )
        .execute()
    )

    return resultado