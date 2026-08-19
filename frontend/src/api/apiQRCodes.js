import { API_URL } from './api'

// ============================================================
// GERAR QR CODE
// ============================================================

export async function gerarQRCodeSala() {
    const token = localStorage.getItem('token')

    const response = await fetch(
        `${API_URL}/qrcodes/sala`,
        {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    )

    if (!response.ok) {
        throw new Error('Erro ao gerar QR Code da sala')
    }

    // Retorna a imagem como blob
    return response.blob()
}

export async function gerarQRCodeReuniao(reuniaoId) {
    const token = localStorage.getItem('token')

    const response = await fetch(
        `${API_URL}/qrcodes/reuniao/${reuniaoId}`,
        {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    )

    if (!response.ok) {
        throw new Error('Erro ao gerar QR Code da reunião')
    }

    // Retorna a imagem como blob
    return response.blob()
}

// ============================================================
// LISTAR QR CODES ATIVOS
// ============================================================

export async function listarQRCodesAtivos() {
    const token = localStorage.getItem('token')

    const response = await fetch(
        `${API_URL}/qrcodes/`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    )

    if (!response.ok) {
        throw new Error('Erro ao listar QR Codes')
    }

    return response.json()
}

// ============================================================
// INVALIDAR QR CODE
// ============================================================

export async function invalidarQRCode(codigo) {
    const token = localStorage.getItem('token')

    const response = await fetch(
        `${API_URL}/qrcodes/${codigo}/invalidar`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        }
    )

    if (!response.ok) {
        throw new Error('Erro ao invalidar QR Code')
    }

    return response.json()
}
