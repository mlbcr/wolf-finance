import Button from '@/components/Button/Button'

import './ReuniaoInfoModal.css'


function formatarData(data) {

    if (!data) return '--'


    const date = new Date(
        data + 'T00:00:00'
    )


    return date.toLocaleDateString(
        'pt-BR',
        {
            weekday: 'long',
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        }
    )

}


function formatarHora(hora) {

    if (!hora) return '--:--'

    return hora.substring(0, 5)

}


export default function ReuniaoInfoModal({
    reuniao,
    qrcode,
    onGerarQRCode,
    onFechar,
    onAbrirQRCode,
    gerando
}) {

    const temQRCode =
        Boolean(
            qrcode?.imagemUrl
        )


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
                className="modal-container reuniao-info-modal"
                onClick={(e) =>
                    e.stopPropagation()
                }
            >

                <div className="modal-header">

                    <h2>

                        Informações da Reunião

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


                <div className="modal-body reuniao-info-body">


                    {/* ================================================= */}
                    {/* INFORMAÇÕES */}
                    {/* ================================================= */}

                    <div className="reuniao-info-section">

                        <h3>

                            {reuniao.titulo}

                        </h3>


                        {reuniao.descricao && (

                            <p>

                                {reuniao.descricao}

                            </p>

                        )}

                    </div>


                    <div className="reuniao-info-grid">

                        <div className="reuniao-info-item">

                            <div className="reuniao-info-icon">

                                <i className="fa-solid fa-calendar" />

                            </div>


                            <div>

                                <span>

                                    Data

                                </span>


                                <strong>

                                    {formatarData(
                                        reuniao.data
                                    )}

                                </strong>

                            </div>

                        </div>


                        <div className="reuniao-info-item">

                            <div className="reuniao-info-icon">

                                <i className="fa-solid fa-clock" />

                            </div>


                            <div>

                                <span>

                                    Horário

                                </span>


                                <strong>

                                    {formatarHora(
                                        reuniao.hora_inicio
                                    )}

                                    {' - '}

                                    {formatarHora(
                                        reuniao.hora_fim
                                    )}

                                </strong>

                            </div>

                        </div>

                    </div>


                    {/* ================================================= */}
                    {/* QR CODE */}
                    {/* ================================================= */}

                    <div className="reuniao-qrcode-section">


                        <div className="reuniao-qrcode-header">

                            <div>

                                <div className="reuniao-qrcode-title">

                                    <i className="fa-solid fa-qrcode" />


                                    <h3>

                                        Presença

                                    </h3>

                                </div>


                                <p>

                                    Utilize o QR Code abaixo
                                    para registrar a presença
                                    dos membros nesta reunião.

                                </p>

                            </div>


                            <Button
                                type="button"
                                label={
                                    temQRCode
                                        ? 'Gerar novo'
                                        : 'Gerar QR Code'
                                }
                                variant="btn-gerar-qrcode"
                                disabled={gerando}
                                loading={gerando}
                                loadingLabel="Gerando..."
                                onClick={
                                    onGerarQRCode
                                }
                            >

                                <i className="fa-solid fa-rotate" />

                            </Button>

                        </div>


                        {temQRCode ? (

                            <div className="reuniao-qrcode-preview">


                                <div className="reuniao-qrcode-image-container">

                                    <img
                                        src={
                                            qrcode.imagemUrl
                                        }
                                        alt="QR Code para registrar presença"
                                        className="reuniao-qrcode-image"
                                    />

                                </div>


                                <div className="reuniao-qrcode-preview-info">


                                    <div>

                                        <span className="qrcode-status">

                                            <i className="fa-solid fa-circle-check" />

                                            QR Code ativo

                                        </span>


                                        <p>

                                            Escaneie o código
                                            ou abra o QR Code
                                            para visualizar o link.

                                        </p>

                                    </div>


                                    <Button
                                        type="button"
                                        label="Visualizar"
                                        variant="btn-info"
                                        disabled={gerando}
                                        onClick={
                                            onAbrirQRCode
                                        }
                                    >

                                        <i className="fa-solid fa-expand" />

                                    </Button>

                                </div>

                            </div>

                        ) : (

                            <div className="reuniao-qrcode-empty">

                                <div className="reuniao-qrcode-empty-icon">

                                    <i className="fa-solid fa-qrcode" />

                                </div>


                                <div>

                                    <h4>

                                        Nenhum QR Code ativo

                                    </h4>


                                    <p>

                                        Gere um QR Code para
                                        permitir o registro de
                                        presença nesta reunião.

                                    </p>

                                </div>

                            </div>

                        )}

                    </div>


                </div>


                <div className="modal-footer">

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