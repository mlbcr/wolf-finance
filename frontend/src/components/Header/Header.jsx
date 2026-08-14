import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import useAuth from '@/contexts/useAuth'
import Logo from '@/assets/logo1.png'

import './Header.css'

export default function Header() {

    const { usuario, loading, logout } = useAuth()

    const [menuAberto, setMenuAberto] = useState(false)

    const navigate = useNavigate()

    if (loading) {
        return null
    }

    if (!usuario) {
        return null
    }

    const iniciais = usuario.nome_completo
        .split(' ')
        .map(nome => nome[0])
        .slice(0, 2)
        .join('')

    function handleLogout() {
        logout()
        navigate('/login')
    }
    function handlePerfil() { 
        setMenuAberto(false) 
        navigate('/perfil') 
    }

    return (
        <header className="header">

            <button
                className="header-logo"
                onClick={() => navigate('/')}
            >
                <img
                    src={Logo}
                    alt="Wolf Finance"
                />

            </button>

            <div className="header-user">

                <button
                    className="user-avatar"
                    onClick={() => setMenuAberto(!menuAberto)}
                >
                    {iniciais}
                </button>

                {menuAberto && (
                    <div className="user-menu">

                        <div className="user-menu-info">
                            <strong>
                                {usuario.nome_completo}
                            </strong>

                            <span>
                                {usuario.email}
                            </span>
                        </div>

                        <div className="user-menu-divider"></div>
                        <button className="logout-button" onClick={handlePerfil} >
                            <i className="fa-solid fa-user"></i>
                            Perfil
                        </button>

                        <button
                            className="logout-button"
                            onClick={handleLogout}
                        >
                            <i className="fa-solid fa-right-from-bracket"></i>
                            Sair
                        </button>

                    </div>
                )}

            </div>

        </header>
    )
}

