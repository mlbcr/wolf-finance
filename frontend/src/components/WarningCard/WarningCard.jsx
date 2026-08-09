import './WarningCard.css'

export default function WarningCard({ quantity }) {
    return (
        <div className="warning-card">

            <div className="warning-title">
                <i className="fa-solid fa-triangle-exclamation"></i>
                Advertências
            </div>

            {quantity === 0 ? (
                <span>Nenhuma recebida</span>
            ) : (
                <span>
                    {quantity} advertência{quantity > 1 ? 's' : ''}
                </span>
            )}

        </div>
    )
}