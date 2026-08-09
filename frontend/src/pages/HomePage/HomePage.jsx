import './HomePage.css'

import useAuth from '@/contexts/useAuth'

import { NavLink } from 'react-router-dom'

import ProgressBar from '@/components/ProgressBar/ProgressBar'
import MeetingCard from '@/components/MeetingCard/MeetingCard'
import WarningCard from '@/components/WarningCard/WarningCard'

export default function HomePage() {
    const { usuario, loading } = useAuth()

    if (loading) {
        return <p>Carregando...</p>
    }

    if (!usuario) {
        return <p>Não foi possível carregar o usuário.</p>
    }

    const isAdmin = usuario.tipo === 'ADMIN'

    const metaSemanal = usuario.faz_estagio ? 3 : 4

    return (
        <main className="home-page">

            <section className="profile-section">

                <div className="profile-avatar-big">
                    {usuario.nome_completo
                        .split(' ')
                        .map(nome => nome[0])
                        .slice(0, 2)
                        .join('')
                    }
                </div>

                <div className="profile-info">

                    <h1>{usuario.nome_completo}</h1>

                    <span className="profile-role">
                        {usuario.tipo}
                    </span>

                    <ProgressBar
                        current={1}
                        goal={metaSemanal}
                    />

                </div>

                <div className="home-top-cards">

                    {isAdmin ? (
                        <MeetingCard
                            date="07/08/2026"
                            time="14:00"
                        />
                    ) : (
                        <>
                            <WarningCard quantity={0} />

                            <MeetingCard
                                date="07/08/2026"
                                time="14:00"
                            />
                        </>
                    )}

                </div>

            </section>

            <section className="quick-menu">

                <h2>Menu rápido</h2>

                <div className="nav-cards">

                    {isAdmin && (
                        <NavLink to="/alunos" className="nav-card">
                            <i className="fa-solid fa-user-group"></i>
                            <span>Alunos</span>
                        </NavLink>
                    )}

                    <NavLink to="/presencas" className="nav-card">
                        <i className="fa-solid fa-calendar-check"></i>
                        <span>Presenças</span>
                    </NavLink>

                    <NavLink to="/equipes" className="nav-card">
                        <i className="fa-solid fa-users"></i>
                        <span>Equipes</span>
                    </NavLink>

                    <NavLink to="/projetos" className="nav-card">
                        <i className="fa-solid fa-folder"></i>
                        <span>Projetos</span>
                    </NavLink>

                    <NavLink to="/reunioes" className="nav-card">
                        <i className="fa-solid fa-people-group"></i>
                        <span>Reuniões</span>
                    </NavLink>

                    {isAdmin && (
                        <NavLink
                            to="/advertencias"
                            className="nav-card"
                        >
                            <i className="fa-solid fa-triangle-exclamation"></i>
                            <span>Advertências</span>
                        </NavLink>
                    )}

                </div>

            </section>

        </main>
    )
}