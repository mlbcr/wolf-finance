import './ConfirmModal.css'

export default function ConfirmModal({ titulo, mensagem, onConfirmar, onCancelar }) {
    if (!mensagem) return null

    return (
        <div className="confirm-modal-overlay">
            <div className="confirm-modal">
                <div className="confirm-modal-icon">
                    <i className="fa-solid fa-question-circle"></i>
                </div>

                <h2 className="confirm-modal-titulo">{titulo || 'Confirmação'}</h2>

                <p className="confirm-modal-mensagem">{mensagem}</p>

                <div className="confirm-modal-footer">
                    <button className="btn-cancelar" onClick={onCancelar}>
                        Cancelar
                    </button>
                    <button className="btn-confirmar" onClick={onConfirmar}>
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    )
}
