import { useEffect, useState } from 'react'

import { buscarEquipesAluno } from '@/api/api'
import './AlunoEquipes.css'

export default function AlunoEquipes({ aluno }) {

    const [equipes, setEquipes] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {

        async function carregarEquipes() {

            try {

                setLoading(true)

                const dados = await buscarEquipesAluno(aluno.id)

                setEquipes(dados)

            } catch (error) {

                console.error('Erro ao buscar equipes:', error)
                setEquipes([])

            } finally {

                setLoading(false)

            }

        }

        if (aluno?.id) {
            carregarEquipes()
        }

    }, [aluno?.id])


    if (loading) {
        return (
            <section className="aluno-section">

                <div className="section-title">

                    <div>

                        <h2>
                            <i className="fa-solid fa-users"></i>
                            Equipes
                        </h2>

                        <p>
                            Equipes das quais o aluno participa
                        </p>

                    </div>

                </div>

                <div className="tab-empty">

                    <p>
                        Carregando equipes...
                    </p>

                </div>

            </section>
        )
    }


    return (
        <section className="aluno-section">

            <div className="section-title">

                <div>

                    <h2>
                        <i className="fa-solid fa-users"></i>
                        Equipes
                    </h2>

                    <p>
                        Equipes das quais o aluno participa
                    </p>

                </div>

            </div>


            {equipes.length === 0 ? (

                <div className="tab-empty">

                    <i className="fa-solid fa-users"></i>

                    <h3>
                        Nenhuma equipe encontrada
                    </h3>

                    <p>
                        As equipes vinculadas a este aluno
                        aparecerão aqui.
                    </p>

                </div>

            ) : (


                <div className="aluno-equipes-grid">

                    {equipes.map((equipe) => (

                        <div
                            className="aluno-equipe-card"
                            key={equipe.id}
                        >

                            <div
                                className="aluno-equipe-icon"
                                style={{
                                    backgroundColor: `${equipe.cor}15`,
                                    color: equipe.cor
                                }}
                            >
                                <i
                                    className={`fa-solid ${equipe.icone}`}
                                ></i>
                            </div>


                            <div className="aluno-equipe-content">

                                <div className="aluno-equipe-header">

                                    <h3>
                                        {equipe.nome}
                                    </h3>

                                    <span
                                        className={
                                            equipe.status === 'ATIVA'
                                                ? 'equipe-status ativa'
                                                : 'equipe-status'
                                        }
                                    >
                                        <i className="fa-solid fa-circle"></i>
                                        {equipe.status === 'ATIVA'
                                            ? 'Ativa'
                                            : equipe.status}
                                    </span>

                                </div>


                                <p>
                                    {equipe.descricao ||
                                        'Sem descrição'}
                                </p>

                            </div>


                            <i className="fa-solid fa-chevron-right aluno-equipe-arrow"></i>

                        </div>

                    ))}

                </div>



            )}

        </section>
    )
}

