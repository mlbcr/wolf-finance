import { useEffect, useMemo, useState } from 'react'

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
import Button from '@/components/Button/Button'
import BackButton from '@/components/BackButton/BackButton'

import './PresencasPage.css'

function formatarHora(time) {
    if (!time) return '--:--'

    return time.substring(0, 5)
}

function formatarDuracao(totalHoras) {
    if (totalHoras === null || totalHoras === undefined) {
        return null
    }

    const horas = Number(totalHoras)

    if (isNaN(horas)) {
        return null
    }

    const horasInteiras = Math.floor(horas)
    const minutos = Math.round((horas - horasInteiras) * 60)

    // Caso o arredondamento resulte em 60 minutos
    if (minutos === 60) {
        return `${horasInteiras + 1}h`
    }

    if (horasInteiras === 0) {
        return `${minutos}min`
    }

    if (minutos === 0) {
        return `${horasInteiras}h`
    }

    return `${horasInteiras}h ${minutos}min`
}

function formatarHoraInput(time) {
    if (!time) return ''

    return time.substring(0, 5)
}


function horaValida(hora) {
    if (!hora || hora.length !== 5) return false

    const [horas, minutos] = hora.split(':').map(Number)

    return (
        horas >= 0 &&
        horas <= 23 &&
        minutos >= 0 &&
        minutos <= 59
    )
}

function formatarDataExibicao(dataIso) {
    if (!dataIso) return ''

    const date = new Date(dataIso + 'T00:00:00')

    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    })
}

function dataBrParaIso(dataBr) {
    if (!dataBr || dataBr.length < 10) return ''

    const [dia, mes, ano] = dataBr.split('/')

    return `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`
}

function aplicarMascaraData(valor) {
    return valor
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '$1/$2')
        .replace(/(\d{2})(\d)/, '$1/$2')
        .replace(/(\d{4})\d+?$/, '$1')
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

    const [filtroAberto, setFiltroAberto] = useState(false)
    const [dataInicioInput, setDataInicioInput] = useState('')
    const [dataFimInput, setDataFimInput] = useState('')

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
            setErro(error.message || 'Erro ao carregar presenças')
        } finally {
            setLoading(false)
        }
    }

    function abrirEdicao(presenca) {
        setPresencaSelecionada(presenca)

        setDados({
            hora_inicio: formatarHoraInput(presenca.hora_inicio),
            hora_fim: formatarHoraInput(presenca.hora_fim)
        })

        setEditando(true)
    }

    function fecharEdicao() {
        if (salvando) return

        setEditando(false)
        setPresencaSelecionada(null)

        setDados({
            hora_inicio: '',
            hora_fim: ''
        })
    }

    async function salvarEdicao() {
        if (salvando || !presencaSelecionada) return

        try {
            if (!dados.hora_inicio || !dados.hora_fim) {
                setErro('Preencha hora de início e fim')
                return
            }

            if (!horaValida(dados.hora_inicio)) {
                setErro('Informe uma hora de início válida')
                return
            }

            if (!horaValida(dados.hora_fim)) {
                setErro('Informe uma hora de fim válida')
                return
            }

            setSalvando(true)

            await atualizarPresenca(presencaSelecionada.id, {
                hora_inicio: dados.hora_inicio,
                hora_fim: dados.hora_fim
            })

            await carregarDados()

            setEditando(false)
            setPresencaSelecionada(null)

            setDados({
                hora_inicio: '',
                hora_fim: ''
            })

            setErro('Presença atualizada com sucesso!')

            setTimeout(() => {
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

    function limparFiltros() {
        setDataInicioInput('')
        setDataFimInput('')
    }

    function aplicarAtalhos(dias) {
        const hoje = new Date()
        const inicio = new Date()

        inicio.setDate(hoje.getDate() - dias)

        const formatar = (d) => {
            const dia = String(d.getDate()).padStart(2, '0')
            const mes = String(d.getMonth() + 1).padStart(2, '0')
            const ano = d.getFullYear()

            return `${dia}/${mes}/${ano}`
        }

        setDataInicioInput(formatar(inicio))
        setDataFimInput(formatar(hoje))
    }

    const presencasFiltradas = useMemo(() => {
        const dataInicioIso = dataBrParaIso(dataInicioInput)
        const dataFimIso = dataBrParaIso(dataFimInput)

        return presencas.filter((presenca) => {
            if (dataInicioIso && presenca.data < dataInicioIso) {
                return false
            }

            if (dataFimIso && presenca.data > dataFimIso) {
                return false
            }

            return true
        })
    }, [presencas, dataInicioInput, dataFimInput])

    const temFiltro = Boolean(dataInicioInput || dataFimInput)

    const progressoPercentual = horasSemana?.percentual || 0
    const metaAtingida = progressoPercentual >= 100

    if (loading || loadingAuth) {
        return (
            <main className="presencas-page">
                <LoadingModal mensagem="Carregando suas presenças..." />
            </main>
        )
    }

    return (
        <main className="presencas-page">
            <BackButton />

            {salvando && <LoadingModal mensagem="Processando..." />}

            {erro && (
                <AlertModal
                    titulo={erro.includes('sucesso') ? 'Sucesso' : 'Atenção'}
                    mensagem={erro}
                    onFechar={() => setErro(null)}
                    tipo={erro.includes('sucesso') ? 'sucesso' : 'erro'}
                />
            )}

            {confirmDelete && (
                <ConfirmModal
                    titulo="Deletar presença"
                    mensagem="Tem certeza que deseja deletar esta presença? Esta ação não pode ser desfeita."
                    onConfirmar={confirmarDelete}
                    onCancelar={() => setConfirmDelete(null)}
                />
            )}

            <header className="presencas-header">
                <h1>Minhas Presenças</h1>
                <p>Acompanhe seus registros de presença.</p>
            </header>

            {horasSemana && (
                <section className="resumo-semanal">
                    <div
                        className={`resumo-card ${metaAtingida ? 'meta-cumprida' : ''
                            }`}
                    >
                        <div className="resumo-info">
                            <span className="resumo-label">
                                <i className="fa-regular fa-clock"></i>
                                Horas nesta semana
                            </span>

                            <div className="resumo-metricas">
                                <strong className="horas-valor">
                                    {horasSemana.total_horas}h
                                </strong>

                                <span className="meta-valor">
                                    / {horasSemana.meta_horas}h
                                </span>
                            </div>
                        </div>

                        <div className="resumo-progresso">
                            <div className="progress-bar">
                                <div
                                    className="progress-fill"
                                    style={{
                                        width: `${Math.min(
                                            progressoPercentual,
                                            100
                                        )}%`
                                    }}
                                />
                            </div>

                            <span
                                className={`percentual-badge ${metaAtingida ? 'concluido' : ''
                                    }`}
                            >
                                {progressoPercentual}%
                            </span>
                        </div>
                    </div>
                </section>
            )}

            <section className="presencas-section">
                <div className="section-header">
                    <h2>Histórico</h2>

                    <span className="presencas-count">
                        <strong>{presencasFiltradas.length}</strong>
                        {presencasFiltradas.length === 1
                            ? 'registro'
                            : 'registros'}
                    </span>
                </div>

                <div
                    className={`filtros-container ${filtroAberto ? 'aberto' : ''
                        }`}
                >
                    <button
                        type="button"
                        className="filtros-toggle"
                        onClick={() =>
                            setFiltroAberto((prev) => !prev)
                        }
                        aria-expanded={filtroAberto}
                    >
                        <span className="filtros-toggle-conteudo">
                            <i className="fa-regular fa-calendar"></i>
                            <span>Filtrar por período</span>

                            {temFiltro && (
                                <span className="filtro-ativo">
                                    Ativo
                                </span>
                            )}
                        </span>

                        <i
                            className={`fa-solid fa-chevron-down ${filtroAberto ? 'rotacionado' : ''
                                }`}
                        ></i>
                    </button>

                    <div
                        className={`filtros-conteudo ${filtroAberto ? 'visivel' : ''
                            }`}
                    >
                        <div className="filtros-campos">
                            <div className="filtro-group">
                                <label htmlFor="data-inicio">
                                    Data inicial
                                </label>

                                <input
                                    id="data-inicio"
                                    type="text"
                                    placeholder="DD/MM/AAAA"
                                    maxLength={10}
                                    value={dataInicioInput}
                                    onChange={(e) =>
                                        setDataInicioInput(
                                            aplicarMascaraData(
                                                e.target.value
                                            )
                                        )
                                    }
                                />
                            </div>

                            <span className="filtro-separador">
                                até
                            </span>

                            <div className="filtro-group">
                                <label htmlFor="data-fim">
                                    Data final
                                </label>

                                <input
                                    id="data-fim"
                                    type="text"
                                    placeholder="DD/MM/AAAA"
                                    maxLength={10}
                                    value={dataFimInput}
                                    onChange={(e) =>
                                        setDataFimInput(
                                            aplicarMascaraData(
                                                e.target.value
                                            )
                                        )
                                    }
                                />
                            </div>

                            <div className="filtro-atalhos">
                                <button
                                    type="button"
                                    onClick={() => aplicarAtalhos(7)}
                                >
                                    Últimos 7 dias
                                </button>

                                <button
                                    type="button"
                                    onClick={() => aplicarAtalhos(30)}
                                >
                                    Últimos 30 dias
                                </button>
                            </div>

                            {temFiltro && (
                                <button
                                    type="button"
                                    className="limpar-filtros"
                                    onClick={limparFiltros}
                                >
                                    Limpar
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {presencasFiltradas.length > 0 ? (
                    <div className="presencas-container">
                        <div className="presencas-tabela-header">
                            <span>Data</span>
                            <span>Horário</span>
                            <span>Duração</span>
                            <span className="text-right">
                                Ações
                            </span>
                        </div>

                        <div className="presencas-lista">
                            {presencasFiltradas.map((presenca) => (
                                <div
                                    key={presenca.id}
                                    className="presenca-item"
                                >
                                    <div className="presenca-data">
                                        <span>
                                            {formatarDataExibicao(
                                                presenca.data
                                            )}
                                        </span>
                                    </div>

                                    <div className="presenca-horas">
                                        <span className="hora-badge">
                                            {formatarHora(
                                                presenca.hora_inicio
                                            )}
                                        </span>

                                        <span className="horario-separador">
                                            até
                                        </span>

                                        <span className="hora-badge">
                                            {formatarHora(
                                                presenca.hora_fim
                                            )}
                                        </span>
                                    </div>

                                    <div className="presenca-total">
                                        {presenca.total_horas !== null &&
                                            presenca.total_horas !== undefined ? (
                                            <span className="total-chip">
                                                {formatarDuracao(presenca.total_horas)}
                                            </span>
                                        ) : (
                                            <span className="em-andamento-chip">
                                                Em aberto
                                            </span>
                                        )}
                                    </div>

                                    <div className="presenca-acoes">
                                        <button
                                            type="button"
                                            className="btn-acao-editar"
                                            onClick={() =>
                                                abrirEdicao(presenca)
                                            }
                                            title="Editar horários"
                                            aria-label="Editar horários"
                                        >
                                            <i className="fa-solid fa-pen"></i>
                                        </button>

                                        <Button
                                            type="button"
                                            variant="btn-deletar"
                                            onClick={() =>
                                                setConfirmDelete(
                                                    presenca.id
                                                )
                                            }
                                            title="Deletar presença"
                                            disabled={salvando}
                                        >
                                            <i className="fa-regular fa-trash-can"></i>
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="vazio-container">
                        <div className="vazio-icon">
                            <i className="fa-solid fa-folder-open"></i>
                        </div>

                        <h3>Nenhum registro encontrado</h3>

                        <p>
                            {temFiltro
                                ? 'Não existem presenças nesse período.'
                                : 'Você ainda não possui registros de presença.'}
                        </p>

                        {temFiltro && (
                            <button
                                type="button"
                                className="vazio-limpar"
                                onClick={limparFiltros}
                            >
                                Limpar filtros
                            </button>
                        )}
                    </div>
                )}
            </section>

            {editando && (
                <div
                    className="modal-overlay"
                    onClick={fecharEdicao}
                >
                    <div
                        className="modal-container"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-header">
                            <div>
                                <h2>Editar presença</h2>

                                <p className="modal-subtitle">
                                    {presencaSelecionada &&
                                        formatarDataExibicao(
                                            presencaSelecionada.data
                                        )}
                                </p>
                            </div>

                            <Button
                                type="button"
                                variant="btn-fechar"
                                onClick={fecharEdicao}
                                disabled={salvando}
                            >
                                <i className="fa-solid fa-xmark"></i>
                            </Button>
                        </div>

                        <div className="modal-body">
                            <div className="horarios-edicao">
                                <div className="horario-edicao-group">
                                    <label htmlFor="hora_inicio">
                                        Início
                                    </label>

                                    <input
                                        type="time"
                                        id="hora_inicio"
                                        value={dados.hora_inicio}
                                        disabled={salvando}
                                        onChange={(e) =>
                                            setDados({
                                                ...dados,
                                                hora_inicio: e.target.value
                                            })
                                        }
                                    />
                                </div>

                                <div className="horario-edicao-group">
                                    <label htmlFor="hora_fim">
                                        Fim
                                    </label>

                                    <input
                                        type="time"
                                        id="hora_fim"
                                        value={dados.hora_fim}
                                        disabled={salvando}
                                        onChange={(e) =>
                                            setDados({
                                                ...dados,
                                                hora_fim: e.target.value
                                            })
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <Button
                                type="button"
                                label="Cancelar"
                                variant="btn-cancelar"
                                onClick={fecharEdicao}
                                disabled={salvando}
                            />

                            <Button
                                type="button"
                                label="Salvar alterações"
                                loadingLabel="Salvando..."
                                variant="btn-salvar"
                                onClick={salvarEdicao}
                                loading={salvando}
                            />
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}