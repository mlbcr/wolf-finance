export async function fazerLogin(dados) {
    const response = await fetch(
        'http://127.0.0.1:8000/auth/login',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dados),
        }
    )

    if (!response.ok) {
        throw new Error('Usuário ou senha inválidos')
    }

    return response.json()
}

export async function buscarUsuarioLogado() {
    const token = localStorage.getItem('token')

    const response = await fetch(
        'http://127.0.0.1:8000/auth/me',
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    )

    if (!response.ok) {
        throw new Error('Não foi possível buscar o usuário')
    }

    return response.json()
}


export async function buscarMinhasEquipes() {
    const token = localStorage.getItem('token')

    const response = await fetch(
        'http://127.0.0.1:8000/equipes/minhas',
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
        `http://127.0.0.1:8000/equipes/${id}`,
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

export async function buscarMembrosEquipe(id) {
    const token = localStorage.getItem('token')

    const response = await fetch(
        `http://127.0.0.1:8000/equipes/${id}/membros`,
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

export async function criarEquipe(dados) {
    const token = localStorage.getItem('token')

    const response = await fetch(
        'http://127.0.0.1:8000/equipes/',
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

export async function buscarTodasEquipes() {
    const token = localStorage.getItem('token')

    const response = await fetch(
        'http://127.0.0.1:8000/equipes/',
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

export async function atualizarEquipe(id, dados) {
    const token = localStorage.getItem('token')

    const response = await fetch(
        `http://127.0.0.1:8000/equipes/${id}`,
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