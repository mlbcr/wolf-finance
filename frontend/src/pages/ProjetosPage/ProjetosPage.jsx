import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'

import useProjetos from '@/contexts/Projetos/useProjetos'
import useAuth from '@/contexts/useAuth'

import {
    buscarTodosProjetos
} from '@/api/api'

import Modal from '@/components/Modal/Modal'
import Button from '@/components/Button/Button'
import BackButton from '@/components/BackButton/BackButton'

import './ProjetosPage.css'


export default function ProjetosPage() {

    const { usuario } = useAuth()

    const {
        projetos: meusProjetos,
        loading
    } = useProjetos()

    const [todosProjetos, setTodosProjetos] = useState([])
    const [loadingTodos, setLoadingTodos] = useState(true)

    const [termoBusca, setTermoBusca] = useState('')
    const [modalAberto, setModalAberto] = useState(false)

    const isAdmin = usuario?.tipo === 'ADMIN'


    const projetosFiltrados = todosProjetos.filter(projeto => {

        const busca = termoBusca
            .toLowerCase()
            .trim()

        if (!busca) {
            return true
        }

        return (
            projeto.nome
                ?.toLowerCase()
                .includes(busca) ||

            projeto.descricao
                ?.toLowerCase()
                .includes(busca)
        )
    })


    useEffect(() => {

        async function carregarTodosProjetos() {

            try {

                setLoadingTodos(true)

                const dados = await buscarTodosProjetos()

                setTodosProjetos(dados)

            } catch (error) {

                console.error(
                    'Erro ao buscar todos os projetos:',
                    error
                )

                setTodosProjetos([])

            } finally {

                setLoadingTodos(false)

            }
        }


        if (isAdmin) {
            carregarTodosProjetos()
        }

    }, [isAdmin])


    function abrirModalNovoProjeto() {

        console.log(
            'Abrir cadastro de novo projeto'
        )

        setModalAberto(true)
    }


    function fecharModal() {

        setModalAberto(false)

    }


    if (loading) {

        return (
            <main className="projetos-page">
                <p>Carregando...</p>
            </main>
        )
    }


    return (
        <main className="projetos-page">

            <BackButton />

            {/* HEADER */}

            <header className="projetos-header">

                <div>

                    <span className="page-label">
                        Wolf Finance
                    </span>

                    <h1>
                        Projetos
                    </h1>

                    <p>
                        Projetos dos quais você participa
                        na liga.
                    </p>

                </div>


                {isAdmin && (

                    <Button
                        type="button"
                        variant="btn-novo-projeto"
                        onClick={abrirModalNovoProjeto}
                    >
                        <i className="fa-solid fa-plus"></i>

                        Novo projeto
                    </Button>

                )}

            </header>


            {/* MEUS PROJETOS */}

            <section className="projetos-section">

                <div className="section-header">

                    <div>

                        <h2>
                            Meus projetos
                        </h2>

                        <p>
                            Projetos dos quais você participa.
                        </p>

                    </div>


                    {meusProjetos.length > 0 && (

                        <div className="projetos-count">

                            <strong>
                                {meusProjetos.length}
                            </strong>

                            <span>
                                {meusProjetos.length === 1
                                    ? 'projeto'
                                    : 'projetos'
                                }
                            </span>

                        </div>

                    )}

                </div>


                {meusProjetos.length > 0 ? (

                    <section className="projetos-cards">

                        {meusProjetos.map(projeto => (

                            <NavLink
                                key={projeto.id}
                                to={`/projetos/${projeto.id}`}
                                className="projeto-card"
                            >

                                <div className="projeto-card-top">

                                    <div
                                        className="projeto-icon"
                                        style={{
                                            backgroundColor:
                                                `${projeto.cor}15`,
                                            color: projeto.cor
                                        }}
                                    >
                                        <i
                                            className={
                                                `fa-solid ${projeto.icone}`
                                            }
                                        ></i>
                                    </div>


                                    <span className="projeto-status">

                                        <i className="fa-solid fa-circle"></i>

                                        {projeto.status || 'ATIVO'}

                                    </span>

                                </div>


                                <div className="projeto-info">

                                    <h2>
                                        {projeto.nome}
                                    </h2>

                                    <p>
                                        {projeto.descricao ||
                                            'Sem descrição'}
                                    </p>

                                </div>


                                <div className="projeto-card-footer">

                                    <span>
                                        Ver projeto
                                    </span>

                                    <div className="projeto-arrow">
                                        <i className="fa-solid fa-arrow-right"></i>
                                    </div>

                                </div>

                            </NavLink>

                        ))}

                    </section>

                ) : (

                    <div className="sem-projetos">

                        <div className="sem-projetos-icon">
                            <i className="fa-solid fa-diagram-project"></i>
                        </div>

                        <h2>
                            Você ainda não participa
                            de nenhum projeto
                        </h2>

                        <p>
                            Quando você entrar em um projeto,
                            ele aparecerá aqui.
                        </p>

                    </div>

                )}

            </section>


            {/* TODOS OS PROJETOS — SOMENTE ADMIN */}

            {isAdmin && (

                <section className="projetos-section todos-projetos-section">

                    <div className="section-header">

                        <div>

                            <h2>
                                Todos os projetos
                            </h2>

                            <p>
                                Projetos cadastrados na
                                Wolf Finance.
                            </p>

                        </div>


                        {!loadingTodos && (

                            <div className="projetos-count">

                                <strong>
                                    {todosProjetos.length}
                                </strong>

                                <span>
                                    {todosProjetos.length === 1
                                        ? 'projeto'
                                        : 'projetos'
                                    }
                                </span>

                            </div>

                        )}

                    </div>


                    {/* BUSCA */}

                    {!loadingTodos &&
                        todosProjetos.length > 0 && (

                            <div className="projetos-search">

                                <i className="fa-solid fa-magnifying-glass"></i>

                                <input
                                    type="text"
                                    placeholder="Pesquisar projeto..."
                                    value={termoBusca}
                                    onChange={event =>
                                        setTermoBusca(
                                            event.target.value
                                        )
                                    }
                                />


                                {termoBusca && (

                                    <Button
                                        type="button"
                                        variant="limpar-busca"
                                        onClick={() =>
                                            setTermoBusca('')
                                        }
                                        aria-label="Limpar busca"
                                    >
                                        <i className="fa-solid fa-xmark"></i>
                                    </Button>

                                )}

                            </div>

                        )}


                    {loadingTodos ? (

                        <div className="projetos-loading">

                            <i className="fa-solid fa-spinner fa-spin"></i>

                            <span>
                                Carregando projetos...
                            </span>

                        </div>

                    ) : todosProjetos.length > 0 ? (

                        projetosFiltrados.length > 0 ? (

                            <div className="todos-projetos-list">

                                {projetosFiltrados.map(projeto => (

                                    <NavLink
                                        key={projeto.id}
                                        to={`/projetos/${projeto.id}`}
                                        className="todos-projeto-item"
                                    >

                                        <div
                                            className="todos-projeto-icon"
                                            style={{
                                                backgroundColor:
                                                    `${projeto.cor}15`,
                                                color: projeto.cor
                                            }}
                                        >
                                            <i
                                                className={
                                                    `fa-solid ${projeto.icone}`
                                                }
                                            ></i>
                                        </div>


                                        <div className="todos-projeto-info">

                                            <strong>
                                                {projeto.nome}
                                            </strong>

                                            <span>
                                                {projeto.descricao ||
                                                    'Sem descrição'}
                                            </span>

                                        </div>


                                        <i
                                            className="
                                                fa-solid
                                                fa-chevron-right
                                                todos-projeto-arrow
                                            "
                                        ></i>

                                    </NavLink>

                                ))}

                            </div>

                        ) : (

                            <div className="busca-sem-resultados">

                                <i className="fa-solid fa-magnifying-glass"></i>

                                <h3>
                                    Nenhum projeto encontrado
                                </h3>

                                <p>
                                    Não encontramos nenhum projeto
                                    para "{termoBusca}".
                                </p>

                            </div>

                        )

                    ) : (

                        <div className="sem-projetos">

                            <div className="sem-projetos-icon">
                                <i className="fa-solid fa-diagram-project"></i>
                            </div>

                            <h2>
                                Nenhum projeto encontrado
                            </h2>

                            <p>
                                Ainda não existem projetos cadastrados.
                            </p>

                        </div>

                    )}

                </section>

            )}


            {/* MODAL */}

            {modalAberto && (

                <Modal
                    onClose={fecharModal}
                    containerClassName="novo-projeto-modal"
                >

                    <div className="modal-header">

                        <div>

                            <h2>
                                Novo projeto
                            </h2>

                            <p>
                                Cadastre um novo projeto
                                na Wolf Finance.
                            </p>

                        </div>


                        <Button
                            type="button"
                            variant="modal-close"
                            onClick={fecharModal}
                            aria-label="Fechar modal"
                        >
                            <i className="fa-solid fa-xmark"></i>
                        </Button>

                    </div>


                    <div className="modal-body">

                        <p>
                            Cadastro de projeto em breve.
                        </p>

                    </div>


                    <div className="modal-footer">

                        <Button
                            type="button"
                            label="Fechar"
                            variant="btn-modal-cancelar"
                            onClick={fecharModal}
                        />

                    </div>

                </Modal>

            )}

        </main>
    )
}