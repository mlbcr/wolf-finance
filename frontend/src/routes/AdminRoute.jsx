import { Navigate, Outlet } from 'react-router-dom'
import useAuth from '@/contexts/useAuth'

export default function AdminRoute() {
    const { usuario, loading } = useAuth()

    if (loading) {
        return null
    }

    if (!usuario) {
        return <Navigate to="/login" replace />
    }

    if (usuario.tipo !== 'ADMIN') {
        return <Navigate to="/" replace />
    }

    return <Outlet />
}