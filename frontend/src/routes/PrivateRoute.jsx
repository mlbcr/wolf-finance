import { Navigate, Outlet } from "react-router-dom";
import useAuth from '@/contexts/useAuth'

function PrivateRoute() {
    const { usuario, loading } = useAuth()

    if (loading) {
        return null
    }

    return usuario ? <Outlet /> : <Navigate to="/login" replace />
}

export default PrivateRoute;