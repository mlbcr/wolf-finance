import { useContext } from 'react'

import ProjetosContext from './ProjetosContext'

export default function useProjetos() {
    return useContext(ProjetosContext)
}