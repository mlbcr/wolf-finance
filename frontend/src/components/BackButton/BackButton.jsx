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

    // Rotas com parâmetros (usadas para pattern matching)
    '/alunos/:id': '/alunos',
    '/equipes/:id': '/equipes',
    '/projetos/:id': '/projetos',
    '/presenca/:codigo': '/presencas',
}

export default function BackButton({ to }) {
    const navigate = useNavigate()
    const location = useLocation()

    // Se passou explicitamente a rota, usa isso
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

    // Caso contrário, tenta mapear automaticamente
    const currentPath = location.pathname
    let destination = -1 // fallback: voltar no histórico

    // Tenta encontrar a rota exata no mapa
    if (ROUTE_MAP[currentPath]) {
        destination = ROUTE_MAP[currentPath]
    } else {
        // Tenta pattern matching para rotas com parâmetros (ex: /alunos/123)
        for (const route in ROUTE_MAP) {
            // Transforma /alunos/:id em regex que corresponde /alunos/qualquer-coisa
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
