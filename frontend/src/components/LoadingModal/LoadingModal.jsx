import './LoadingModal.css'

export default function LoadingModal({ mensagem = 'Carregando...' }) {
    return (
        <div className="loading-modal-overlay">
            <div className="loading-modal">
                <div className="loading-spinner">
                    <div className="spinner"></div>
                </div>

                <p className="loading-mensagem">{mensagem}</p>
            </div>
        </div>
    )
}
