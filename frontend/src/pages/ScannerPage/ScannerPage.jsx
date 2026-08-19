import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import useAuth from '@/contexts/useAuth'

import {
    registrarPresencaSala,
    registrarPresencaReuniao
} from '@/api/api'

import AlertModal from '@/components/AlertModal/AlertModal'
import PromptModal from '@/components/PromptModal/PromptModal'
import LoadingModal from '@/components/LoadingModal/LoadingModal'
import Button from '@/components/Button/Button'

import jsQR from 'jsqr'

import './ScannerPage.css'

export default function ScannerPage() {
    const navigate = useNavigate()

    const { usuario, loading: loadingAuth } = useAuth()

    const videoRef = useRef(null)
    const canvasRef = useRef(null)
    const inputRef = useRef(null)

    const [scanning, setScanning] = useState(false)
    const [carregando, setCarregando] = useState(false)
    const [sucesso, setSucesso] = useState(null)
    const [erro, setErro] = useState(null)
    const [modo, setModo] = useState('camera')
    const [mostrarPrompt, setMostrarPrompt] = useState(false)

    const processandoCodigoRef = useRef(false)

    useEffect(() => {
        if (!loadingAuth && !usuario) {
            navigate('/login')
        }
    }, [usuario, loadingAuth, navigate])

    useEffect(() => {
        return () => {
            pararCamera()
        }
    }, [])

    async function iniciarCamera() {
        try {
            setErro(null)
            setSucesso(null)

            processandoCodigoRef.current = false

            if (!navigator.mediaDevices?.getUserMedia) {
                setErro(
                    'Seu navegador não permite acesso à câmera.'
                )

                return
            }

            const stream =
                await navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: {
                            ideal: 'environment'
                        }
                    },
                    audio: false
                })

            if (videoRef.current) {
                videoRef.current.srcObject = stream

                await videoRef.current.play()

                setScanning(true)
            }

        } catch (error) {
            console.error(
                'Erro ao acessar câmera:',
                error
            )

            setErro(
                'Não foi possível acessar a câmera. Verifique as permissões do navegador ou use o modo arquivo.'
            )
        }
    }

    function processoScan() {
        if (
            !videoRef.current ||
            !canvasRef.current ||
            !videoRef.current.videoWidth ||
            processandoCodigoRef.current
        ) {
            return
        }

        const video = videoRef.current
        const canvas = canvasRef.current

        const ctx = canvas.getContext(
            '2d',
            {
                willReadFrequently: true
            }
        )

        canvas.width = video.videoWidth
        canvas.height = video.videoHeight

        ctx.drawImage(
            video,
            0,
            0,
            canvas.width,
            canvas.height
        )

        const imageData = ctx.getImageData(
            0,
            0,
            canvas.width,
            canvas.height
        )

        const qrCode = jsQR(
            imageData.data,
            imageData.width,
            imageData.height,
            {
                inversionAttempts: 'attemptBoth'
            }
        )

        if (qrCode) {
            processandoCodigoRef.current = true

            processarCodigo(qrCode.data)

            return
        }

        if (videoRef.current?.srcObject) {
            requestAnimationFrame(processoScan)
        }
    }

    function handleVideoPlay() {
        processoScan()
    }

    function pararCamera() {
        if (
            videoRef.current &&
            videoRef.current.srcObject
        ) {
            videoRef.current.srcObject
                .getTracks()
                .forEach(track => track.stop())

            videoRef.current.srcObject = null
        }

        setScanning(false)
    }

    async function processarCodigo(codigo) {
        if (!codigo) {
            processandoCodigoRef.current = false

            setErro(
                'QR Code vazio ou inválido'
            )

            return
        }

        try {
            setCarregando(true)
            setErro(null)

            if (
                codigo.includes(
                    '/presenca/sala/'
                )
            ) {
                const partes = codigo.split(
                    '/presenca/sala/'
                )

                const codigoExtraido =
                    partes[1]?.split(/[?#]/)[0]

                if (!codigoExtraido) {
                    throw new Error(
                        'Código de presença da sala inválido'
                    )
                }

                const resposta =
                    await registrarPresencaSala(
                        codigoExtraido
                    )

                setSucesso({
                    tipo: 'SALA',
                    mensagem:
                        resposta?.mensagem ||
                        'Presença registrada na sala com sucesso!'
                })

                setTimeout(() => {
                    navigate('/presencas')
                }, 1500)

                return
            }

            if (
                codigo.includes(
                    '/presenca/reuniao/'
                )
            ) {
                const partes = codigo.split(
                    '/presenca/reuniao/'
                )

                const codigoExtraido =
                    partes[1]?.split(/[?#]/)[0]

                if (!codigoExtraido) {
                    throw new Error(
                        'Código de presença da reunião inválido'
                    )
                }

                const resposta =
                    await registrarPresencaReuniao(
                        codigoExtraido
                    )

                setSucesso({
                    tipo: 'REUNIAO',
                    mensagem:
                        resposta?.mensagem ||
                        'Presença em reunião registrada com sucesso!'
                })

                setTimeout(() => {
                    navigate('/reunioes')
                }, 1500)

                return
            }

            setErro(
                'QR Code inválido ou não reconhecido.'
            )

            processandoCodigoRef.current = false

        } catch (error) {
            console.error(
                'Erro ao processar QR Code:',
                error
            )

            let mensagem =
                'Erro ao processar QR Code'

            if (error?.message) {
                mensagem = error.message
            }

            setErro(mensagem)

            processandoCodigoRef.current = false

        } finally {
            setCarregando(false)

            pararCamera()
        }
    }

    function lerQRCodeDaImagem(img) {
        const canvas = canvasRef.current

        if (!canvas) {
            setErro(
                'Não foi possível processar a imagem.'
            )

            return
        }

        const ctx = canvas.getContext(
            '2d',
            {
                willReadFrequently: true
            }
        )

        canvas.width =
            img.naturalWidth || img.width

        canvas.height =
            img.naturalHeight || img.height

        ctx.drawImage(
            img,
            0,
            0,
            canvas.width,
            canvas.height
        )

        const imageData = ctx.getImageData(
            0,
            0,
            canvas.width,
            canvas.height
        )

        const qrCode = jsQR(
            imageData.data,
            imageData.width,
            imageData.height,
            {
                inversionAttempts: 'attemptBoth'
            }
        )

        if (!qrCode) {
            setErro(
                'Não foi possível encontrar um QR Code nessa imagem.'
            )

            return
        }

        processandoCodigoRef.current = true

        processarCodigo(qrCode.data)
    }

    function handleInputMudou(e) {
        const arquivo = e.target.files?.[0]

        if (!arquivo) {
            return
        }

        setErro(null)
        setSucesso(null)

        const reader = new FileReader()

        reader.onload = event => {
            const img = new Image()

            img.onload = () => {
                lerQRCodeDaImagem(img)
            }

            img.onerror = () => {
                setErro(
                    'Não foi possível carregar a imagem.'
                )
            }

            img.src = event.target.result
        }

        reader.onerror = () => {
            setErro(
                'Não foi possível ler o arquivo.'
            )
        }

        reader.readAsDataURL(arquivo)

        e.target.value = ''
    }

    function handleCodigoCola() {
        setErro(null)

        setMostrarPrompt(true)
    }

    function handlePromptConfirmar(codigo) {
        setMostrarPrompt(false)

        if (!codigo?.trim()) {
            return
        }

        processandoCodigoRef.current = true

        processarCodigo(
            codigo.trim()
        )
    }

    function mudarModo(novoModo) {
        pararCamera()

        setModo(novoModo)
        setErro(null)
        setSucesso(null)

        processandoCodigoRef.current = false
    }

    if (loadingAuth) {
        return (
            <main className="scanner-page">
                <p>Carregando...</p>
            </main>
        )
    }

    return (
        <main className="scanner-page">

            {/* HEADER */}

            <header className="scanner-header">

                <Button
                    variant="btn-voltar"
                    onClick={() => navigate(-1)}
                >
                    <i className="fa-solid fa-arrow-left"></i>
                </Button>

                <div>
                    <h1>Escanear QR Code</h1>

                    <p>
                        Escaneie o código de presença
                    </p>
                </div>

                <div></div>

            </header>

            {/* CONTAINER */}

            <div className="scanner-container">

                {carregando && (
                    <LoadingModal
                        mensagem="Processando..."
                    />
                )}

                {erro && (
                    <AlertModal
                        titulo="Erro"
                        mensagem={erro}
                        onFechar={() => {
                            setErro(null)

                            processandoCodigoRef.current =
                                false
                        }}
                        tipo="erro"
                    />
                )}

                {mostrarPrompt && (
                    <PromptModal
                        titulo="Escanear Manualmente"
                        mensagem="Cole o código do QR Code:"
                        placeholder="Código..."
                        onConfirmar={
                            handlePromptConfirmar
                        }
                        onCancelar={() =>
                            setMostrarPrompt(false)
                        }
                    />
                )}

                {sucesso && (
                    <div className="sucesso-container">

                        <i className="fa-solid fa-circle-check"></i>

                        <h2>
                            Sucesso!
                        </h2>

                        <p>
                            {sucesso.mensagem}
                        </p>

                    </div>
                )}

                {/* CAMERA */}

                {modo === 'camera' && !sucesso && (

                    <div className="modo-camera">

                        <div className="video-container">

                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                onPlay={handleVideoPlay}
                                style={{
                                    display: scanning
                                        ? 'block'
                                        : 'none'
                                }}
                            />

                            <canvas
                                ref={canvasRef}
                                style={{
                                    display: 'none'
                                }}
                            />

                            {!scanning && (
                                <div className="placeholder-camera">

                                    <i className="fa-solid fa-camera"></i>

                                    <p>
                                        Câmera não iniciada
                                    </p>

                                </div>
                            )}

                            {scanning && (
                                <div className="scanning-overlay">

                                    <div className="scan-frame">

                                        <span className="corner corner-top-left"></span>

                                        <span className="corner corner-top-right"></span>

                                        <span className="corner corner-bottom-left"></span>

                                        <span className="corner corner-bottom-right"></span>

                                    </div>

                                    <p>
                                        Aponte a câmera para o QR Code
                                    </p>

                                </div>
                            )}

                        </div>

                        <div className="camera-controles">

                            {!scanning ? (

                                <Button
                                    variant="btn-iniciar"
                                    onClick={iniciarCamera}
                                    disabled={carregando}
                                >
                                    <i className="fa-solid fa-play"></i>
                                    Iniciar câmera
                                </Button>

                            ) : (

                                <Button
                                    variant="btn-parar"
                                    onClick={pararCamera}
                                    disabled={carregando}
                                >
                                    <i className="fa-solid fa-stop"></i>
                                    Parar câmera
                                </Button>

                            )}

                        </div>

                    </div>
                )}

                {/* ARQUIVO */}

                {modo === 'arquivo' && !sucesso && (

                    <div className="modo-arquivo">

                        <div className="upload-area">

                            <input
                                ref={inputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleInputMudou}
                                style={{
                                    display: 'none'
                                }}
                            />

                            <Button
                                variant="btn-upload"
                                onClick={() =>
                                    inputRef.current?.click()
                                }
                                disabled={carregando}
                            >
                                <i className="fa-solid fa-image"></i>

                                <span>
                                    Escolher imagem
                                </span>
                            </Button>

                            <p>ou</p>

                            <Button
                                variant="btn-colar"
                                onClick={handleCodigoCola}
                                disabled={carregando}
                            >
                                <i className="fa-solid fa-paste"></i>

                                <span>
                                    Colar código manualmente
                                </span>
                            </Button>

                        </div>

                    </div>
                )}

                {/* SELETOR */}

                {!sucesso && (

                    <div className="modo-seletor">

                        <Button
                            variant={`btn-modo ${
                                modo === 'camera'
                                    ? 'ativo'
                                    : ''
                            }`}
                            onClick={() =>
                                mudarModo('camera')
                            }
                            disabled={carregando}
                        >
                            <i className="fa-solid fa-camera"></i>
                            Câmera
                        </Button>

                        <Button
                            variant={`btn-modo ${
                                modo === 'arquivo'
                                    ? 'ativo'
                                    : ''
                            }`}
                            onClick={() =>
                                mudarModo('arquivo')
                            }
                            disabled={carregando}
                        >
                            <i className="fa-solid fa-image"></i>
                            Arquivo
                        </Button>

                    </div>
                )}

            </div>

        </main>
    )
}