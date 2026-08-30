import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import {
    registrarPresencaSala
} from '@/api/api'

import Button from '@/components/Button/Button'
import LoadingModal from '@/components/LoadingModal/LoadingModal'

import './RegistrarPresencaPage.css'


function formatarHora(time) {
    if (!time) return '--:--'

    return time.substring(0, 5)
}


export default function RegistrarPresencaPage() {

    const { codigo } = useParams()
    const navigate = useNavigate()

    const registrandoRef = useRef(false)

    const [loading, setLoading] = useState(true)
    const [sucesso, setSucesso] = useState(false)
    const [erro, setErro] = useState(null)

    const [presenca, setPresenca] = useState(null)


    useEffect(() => {

        if (!codigo) {
            setErro('QR Code inválido')
            setLoading(false)
            return
        }

        if (registrandoRef.current) {
            return
        }

        registrandoRef.current = true

        async function registrar() {

            try {

                setErro(null)

                const resultado =
                    await registrarPresencaSala(codigo)

                setPresenca(resultado)
                setSucesso(true)

            } catch (error) {

                console.error(
                    'Erro ao registrar presença:',
                    error
                )

                setErro(
                    error.message ||
                    'Não foi possível registrar sua presença.'
                )

            } finally {

                setLoading(false)

            }
        }

        registrar()

    }, [codigo])


    function voltar() {
        navigate('/presencas')
    }


    if (loading) {

        return (
            <main className="registrar-presenca-page">

                <LoadingModal
                    mensagem="Registrando presença..."
                />

            </main>
        )
    }


    return (
        <main className="registrar-presenca-page">

            <div className="registrar-presenca-container">


                {sucesso && presenca && (

                    <section className="presenca-sucesso">

                        <div className="sucesso-icone">

                            <i
                                className={
                                    presenca.hora_fim
                                        ? "fa-solid fa-door-open"
                                        : "fa-solid fa-check"
                                }
                            />

                        </div>


                        <span className="page-label">
                            Presença
                        </span>


                        <h1>
                            {presenca.hora_fim
                                ? 'Saída registrada!'
                                : 'Entrada registrada!'
                            }
                        </h1>


                        <p className="sucesso-descricao">

                            {presenca.hora_fim
                                ? 'Sua saída foi registrada com sucesso.'
                                : 'Sua entrada foi registrada com sucesso.'
                            }

                        </p>


                        <div className="presenca-card">

                            <div className="presenca-card-item">

                                <span>
                                    Entrada
                                </span>

                                <strong>
                                    {formatarHora(
                                        presenca.hora_inicio
                                    )}
                                </strong>

                            </div>


                            <div className="presenca-card-divider" />


                            <div className="presenca-card-item">

                                <span>
                                    Saída
                                </span>

                                <strong>
                                    {formatarHora(
                                        presenca.hora_fim
                                    )}
                                </strong>

                            </div>

                        </div>


                        <Button
                            type="button"
                            label="Ver minhas presenças"
                            variant="btn-salvar"
                            onClick={voltar}
                        />

                    </section>

                )}


                {erro && (

                    <section className="presenca-erro">

                        <div className="erro-icone">

                            <i className="fa-solid fa-circle-exclamation" />

                        </div>


                        <span className="page-label">
                            Presença
                        </span>


                        <h1>
                            Não foi possível registrar
                        </h1>


                        <p>
                            {erro}
                        </p>


                        <Button
                            type="button"
                            label="Voltar para presenças"
                            variant="btn-cancelar"
                            onClick={voltar}
                        />

                    </section>

                )}

            </div>

        </main>
    )
}