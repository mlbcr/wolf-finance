import './MembroCard.css'

export default function MembroCard({ membro, isLeader, onRemove }) {
    const iniciais = membro.nome_completo
        .split(' ')
        .map(nome => nome[0])
        .slice(0, 2)
        .join('')

    return (
        <div className="membro-card">
            <div className="membro-avatar">{iniciais}</div>

            <div className="membro-info">
                <strong>{membro.nome_completo}</strong>
                <span>{membro.email}</span>
                {isLeader && <span className="membro-lider-badge">LÍDER</span>}
            </div>
            <div className="membro-meta">
                {membro.cargo && <span>{membro.cargo}</span>}
                <small>{membro.matricula}</small>
            </div>

            {!isLeader && (
                <button
                    type="button"
                    className="membro-remove"
                    onClick={() => onRemove && onRemove(membro.id)}
                    title="Remover membro"
                >
                    <i className="fa-solid fa-trash"></i>
                </button>
            )}
        </div>
    )
}
