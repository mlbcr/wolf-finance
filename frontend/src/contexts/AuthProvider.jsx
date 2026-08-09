
import { useEffect, useRef, useState } from 'react'

import AuthContext from './AuthContext'

import {
    buscarUsuarioLogado,
    fazerLogin
} from '@/api/api'

export default function AuthProvider({ children }) {

    const [usuario, setUsuario] = useState(null)
    const [loading, setLoading] = useState(true)

    const operacaoAuth = useRef(0)


    useEffect(() => {
        const carregarUsuario = async () => {
            const operacao = ++operacaoAuth.current

            const token = localStorage.getItem('token')

            if (!token) {
                setUsuario(null)
                setLoading(false)
                return
            }

            try {
                const dados = await buscarUsuarioLogado()

                // Ignora uma resposta antiga
                if (operacao !== operacaoAuth.current) {
                    return
                }

                setUsuario(dados)

            } catch (error) {
                console.error(
                    'Erro ao carregar usuário:',
                    error
                )

                // Só remove o token se essa
                // ainda for a operação atual
                if (operacao === operacaoAuth.current) {
                    localStorage.removeItem('token')
                    setUsuario(null)
                }

            } finally {
                if (operacao === operacaoAuth.current) {
                    setLoading(false)
                }
            }
        }

        void carregarUsuario()
    }, [])


    async function login(dados) {

        const operacao = ++operacaoAuth.current

        setLoading(true)

        try {

            const resposta = await fazerLogin(dados)

            localStorage.setItem(
                'token',
                resposta.access_token
            )

            const usuarioLogado =
                await buscarUsuarioLogado()

            // Garante que essa ainda é
            // a operação de login atual
            if (operacao !== operacaoAuth.current) {
                return
            }

            setUsuario(usuarioLogado)

            return usuarioLogado

        } catch (error) {

            if (operacao === operacaoAuth.current) {
                localStorage.removeItem('token')
                setUsuario(null)
            }

            throw error

        } finally {

            if (operacao === operacaoAuth.current) {
                setLoading(false)
            }

        }
    }


    function logout() {

        ++operacaoAuth.current

        localStorage.removeItem('token')

        setUsuario(null)

    }


    return (
        <AuthContext.Provider
            value={{
                usuario,
                loading,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

