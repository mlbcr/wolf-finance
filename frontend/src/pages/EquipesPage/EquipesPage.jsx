import { NavLink } from 'react-router-dom'

import useEquipes from '@/contexts/Equipes/useEquipes'

import './EquipesPage.css'

export default function EquipesPage() {

    const { equipes, loading } = useEquipes()

    if (loading) {
        return <p>Carregando...</p>
    }

    return (
        <main className="equipes-page">

            <header className="equipes-header">
                <div>
                    <h1>Minhas Equipes</h1>
                    <span className="page-label">
                        Wolf Finance
                    </span>

                    <p>
                        Equipes das quais você participa na liga.
                    </p>
                </div>

                {equipes.length > 0 && (
                    <div className="equipes-count">
                        <strong>{equipes.length}</strong>
                        <span>
                            {equipes.length === 1
                                ? 'equipe'
                                : 'equipes'
                            }
                        </span>
                    </div>
                )}
            </header>

            {equipes.length > 0 ? (
                <section className="equipes-cards">
                    {equipes.map(equipe => (

                        <NavLink
                            key={equipe.id}
                            to={`/equipes/${equipe.id}`}
                            className="equipe-card"
                        >

                            <div className="equipe-card-top">
                                <div
                                    className="equipe-icon"
                                    style={{
                                        backgroundColor: `${equipe.cor}15`,
                                        color: equipe.cor
                                    }}
                                >
                                    <i className={`fa-solid ${equipe.icone}`}></i>
                                </div>
                                <span className="equipe-status">
                                    <i className="fa-solid fa-circle"></i>
                                    Ativa
                                </span>

                            </div>


                            <div className="equipe-info">
                                <h2>{equipe.nome}</h2>
                                <p>
                                    {equipe.descricao ||
                                        'Sem descrição'}
                                </p>
                            </div>


                            <div className="equipe-card-footer">
                                <span>
                                    Ver equipe
                                </span>

                                <div className="equipe-arrow">
                                    <i className="fa-solid fa-arrow-right"></i>
                                </div>
                            </div>

                        </NavLink>

                    ))}

                </section>

            ) : (

                <section className="sem-equipes">

                    <div className="sem-equipes-icon">
                        <i className="fa-solid fa-users"></i>
                    </div>
                    <h2>
                        Você ainda não participa de nenhuma equipe
                    </h2>
                    <p>
                        Quando você entrar em uma equipe,
                        ela aparecerá aqui.
                    </p>
                </section>

            )}

        </main>
    )
}