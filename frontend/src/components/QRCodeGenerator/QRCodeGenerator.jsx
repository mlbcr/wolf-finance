import { useState } from 'react'
import { gerarQRCodeSala } from '@/api/api'
import './QRCodeGenerator.css'

export default function QRCodeGenerator() {
    const [carregando, setCarregando] = useState(false)
    const [qrcodeUrl, setQrcodeUrl] = useState(null)
    const [erro, setErro] = useState(null)
    const [mostrarModal, setMostrarModal] = useState(false)

    async function gerarQRCode() {
        try {
            setCarregando(true)
            setErro(null)

            const blob = await gerarQRCodeSala()

            // Cria uma URL temporária para exibir
            const url = URL.createObjectURL(blob)
            setQrcodeUrl(url)
            setMostrarModal(true)
        } catch (error) {
            setErro(error.message || 'Erro ao gerar QR Code')
        } finally {
            setCarregando(false)
        }
    }

    function downloadQRCode() {
        if (!qrcodeUrl) return

        const link = document.createElement('a')
        link.href = qrcodeUrl
        link.download = `qrcode-sala-${new Date().getTime()}.png`
        link.click()
    }

    function fecharModal() {
        setMostrarModal(false)
    }

    return (
        <>
            <button
                className="btn-gerar-qrcode"
                onClick={gerarQRCode}
                disabled={carregando}
                title="Gerar QR Code de presença"
            >
                <i className="fa-solid fa-qrcode"></i>
                {carregando ? 'Gerando...' : 'Gerar QR Code'}
            </button>

            {erro && (
                <div className="qrcode-erro">
                    <i className="fa-solid fa-exclamation-circle"></i>
                    <span>{erro}</span>
                </div>
            )}

            {mostrarModal && qrcodeUrl && (
                <div className="qrcode-modal-overlay" onClick={fecharModal}>
                    <div className="qrcode-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="qrcode-modal-header">
                            <h3>QR Code de Presença na Sala</h3>
                            <button className="btn-fechar" onClick={fecharModal}>
                                <i className="fa-solid fa-times"></i>
                            </button>
                        </div>

                        <div className="qrcode-modal-body">
                            <img src={qrcodeUrl} alt="QR Code" className="qrcode-imagem" />
                            <p className="qrcode-info">
                                <i className="fa-solid fa-info-circle"></i>
                                Válido por 5 minutos
                            </p>
                        </div>

                        <div className="qrcode-modal-footer">
                            <button className="btn-cancelar" onClick={fecharModal}>
                                Fechar
                            </button>
                            <button className="btn-download" onClick={downloadQRCode}>
                                <i className="fa-solid fa-download"></i>
                                Baixar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
