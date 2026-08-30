import './ProgressBar.css'


function formatarHoras(horas) {

    if (!horas || horas <= 0) {
        return '0 min'
    }

    const minutosTotais = Math.round(horas * 60)

    const horasInteiras = Math.floor(minutosTotais / 60)

    const minutos = minutosTotais % 60


    if (horasInteiras === 0) {
        return `${minutos} min`
    }

    if (minutos === 0) {
        return `${horasInteiras}h`
    }

    return `${horasInteiras}h ${minutos}min`
}


export default function ProgressBar({
    current = 0,
    goal = 0
}) {

    const percentage =
        goal > 0
            ? Math.min((current / goal) * 100, 100)
            : 0

    const percentageFormatada =
        Math.round(percentage)


    return (
        <div className="weekly-progress">

            <div className="progress-info">

                <span>
                    Meta semanal
                </span>

                <span>
                    {percentageFormatada}%
                </span>

            </div>


            <div className="progress-bar-track">

                <div
                    className="progress-bar-fill"
                    style={{
                        width: `${percentage}%`
                    }}
                />

            </div>


            <div className="progress-hours">

                <span>
                    {formatarHoras(current)}
                </span>

                <span>
                    {formatarHoras(goal)}
                </span>

            </div>

        </div>
    )
}