export const API_URL = 'https://wolf-finance.onrender.com'
export * from './apiAuth'
export * from './apiAlunos'
export * from './apiEquipes'
export * from './apiCursos'
export * from './apiProjetos'

export default async function recuperarSenha(login) {
    const response = await fetch(
        `${API_URL}/auth/recuperar-senha`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                login: login
            })
        }
    )

    if (!response.ok) {
        throw new Error('Erro ao solicitar recuperação de senha')
    }

    return response.json()
}
