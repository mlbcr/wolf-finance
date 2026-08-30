import { useState } from 'react'

import Button from '@/components/Button/Button'

import './QRCodeModal.css'


export default function QRCodeModal({
    titulo = 'QR Code',
    qrcode,
    onGerarNovo,
    onFechar,
    gerando
}) {

    const [
        copiado,
        setCopiado
    ] = useState(false)


    const imagemUrl =
        qrcode?.imagemUrl


    const link =
        qrcode?.link


    const codigo =
        qrcode?.codigo


    function copiarLink() {

        if (!link) return


        navigator.clipboard
            .writeText(link)
            .then(() => {

                setCopiado(true)


                setTimeout(() => {

                    setCopiado(false)

                }, 2000)

            })
            .catch((error) => {

                console.error(
                    'Erro ao copiar link:',
                    error
                )

            })

    }


    return (

        <div
            className="modal-overlay"
            onClick={
                gerando
                    ? undefined
                    : onFechar
            }
        >

            <div
                className="modal-container qrcode-modal"
                onClick={(e) =>
                    e.stopPropagation()
                }
            >

                <div className="modal-header">

                    <h2>

                        {titulo}

                    </h2>


                    <Button
                        type="button"
                        variant="btn-fechar"
                        onClick={onFechar}
                        disabled={gerando}
                    >

                        <i className="fa-solid fa-times" />

                    </Button>

                </div>


                <div className="modal-body qrcode-body">

                    {imagemUrl ? (

                        <>

                            <div className="qrcode-container">

                                <img
                                    src={imagemUrl}
                                    alt="QR Code para registrar presença"
                                    className="qrcode-imagem"
                                />

                            </div>


                            <p className="qrcode-instrucao">

                                Escaneie o QR Code ou utilize
                                o link abaixo para registrar
                                a presença nesta reunião.

                            </p>


                            {/* LINK */}

                            {link && (

                                <div className="qrcode-link-section">

                                    <label>

                                        Link para presença

                                    </label>


                                    <div className="qrcode-link-container">

                                        <input
                                            type="text"
                                            value={link}
                                            readOnly
                                            onFocus={(e) =>
                                                e.target.select()
                                            }
                                        />


                                        <button
                                            type="button"
                                            className="qrcode-copy-button"
                                            onClick={copiarLink}
                                            title="Copiar link"
                                        >

                                            <i
                                                className={
                                                    copiado
                                                        ? 'fa-solid fa-check'
                                                        : 'fa-solid fa-copy'
                                                }
                                            />

                                        </button>

                                    </div>


                                    {copiado && (

                                        <span className="qrcode-copiado">

                                            Link copiado!

                                        </span>

                                    )}

                                </div>

                            )}


                            {/* CÓDIGO */}

                            {codigo && (

                                <div className="qrcode-codigo-section">

                                    <span>

                                        Código do QR Code

                                    </span>


                                    <code>

                                        {codigo}

                                    </code>

                                </div>

                            )}

                        </>

                    ) : (

                        <div className="qrcode-vazio">

                            <i className="fa-solid fa-qrcode" />


                            <h3>

                                Nenhum QR Code gerado

                            </h3>


                            <p>

                                Clique em gerar QR Code
                                para criar um novo código.

                            </p>

                        </div>

                    )}

                </div>


                <div className="modal-footer qrcode-footer">

                    {onGerarNovo && (

                        <Button
                            type="button"
                            label={
                                imagemUrl
                                    ? 'Gerar novo QR Code'
                                    : 'Gerar QR Code'
                            }
                            variant="btn-gerar-qrcode"
                            disabled={gerando}
                            loading={gerando}
                            loadingLabel="Gerando..."
                            onClick={onGerarNovo}
                        >

                            <i className="fa-solid fa-rotate" />

                        </Button>

                    )}


                    <Button
                        type="button"
                        label="Fechar"
                        variant="btn-cancelar"
                        disabled={gerando}
                        onClick={onFechar}
                    />

                </div>

            </div>

        </div>

    )

}