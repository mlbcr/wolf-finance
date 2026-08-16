import os
import base64

import resend
from dotenv import load_dotenv

load_dotenv()


def enviar_email(
    email: str,
    assunto: str,
    corpo_html: str
):
    api_key = os.getenv("RESEND_API_KEY")
    remetente = os.getenv("EMAIL_REMETENTE")

    if not api_key:
        raise RuntimeError("RESEND_API_KEY não configurada")

    if not remetente:
        raise RuntimeError("EMAIL_REMETENTE não configurado")

    resend.api_key = api_key

    logo_cid = "logo-wolf"
    logo_text_cid = "logo-wolf-text"

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
        logo_base64 = base64.b64encode(
            arquivo.read()
        ).decode("utf-8")

    with open(caminho_logo_texto, "rb") as arquivo:
        logo_text_base64 = base64.b64encode(
            arquivo.read()
        ).decode("utf-8")

    resposta = resend.Emails.send({
        "from": remetente,
        "to": [email],
        "subject": assunto,
        "html": corpo_html,
        "attachments": [
            {
                "filename": "logo.png",
                "content": logo_base64,
                "content_id": logo_cid,
                "content_type": "image/png"
            },
            {
                "filename": "logo-text.png",
                "content": logo_text_base64,
                "content_id": logo_text_cid,
                "content_type": "image/png"
            }
        ]
    })

    return resposta