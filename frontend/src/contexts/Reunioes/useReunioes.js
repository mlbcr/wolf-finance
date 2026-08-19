import { useContext } from 'react'
import ReunioesContext from './ReunioesContext'

export default function useReunioes() {
    const context = useContext(ReunioesContext)

    if (!context) {
        throw new Error('useReunioes deve ser usado dentro de ReunioesProvider')
    }

    return context
}
