import { API_URL } from './api'


// ============================================================
// GERAR QR CODE DA SALA
// ============================================================

export async function gerarQRCodeSala() {

    const token =
        localStorage.getItem('token')


    const response = await fetch(
        `${API_URL}/qrcodes/sala`,
        {
            method: 'POST',

            headers: {
                Authorization:
                    `Bearer ${token}`
            }
        }
    )


    if (!response.ok) {

        throw new Error(
            'Erro ao gerar QR Code da sala'
        )

    }


    const imagem =
        await response.blob()


    const codigo =
        response.headers.get(
            'X-QRCode-Codigo'
        )


    const id =
        response.headers.get(
            'X-QRCode-ID'
        )


    const dataLimite =
        response.headers.get(
            'X-QRCode-Data-Limite'
        )


    return {
        imagem,
        codigo,
        id,
        dataLimite
    }

}


// ============================================================
// GERAR QR CODE DA REUNIÃO
// ============================================================

export async function gerarQRCodeReuniao(
    reuniaoId
) {

    const token =
        localStorage.getItem('token')


    const response = await fetch(
        `${API_URL}/qrcodes/reuniao/${reuniaoId}`,
        {
            method: 'POST',

            headers: {
                Authorization:
                    `Bearer ${token}`
            }
        }
    )


    if (!response.ok) {

        const erro =
            await response.json()
                .catch(() => null)


        throw new Error(
            erro?.detail ||
            'Erro ao gerar QR Code da reunião'
        )

    }


    const imagem =
        await response.blob()


    const codigo =
        response.headers.get(
            'X-QRCode-Codigo'
        )


    const id =
        response.headers.get(
            'X-QRCode-ID'
        )


    const dataLimite =
        response.headers.get(
            'X-QRCode-Data-Limite'
        )


    return {
        imagem,
        codigo,
        id,
        dataLimite
    }

}


// ============================================================
// LISTAR QR CODES ATIVOS
// ============================================================

export async function listarQRCodesAtivos() {

    const token =
        localStorage.getItem('token')


    const response = await fetch(
        `${API_URL}/qrcodes/`,
        {
            headers: {
                Authorization:
                    `Bearer ${token}`
            }
        }
    )


    if (!response.ok) {

        throw new Error(
            'Erro ao listar QR Codes'
        )

    }


    return response.json()

}


// ============================================================
// INVALIDAR QR CODE
// ============================================================

export async function invalidarQRCode(
    codigo
) {

    const token =
        localStorage.getItem('token')


    const response = await fetch(
        `${API_URL}/qrcodes/${codigo}/invalidar`,
        {
            method: 'POST',

            headers: {
                'Content-Type':
                    'application/json',

                Authorization:
                    `Bearer ${token}`
            }
        }
    )


    if (!response.ok) {

        throw new Error(
            'Erro ao invalidar QR Code'
        )

    }


    return response.json()

}