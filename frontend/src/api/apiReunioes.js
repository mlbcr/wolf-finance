import { API_URL } from './api'

// ============================================================
// LISTAR REUNIÕES
// ============================================================

export async function listarReunioes(equipeId = null) {
    const token = localStorage.getItem('token')

    let url = `${API_URL}/reunioes/`

    if (equipeId) {
        url += `?equipe_id=${equipeId}`
    }

    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })

    if (!response.ok) {
        throw new Error('Erro ao buscar reuniões')
    }

    return response.json()
}


// ============================================================
// LISTAR REUNIÕES POR PERÍODO
// ============================================================

export async function listarReunioesForPeriodo(
    dataInicio,
    dataFim,
    equipeId = null
) {
    const token = localStorage.getItem('token')

    let url =
        `${API_URL}/reunioes/data?` +
        `data_inicio=${dataInicio}&` +
        `data_fim=${dataFim}`

    if (equipeId) {
        url += `&equipe_id=${equipeId}`
    }

    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })

    if (!response.ok) {
        throw new Error('Erro ao buscar reuniões')
    }

    return response.json()
}


// ============================================================
// OBTER REUNIÃO
// ============================================================

export async function obterReuniao(reuniaoId) {
    const token = localStorage.getItem('token')

    const response = await fetch(
        `${API_URL}/reunioes/${reuniaoId}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    )

    if (!response.ok) {
        throw new Error('Erro ao obter reunião')
    }

    return response.json()
}


// ============================================================
// CRIAR REUNIÃO
// ============================================================

export async function criarReuniao(dados) {
    const token = localStorage.getItem('token')

    const response = await fetch(
        `${API_URL}/reunioes/`,
        {
            method: 'POST',

            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },

            body: JSON.stringify(dados),
        }
    )

    if (!response.ok) {
        const erro = await response.json()

        throw new Error(
            erro.detail || 'Erro ao criar reunião'
        )
    }

    return response.json()
}


// ============================================================
// ATUALIZAR REUNIÃO
// ============================================================

export async function atualizarReuniao(
    reuniaoId,
    dados
) {
    const token = localStorage.getItem('token')

    const response = await fetch(
        `${API_URL}/reunioes/${reuniaoId}`,
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

        throw new Error(
            erro.detail || 'Erro ao atualizar reunião'
        )
    }

    return response.json()
}


// ============================================================
// DELETAR REUNIÃO
// ============================================================

export async function deletarReuniao(reuniaoId) {
    const token = localStorage.getItem('token')

    const response = await fetch(
        `${API_URL}/reunioes/${reuniaoId}`,
        {
            method: 'DELETE',

            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    )

    if (!response.ok) {
        const erro = await response.json()

        throw new Error(
            erro.detail || 'Erro ao deletar reunião'
        )
    }
}


// ============================================================
// PRESENÇAS NA REUNIÃO
// ============================================================

export async function listarPresencasReuniao(
    reuniaoId
) {
    const token = localStorage.getItem('token')

    const response = await fetch(
        `${API_URL}/reunioes/${reuniaoId}/presencas`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    )

    if (!response.ok) {
        throw new Error(
            'Erro ao listar presenças da reunião'
        )
    }

    return response.json()
}