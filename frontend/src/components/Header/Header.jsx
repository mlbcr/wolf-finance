import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import useAuth from '@/contexts/useAuth'
import Logo from '@/assets/logo1.png'
import Button from '@/components/Button/Button'

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

            <Button
                variant="header-logo"
                onClick={() => navigate('/')}
            >
                <img
                    src={Logo}
                    alt="Wolf Finance"
                />
            </Button>

            <div className="header-user">

                <Button
                    variant="user-avatar"
                    onClick={() => setMenuAberto(!menuAberto)}
                >
                    {iniciais}
                </Button>

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

                        <Button
                            variant="logout-button"
                            onClick={handlePerfil}
                        >
                            <i className="fa-solid fa-user"></i>
                            Perfil
                        </Button>

                        <Button
                            variant="logout-button"
                            onClick={handleLogout}
                        >
                            <i className="fa-solid fa-right-from-bracket"></i>
                            Sair
                        </Button>

                    </div>
                )}

            </div>

        </header>
    )
}

