import { useNavigate, useLocation } from 'react-router-dom'
import './BackButton.css'

// Mapa de rotas: rota atual -> rota de volta desejada
const ROUTE_MAP = {
    // Páginas principais
    '/alunos': '/',
    '/equipes': '/',
    '/reunioes': '/',
    '/presencas': '/',
    '/projetos': '/',
    '/perfil': '/',
    '/scanner': '/',
    '/registrar-presenca': '/presencas',
    '/presenca/scanner': '/presencas',

    '/alunos/:id': '/alunos',
    '/equipes/:id': '/equipes',
    '/projetos/:id': '/projetos',
    '/presenca/:codigo': '/presencas',
}

export default function BackButton({ to }) {
    const navigate = useNavigate()
    const location = useLocation()

    if (to !== undefined) {
        return (
            <button
                type="button"
                className="btn-back-button"
                onClick={() => navigate(to)}
                title="Voltar para página anterior"
            >
                <i className="fa-solid fa-chevron-left"></i>
                Voltar
            </button>
        )
    }

    const currentPath = location.pathname
    let destination = -1 

    if (ROUTE_MAP[currentPath]) {
        destination = ROUTE_MAP[currentPath]
    } else {
        for (const route in ROUTE_MAP) {
            const pattern = route.replace(/:[^/]+/g, '[^/]+')
            const regex = new RegExp(`^${pattern}$`)

            if (regex.test(currentPath)) {
                destination = ROUTE_MAP[route]
                break
            }
        }
    }

    return (
        <button
            type="button"
            className="btn-back-button"
            onClick={() => navigate(destination)}
            title="Voltar para página anterior"
        >
            <i className="fa-solid fa-chevron-left"></i>
            Voltar
        </button>
    )
}
