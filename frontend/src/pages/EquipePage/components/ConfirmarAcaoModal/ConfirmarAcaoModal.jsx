import './ConfirmarAcaoModal.css'

export default function ConfirmarAcaoModal({
    titulo,
    mensagem,
    onClose,
    onConfirm,
    confirmando = false,
    textoConfirmar = 'Confirmar',
    textoCancelar = 'Cancelar'
}) {
    return (
        <div className="confirm-modal-overlay">
            <div className="confirm-modal">

                <div className="confirm-modal-icon">
                    <i className="fa-solid fa-triangle-exclamation"></i>
                </div>

                <div className="confirm-modal-content">
                    <h2>{titulo}</h2>

                    <p>{mensagem}</p>
                </div>

                <div className="confirm-modal-actions">

                    <button
                        type="button"
                        className="confirm-cancel-button"
                        onClick={onClose}
                        disabled={confirmando}
                    >
                        {textoCancelar}
                    </button>

                    <button
                        type="button"
                        className="confirm-danger-button"
                        onClick={onConfirm}
                        disabled={confirmando}
                    >
                        {confirmando
                            ? 'Aguarde...'
                            : textoConfirmar}
                    </button>

                </div>

            </div>
        </div>
    )
}

