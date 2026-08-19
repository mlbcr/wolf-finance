import { useState, useCallback } from 'react'
import ReunioesContext from './ReunioesContext'
import { listarReunioes } from '@/api/api'

export default function ReunioesProvider({ children }) {
    const [reunioes, setReunioes] = useState([])
    const [carregando, setCarregando] = useState(false)
    const [erro, setErro] = useState(null)

    const carregarReunioes = useCallback(async (equipeId = null) => {
        try {
            setCarregando(true)
            setErro(null)

            const dados = await listarReunioes(equipeId)

            setReunioes(dados || [])
        } catch (error) {
            setErro(error.message || 'Erro ao carregar reuniões')
        } finally {
            setCarregando(false)
        }
    }, [])

    const adicionarReuniao = useCallback((novaReuniao) => {
        setReunioes((prev) => [novaReuniao, ...prev])
    }, [])

    const atualizarReuniao = useCallback((reuniaoId, reuniaoAtualizada) => {
        setReunioes((prev) =>
            prev.map((r) => (r.id === reuniaoId ? reuniaoAtualizada : r))
        )
    }, [])

    const removerReuniao = useCallback((reuniaoId) => {
        setReunioes((prev) => prev.filter((r) => r.id !== reuniaoId))
    }, [])

    const value = {
        reunioes,
        carregando,
        erro,
        carregarReunioes,
        adicionarReuniao,
        atualizarReuniao,
        removerReuniao
    }

    return (
        <ReunioesContext.Provider value={value}>
            {children}
        </ReunioesContext.Provider>
    )
}
