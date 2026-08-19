import { useState, useCallback } from 'react'
import PresencasContext from './PresencasContext'
import { listarMinhasPresencas, obterHorasSemana } from '@/api/api'

export default function PresencasProvider({ children }) {
    const [presencas, setPresencas] = useState([])
    const [horasSemana, setHorasSemana] = useState({})
    const [carregando, setCarregando] = useState(false)
    const [erro, setErro] = useState(null)

    const carregarDados = useCallback(async () => {
        try {
            setCarregando(true)
            setErro(null)

            const [presencasData, horasData] = await Promise.all([
                listarMinhasPresencas(),
                obterHorasSemana()
            ])

            setPresencas(presencasData || [])
            setHorasSemana(horasData || {})
        } catch (error) {
            setErro(error.message || 'Erro ao carregar dados')
        } finally {
            setCarregando(false)
        }
    }, [])

    const adicionarPresenca = useCallback((novaPresenca) => {
        setPresencas((prev) => [novaPresenca, ...prev])

        // Atualiza as horas da semana
        if (horasSemana.total_horas !== undefined) {
            setHorasSemana((prev) => ({
                ...prev,
                total_horas: (prev.total_horas || 0) + (novaPresenca.total_horas || 0)
            }))
        }
    }, [horasSemana])

    const atualizarPresenca = useCallback((presencaId, presencaAtualizada) => {
        setPresencas((prev) =>
            prev.map((p) => (p.id === presencaId ? presencaAtualizada : p))
        )
    }, [])

    const removerPresenca = useCallback((presencaId) => {
        setPresencas((prev) => prev.filter((p) => p.id !== presencaId))
    }, [])

    const value = {
        presencas,
        horasSemana,
        carregando,
        erro,
        carregarDados,
        adicionarPresenca,
        atualizarPresenca,
        removerPresenca
    }

    return (
        <PresencasContext.Provider value={value}>
            {children}
        </PresencasContext.Provider>
    )
}
