import {
    useEffect,
    useState
} from 'react'

import useAuth from '@/contexts/useAuth'

import {
    listarReunioes,
    criarReuniao,
    atualizarReuniao,
    deletarReuniao,
    gerarQRCodeReuniao
} from '@/api/api'

import AlertModal from '@/components/AlertModal/AlertModal'
import ConfirmModal from '@/components/ConfirmModal/ConfirmModal'
import LoadingModal from '@/components/LoadingModal/LoadingModal'
import Button from '@/components/Button/Button'
import BackButton from '@/components/BackButton/BackButton'

import ReuniaoCard from './components/ReuniaoCard'
import ReuniaoFormModal from './components/ReuniaoFormModal'
import ReuniaoInfoModal from './components/ReuniaoInfoModal'
import QRCodeModal from './components/QRCodeModal'

import './ReunioesPage.css'


export default function ReunioesPage() {

    const {
        usuario,
        loading: loadingAuth
    } = useAuth()


    const [
        reunioes,
        setReunioes
    ] = useState([])


    const [
        loading,
        setLoading
    ] = useState(true)


    const [
        erro,
        setErro
    ] = useState(null)


    const [
        reuniaoSelecionada,
        setReuniaoSelecionada
    ] = useState(null)


    const [
        modalFormulario,
        setModalFormulario
    ] = useState(false)


    const [
        modalInformacoes,
        setModalInformacoes
    ] = useState(false)


    const [
        modalQRCode,
        setModalQRCode
    ] = useState(false)


    const [
        confirmDelete,
        setConfirmDelete
    ] = useState(null)


    const [
        salvando,
        setSalvando
    ] = useState(false)


    const [
        gerandoQRCode,
        setGerandoQRCode
    ] = useState(false)


    const [
        qrcode,
        setQRCode
    ] = useState(null)


    useEffect(() => {

        if (
            !loadingAuth &&
            usuario
        ) {

            carregarReunioes()

        }

    }, [
        usuario,
        loadingAuth
    ])


    useEffect(() => {

        return () => {

            if (
                qrcode?.imagemUrl
            ) {

                URL.revokeObjectURL(
                    qrcode.imagemUrl
                )

            }

        }

    }, [
        qrcode
    ])


    async function carregarReunioes() {

        try {

            setLoading(true)

            setErro(null)


            const data =
                await listarReunioes()


            setReunioes(
                data || []
            )

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


    function abrirCriacao() {

        setReuniaoSelecionada(null)

        setModalFormulario(true)

    }


    function abrirEdicao(reuniao) {

        setReuniaoSelecionada(
            reuniao
        )

        setModalFormulario(true)

    }


    function abrirInformacoes(reuniao) {

        setReuniaoSelecionada(
            reuniao
        )


        /*
        O QR Code é uma imagem temporária.
        Portanto, ao abrir outra reunião,
        começamos sem QR Code.
        */

        setQRCode(null)


        setModalInformacoes(true)

    }


    function fecharFormulario() {

        if (salvando) return


        setModalFormulario(false)

        setReuniaoSelecionada(null)

    }


    function fecharInformacoes() {

        if (gerandoQRCode) return


        setModalInformacoes(false)

        setModalQRCode(false)

        setReuniaoSelecionada(null)

        setQRCode(null)

    }


    function fecharQRCode() {

        if (gerandoQRCode) return


        setModalQRCode(false)

    }


    async function salvarReuniao(dados) {

        try {

            setSalvando(true)


            if (reuniaoSelecionada) {

                await atualizarReuniao(
                    reuniaoSelecionada.id,
                    dados
                )


                setErro(
                    'Reunião atualizada com sucesso!'
                )

            } else {

                await criarReuniao(
                    dados
                )


                setErro(
                    'Reunião criada com sucesso!'
                )

            }


            await carregarReunioes()


            setTimeout(() => {

                setModalFormulario(false)

                setReuniaoSelecionada(null)

                setErro(null)

            }, 1500)

        } catch (error) {

            console.error(
                'Erro ao salvar reunião:',
                error
            )


            setErro(
                error.message ||
                'Erro ao salvar reunião'
            )

        } finally {

            setSalvando(false)

        }

    }


    async function confirmarDelete() {

        if (!confirmDelete) return


        try {

            setSalvando(true)


            await deletarReuniao(
                confirmDelete.id
            )


            await carregarReunioes()


            setConfirmDelete(null)


            setErro(
                'Reunião deletada com sucesso!'
            )


            setTimeout(() => {

                setErro(null)

            }, 1500)

        } catch (error) {

            console.error(
                'Erro ao deletar reunião:',
                error
            )


            setErro(
                error.message ||
                'Erro ao deletar reunião'
            )

        } finally {

            setSalvando(false)

        }

    }


    async function gerarNovoQRCode() {

        if (!reuniaoSelecionada) return


        try {

            setGerandoQRCode(true)


            const resultado =
                await gerarQRCodeReuniao(
                    reuniaoSelecionada.id
                )


            const {
                imagem,
                codigo,
                id,
                dataLimite
            } = resultado


            if (
                !imagem ||
                imagem.size === 0
            ) {

                throw new Error(
                    'O QR Code não foi gerado corretamente.'
                )

            }


            if (
                qrcode?.imagemUrl
            ) {

                URL.revokeObjectURL(
                    qrcode.imagemUrl
                )

            }


            const imagemUrl =
                URL.createObjectURL(
                    imagem
                )


            /*
            Aqui você define o link
            que será usado para registrar
            a presença.
            */

            const link =
                `${window.location.origin}/presenca/${codigo}`


            setQRCode({
                imagemUrl,
                codigo,
                id,
                dataLimite,
                link
            })


            /*
            Não precisa mais abrir
            outro modal automaticamente.
            O QR Code aparece no próprio
            modal de informações.
            */

        } catch (error) {

            console.error(
                'Erro ao gerar QR Code:',
                error
            )


            setErro(
                error.message ||
                'Erro ao gerar QR Code'
            )

        } finally {

            setGerandoQRCode(false)

        }

    }


    function abrirQRCode() {

        if (
            !qrcode?.imagemUrl
        ) {

            setErro(
                'Nenhum QR Code disponível para esta reunião.'
            )

            return

        }


        setModalQRCode(true)

    }


    if (
        loading ||
        loadingAuth
    ) {

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

            <BackButton />

            {(salvando || gerandoQRCode) && (

                <LoadingModal
                    mensagem={
                        gerandoQRCode
                            ? 'Gerando QR Code...'
                            : 'Processando...'
                    }
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
                    onFechar={() =>
                        setErro(null)
                    }
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
                    mensagem={
                        `Tem certeza que deseja deletar ` +
                        `"${confirmDelete.titulo}"? ` +
                        `Esta ação não pode ser desfeita.`
                    }
                    onConfirmar={
                        confirmarDelete
                    }
                    onCancelar={() =>
                        setConfirmDelete(null)
                    }
                />

            )}


            {modalFormulario && (

                <ReuniaoFormModal
                    reuniao={
                        reuniaoSelecionada
                    }
                    onSalvar={
                        salvarReuniao
                    }
                    onFechar={
                        fecharFormulario
                    }
                    salvando={
                        salvando
                    }
                />

            )}


            {modalInformacoes &&
                reuniaoSelecionada && (

                    <ReuniaoInfoModal
                        reuniao={
                            reuniaoSelecionada
                        }
                        qrcode={
                            qrcode
                        }
                        onGerarQRCode={
                            gerarNovoQRCode
                        }
                        onAbrirQRCode={
                            abrirQRCode
                        }
                        onFechar={
                            fecharInformacoes
                        }
                        gerando={
                            gerandoQRCode
                        }
                    />

                )}


            {modalQRCode && (

                <QRCodeModal
                    titulo={
                        reuniaoSelecionada
                            ? `QR Code - ${reuniaoSelecionada.titulo}`
                            : 'QR Code'
                    }
                    qrcode={
                        qrcode
                    }
                    onGerarNovo={
                        gerarNovoQRCode
                    }
                    onFechar={
                        fecharQRCode
                    }
                    gerando={
                        gerandoQRCode
                    }
                />

            )}


            <header className="reunioes-header">

                <div>

                    <span className="page-label">

                        Wolf Finance

                    </span>


                    <h1>

                        Reuniões

                    </h1>


                    <p>

                        Gerencie as reuniões
                        e acompanhe as informações.

                    </p>

                </div>


                {usuario?.tipo === 'ADMIN' && (

                    <Button
                        type="button"
                        label="Nova reunião"
                        variant="btn-criar-reuniao"
                        onClick={
                            abrirCriacao
                        }
                    >

                        <i className="fa-solid fa-plus" />

                    </Button>

                )}

            </header>


            <section className="reunioes-section">

                <div className="section-header">

                    <div>

                        <h2>

                            Todas as reuniões

                        </h2>


                        <p>

                            Visualize e gerencie
                            as reuniões da liga.

                        </p>

                    </div>


                    {reunioes.length > 0 && (

                        <div className="reunioes-count">

                            <strong>

                                {reunioes.length}

                            </strong>


                            <span>

                                {reunioes.length === 1
                                    ? 'reunião'
                                    : 'reuniões'
                                }

                            </span>

                        </div>

                    )}

                </div>


                {reunioes.length > 0 ? (

                    <div className="reunioes-lista">

                        {reunioes.map(
                            reuniao => (

                                <ReuniaoCard
                                    key={reuniao.id}
                                    reuniao={reuniao}
                                    loading={
                                        salvando ||
                                        gerandoQRCode
                                    }
                                    onVerInformacoes={() =>
                                        abrirInformacoes(
                                            reuniao
                                        )
                                    }
                                    onEditar={() =>
                                        abrirEdicao(
                                            reuniao
                                        )
                                    }
                                    onDeletar={() =>
                                        setConfirmDelete(
                                            reuniao
                                        )
                                    }
                                />

                            )
                        )}

                    </div>

                ) : (

                    <div className="vazio-container">

                        <i className="fa-solid fa-calendar-xmark" />


                        <p>

                            Nenhuma reunião cadastrada.

                        </p>


                        {usuario?.tipo === 'ADMIN' && (

                            <Button
                                type="button"
                                label="Criar primeira reunião"
                                variant="btn-criar-reuniao"
                                onClick={
                                    abrirCriacao
                                }
                            />

                        )}

                    </div>

                )}

            </section>

        </main>

    )

}