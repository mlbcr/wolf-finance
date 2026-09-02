import { API_URL } from './api'

export async function buscarAlunos() {
    const token = localStorage.getItem('token')

    const response = await fetch(
        `${API_URL}/alunos/`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )

    if (!response.ok) {
        throw new Error('Erro ao buscar alunos')
    }

    return response.json()
}

export async function buscarAluno(id) {
    const token = localStorage.getItem('token')

    const response = await fetch(
        `${API_URL}/alunos/${id}`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )

    if (!response.ok) {
        throw new Error('Não foi possível buscar o aluno')
    }

    return response.json()
}

export async function importarAlunos(arquivo) {
    const token = localStorage.getItem('token')

    const formData = new FormData()

    formData.append('arquivo', arquivo)

    const response = await fetch(
        `${API_URL}/alunos/importar`,
        {
            method: 'POST',

            headers: {
                Authorization: `Bearer ${token}`
            },

            body: formData
        }
    )

    if (!response.ok) {
        const erro = await response.json()

        throw new Error(
            erro.detail ||
            'Não foi possível importar os alunos'
        )
    }

    return response.json()
}

export async function atualizarAluno(id, dados) {
    const token = localStorage.getItem('token')

    const response = await fetch(
        `${API_URL}/alunos/${id}`,
        {
            method: 'PUT',

            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },

            body: JSON.stringify(dados)
        }
    )

    if (!response.ok) {
        throw new Error('Não foi possível atualizar o aluno')
    }

    return response.json()
}

export async function cadastrarAluno(dados) {
    const token = localStorage.getItem('token')

    const response = await fetch(
        `${API_URL}/alunos/`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(dados)
        }
    )

    if (!response.ok) {
        const erro = await response.json()

        console.error('Erro da API:', erro)

        throw new Error(
            erro.detail || 'Não foi possível cadastrar o aluno'
        )
    }

    return response.json()
}