import { useEffect, useState } from 'react'

import useAuth from '@/contexts/useAuth'

import {
    listarReunioes,
    criarReuniao,
    atualizarReuniao,
    deletarReuniao,
    gerarQRCodeReuniao,
    listarPresencasReuniao
} from '@/api/api'

import AlertModal from '@/components/AlertModal/AlertModal'
import ConfirmModal from '@/components/ConfirmModal/ConfirmModal'
import LoadingModal from '@/components/LoadingModal/LoadingModal'
import Button from '@/components/Button/Button'

import './ReunioesPage.css'


function formatarData(data) {
    const date = new Date(data + 'T00:00:00')

    return date.toLocaleDateString('pt-BR', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })
}


function formatarHora(time) {
    if (!time) return '--:--'

    return time.substring(0, 5)
}


export default function ReunioesPage() {
    const { usuario, loading: loadingAuth } = useAuth()

    const [reunioes, setReunioes] = useState([])
    const [loading, setLoading] = useState(true)
    const [erro, setErro] = useState(null)

    const [modalAberto, setModalAberto] = useState(false)
    const [modalPresencas, setModalPresencas] = useState(false)

    const [reuniaoSelecionada, setReuniaoSelecionada] = useState(null)
    const [presencas, setPresencas] = useState([])

    const [dados, setDados] = useState({
        numero: '',
        hora: '',
        data: '',
        tipo: 'PRESENCIAL',
        equipe_id: null
    })

    const [confirmDelete, setConfirmDelete] = useState(null)
    const [processando, setProcessando] = useState(false)


    useEffect(() => {
        if (!loadingAuth && usuario) {
            carregarReunioes()
        }
    }, [usuario, loadingAuth])


    async function carregarReunioes() {
        try {
            setLoading(true)
            setErro(null)

            const dados = await listarReunioes()

            const sorted = (dados || []).sort((a, b) => {
                return new Date(b.data) - new Date(a.data)
            })

            setReunioes(sorted)

        } catch (error) {
            console.error(
                'Erro ao carregar reuniões:',
                error
            )

            setErro(
                error.message ||
                'Erro ao carregar reuniões'
            )

        } finally {
            setLoading(false)
        }
    }


    function abrirModalNova() {
        setDados({
            numero: '',
            hora: '',
            data: '',
            tipo: 'PRESENCIAL',
            equipe_id: null
        })

        setModalAberto(true)
    }


    function fecharModal() {
        if (processando) return

        setModalAberto(false)
    }


    async function salvarReuniao() {
        try {
            if (
                !dados.numero ||
                !dados.hora ||
                !dados.data
            ) {
                setErro(
                    'Preencha todos os campos obrigatórios'
                )

                return
            }

            setProcessando(true)

            const payload = {
                numero: parseInt(dados.numero),
                hora: dados.hora,
                data: dados.data,
                tipo: dados.tipo,
                equipe_id: dados.equipe_id || null
            }

            await criarReuniao(payload)

            await carregarReunioes()

            setErro(
                'Reunião criada com sucesso!'
            )

            setTimeout(() => {
                fecharModal()
                setErro(null)
            }, 1500)

        } catch (error) {
            setErro(
                error.message ||
                'Erro ao criar reunião'
            )

        } finally {
            setProcessando(false)
        }
    }


    async function gerarQRCode(reuniao) {
        try {
            const blob =
                await gerarQRCodeReuniao(reuniao.id)

            const url = URL.createObjectURL(blob)

            const link =
                document.createElement('a')

            link.href = url

            link.download =
                `qrcode-reuniao-${reuniao.numero}.png`

            link.click()

            URL.revokeObjectURL(url)

        } catch (error) {
            setErro(
                error.message ||
                'Erro ao gerar QR Code'
            )
        }
    }


    async function verPresencas(reuniao) {
        try {
            setProcessando(true)

            setReuniaoSelecionada(reuniao)

            const presencasData =
                await listarPresencasReuniao(
                    reuniao.id
                )

            setPresencas(
                presencasData || []
            )

            setModalPresencas(true)

        } catch (error) {
            setErro(
                error.message ||
                'Erro ao carregar presenças'
            )

        } finally {
            setProcessando(false)
        }
    }


    async function confirmarDeleteReuniao() {
        try {
            setProcessando(true)

            await deletarReuniao(confirmDelete)

            await carregarReunioes()

            setConfirmDelete(null)

            setErro(
                'Reunião deletada com sucesso!'
            )

            setTimeout(() => {
                setErro(null)
            }, 1500)

        } catch (error) {
            setErro(
                error.message ||
                'Erro ao deletar reunião'
            )

        } finally {
            setProcessando(false)
        }
    }


    const isAdmin = usuario?.tipo === 'ADMIN'


    if (loading || loadingAuth) {
        return (
            <main className="reunioes-page">
                <LoadingModal
                    mensagem="Carregando reuniões..."
                />
            </main>
        )
    }


    return (
        <main className="reunioes-page">

            {/* MODAIS */}

            {processando && (
                <LoadingModal
                    mensagem="Processando..."
                />
            )}

            {erro && (
                <AlertModal
                    titulo={
                        erro.includes('sucesso')
                            ? 'Sucesso'
                            : 'Erro'
                    }
                    mensagem={erro}
                    onFechar={() => setErro(null)}
                    tipo={
                        erro.includes('sucesso')
                            ? 'sucesso'
                            : 'erro'
                    }
                />
            )}

            {confirmDelete && (
                <ConfirmModal
                    titulo="Deletar Reunião"
                    mensagem="Tem certeza que deseja deletar esta reunião? Esta ação não pode ser desfeita."
                    onConfirmar={confirmarDeleteReuniao}
                    onCancelar={() =>
                        setConfirmDelete(null)
                    }
                />
            )}


            {/* HEADER */}

            <header className="reunioes-header">

                <div>
                    <span className="page-label">
                        Wolf Finance
                    </span>

                    <h1>Reuniões</h1>

                    <p>
                        Acompanhe as reuniões programadas
                    </p>
                </div>


                {isAdmin && (
                    <Button
                        variant="btn-nova-reuniao"
                        onClick={abrirModalNova}
                    >
                        <i className="fa-solid fa-plus"></i>
                        Nova reunião
                    </Button>
                )}

            </header>


            {/* LISTA DE REUNIÕES */}

            <section className="reunioes-section">

                <div className="section-header">

                    <div>
                        <h2>
                            Reuniões programadas
                        </h2>

                        <p>
                            Lista de todas as reuniões
                        </p>
                    </div>


                    {reunioes.length > 0 && (
                        <div className="reunioes-count">

                            <strong>
                                {reunioes.length}
                            </strong>

                            <span>
                                reuniões
                            </span>

                        </div>
                    )}

                </div>


                {reunioes.length > 0 ? (

                    <div className="reunioes-lista">

                        {reunioes.map(reuniao => (

                            <div
                                key={reuniao.id}
                                className="reuniao-item"
                            >

                                <div className="reuniao-info">

                                    <div className="reuniao-numero">

                                        <span className="badge">
                                            #{reuniao.numero}
                                        </span>

                                    </div>


                                    <div className="reuniao-detalhes">

                                        <div className="reuniao-data-hora">

                                            <i className="fa-solid fa-calendar"></i>

                                            <span>
                                                {formatarData(
                                                    reuniao.data
                                                )}
                                            </span>

                                            <span className="separador">
                                                •
                                            </span>

                                            <i className="fa-solid fa-clock"></i>

                                            <span>
                                                {formatarHora(
                                                    reuniao.hora
                                                )}
                                            </span>

                                        </div>


                                        <div className="reuniao-tipo">

                                            <i className="fa-solid fa-video"></i>

                                            <span>
                                                {reuniao.tipo}
                                            </span>

                                        </div>

                                    </div>

                                </div>


                                <div className="reuniao-acoes">

                                    {isAdmin && (
                                        <>

                                            <Button
                                                variant="btn-qrcode"
                                                onClick={() =>
                                                    gerarQRCode(reuniao)
                                                }
                                                title="Gerar QR Code"
                                            >
                                                <i className="fa-solid fa-qrcode"></i>
                                            </Button>


                                            <Button
                                                variant="btn-presencas"
                                                onClick={() =>
                                                    verPresencas(reuniao)
                                                }
                                                title="Ver presenças"
                                                disabled={processando}
                                            >
                                                <i className="fa-solid fa-users"></i>
                                            </Button>


                                            <Button
                                                variant="btn-deletar"
                                                onClick={() =>
                                                    setConfirmDelete(
                                                        reuniao.id
                                                    )
                                                }
                                                title="Deletar reunião"
                                                disabled={processando}
                                            >
                                                <i className="fa-solid fa-trash"></i>
                                            </Button>

                                        </>
                                    )}

                                </div>

                            </div>

                        ))}

                    </div>

                ) : (

                    <div className="vazio-container">

                        <i className="fa-solid fa-calendar-xmark"></i>

                        <p>
                            Nenhuma reunião programada
                        </p>

                    </div>

                )}

            </section>


            {/* MODAL NOVA REUNIÃO */}

            {modalAberto && isAdmin && (

                <div
                    className="modal-overlay"
                    onClick={fecharModal}
                >

                    <div
                        className="modal-container"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <div className="modal-header">

                            <h2>
                                Nova Reunião
                            </h2>


                            <Button
                                type="button"
                                variant="btn-fechar"
                                onClick={fecharModal}
                                disabled={processando}
                            >
                                <i className="fa-solid fa-times"></i>
                            </Button>

                        </div>


                        <div className="modal-body">

                            <div className="form-group">

                                <label htmlFor="numero">
                                    Número
                                </label>

                                <input
                                    type="number"
                                    id="numero"
                                    min="1"
                                    value={dados.numero}
                                    onChange={(e) =>
                                        setDados({
                                            ...dados,
                                            numero: e.target.value
                                        })
                                    }
                                    disabled={processando}
                                />

                            </div>


                            <div className="form-row">

                                <div className="form-group">

                                    <label htmlFor="data">
                                        Data
                                    </label>

                                    <input
                                        type="date"
                                        id="data"
                                        value={dados.data}
                                        onChange={(e) =>
                                            setDados({
                                                ...dados,
                                                data: e.target.value
                                            })
                                        }
                                        disabled={processando}
                                    />

                                </div>


                                <div className="form-group">

                                    <label htmlFor="hora">
                                        Hora
                                    </label>

                                    <input
                                        type="time"
                                        id="hora"
                                        value={dados.hora}
                                        onChange={(e) =>
                                            setDados({
                                                ...dados,
                                                hora: e.target.value
                                            })
                                        }
                                        disabled={processando}
                                    />

                                </div>

                            </div>


                            <div className="form-group">

                                <label htmlFor="tipo">
                                    Tipo
                                </label>

                                <select
                                    id="tipo"
                                    value={dados.tipo}
                                    onChange={(e) =>
                                        setDados({
                                            ...dados,
                                            tipo: e.target.value
                                        })
                                    }
                                    disabled={processando}
                                >

                                    <option value="PRESENCIAL">
                                        Presencial
                                    </option>

                                    <option value="ONLINE">
                                        Online
                                    </option>

                                    <option value="HIBRIDA">
                                        Híbrida
                                    </option>

                                </select>

                            </div>

                        </div>


                        <div className="modal-footer">

                            <Button
                                type="button"
                                label="Cancelar"
                                variant="btn-cancelar"
                                onClick={fecharModal}
                                disabled={processando}
                            />


                            <Button
                                type="button"
                                label="Criar"
                                loadingLabel="Criando..."
                                variant="btn-salvar"
                                onClick={salvarReuniao}
                                loading={processando}
                            />

                        </div>

                    </div>

                </div>

            )}


            {/* MODAL PRESENÇAS */}

            {modalPresencas && (

                <div
                    className="modal-overlay"
                    onClick={() =>
                        setModalPresencas(false)
                    }
                >

                    <div
                        className="modal-container"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <div className="modal-header">

                            <h2>
                                Presenças - Reunião #
                                {reuniaoSelecionada?.numero}
                            </h2>


                            <Button
                                type="button"
                                variant="btn-fechar"
                                onClick={() =>
                                    setModalPresencas(false)
                                }
                            >
                                <i className="fa-solid fa-times"></i>
                            </Button>

                        </div>


                        <div className="modal-body">

                            {presencas.length > 0 ? (

                                <div className="presencas-lista">

                                    {presencas.map(
                                        presenca => (

                                            <div
                                                key={presenca.id}
                                                className="presenca-item"
                                            >

                                                <div>

                                                    <p className="presenca-aluno-id">
                                                        {
                                                            presenca.aluno_id
                                                        }
                                                    </p>

                                                    <p className="presenca-horario">
                                                        {
                                                            new Date(
                                                                presenca.registrada_em
                                                            ).toLocaleString(
                                                                'pt-BR'
                                                            )
                                                        }
                                                    </p>

                                                </div>

                                            </div>

                                        )
                                    )}

                                </div>

                            ) : (

                                <div className="vazio-modal">

                                    <p>
                                        Nenhuma presença registrada
                                    </p>

                                </div>

                            )}

                        </div>


                        <div className="modal-footer">

                            <Button
                                type="button"
                                label="Fechar"
                                variant="btn-fechar-modal"
                                onClick={() =>
                                    setModalPresencas(false)
                                }
                            />

                        </div>

                    </div>

                </div>

            )}

        </main>
    )
}