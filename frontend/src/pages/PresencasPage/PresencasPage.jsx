import { useEffect, useState } from 'react'
import useAuth from '@/contexts/useAuth'
import {
    listarMinhasPresencas,
    obterHorasSemana,
    atualizarPresenca,
    deletarPresenca
} from '@/api/api'
import AlertModal from '@/components/AlertModal/AlertModal'
import ConfirmModal from '@/components/ConfirmModal/ConfirmModal'
import LoadingModal from '@/components/LoadingModal/LoadingModal'
import './PresencasPage.css'

function formatarHora(time) {
    if (!time) return '--:--'
    return time.substring(0, 5)
}

function formatarData(data) {
    const date = new Date(data + 'T00:00:00')
    return date.toLocaleDateString('pt-BR', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })
}

export default function PresencasPage() {
    const { usuario, loading: loadingAuth } = useAuth()
    const [presencas, setPresencas] = useState([])
    const [horasSemana, setHorasSemana] = useState(null)
    const [loading, setLoading] = useState(true)
    const [erro, setErro] = useState(null)
    const [presencaSelecionada, setPresencaSelecionada] = useState(null)
    const [editando, setEditando] = useState(false)
    const [dados, setDados] = useState({
        hora_inicio: '',
        hora_fim: ''
    })
    const [confirmDelete, setConfirmDelete] = useState(null)
    const [salvando, setSalvando] = useState(false)

    useEffect(() => {
        if (!loadingAuth && usuario) {
            carregarDados()
        }
    }, [usuario, loadingAuth])

    async function carregarDados() {
        try {
            setLoading(true)
            setErro(null)

            const [presencasData, horasData] = await Promise.all([
                listarMinhasPresencas(),
                obterHorasSemana()
            ])

            setPresencas(presencasData || [])
            setHorasSemana(horasData)
        } catch (error) {
            console.error('Erro ao carregar presencas:', error)
            setErro(error.message || 'Erro ao carregar presencas')
        } finally {
            setLoading(false)
        }
    }

    function abrirEdicao(presenca) {
        setPresencaSelecionada(presenca)
        setDados({
            hora_inicio: presenca.hora_inicio || '',
            hora_fim: presenca.hora_fim || ''
        })
        setEditando(true)
    }

    function fecharEdicao() {
        setEditando(false)
        setPresencaSelecionada(null)
        setDados({
            hora_inicio: '',
            hora_fim: ''
        })
    }

    async function salvarEdicao() {
        try {
            if (!dados.hora_inicio || !dados.hora_fim) {
                setErro('Preencha hora de início e fim')
                return
            }

            setSalvando(true)

            await atualizarPresenca(presencaSelecionada.id, {
                hora_inicio: dados.hora_inicio,
                hora_fim: dados.hora_fim
            })

            await carregarDados()
            setErro(null)
            setErro('Presença atualizada com sucesso!')
            setTimeout(() => {
                fecharEdicao()
                setErro(null)
            }, 1500)
        } catch (error) {
            setErro(error.message || 'Erro ao atualizar presença')
        } finally {
            setSalvando(false)
        }
    }

    async function confirmarDelete() {
        try {
            setSalvando(true)

            await deletarPresenca(confirmDelete)
            await carregarDados()
            setErro(null)
            setConfirmDelete(null)
            setErro('Presença deletada com sucesso!')
            setTimeout(() => {
                setErro(null)
            }, 1500)
        } catch (error) {
            setErro(error.message || 'Erro ao deletar presença')
        } finally {
            setSalvando(false)
        }
    }

    if (loading || loadingAuth) {
        return (
            <main className="presencas-page">
                <LoadingModal mensagem="Carregando suas presenças..." />
            </main>
        )
    }

    return (
        <main className="presencas-page">

            {/* MODAIS */}
            {salvando && <LoadingModal mensagem="Processando..." />}
            {erro && (
                <AlertModal
                    titulo={erro.includes('sucesso') ? 'Sucesso' : 'Erro'}
                    mensagem={erro}
                    onFechar={() => setErro(null)}
                    tipo={erro.includes('sucesso') ? 'sucesso' : 'erro'}
                />
            )}
            {confirmDelete && (
                <ConfirmModal
                    titulo="Deletar Presença"
                    mensagem="Tem certeza que deseja deletar esta presença? Esta ação não pode ser desfeita."
                    onConfirmar={confirmarDelete}
                    onCancelar={() => setConfirmDelete(null)}
                />
            )}

            {/* HEADER */}
            <header className="presencas-header">
                <div>
                    <span className="page-label">Wolf Finance</span>
                    <h1>Presenças</h1>
                    <p>Acompanhe suas horas de presença na liga</p>
                </div>
            </header>

            {/* RESUMO SEMANAL */}
            {horasSemana && (
                <section className="resumo-semanal">
                    <div className="resumo-card">
                        <div className="resumo-info">
                            <h3>Horas desta semana</h3>
                            <p className="horas-valor">{horasSemana.total_horas}h</p>
                            <p className="meta-valor">Meta: {horasSemana.meta_horas}h</p>
                        </div>
                        <div className="resumo-progresso">
                            <div className="progress-bar">
                                <div
                                    className="progress-fill"
                                    style={{
                                        width: `${Math.min(horasSemana.percentual, 100)}%`,
                                        backgroundColor: horasSemana.percentual >= 100 ? '#10b981' : '#3157d5'
                                    }}
                                ></div>
                            </div>
                            <p className="percentual">{horasSemana.percentual}%</p>
                        </div>
                    </div>
                </section>
            )}

            {/* LISTA DE PRESENÇAS */}
            <section className="presencas-section">
                <div className="section-header">
                    <div>
                        <h2>Suas presenças</h2>
                        <p>Histórico de presenças registradas</p>
                    </div>

                    {presencas.length > 0 && (
                        <div className="presencas-count">
                            <strong>{presencas.length}</strong>
                            <span>
                                {presencas.length === 1 ? 'presença' : 'presenças'}
                            </span>
                        </div>
                    )}
                </div>

                {presencas.length > 0 ? (
                    <div className="presencas-lista">
                        {presencas.map(presenca => (
                            <div key={presenca.id} className="presenca-item">
                                <div className="presenca-info">
                                    <div className="presenca-data">
                                        <i className="fa-solid fa-calendar"></i>
                                        <span>{formatarData(presenca.data)}</span>
                                    </div>

                                    <div className="presenca-horas">
                                        <span className="hora-inicio">
                                            {formatarHora(presenca.hora_inicio)}
                                        </span>
                                        <i className="fa-solid fa-arrow-right"></i>
                                        <span className="hora_fim">
                                            {formatarHora(presenca.hora_fim)}
                                        </span>
                                    </div>

                                    {presenca.total_horas && (
                                        <div className="presenca-total">
                                            <i className="fa-solid fa-hourglass-end"></i>
                                            <span>{presenca.total_horas}h</span>
                                        </div>
                                    )}
                                </div>

                                <div className="presenca-acoes">
                                    <button
                                        className="btn-editar"
                                        onClick={() => abrirEdicao(presenca)}
                                        title="Editar presença"
                                    >
                                        <i className="fa-solid fa-pencil"></i>
                                    </button>
                                    <button
                                        className="btn-deletar"
                                        onClick={() => setConfirmDelete(presenca.id)}
                                        title="Deletar presença"
                                    >
                                        <i className="fa-solid fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="vazio-container">
                        <i className="fa-solid fa-inbox"></i>
                        <p>Nenhuma presença registrada</p>
                    </div>
                )}
            </section>

            {/* MODAL DE EDIÇÃO */}
            {editando && (
                <div className="modal-overlay" onClick={fecharEdicao}>
                    <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Editar Presença</h2>
                            <button
                                className="btn-fechar"
                                onClick={fecharEdicao}
                            >
                                <i className="fa-solid fa-times"></i>
                            </button>
                        </div>

                        <div className="modal-body">
                            <div className="form-group">
                                <label htmlFor="hora_inicio">Hora de Início</label>
                                <input
                                    type="time"
                                    id="hora_inicio"
                                    value={dados.hora_inicio}
                                    onChange={(e) =>
                                        setDados({
                                            ...dados,
                                            hora_inicio: e.target.value
                                        })
                                    }
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="hora_fim">Hora de Fim</label>
                                <input
                                    type="time"
                                    id="hora_fim"
                                    value={dados.hora_fim}
                                    onChange={(e) =>
                                        setDados({
                                            ...dados,
                                            hora_fim: e.target.value
                                        })
                                    }
                                />
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button
                                className="btn-cancelar"
                                onClick={fecharEdicao}
                            >
                                Cancelar
                            </button>
                            <button
                                className="btn-salvar"
                                onClick={salvarEdicao}
                            >
                                Salvar
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </main>
    )
}