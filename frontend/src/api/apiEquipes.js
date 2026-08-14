import { API_URL } from './api'

export async function buscarMinhasEquipes() {
    const token = localStorage.getItem('token')

    const response = await fetch(
        `${API_URL}/equipes/minhas`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    )

    if (!response.ok) {
        throw new Error('Não foi possível buscar as equipes')
    }

    return response.json()
}

export async function buscarTodasEquipes() {
    const token = localStorage.getItem('token')

    const response = await fetch(
        `${API_URL}/equipes/`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    )

    if (!response.ok) {
        throw new Error('Não foi possível buscar as equipes')
    }

    return response.json()
}

export async function buscarEquipe(id) {
    const token = localStorage.getItem('token')

    const response = await fetch(
        `${API_URL}/equipes/${id}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    )

    if (!response.ok) {
        throw new Error('Não foi possível buscar a equipe')
    }

    return response.json()
}

export async function criarEquipe(dados) {
    const token = localStorage.getItem('token')

    const response = await fetch(
        `${API_URL}/equipes/`,
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
        throw new Error('Não foi possível criar a equipe')
    }

    return response.json()
}

export async function atualizarEquipe(id, dados) {
    const token = localStorage.getItem('token')

    const response = await fetch(
        `${API_URL}/equipes/${id}`,
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
        throw new Error('Não foi possível atualizar a equipe')
    }

    return response.json()
}

export async function buscarMembrosEquipe(id) {
    const token = localStorage.getItem('token')

    const response = await fetch(
        `${API_URL}/equipes/${id}/membros`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    )

    if (!response.ok) {
        throw new Error('Não foi possível buscar os membros')
    }

    return response.json()
}

export async function adicionarMembrosEquipe(equipeId, alunoIds) {
    const token = localStorage.getItem('token')

    const response = await fetch(
        `${API_URL}/equipes/${equipeId}/membros`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                aluno_ids: alunoIds
            })
        }
    )

    if (!response.ok) {
        throw new Error('Erro ao adicionar membros')
    }

    return response.json()
}

export async function removerMembroEquipe(equipeId, alunoId) {
    const token = localStorage.getItem('token')

    const response = await fetch(
        `${API_URL}/equipes/${equipeId}/membros/${alunoId}`,
        {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )

    if (!response.ok) {
        throw new Error('Não foi possível remover o membro')
    }

    return response.json()
}

export async function buscarEquipesAluno(alunoId) {
    const token = localStorage.getItem('token')

    const response = await fetch(
        `${API_URL}/alunos/${alunoId}/equipes`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    )

    if (!response.ok) {
        throw new Error(
            'Não foi possível buscar as equipes do aluno'
        )
    }

    return response.json()
}

