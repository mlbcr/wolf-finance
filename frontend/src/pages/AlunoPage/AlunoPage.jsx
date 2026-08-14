import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import {
    buscarAluno,
    atualizarAluno
} from '@/api/api'

import EditarAlunoModal from './components/EditarAlunoModal'
import AlunoInfo from './AlunoInfo'
import AlunoEquipes from './AlunoEquipes'
import AlunoProjetos from './AlunoProjetos'

import './AlunoPage.css'

export default function AlunoPage() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [aluno, setAluno] = useState(null)
    const [loading, setLoading] = useState(true)

    const [editando, setEditando] = useState(false)
    const [salvando, setSalvando] = useState(false)

    const [abaAtiva, setAbaAtiva] = useState('informacoes')

    useEffect(() => {
        async function carregarAluno() {
            try {
                const dados = await buscarAluno(id)
                setAluno(dados)
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }

        carregarAluno()
    }, [id])

    async function handleSalvar(dados) {
        setSalvando(true)

        try {
            const alunoAtualizado = await atualizarAluno(id, dados)

            setAluno(alunoAtualizado)
            setEditando(false)

        } catch (error) {
            console.error(error)
            alert('Não foi possível atualizar o aluno.')
        } finally {
            setSalvando(false)
        }
    }

    if (loading) {
        return (
            <main className="aluno-page">
                <p>Carregando...</p>
            </main>
        )
    }

    if (!aluno) {
        return (
            <main className="aluno-page">

                <button
                    type="button"
                    className="voltar-button"
                    onClick={() => navigate('/alunos')}
                >
                    <i className="fa-solid fa-arrow-left"></i>
                    Voltar para alunos
                </button>

                <div className="aluno-empty">

                    <i className="fa-solid fa-user-slash"></i>

                    <h2>Aluno não encontrado</h2>

                    <p>
                        Não foi possível encontrar este aluno.
                    </p>

                </div>

            </main>
        )
    }

    const iniciais = aluno.nome_completo
        ?.split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map(nome => nome[0])
        .join('')
        .toUpperCase()

    return (
        <main className="aluno-page">

            <button
                type="button"
                className="voltar-button"
                onClick={() => navigate('/alunos')}
            >
                <i className="fa-solid fa-arrow-left"></i>
                Voltar para alunos
            </button>


            {/* HEADER */}

            <section className="aluno-header">

                <div className="aluno-header-avatar">
                    {iniciais || 'A'}
                </div>

                <div className="aluno-header-info">

                    <h1>
                        {aluno.nome_completo}
                    </h1>

                    <p>
                        <i className="fa-solid fa-envelope"></i>
                        {aluno.email}
                    </p>

                    <span
                        className={`aluno-status ${
                            aluno.status === 'ATIVO'
                                ? 'ativo'
                                : 'inativo'
                        }`}
                    >
                        <i className="fa-solid fa-circle"></i>
                        {aluno.status}
                    </span>

                </div>

                <button
                    type="button"
                    className="btn-editar-aluno"
                    onClick={() => setEditando(true)}
                >
                    <i className="fa-solid fa-pen"></i>
                    Editar aluno
                </button>

            </section>


            {/* ABAS */}

            <nav className="aluno-tabs">

                <button
                    type="button"
                    className={
                        abaAtiva === 'informacoes'
                            ? 'active'
                            : ''
                    }
                    onClick={() => setAbaAtiva('informacoes')}
                >
                    Informações do aluno
                </button>

                <button
                    type="button"
                    className={
                        abaAtiva === 'equipes'
                            ? 'active'
                            : ''
                    }
                    onClick={() => setAbaAtiva('equipes')}
                >
                    Equipes
                </button>

                <button
                    type="button"
                    className={
                        abaAtiva === 'projetos'
                            ? 'active'
                            : ''
                    }
                    onClick={() => setAbaAtiva('projetos')}
                >
                    Projetos
                </button>

            </nav>


            {/* CONTEÚDO DA ABA */}

            <div className="aluno-tab-content">

                {abaAtiva === 'informacoes' && (
                    <AlunoInfo aluno={aluno} />
                )}

                {abaAtiva === 'equipes' && (
                    <AlunoEquipes aluno={aluno} />
                )}

                {abaAtiva === 'projetos' && (
                    <AlunoProjetos aluno={aluno} />
                )}

            </div>


            {/* MODAL DE EDIÇÃO */}

            {editando && (
                <EditarAlunoModal
                    aluno={aluno}
                    onClose={() => setEditando(false)}
                    onSave={handleSalvar}
                    salvando={salvando}
                />
            )}

        </main>
    )
}

