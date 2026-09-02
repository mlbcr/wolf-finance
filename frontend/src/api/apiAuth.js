import { API_URL } from './api'

export async function fazerLogin(dados) {
    const response = await fetch(
        `${API_URL}/auth/login`,
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
        `${API_URL}/auth/me`,
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

export async function mudarSenha(senhaAtual, novaSenha) {
    const token = localStorage.getItem('token')

    const response = await fetch(
        `${API_URL}/auth/mudar-senha`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                senha_atual: senhaAtual,
                nova_senha: novaSenha,
            }),
        }
    )

    if (!response.ok) {
        const erro = await response.json().catch(() => ({}))
        throw new Error(
            erro.detail ||
            erro.message ||
            'Não foi possível mudar a senha'
        )
    }

    return response.json()
}