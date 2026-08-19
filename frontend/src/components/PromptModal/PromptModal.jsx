import { useState } from 'react'
import './PromptModal.css'

import Button from '@/components/Button/Button'

export default function PromptModal({
    titulo,
    mensagem,
    placeholder,
    onConfirmar,
    onCancelar
}) {
    const [valor, setValor] = useState('')

    if (!mensagem) return null

    function handleConfirmar() {
        onConfirmar(valor)
    }

    function handleKeyDown(e) {
        if (e.key === 'Enter') {
            handleConfirmar()
        }

        if (e.key === 'Escape') {
            onCancelar()
        }
    }

    return (
        <div className="prompt-modal-overlay">
            <div className="prompt-modal">
                <div className="prompt-modal-icon">
                    <i className="fa-solid fa-pen"></i>
                </div>

                <h2 className="prompt-modal-titulo">
                    {titulo || 'Entrada'}
                </h2>

                <p className="prompt-modal-mensagem">
                    {mensagem}
                </p>

                <input
                    type="text"
                    className="prompt-modal-input"
                    placeholder={placeholder || ''}
                    value={valor}
                    onChange={(e) => setValor(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoFocus
                />

                <div className="prompt-modal-footer">
                    <Button
                        label="Cancelar"
                        variant="btn-cancelar"
                        onClick={onCancelar}
                    />

                    <Button
                        label="Confirmar"
                        variant="btn-confirmar"
                        onClick={handleConfirmar}
                    />
                </div>
            </div>
        </div>
    )
}