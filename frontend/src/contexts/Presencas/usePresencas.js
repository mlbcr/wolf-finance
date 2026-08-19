import { useContext } from 'react'
import PresencasContext from './PresencasContext'

export default function usePresencas() {
    const context = useContext(PresencasContext)

    if (!context) {
        throw new Error('usePresencas deve ser usado dentro de PresencasProvider')
    }

    return context
}
