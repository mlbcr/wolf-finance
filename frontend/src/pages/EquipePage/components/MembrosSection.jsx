import MembroCard from './MembroCard'
import './MembrosSection.css'

export default function MembrosSection({ membros, leaderId, onAdd, onRemove }) {
    return (
        <section className="equipe-section membros-section">
            <div className="section-title">
                <div>
                    <h2>Membros</h2>
                    <p>Pessoas que fazem parte desta equipe.</p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <button className="btn-adicionar-membro" onClick={onAdd}>
                        <i className="fa-solid fa-plus"></i>
                        Adicionar
                    </button>

                    <span className="membros-count">{membros.length}</span>
                </div>
            </div>

            <div className="membros-list">
                {membros.map(membro => (
                    <MembroCard
                        key={membro.id}
                        membro={membro}
                        isLeader={String(membro.id) === String(leaderId)}
                        onRemove={onRemove}
                    />
                ))}
            </div>

            {membros.length === 0 && (
                <div className="sem-membros">
                    <i className="fa-solid fa-user-group"></i>
                    <h3>Nenhum membro</h3>
                    <p>Esta equipe ainda não possui membros.</p>
                </div>
            )}
        </section>
    )
}
