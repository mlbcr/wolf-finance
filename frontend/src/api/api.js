export async function buscarUsuarioLogado() {
    const token = localStorage.getItem('token')

    console.log('TOKEN:', token)

    const response = await fetch('http://127.0.0.1:8000/auth/me', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })

    console.log('STATUS:', response.status)

    if (!response.ok) {
        throw new Error('Não foi possível buscar o usuário')
    }

    return response.json()
}