export async function buscarMeusProjetos() {
    const token = localStorage.getItem('token')

    const response = await fetch(
        'http://127.0.0.1:8000/projetos/meus',
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    )

    if (!response.ok) {
        throw new Error('Não foi possível buscar os projetos')
    }

    return response.json()
}


export async function buscarTodosProjetos() {
    const token = localStorage.getItem('token')

    const response = await fetch(
        'http://127.0.0.1:8000/projetos/',
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    )

    if (!response.ok) {
        throw new Error('Não foi possível buscar os projetos')
    }

    return response.json()
}


export async function buscarProjeto(id) {
    const token = localStorage.getItem('token')

    const response = await fetch(
        `http://127.0.0.1:8000/projetos/${id}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    )

    if (!response.ok) {
        throw new Error('Não foi possível buscar o projeto')
    }

    return response.json()
}


export async function criarProjeto(dados) {
    const token = localStorage.getItem('token')

    const response = await fetch(
        'http://127.0.0.1:8000/projetos/',
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
        throw new Error('Não foi possível criar o projeto')
    }

    return response.json()
}


export async function atualizarProjeto(id, dados) {
    const token = localStorage.getItem('token')

    const response = await fetch(
        `http://127.0.0.1:8000/projetos/${id}`,
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
        throw new Error('Não foi possível atualizar o projeto')
    }

    return response.json()
}


export async function buscarMembrosProjeto(id) {
    const token = localStorage.getItem('token')

    const response = await fetch(
        `http://127.0.0.1:8000/projetos/${id}/membros`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    )

    if (!response.ok) {
        throw new Error('Não foi possível buscar os membros do projeto')
    }

    return response.json()
}


export async function adicionarMembrosProjeto(
    projetoId,
    alunoIds
) {
    const token = localStorage.getItem('token')

    const response = await fetch(
        `http://127.0.0.1:8000/projetos/${projetoId}/membros`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
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


export async function removerMembroProjeto(
    projetoId,
    alunoId
) {
    const token = localStorage.getItem('token')

    const response = await fetch(
        `http://127.0.0.1:8000/projetos/${projetoId}/membros/${alunoId}`,
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


export async function buscarProjetosAluno(alunoId) {
    const token = localStorage.getItem('token')

    const response = await fetch(
        `http://127.0.0.1:8000/alunos/${alunoId}/projetos`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    )

    if (!response.ok) {
        throw new Error(
            'Não foi possível buscar os projetos do aluno'
        )
    }

    return response.json()
}