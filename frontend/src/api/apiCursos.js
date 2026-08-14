const API_URL = 'http://127.0.0.1:8000'

export async function buscarCursos() {
    const response = await fetch(
        `${API_URL}/cursos/`
    )

    if (!response.ok) {
        throw new Error('Não foi possível buscar os cursos')
    }

    return response.json()
}