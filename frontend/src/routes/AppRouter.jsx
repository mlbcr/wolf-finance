import HomePage from '@/pages/HomePage/HomePage'
import EquipesPage from '@/pages/EquipesPage/EquipesPage'
import EquipePage from '@/pages/EquipePage/EquipePage'
import ProjetosPage from '@/pages/ProjetosPage/ProjetosPage'
import ProjetoPage from '@/pages/ProjetoPage/ProjetoPage'
import LoginPage from '@/pages/LoginPage/LoginPage'
import PresencasPage from '@/pages/PresencasPage/PresencasPage'
import ReunioesPage from '@/pages/ReunioesPage/ReunioesPage'
import PerfilPage from '@/pages/PerfilPage/PerfilPage'

import { Routes, Route } from 'react-router-dom'
import PrivateRoute from './PrivateRoute'

export default function AppRouter() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<PrivateRoute />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/perfil" element={<PerfilPage />} />
                <Route path="/reunioes" element={<ReunioesPage />} />
                <Route path="/presencas" element={<PresencasPage />} />
                <Route path="/equipes" element={<EquipesPage />} />
                <Route path="/equipes/:id" element={<EquipePage />} />
                <Route path="/projetos" element={<ProjetosPage />} />
                <Route path="/projetos/:id" element={<ProjetoPage />} />
            </Route>
        </Routes>
    )
}