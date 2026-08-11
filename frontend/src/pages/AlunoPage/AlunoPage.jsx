import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import {
    buscarAluno,
    atualizarAluno
} from '@/api/api'

import EditarAlunoModal from './components/EditarAlunoModal'

import './AlunoPage.css'

export default function AlunoPage() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [aluno, setAluno] = useState(null)
    const [loading, setLoading] = useState(true)

    const [editando, setEditando] = useState(false)
    const [salvando, setSalvando] = useState(false)

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

    function formatarData(data) {
        if (!data) {
            return '-'
        }

        return new Date(`${data}T00:00:00`).toLocaleDateString('pt-BR')
    }

    function abrirEdicao() {
        setEditando(true)
    }

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

                    <h1>{aluno.nome_completo}</h1>

                    <p>
                        <i className="fa-solid fa-envelope"></i>
                        {aluno.email}
                    </p>

                    <span className={`aluno-status ${aluno.status === 'ATIVO' ? 'ativo' : 'inativo'}`}>
                        <i className="fa-solid fa-circle"></i>
                        {aluno.status}
                    </span>

                </div>

                <button
                    type="button"
                    className="btn-editar-aluno"
                    onClick={abrirEdicao}
                >
                    <i className="fa-solid fa-pen"></i>
                    Editar aluno
                </button>

            </section>

            {/* DADOS PESSOAIS */}

            <section className="aluno-section">

                <div className="section-title">
                    <div>
                        <h2>
                            <i className="fa-solid fa-user"></i>
                            Dados pessoais
                        </h2>

                        <p>
                            Informações pessoais do aluno
                        </p>
                    </div>
                </div>

                <div className="aluno-info-grid">

                    <div className="info-item">
                        <span>Nome completo</span>
                        <strong>{aluno.nome_completo || '-'}</strong>
                    </div>

                    <div className="info-item">
                        <span>Data de nascimento</span>
                        <strong>
                            {formatarData(aluno.data_nascimento)}
                        </strong>
                    </div>

                    <div className="info-item">
                        <span>Bairro</span>
                        <strong>{aluno.bairro || '-'}</strong>
                    </div>

                    <div className="info-item">
                        <span>E-mail</span>
                        <strong>{aluno.email || '-'}</strong>
                    </div>

                    <div className="info-item">
                        <span>Telefone</span>
                        <strong>{aluno.telefone || '-'}</strong>
                    </div>

                </div>

            </section>

            {/* DADOS ACADÊMICOS */}

            <section className="aluno-section">

                <div className="section-title">
                    <div>
                        <h2>
                            <i className="fa-solid fa-graduation-cap"></i>
                            Dados acadêmicos
                        </h2>

                        <p>
                            Informações acadêmicas do aluno
                        </p>
                    </div>
                </div>

                <div className="aluno-info-grid">

                    <div className="info-item">
                        <span>Matrícula</span>
                        <strong>{aluno.matricula || '-'}</strong>
                    </div>

                    <div className="info-item">
                        <span>Curso</span>
                        <strong>{aluno.curso || '-'}</strong>
                    </div>

                    <div className="info-item">
                        <span>Ingresso no curso</span>
                        <strong>
                            {formatarData(aluno.periodo_ingresso)}
                        </strong>
                    </div>

                    <div className="info-item">
                        <span>Data de cadastro</span>
                        <strong>
                            {aluno.cadastrado_em
                                ? new Date(
                                    aluno.cadastrado_em
                                ).toLocaleDateString('pt-BR')
                                : '-'
                            }
                        </strong>
                    </div>

                </div>

            </section>

            {/* DADOS DA LIGA */}

            <section className="aluno-section">

                <div className="section-title">
                    <div>
                        <h2>
                            <i className="fa-solid fa-users"></i>
                            Dados da liga
                        </h2>

                        <p>
                            Informações sobre a participação na liga
                        </p>
                    </div>
                </div>

                <div className="aluno-info-grid">

                    <div className="info-item">
                        <span>Cargo</span>
                        <strong>{aluno.cargo || '-'}</strong>
                    </div>

                    <div className="info-item">
                        <span>Ingresso na liga</span>
                        <strong>
                            {formatarData(aluno.ingresso_liga)}
                        </strong>
                    </div>

                    <div className="info-item">
                        <span>Desligamento da liga</span>
                        <strong>
                            {aluno.desligamento_liga
                                ? formatarData(aluno.desligamento_liga)
                                : 'Ainda na liga'
                            }
                        </strong>
                    </div>

                    <div className="info-item">
                        <span>Status</span>
                        <strong>{aluno.status || '-'}</strong>
                    </div>

                </div>

            </section>

            {/* DADOS PROFISSIONAIS */}

            <section className="aluno-section">

                <div className="section-title">
                    <div>
                        <h2>
                            <i className="fa-solid fa-briefcase"></i>
                            Dados profissionais
                        </h2>

                        <p>
                            Informações profissionais do aluno
                        </p>
                    </div>
                </div>

                <div className="aluno-info-grid">

                    <div className="info-item">
                        <span>Faz estágio</span>

                        <strong>
                            {aluno.faz_estagio
                                ? 'Sim'
                                : 'Não'
                            }
                        </strong>
                    </div>

                </div>

            </section>

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