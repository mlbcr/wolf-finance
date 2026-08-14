import { API_URL } from './api'

export async function buscarCursos() {
    const response = await fetch(
        `${API_URL}/cursos/`
    )

    if (!response.ok) {
        throw new Error('Não foi possível buscar os cursos')
    }

    return response.json()
}