import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'

import useEquipes from '@/contexts/Equipes/useEquipes'
import useAuth from '@/contexts/useAuth'

import {
    buscarTodasEquipes
} from '@/api/api'

import BackButton from '@/components/BackButton/BackButton'

import './EquipesPage.css'
import Modal from '@/components/Modal/Modal'

export default function EquipesPage() {

    const { usuario } = useAuth()
    const [termoBusca, setTermoBusca] = useState('')
    const {
        equipes: minhasEquipes,
        loading
    } = useEquipes()

    const [todasEquipes, setTodasEquipes] = useState([])
    const [loadingTodas, setLoadingTodas] = useState(true)

    const [modalAberto, setModalAberto] = useState(false)

    const isAdmin = usuario?.tipo === 'ADMIN'

    const todasEquipesFiltradas = todasEquipes.filter(equipe => {

        const busca = termoBusca.toLowerCase().trim()

        if (!busca) {
            return true
        }

        return (
            equipe.nome?.toLowerCase().includes(busca) ||
            equipe.descricao?.toLowerCase().includes(busca)
        )

    })

    useEffect(() => {

        async function carregarTodasEquipes() {

            try {

                setLoadingTodas(true)

                const dados = await buscarTodasEquipes()

                setTodasEquipes(dados)

            } catch (error) {

                console.error(
                    'Erro ao buscar todas as equipes:',
                    error
                )

                setTodasEquipes([])

            } finally {

                setLoadingTodas(false)

            }

        }

        if (isAdmin) {
            carregarTodasEquipes()
        }

    }, [isAdmin])


    function abrirModalNovaEquipe() {

        console.log('Abrir cadastro de nova equipe')

        setModalAberto(true)

    }


    function fecharModal() {

        setModalAberto(false)

    }


    if (loading) {

        return (
            <main className="equipes-page">
                <p>Carregando...</p>
            </main>
        )

    }


    return (
        <main className="equipes-page">

            <BackButton />

            {/* HEADER */}

            <header className="equipes-header">

                <div>

                    <span className="page-label">
                        Wolf Finance
                    </span>

                    <h1>
                        Equipes
                    </h1>

                    <p>
                        Equipes das quais você participa
                        na liga.
                    </p>

                </div>


                {isAdmin && (

                    <button
                        type="button"
                        className="btn-nova-equipe"
                        onClick={abrirModalNovaEquipe}
                    >
                        <i className="fa-solid fa-plus"></i>

                        Nova equipe
                    </button>

                )}

            </header>


            {/* MINHAS EQUIPES */}

            <section className="equipes-section">

                <div className="section-header">

                    <div>

                        <h2>
                            Minhas equipes
                        </h2>

                        <p>
                            Equipes das quais você participa.
                        </p>

                    </div>


                    {minhasEquipes.length > 0 && (

                        <div className="equipes-count">

                            <strong>
                                {minhasEquipes.length}
                            </strong>

                            <span>
                                {minhasEquipes.length === 1
                                    ? 'equipe'
                                    : 'equipes'
                                }
                            </span>

                        </div>

                    )}

                </div>


                {minhasEquipes.length > 0 ? (

                    <section className="equipes-cards">

                        {minhasEquipes.map(equipe => (

                            <NavLink
                                key={equipe.id}
                                to={`/equipes/${equipe.id}`}
                                className="equipe-card"
                            >

                                <div className="equipe-card-top">

                                    <div
                                        className="equipe-icon"
                                        style={{
                                            backgroundColor:
                                                `${equipe.cor}15`,
                                            color: equipe.cor
                                        }}
                                    >
                                        <i
                                            className={
                                                `fa-solid ${equipe.icone}`
                                            }
                                        ></i>
                                    </div>


                                    <span className="equipe-status">

                                        <i className="fa-solid fa-circle"></i>

                                        Ativa

                                    </span>

                                </div>


                                <div className="equipe-info">

                                    <h2>
                                        {equipe.nome}
                                    </h2>

                                    <p>
                                        {equipe.descricao ||
                                            'Sem descrição'}
                                    </p>

                                </div>


                                <div className="equipe-card-footer">

                                    <span>
                                        Ver equipe
                                    </span>

                                    <div className="equipe-arrow">
                                        <i className="fa-solid fa-arrow-right"></i>
                                    </div>

                                </div>

                            </NavLink>

                        ))}

                    </section>

                ) : (

                    <div className="sem-equipes">

                        <div className="sem-equipes-icon">
                            <i className="fa-solid fa-users"></i>
                        </div>

                        <h2>
                            Você ainda não participa
                            de nenhuma equipe
                        </h2>

                        <p>
                            Quando você entrar em uma equipe,
                            ela aparecerá aqui.
                        </p>

                    </div>

                )}

            </section>


            {/* TODAS AS EQUIPES — SOMENTE ADMIN */}

            {isAdmin && (

                <section className="equipes-section todas-equipes-section">

                    <div className="section-header">

                        <div>

                            <h2>
                                Todas as equipes
                            </h2>

                            <p>
                                Equipes cadastradas na Wolf Finance.
                            </p>

                        </div>


                        {!loadingTodas && (

                            <div className="equipes-count">

                                <strong>
                                    {todasEquipes.length}
                                </strong>

                                <span>
                                    {todasEquipes.length === 1
                                        ? 'equipe'
                                        : 'equipes'
                                    }
                                </span>

                            </div>

                        )}

                    </div>


                    {/* BUSCA */}

                    {!loadingTodas && todasEquipes.length > 0 && (

                        <div className="equipes-search">

                            <i className="fa-solid fa-magnifying-glass"></i>

                            <input
                                type="text"
                                placeholder="Pesquisar equipe..."
                                value={termoBusca}
                                onChange={event =>
                                    setTermoBusca(event.target.value)
                                }
                            />

                            {termoBusca && (

                                <button
                                    type="button"
                                    className="limpar-busca"
                                    onClick={() => setTermoBusca('')}
                                    aria-label="Limpar busca"
                                >
                                    <i className="fa-solid fa-xmark"></i>
                                </button>

                            )}

                        </div>

                    )}


                    {loadingTodas ? (

                        <div className="equipes-loading">

                            <i className="fa-solid fa-spinner fa-spin"></i>

                            <span>
                                Carregando equipes...
                            </span>

                        </div>

                    ) : todasEquipes.length > 0 ? (

                        todasEquipesFiltradas.length > 0 ? (

                            <div className="todas-equipes-list">

                                {todasEquipesFiltradas.map(equipe => (

                                    <NavLink
                                        key={equipe.id}
                                        to={`/equipes/${equipe.id}`}
                                        className="todas-equipe-item"
                                    >

                                        <div
                                            className="todas-equipe-icon"
                                            style={{
                                                backgroundColor:
                                                    `${equipe.cor}15`,
                                                color: equipe.cor
                                            }}
                                        >
                                            <i
                                                className={
                                                    `fa-solid ${equipe.icone}`
                                                }
                                            ></i>
                                        </div>


                                        <div className="todas-equipe-info">

                                            <strong>
                                                {equipe.nome}
                                            </strong>

                                            <span>
                                                {equipe.descricao ||
                                                    'Sem descrição'}
                                            </span>

                                        </div>


                                        <i className="fa-solid fa-chevron-right todas-equipe-arrow"></i>

                                    </NavLink>

                                ))}

                            </div>

                        ) : (

                            <div className="busca-sem-resultados">

                                <i className="fa-solid fa-magnifying-glass"></i>

                                <h3>
                                    Nenhuma equipe encontrada
                                </h3>

                                <p>
                                    Não encontramos nenhuma equipe
                                    para "{termoBusca}".
                                </p>

                            </div>

                        )

                    ) : (

                        <div className="sem-equipes">

                            <div className="sem-equipes-icon">
                                <i className="fa-solid fa-users"></i>
                            </div>

                            <h2>
                                Nenhuma equipe encontrada
                            </h2>

                            <p>
                                Ainda não existem equipes cadastradas.
                            </p>

                        </div>

                    )}

                </section>

            )}


            {modalAberto && (
                <Modal onClose={fecharModal} containerClassName="nova-equipe-modal">

                    <div className="modal-header">

                        <div>

                            <h2>
                                Nova equipe
                            </h2>

                            <p>
                                Cadastre uma nova equipe
                                na Wolf Finance.
                            </p>

                        </div>


                        <button
                            type="button"
                            className="modal-close"
                            onClick={fecharModal}
                        >
                            <i className="fa-solid fa-xmark"></i>
                        </button>

                    </div>


                    <div className="modal-body">

                        <p>
                            Cadastro de equipe em breve.
                        </p>

                    </div>


                    <div className="modal-footer">

                        <button
                            type="button"
                            className="btn-modal-cancelar"
                            onClick={fecharModal}
                        >
                            Fechar
                        </button>

                    </div>

                </Modal>
            )}

        </main>
    )
}

