import HomePage from '@/pages/HomePage/HomePage'
import EquipesPage from '@/pages/EquipesPage/EquipesPage'
import EquipePage from '@/pages/EquipePage/EquipePage'
import ProjetosPage from '@/pages/ProjetosPage/ProjetosPage'
import ProjetoPage from '@/pages/ProjetoPage/ProjetoPage'
import LoginPage from '@/pages/LoginPage/LoginPage'
import RecuperarSenhaPage from '@/pages/LoginPage/RecuperarSenhaPage'
import PresencasPage from '@/pages/PresencasPage/PresencasPage'
import ReunioesPage from '@/pages/ReunioesPage/ReunioesPage'
import PerfilPage from '@/pages/PerfilPage/PerfilPage'
import AlunoPage from '@/pages/AlunoPage/AlunoPage'
import AlunosPage from '@/pages/AlunosPage/AlunosPage'
import ScannerPage from '@/pages/ScannerPage/ScannerPage'
import RegistrarPresencaPage from '@/pages/RegistrarPresencaPage/RegistrarPresencaPage'
import NotFoundPage from '@/pages/NotFoundPage/NotFoundPage'

import { Routes, Route } from 'react-router-dom'
import PrivateRoute from './PrivateRoute'
import AdminRoute from './AdminRoute'

export default function AppRouter() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/recuperar-senha" element={<RecuperarSenhaPage />} />
            <Route element={<PrivateRoute />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/perfil" element={<PerfilPage />} />
                <Route path="/reunioes" element={<ReunioesPage />} />
                <Route path="/presencas" element={<PresencasPage />} />
                <Route path="/presenca/:codigo" element={<RegistrarPresencaPage />} />
                <Route path="/presenca/scanner" element={<ScannerPage />} />
                <Route path="/equipes" element={<EquipesPage />} />
                <Route path="/equipes/:id" element={<EquipePage />} />
                <Route path="/projetos" element={<ProjetosPage />} />
                <Route path="/projetos/:id" element={<ProjetoPage />} />
            </Route>

            <Route element={<AdminRoute />}>
                <Route path="/alunos" element={<AlunosPage />} />
                <Route path="/alunos/:id" element={<AlunoPage />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />

        </Routes>
    )
}