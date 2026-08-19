import './AlertModal.css'

import Button from '@/components/Button/Button'

export default function AlertModal({
    titulo,
    mensagem,
    onFechar,
    tipo = 'erro'
}) {
    if (!mensagem) return null

    const iconeMap = {
        erro: 'fa-exclamation-circle',
        sucesso: 'fa-circle-check',
        aviso: 'fa-triangle-exclamation',
        info: 'fa-info-circle'
    }

    const corMap = {
        erro: '#dc2626',
        sucesso: '#10b981',
        aviso: '#f59e0b',
        info: '#3b82f6'
    }

    return (
        <div className="alert-modal-overlay">
            <div className="alert-modal">
                <div
                    className="alert-modal-icon"
                    style={{ color: corMap[tipo] }}
                >
                    <i className={`fa-solid ${iconeMap[tipo]}`}></i>
                </div>

                <h2 className="alert-modal-titulo">
                    {titulo || 'Aviso'}
                </h2>

                <p className="alert-modal-mensagem">
                    {mensagem}
                </p>

                <div className="alert-modal-footer">
                    <Button
                        label="OK"
                        variant={`btn-ok btn-${tipo}`}
                        onClick={onFechar}
                    />
                </div>
            </div>
        </div>
    )
}