import './ConfirmModal.css'

import Button from '@/components/Button/Button'

export default function ConfirmModal({
    titulo,
    mensagem,
    onConfirmar,
    onCancelar
}) {
    if (!mensagem) return null

    return (
        <div className="confirm-modal-overlay">
            <div className="confirm-modal">
                <div className="confirm-modal-icon">
                    <i className="fa-solid fa-question-circle"></i>
                </div>

                <h2 className="confirm-modal-titulo">
                    {titulo || 'Confirmação'}
                </h2>

                <p className="confirm-modal-mensagem">
                    {mensagem}
                </p>

                <div className="confirm-modal-footer">
                    <Button
                        label="Cancelar"
                        variant="btn-cancelar"
                        onClick={onCancelar}
                    />

                    <Button
                        label="Confirmar"
                        variant="btn-confirmar"
                        onClick={onConfirmar}
                    />
                </div>
            </div>
        </div>
    )
}