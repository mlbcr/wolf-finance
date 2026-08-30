import Button from '@/components/Button/Button'

import './ReuniaoCard.css'


function formatarData(data) {
    if (!data) return ''

    const date = new Date(
        data + 'T00:00:00'
    )

    return date.toLocaleDateString(
        'pt-BR',
        {
            weekday: 'short',
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        }
    )
}


function formatarHora(hora) {
    if (!hora) return '--:--'

    return hora.substring(0, 5)
}


export default function ReuniaoCard({
    reuniao,
    onVerInformacoes,
    onEditar,
    onDeletar,
    loading
}) {

    return (

        <article className="reuniao-card">

            <div className="reuniao-card-info">

                <div className="reuniao-icon">

                    <i className="fa-solid fa-users" />

                </div>


                <div className="reuniao-detalhes">

                    <h3>
                        {reuniao.titulo}
                    </h3>


                    {reuniao.descricao && (

                        <p className="reuniao-descricao">

                            {reuniao.descricao}

                        </p>

                    )}


                    <div className="reuniao-meta">

                        <span>

                            <i className="fa-solid fa-calendar" />

                            {formatarData(
                                reuniao.data
                            )}

                        </span>


                        <span>

                            <i className="fa-solid fa-clock" />

                            {formatarHora(
                                reuniao.hora_inicio
                            )}

                            {reuniao.hora_fim && (
                                <>
                                    {' - '}

                                    {formatarHora(
                                        reuniao.hora_fim
                                    )}
                                </>
                            )}

                        </span>

                    </div>

                </div>

            </div>


            <div className="reuniao-card-acoes">

                <Button
                    type="button"
                    label="Informações"
                    variant="btn-info"
                    disabled={loading}
                    onClick={onVerInformacoes}
                >
                    <i className="fa-solid fa-circle-info" />
                </Button>


                <Button
                    type="button"
                    variant="btn-editar"
                    disabled={loading}
                    onClick={onEditar}
                    title="Editar reunião"
                >
                    <i className="fa-solid fa-pencil" />
                </Button>


                <Button
                    type="button"
                    variant="btn-deletar"
                    disabled={loading}
                    onClick={onDeletar}
                    title="Deletar reunião"
                >
                    <i className="fa-solid fa-trash" />
                </Button>

            </div>

        </article>

    )
}