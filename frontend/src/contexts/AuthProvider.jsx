import { useEffect, useState } from 'react'

import AuthContext from './AuthContext'
import { buscarUsuarioLogado } from '@/api/api'

export default function AuthProvider({ children }) {

    const [usuario, setUsuario] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {

        async function carregarUsuario() {

            const token = localStorage.getItem('token')

            if (!token) {
                setLoading(false)
                return
            }

            try {
                const dados = await buscarUsuarioLogado()
                setUsuario(dados)

            } catch (error) {
                console.error(error)
                localStorage.removeItem('token')

            } finally {
                setLoading(false)
            }
        }

        carregarUsuario()

    }, [])

    function logout() {
        localStorage.removeItem('token')
        setUsuario(null)
    }

    return (
        <AuthContext.Provider
            value={{
                usuario,
                loading,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}