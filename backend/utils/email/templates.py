def template_email_cadastro(
    nome: str,
    matricula: str,
    email: str,
    senha: str,
    logo_cid: str,
    logo_text_cid: str
) -> str:

    return f"""
<!DOCTYPE html>
<html lang="pt-BR">

<head>
    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <title>Wolf Finance</title>
</head>

<body style="
    margin: 0;
    padding: 0;
    background-color: #eef0f7;
    font-family: Arial, Helvetica, sans-serif;
">

    <div style="
        width: 100%;
        padding: 35px 0;
        background-color: #eef0f7;
    ">

        <div style="
            width: 100%;
            max-width: 620px;
            margin: 0 auto;
            background-color: #ffffff;
            overflow: hidden;
            border-radius: 14px;
            border: 1px solid #dfe3ee;
        ">

            <!-- CABEÇALHO -->

            <div style="
                width: 100%;
                padding: 12px 0;
                margin: 0;
                background-color: #141345;
                text-align: center;
            ">

                <img
                    src="cid:{logo_text_cid}"
                    alt="Wolf Finance"
                    style="
                        display: block;
                        width: 280px;
                        max-width: 80%;
                        height: auto;
                        margin: 0 auto;
                        border: 0;
                    "
                >

            </div>


            <!-- CONTEÚDO -->

            <div style="
                padding: 42px 45px 40px 45px;
            ">

                <p style="
                    margin: 0 0 8px 0;
                    color: #666b82;
                    font-size: 12px;
                    font-weight: bold;
                    letter-spacing: 1.5px;
                    text-transform: uppercase;
                ">
                    ACESSO AO SISTEMA
                </p>


                <h1 style="
                    margin: 0 0 18px 0;
                    color: #171a4d;
                    font-size: 26px;
                    line-height: 1.3;
                    font-weight: 700;
                ">
                    Olá, {nome}
                </h1>


                <p style="
                    margin: 0 0 16px 0;
                    color: #505568;
                    font-size: 15px;
                    line-height: 1.7;
                ">
                    Seu acesso ao sistema da
                    <strong style="color: #171a4d;">
                        Wolf Finance
                    </strong>
                    foi criado com sucesso.
                </p>


                <p style="
                    margin: 0 0 30px 0;
                    color: #505568;
                    font-size: 15px;
                    line-height: 1.7;
                ">
                    Você poderá acessar o sistema utilizando
                    seu e-mail ou sua matrícula.
                </p>


                <!-- CREDENCIAIS -->

                <div style="
                    padding: 25px;
                    background-color: #f6f7fb;
                    border: 1px solid #e1e4ed;
                    border-radius: 10px;
                ">

                    <p style="
                        margin: 0 0 20px 0;
                        color: #171a4d;
                        font-size: 15px;
                        font-weight: bold;
                    ">
                        Dados de acesso
                    </p>

                    <table style="
                        width: 100%;
                        border-collapse: collapse;
                    ">

                        <tr>

                            <td style="
                                padding: 9px 0;
                                color: #73788d;
                                font-size: 14px;
                                width: 40%;
                                vertical-align: top;
                            ">
                                Matrícula
                            </td>

                            <td style="
                                padding: 9px 0;
                                color: #20243f;
                                font-size: 14px;
                                font-weight: 600;
                                vertical-align: top;
                            ">
                                {matricula}
                            </td>

                        </tr>


                        <tr>

                            <td style="
                                padding: 9px 0;
                                color: #73788d;
                                font-size: 14px;
                                vertical-align: top;
                            ">
                                E-mail
                            </td>

                            <td style="
                                padding: 9px 0;
                                color: #20243f;
                                font-size: 14px;
                                font-weight: 600;
                                word-break: break-word;
                                vertical-align: top;
                            ">
                                {email}
                            </td>

                        </tr>


                        <tr>

                            <td style="
                                padding: 9px 0;
                                color: #73788d;
                                font-size: 14px;
                                vertical-align: top;
                            ">
                                Senha
                            </td>

                            <td style="
                                padding: 9px 0;
                                vertical-align: top;
                            ">

                                <span style="
                                    display: inline-block;
                                    padding: 8px 11px;
                                    background-color: #ffffff;
                                    border: 1px solid #d4d8e3;
                                    border-radius: 6px;
                                    color: #20243f;
                                    font-family: monospace;
                                    font-size: 14px;
                                    letter-spacing: 0.5px;
                                ">
                                    {senha}
                                </span>

                            </td>

                        </tr>

                    </table>

                </div>


                <!-- AVISO -->

                <div style="
                    margin-top: 24px;
                    padding: 16px 18px;
                    background-color: #f8f8fb;
                    border-left: 3px solid #171a4d;
                ">

                    <p style="
                        margin: 0;
                        color: #555a6e;
                        font-size: 13px;
                        line-height: 1.6;
                    ">
                        Recomendamos que você
                        <strong style="color: #171a4d;">
                            altere sua senha
                        </strong>
                        após o primeiro acesso.
                    </p>

                </div>


                <p style="
                    margin: 28px 0 0 0;
                    color: #74798d;
                    font-size: 13px;
                    line-height: 1.6;
                ">
                    Caso você não esperasse receber este e-mail,
                    entre em contato com o RH da Wolf Finance.
                </p>

            </div>


            <!-- FOOTER -->

            <div style="
                padding: 32px 45px;
                background-color: #101347;
                border-top: 1px solid #0b0d38;
            ">

                <p style="
                    margin: 0 0 22px 0;
                    color: #ffffff;
                    font-size: 14px;
                    line-height: 1.6;
                ">
                    Atenciosamente,<br>

                    <strong>
                        Equipe Wolf Finance
                    </strong>
                </p>


                <img
                    src="cid:{logo_cid}"
                    alt="Wolf Finance"
                    width="85"
                    style="
                        display: block;
                        width: 85px;
                        max-width: 85px;
                        height: auto;
                        margin: 0 0 20px 0;
                        border: 0;
                    "
                >


                <p style="
                    margin: 0;
                    color: #d8daea;
                    font-size: 13px;
                    line-height: 1.7;
                ">

                    <strong style="color: #ffffff;">
                        Liga de Investimentos do CEFET/RJ
                    </strong>

                    <br>

                    Avenida Maracanã, 229 - Maracanã

                    <br>

                    Rio de Janeiro/RJ

                </p>


                <p style="
                    margin: 12px 0 0 0;
                    font-size: 13px;
                ">

                    <a
                        href="mailto:wolf.financerj@gmail.com"
                        style="
                            color: #c8cbe0;
                            text-decoration: none;
                        "
                    >
                        wolf.financerj@gmail.com
                    </a>

                </p>

            </div>


            <div style="
                padding: 14px 30px;
                background-color: #0b0d38;
                text-align: center;
            ">

                <p style="
                    margin: 0;
                    color: #9296b3;
                    font-size: 10px;
                    line-height: 1.5;
                ">
                    Este é um e-mail automático enviado pelo
                    sistema da Wolf Finance.
                </p>

            </div>

        </div>

    </div>

</body>

</html>
"""


def template_recuperar_senha(
    nome: str,
    senha: str,
    logo_cid: str,
    logo_text_cid: str
) -> str:

    return f"""
<!DOCTYPE html>
<html lang="pt-BR">

<head>
    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <title>Nova senha - Wolf Finance</title>
</head>

<body style="
    margin: 0;
    padding: 0;
    background-color: #eef0f7;
    font-family: Arial, Helvetica, sans-serif;
">

    <div style="
        width: 100%;
        padding: 35px 0;
        background-color: #eef0f7;
    ">

        <div style="
            width: 100%;
            max-width: 620px;
            margin: 0 auto;
            background-color: #ffffff;
            overflow: hidden;
            border-radius: 14px;
            border: 1px solid #dfe3ee;
        ">

            <!-- CABEÇALHO -->

            <div style="
                width: 100%;
                padding: 12px 0;
                background-color: #141345;
                text-align: center;
            ">

                <img
                    src="cid:{logo_text_cid}"
                    alt="Wolf Finance"
                    style="
                        display: block;
                        width: 280px;
                        max-width: 80%;
                        height: auto;
                        margin: 0 auto;
                        border: 0;
                    "
                >

            </div>


            <!-- CONTEÚDO -->

            <div style="
                padding: 42px 45px 40px 45px;
            ">

                <p style="
                    margin: 0 0 8px 0;
                    color: #666b82;
                    font-size: 12px;
                    font-weight: bold;
                    letter-spacing: 1.5px;
                    text-transform: uppercase;
                ">
                    RECUPERAÇÃO DE SENHA
                </p>


                <h1 style="
                    margin: 0 0 18px 0;
                    color: #171a4d;
                    font-size: 26px;
                    line-height: 1.3;
                    font-weight: 700;
                ">
                    Olá, {nome}
                </h1>


                <p style="
                    margin: 0 0 16px 0;
                    color: #505568;
                    font-size: 15px;
                    line-height: 1.7;
                ">
                    Recebemos uma solicitação para
                    <strong style="color: #171a4d;">
                        redefinir a senha
                    </strong>
                    da sua conta na Wolf Finance.
                </p>


                <p style="
                    margin: 0 0 30px 0;
                    color: #505568;
                    font-size: 15px;
                    line-height: 1.7;
                ">
                    Uma nova senha foi gerada para sua conta.
                    Utilize os dados abaixo para realizar o acesso.
                </p>


                <!-- NOVA SENHA -->

                <div style="
                    padding: 25px;
                    background-color: #f6f7fb;
                    border: 1px solid #e1e4ed;
                    border-radius: 10px;
                ">

                    <p style="
                        margin: 0 0 12px 0;
                        color: #73788d;
                        font-size: 13px;
                    ">
                        Sua nova senha
                    </p>


                    <div style="
                        text-align: center;
                    ">

                        <span style="
                            display: inline-block;
                            padding: 13px 20px;
                            background-color: #ffffff;
                            border: 1px solid #d4d8e3;
                            border-radius: 8px;
                            color: #20243f;
                            font-family: monospace;
                            font-size: 20px;
                            font-weight: bold;
                            letter-spacing: 1px;
                        ">
                            {senha}
                        </span>

                    </div>

                </div>


                <!-- AVISO DE SEGURANÇA -->

                <div style="
                    margin-top: 24px;
                    padding: 16px 18px;
                    background-color: #f8f8fb;
                    border-left: 3px solid #171a4d;
                ">

                    <p style="
                        margin: 0;
                        color: #555a6e;
                        font-size: 13px;
                        line-height: 1.6;
                    ">
                        Por segurança, recomendamos que você
                        <strong style="color: #171a4d;">
                            altere esta senha
                        </strong>
                        após entrar no sistema.
                    </p>

                </div>


                <p style="
                    margin: 28px 0 0 0;
                    color: #74798d;
                    font-size: 13px;
                    line-height: 1.6;
                ">
                    Se você não solicitou a recuperação da senha,
                    entre em contato com o RH da Wolf Finance.
                </p>

            </div>


            <!-- FOOTER -->

            <div style="
                padding: 32px 45px;
                background-color: #101347;
                border-top: 1px solid #0b0d38;
            ">

                <p style="
                    margin: 0 0 22px 0;
                    color: #ffffff;
                    font-size: 14px;
                    line-height: 1.6;
                ">
                    Atenciosamente,<br>

                    <strong>
                        Equipe Wolf Finance
                    </strong>
                </p>


                <img
                    src="cid:{logo_cid}"
                    alt="Wolf Finance"
                    width="85"
                    style="
                        display: block;
                        width: 85px;
                        max-width: 85px;
                        height: auto;
                        margin: 0 0 20px 0;
                        border: 0;
                    "
                >


                <p style="
                    margin: 0;
                    color: #d8daea;
                    font-size: 13px;
                    line-height: 1.7;
                ">

                    <strong style="color: #ffffff;">
                        Liga de Investimentos do CEFET/RJ
                    </strong>

                    <br>

                    Avenida Maracanã, 229 - Maracanã

                    <br>

                    Rio de Janeiro/RJ

                </p>


                <p style="
                    margin: 12px 0 0 0;
                    font-size: 13px;
                ">

                    <a
                        href="mailto:wolf.financerj@gmail.com"
                        style="
                            color: #c8cbe0;
                            text-decoration: none;
                        "
                    >
                        wolf.financerj@gmail.com
                    </a>

                </p>

            </div>


            <!-- RODAPÉ FINAL -->

            <div style="
                padding: 14px 30px;
                background-color: #0b0d38;
                text-align: center;
            ">

                <p style="
                    margin: 0;
                    color: #9296b3;
                    font-size: 10px;
                    line-height: 1.5;
                ">
                    Este é um e-mail automático enviado pelo
                    sistema da Wolf Finance.
                </p>

            </div>

        </div>

    </div>

</body>

</html>
"""