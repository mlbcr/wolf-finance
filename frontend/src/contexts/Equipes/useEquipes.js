import { useContext } from 'react'
import EquipesContext from './EquipesContext'

export default function useEquipes() {
    return useContext(EquipesContext)
}