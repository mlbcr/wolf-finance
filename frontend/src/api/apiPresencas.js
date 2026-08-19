import { API_URL } from './api'

// ============================================================
// SALA - PRESENÇA
// ============================================================

export async function registrarPresencaSala(codigo) {
    const token = localStorage.getItem('token')

    const response = await fetch(
        `${API_URL}/presencas/sala/${codigo}`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        }
    )

    if (!response.ok) {
        const erro = await response.json()
        throw new Error(erro.detail || 'Erro ao registrar presença')
    }

    return response.json()
}

export async function listarMinhasPresencas() {
    const token = localStorage.getItem('token')

    const response = await fetch(
        `${API_URL}/presencas/sala/minhas`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    )

    if (!response.ok) {
        throw new Error('Erro ao buscar presenças')
    }

    return response.json()
}

export async function obterHorasSemana() {
    const token = localStorage.getItem('token')

    const response = await fetch(
        `${API_URL}/presencas/sala/semana`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    )

    if (!response.ok) {
        throw new Error('Erro ao obter horas da semana')
    }

    return response.json()
}

export async function obterPresenca(presencaId) {
    const token = localStorage.getItem('token')

    const response = await fetch(
        `${API_URL}/presencas/sala/${presencaId}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    )

    if (!response.ok) {
        throw new Error('Erro ao obter presença')
    }

    return response.json()
}

export async function atualizarPresenca(presencaId, dados) {
    const token = localStorage.getItem('token')

    const response = await fetch(
        `${API_URL}/presencas/sala/${presencaId}`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(dados),
        }
    )

    if (!response.ok) {
        const erro = await response.json()
        throw new Error(erro.detail || 'Erro ao atualizar presença')
    }

    return response.json()
}

export async function deletarPresenca(presencaId) {
    const token = localStorage.getItem('token')

    const response = await fetch(
        `${API_URL}/presencas/sala/${presencaId}`,
        {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    )

    if (!response.ok) {
        throw new Error('Erro ao deletar presença')
    }
}

// ============================================================
// REUNIÃO - PRESENÇA
// ============================================================

export async function registrarPresencaReuniao(codigo) {
    const token = localStorage.getItem('token')

    const response = await fetch(
        `${API_URL}/presencas/reuniao/${codigo}`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        }
    )

    if (!response.ok) {
        const erro = await response.json()
        throw new Error(erro.detail || 'Erro ao registrar presença na reunião')
    }

    return response.json()
}
