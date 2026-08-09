import { useEffect, useState } from 'react'

import EquipesContext from './EquipesContext'
import useAuth from '../useAuth'

import {
    buscarMinhasEquipes,
    buscarTodasEquipes
} from '@/api/api'

export default function EquipesProvider({ children }) {

    const { usuario, loading: authLoading } = useAuth()

    const [equipes, setEquipes] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {

        async function carregarEquipes() {

            if (authLoading) {
                return
            }

            if (!usuario) {
                setEquipes([])
                setLoading(false)
                return
            }

            setLoading(true)

            try {

                const dados = usuario.tipo === 'ADMIN'
                    ? await buscarTodasEquipes()
                    : await buscarMinhasEquipes()

                setEquipes(dados)

            } catch (error) {

                console.error('Erro ao carregar equipes:', error)
                setEquipes([])

            } finally {

                setLoading(false)

            }
        }

        carregarEquipes()

    }, [usuario, authLoading])


    async function recarregarEquipes() {

        if (!usuario) {
            return
        }

        try {

            const dados = usuario.tipo === 'ADMIN'
                ? await buscarTodasEquipes()
                : await buscarMinhasEquipes()

            setEquipes(dados)

        } catch (error) {

            console.error('Erro ao recarregar equipes:', error)

        }
    }


    return (
        <EquipesContext.Provider
            value={{
                equipes,
                loading,
                recarregarEquipes
            }}
        >
            {children}
        </EquipesContext.Provider>
    )
}