import { useState } from "react"

import useAuth from "@/contexts/useAuth"

import "./PerfilPage.css"

export default function PerfilPage() {

    const { usuario, loading } = useAuth()

    const [modalAberto, setModalAberto] = useState(false)

    if (loading) {
        return <p>Carregando...</p>
    }

    if (!usuario) {
        return <p>Não foi possível carregar o usuário.</p>
    }

    const iniciais = usuario.nome_completo
        .split(" ")
        .map(nome => nome[0])
        .slice(0, 2)
        .join("")

    function formatarData(data) {
        if (!data) {
            return "Não informado"
        }

        const [ano, mes, dia] = data.split("-")

        return `${dia}/${mes}/${ano}`
    }

    return (
        <main className="perfil-page">

            <section className="perfil-card">

                <div className="perfil-header">

                    <div className="perfil-avatar">
                        {iniciais}
                    </div>

                    <div className="perfil-header-info">

                        <h1>{usuario.nome_completo}</h1>

                        <div className="perfil-badges">

                            <span className="perfil-role">
                                {usuario.tipo} {usuario.status}
                            </span>


                        </div>

                    </div>

                </div>


                <div className="perfil-divider"></div>


                {/* INFORMAÇÕES PESSOAIS */}

                <section className="perfil-section">

                    <h2>
                        <i className="fa-solid fa-user"></i>
                        Informações pessoais
                    </h2>

                    <div className="perfil-grid">

                        <div className="perfil-field">
                            <span>Nome completo</span>
                            <strong>{usuario.nome_completo}</strong>
                        </div>

                        <div className="perfil-field">
                            <span>Data de nascimento</span>
                            <strong>
                                {formatarData(usuario.data_nascimento)}
                            </strong>
                        </div>

                        <div className="perfil-field">
                            <span>E-mail</span>
                            <strong>{usuario.email}</strong>
                        </div>

                        <div className="perfil-field">
                            <span>Telefone</span>
                            <strong>
                                {usuario.telefone || "Não informado"}
                            </strong>
                        </div>

                        <div className="perfil-field">
                            <span>Bairro</span>
                            <strong>
                                {usuario.bairro || "Não informado"}
                            </strong>
                        </div>

                    </div>

                </section>


                <div className="perfil-divider"></div>

                <section className="perfil-section">
                    <h2>
                        <i className="fa-solid fa-graduation-cap"></i>
                        Informações acadêmicas
                    </h2>
                    <div className="perfil-grid">
                        <div className="perfil-field">
                            <span>Matrícula</span>
                            <strong>{usuario.matricula}</strong>
                        </div>

                        <div className="perfil-field">
                            <span>Curso</span>
                            <strong>
                                {usuario.curso || "Não informado"}
                            </strong>
                        </div>

                    </div>

                </section>


                <div className="perfil-divider"></div>


                {/* INFORMAÇÕES DA LIGA */}

                <section className="perfil-section">

                    <h2>
                        <i className="fa-solid fa-people-group"></i>
                        Informações na liga
                    </h2>

                    <div className="perfil-grid">

                        <div className="perfil-field">
                            <span>Cargo</span>
                            <strong>
                                {usuario.cargo || "MEMBRO"}
                            </strong>
                        </div>

                        <div className="perfil-field">
                            <span>Status</span>
                            <strong>
                                {usuario.status}
                            </strong>
                        </div>

                        <div className="perfil-field">
                            <span>Ingresso na liga</span>
                            <strong>
                                {formatarData(usuario.ingresso_liga)}
                            </strong>
                        </div>

                        <div className="perfil-field">
                            <span>Desligamento</span>
                            <strong>
                                {usuario.desligamento_liga
                                    ? formatarData(usuario.desligamento_liga)
                                    : "Não desligado"
                                }
                            </strong>
                        </div>

                    </div>

                </section>


                <div className="perfil-divider"></div>


                {/* ESTÁGIO */}

                <section className="perfil-section">

                    <h2>
                        <i className="fa-solid fa-briefcase"></i>
                        Estágio
                    </h2>

                    <div className="perfil-estagio">

                        <span>
                            {usuario.faz_estagio
                                ? "Atualmente realizando estágio"
                                : "Não realiza estágio atualmente"
                            }
                        </span>

                        <i className={
                            usuario.faz_estagio
                                ? "fa-solid fa-circle-check"
                                : "fa-solid fa-circle-xmark"
                        }></i>

                    </div>

                </section>


                <div className="perfil-divider"></div>


                {/* SEGURANÇA */}

                <section className="perfil-security">

                    <div className="security-title">

                        <h2>
                            <i className="fa-solid fa-lock"></i>
                            Segurança
                        </h2>

                        <p>
                            A senha nunca é exibida por segurança.
                        </p>

                    </div>

                    <div className="password-row">

                        <span className="password-dots">
                            ••••••••••
                        </span>

                        <button className="btn-secondary">
                            <i className="fa-solid fa-key"></i>
                            Mudar senha
                        </button>

                    </div>

                </section>


                <div className="perfil-divider"></div>


                {/* ALTERAÇÃO */}

                <section className="perfil-request">

                    <div>

                        <h2>
                            Encontrou alguma informação incorreta?
                        </h2>

                        <p>
                            Solicite uma alteração dos seus dados
                            para a administração da liga.
                        </p>

                    </div>

                    <button
                        className="btn-alterar"
                        onClick={() => setModalAberto(true)}
                    >
                        <i className="fa-solid fa-pen-to-square"></i>
                        Solicitar alteração
                    </button>

                </section>

            </section>


            {/* MODAL */}

            {modalAberto && (

                <div className="modal-overlay">

                    <div className="modal">

                        <div className="modal-header">

                            <div>
                                <h2>Solicitar alteração</h2>

                                <p>
                                    Explique quais informações precisam
                                    ser alteradas.
                                </p>
                            </div>

                            <button
                                className="modal-close"
                                onClick={() => setModalAberto(false)}
                            >
                                <i className="fa-solid fa-xmark"></i>
                            </button>

                        </div>

                        <textarea
                            className="alteracao-textarea"
                            placeholder="Ex: Meu telefone mudou para (21) 99999-9999..."
                        />

                        <div className="modal-actions">

                            <button
                                className="btn-cancelar"
                                onClick={() => setModalAberto(false)}
                            >
                                Cancelar
                            </button>

                            <button className="btn-enviar">
                                <i className="fa-solid fa-paper-plane"></i>
                                Enviar solicitação
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </main>
    )
}

