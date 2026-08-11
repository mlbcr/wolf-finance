import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
    buscarAlunos,
    cadastrarAluno
} from '@/api/api'

import CadastrarAlunoModal from './components/CadastrarAlunoModal'

import './AlunosPage.css'

export default function AlunosPage() {
    const navigate = useNavigate()

    const [alunos, setAlunos] = useState([])
    const [busca, setBusca] = useState('')
    const [loading, setLoading] = useState(true)

    const [cadastrando, setCadastrando] = useState(false)
    const [salvando, setSalvando] = useState(false)

    const [paginaAtual, setPaginaAtual] = useState(1)

    const alunosPorPagina = 10

    useEffect(() => {
        async function carregarAlunos() {
            try {
                const dados = await buscarAlunos()
                setAlunos(dados)
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }

        carregarAlunos()
    }, [])

    const alunosFiltrados = alunos.filter(aluno => {
        const termo = busca.toLowerCase().trim()

        if (!termo) {
            return true
        }

        return (
            aluno.nome_completo?.toLowerCase().includes(termo) ||
            aluno.email?.toLowerCase().includes(termo) ||
            aluno.matricula?.toLowerCase().includes(termo)
        )
    })

    const totalPaginas = Math.ceil(
        alunosFiltrados.length / alunosPorPagina
    )

    const indiceInicial =
        (paginaAtual - 1) * alunosPorPagina

    const alunosPagina =
        alunosFiltrados.slice(
            indiceInicial,
            indiceInicial + alunosPorPagina
        )

    async function handleCadastrar(dados) {
        setSalvando(true)

        try {
            const novoAluno = await cadastrarAluno(dados)

            setAlunos(prev => [...prev, novoAluno])

            setCadastrando(false)

        } catch (error) {
            console.error(error)

            alert('Não foi possível cadastrar o aluno.')

        } finally {
            setSalvando(false)
        }
    }

    if (loading) {
        return (
            <main className="alunos-page">
                <p>Carregando alunos...</p>
            </main>
        )
    }

    return (
        <main className="alunos-page">

            <div className="alunos-header">

                <div>
                    <h1>Alunos</h1>

                    <p>
                        Consulte os alunos cadastrados no sistema.
                    </p>
                </div>

                <div className="alunos-header-actions">

                    <span className="alunos-count">
                        {alunos.length} alunos
                    </span>

                    <button
                        type="button"
                        className="btn-cadastrar-aluno"
                        onClick={() => setCadastrando(true)}
                    >
                        <i className="fa-solid fa-plus"></i>
                        Cadastrar aluno
                    </button>

                </div>

            </div>

            <div className="alunos-search">

                <i className="fa-solid fa-magnifying-glass"></i>

                <input
                    type="text"
                    placeholder="Buscar por nome, e-mail ou matrícula..."
                    value={busca}
                    onChange={event => setBusca(event.target.value)}
                />

            </div>

            <section className="alunos-list">

                {alunosFiltrados.length === 0 && (
                    <div className="empty-alunos">

                        <i className="fa-solid fa-user-slash"></i>

                        <h3>
                            Nenhum aluno encontrado
                        </h3>

                        <p>
                            Tente buscar por outro nome, e-mail ou matrícula.
                        </p>

                    </div>
                )}

                {alunosPagina.map(aluno => (
                    <button
                        key={aluno.id}
                        type="button"
                        className="aluno-card"
                        onClick={() => navigate(`/alunos/${aluno.id}`)}
                    >

                        <div className="aluno-avatar">
                            {aluno.nome_completo
                                ?.charAt(0)
                                .toUpperCase()}
                        </div>

                        <div className="aluno-info">

                            <strong>
                                {aluno.nome_completo}
                            </strong>

                            <span>
                                {aluno.email}
                            </span>

                            <small>
                                Matrícula: {aluno.matricula}
                            </small>

                        </div>

                        <i className="fa-solid fa-chevron-right"></i>

                    </button>
                ))}

            </section>
            
            {totalPaginas > 1 && (
                <div className="alunos-pagination">

                    <button
                        type="button"
                        disabled={paginaAtual === 1}
                        onClick={() =>
                            setPaginaAtual(prev => prev - 1)
                        }
                    >
                        <i className="fa-solid fa-chevron-left"></i>
                    </button>

                    {Array.from(
                        { length: totalPaginas },
                        (_, index) => index + 1
                    ).map(pagina => (
                        <button
                            key={pagina}
                            type="button"
                            className={
                                paginaAtual === pagina
                                    ? 'active'
                                    : ''
                            }
                            onClick={() => setPaginaAtual(pagina)}
                        >
                            {pagina}
                        </button>
                    ))}

                    <button
                        type="button"
                        disabled={paginaAtual === totalPaginas}
                        onClick={() =>
                            setPaginaAtual(prev => prev + 1)
                        }
                    >
                        <i className="fa-solid fa-chevron-right"></i>
                    </button>

                </div>
            )}

            {cadastrando && (
                <CadastrarAlunoModal
                    onClose={() => setCadastrando(false)}
                    onSave={handleCadastrar}
                    salvando={salvando}
                />
            )}

        </main>
    )
}

