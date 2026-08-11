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