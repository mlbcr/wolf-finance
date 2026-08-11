import './EquipeHeader.css'

export default function EquipeHeader({ equipe, leader, onEdit, isAdmin }) {
    return (
        <section className="equipe-header">
            <div
                className="equipe-icon"
                style={{
                    backgroundColor: `${equipe.cor}20`,
                    color: equipe.cor
                }}
            >
                <i className={`fa-solid ${equipe.icone || 'fa-users'}`}></i>
            </div>

            <div className="equipe-header-info">
                <span className="equipe-status">
                    <i className="fa-solid fa-circle"></i>
                    {equipe.status}
                </span>

                <h1>{equipe.nome}</h1>

                <p>{equipe.descricao || 'Sem descrição'}</p>

                {leader?.nome_completo && (
                    <div className="equipe-lider-wrapper">
                        <span className="equipe-lider">Líder: {leader.nome_completo}</span>
                    </div>
                )}
            </div>

            {isAdmin && (
                <button className="btn-editar-equipe" onClick={onEdit}>
                    <i className="fa-solid fa-pen"></i>
                    Editar equipe
                </button>
            )}
        </section>
    )
}
