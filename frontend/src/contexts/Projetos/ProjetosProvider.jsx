import { useEffect, useState } from 'react'

import ProjetosContext from './ProjetosContext'
import useAuth from '../useAuth'

import {
    buscarMeusProjetos,
    buscarTodosProjetos
} from '@/api/api'


export default function ProjetosProvider({ children }) {

    const { usuario, loading: authLoading } = useAuth()

    const [projetos, setProjetos] = useState([])
    const [loading, setLoading] = useState(true)


    useEffect(() => {

        async function carregarProjetos() {

            if (authLoading) {
                return
            }

            if (!usuario) {
                setProjetos([])
                setLoading(false)
                return
            }

            setLoading(true)

            try {

                const dados = usuario.tipo === 'ADMIN'
                    ? await buscarTodosProjetos()
                    : await buscarMeusProjetos()

                setProjetos(dados)

            } catch (error) {

                console.error(
                    'Erro ao carregar projetos:',
                    error
                )

                setProjetos([])

            } finally {

                setLoading(false)

            }

        }

        carregarProjetos()

    }, [usuario, authLoading])


    async function recarregarProjetos() {

        if (!usuario) {
            return
        }

        try {

            const dados = usuario.tipo === 'ADMIN'
                ? await buscarTodosProjetos()
                : await buscarMeusProjetos()

            setProjetos(dados)

        } catch (error) {

            console.error(
                'Erro ao recarregar projetos:',
                error
            )

        }

    }


    return (
        <ProjetosContext.Provider
            value={{
                projetos,
                loading,
                recarregarProjetos
            }}
        >
            {children}
        </ProjetosContext.Provider>
    )
}