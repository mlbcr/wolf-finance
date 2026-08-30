import { useNavigate } from 'react-router-dom'

import Button from '@/components/Button/Button'

import './NotFoundPage.css'


export default function NotFoundPage() {

    const navigate = useNavigate()


    function voltarInicio() {
        navigate('/')
    }


    return (
        <main className="not-found-page">

            <div className="not-found-container">


                <span className="page-label">
                    Wolf Finance
                </span>

                <h1>
                    404
                </h1>

                <h2>
                    Página não encontrada
                </h2>

                <p>
                    A página que você está procurando não existe
                    ou foi removida.
                </p>

                <Button
                    type="button"
                    label="Voltar para o início"
                    variant="btn-salvar"
                    onClick={voltarInicio}
                />

            </div>

        </main>
    )
}