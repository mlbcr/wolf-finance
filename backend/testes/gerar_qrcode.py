import qrcode
import os

ENV = os.getenv("ENV", "dev")

codigo = "123456"
CODIGO_QRCODE = os.getenv("CODIGO_QRCODE")

if not CODIGO_QRCODE:
    print("CODIGO_QRCODE não foi definido no .env")


if ENV == "prod":
    url = f"https://wolffinance.app/presenca/{CODIGO_QRCODE}"
    nome_arquivo = "qrcode_presenca_prod.png"
else:
    url = f"http://localhost:5173/presenca/{codigo}"
    nome_arquivo = "qrcode_presenca_dev.png"


qr = qrcode.make(url)

qr.save(nome_arquivo)

print(f"QR Code criado: {url}")
print(f"Arquivo: {nome_arquivo}")