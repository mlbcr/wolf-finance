import { useState } from "react"

import useAuth from "@/contexts/useAuth"
import { mudarSenha } from "@/api/apiAuth"

import "./PerfilPage.css"

import Modal from '@/components/Modal/Modal'
import Button from '@/components/Button/Button'
import BackButton from '@/components/BackButton/BackButton'


export default function PerfilPage() {

    const { usuario, loading } = useAuth()

    const [modalAlteracao, setModalAlteracao] = useState(false)
    const [modalSenha, setModalSenha] = useState(false)

    const [senhaAtual, setSenhaAtual] = useState('')
    const [novaSenha, setNovaSenha] = useState('')
    const [confirmaSenha, setConfirmaSenha] = useState('')

    const [carregandoSenha, setCarregandoSenha] = useState(false)


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


    async function handleMudarSenha() {

        if (!senhaAtual.trim()) {
            alert('Digite a senha atual')
            return
        }

        if (!novaSenha.trim()) {
            alert('Digite a nova senha')
            return
        }

        if (novaSenha !== confirmaSenha) {
            alert('As senhas não conferem')
            return
        }

        if (novaSenha.length < 6) {
            alert('A nova senha deve ter no mínimo 6 caracteres')
            return
        }

        setCarregandoSenha(true)

        try {

            await mudarSenha(senhaAtual, novaSenha)

            alert('Senha alterada com sucesso!')

            setSenhaAtual('')
            setNovaSenha('')
            setConfirmaSenha('')
            setModalSenha(false)

        } catch (error) {

            alert(error.message || 'Erro ao mudar a senha')

        } finally {

            setCarregandoSenha(false)

        }
    }


    return (
        <main className="perfil-page">

            <BackButton />

            <section className="perfil-card">

                <div className="perfil-header">

                    <div className="perfil-avatar">
                        {iniciais}
                    </div>


                    <div className="perfil-header-info">

                        <h1>
                            {usuario.nome_completo}
                        </h1>


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

                            <span>
                                Nome completo
                            </span>

                            <strong>
                                {usuario.nome_completo}
                            </strong>

                        </div>


                        <div className="perfil-field">

                            <span>
                                Data de nascimento
                            </span>

                            <strong>
                                {formatarData(
                                    usuario.data_nascimento
                                )}
                            </strong>

                        </div>


                        <div className="perfil-field">

                            <span>
                                E-mail
                            </span>

                            <strong>
                                {usuario.email}
                            </strong>

                        </div>


                        <div className="perfil-field">

                            <span>
                                Telefone
                            </span>

                            <strong>
                                {usuario.telefone ||
                                    "Não informado"}
                            </strong>

                        </div>


                        <div className="perfil-field">

                            <span>
                                Bairro
                            </span>

                            <strong>
                                {usuario.bairro ||
                                    "Não informado"}
                            </strong>

                        </div>

                    </div>

                </section>


                <div className="perfil-divider"></div>


                {/* INFORMAÇÕES ACADÊMICAS */}

                <section className="perfil-section">

                    <h2>
                        <i className="fa-solid fa-graduation-cap"></i>
                        Informações acadêmicas
                    </h2>


                    <div className="perfil-grid">

                        <div className="perfil-field">

                            <span>
                                Matrícula
                            </span>

                            <strong>
                                {usuario.matricula}
                            </strong>

                        </div>


                        <div className="perfil-field">

                            <span>
                                Curso
                            </span>

                            <strong>
                                {usuario.curso ||
                                    "Não informado"}
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

                            <span>
                                Cargo
                            </span>

                            <strong>
                                {usuario.cargo || "MEMBRO"}
                            </strong>

                        </div>


                        <div className="perfil-field">

                            <span>
                                Status
                            </span>

                            <strong>
                                {usuario.status}
                            </strong>

                        </div>


                        <div className="perfil-field">

                            <span>
                                Ingresso na liga
                            </span>

                            <strong>
                                {formatarData(
                                    usuario.ingresso_liga
                                )}
                            </strong>

                        </div>


                        <div className="perfil-field">

                            <span>
                                Desligamento
                            </span>

                            <strong>
                                {usuario.desligamento_liga
                                    ? formatarData(
                                        usuario.desligamento_liga
                                    )
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


                        <i
                            className={
                                usuario.faz_estagio
                                    ? "fa-solid fa-circle-check"
                                    : "fa-solid fa-circle-xmark"
                            }
                        ></i>

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


                        <Button
                            type="button"
                            variant="btn-secondary"
                            onClick={() => setModalSenha(true)}
                        >
                            <i className="fa-solid fa-key"></i>
                            Mudar senha
                        </Button>

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


                    <Button
                        type="button"
                        variant="btn-alterar"
                        onClick={() => setModalAlteracao(true)}
                    >
                        <i className="fa-solid fa-pen-to-square"></i>
                        Solicitar alteração
                    </Button>

                </section>

            </section>


            {/* MODAL MUDAR SENHA */}

            {modalSenha && (

                <Modal
                    onClose={() => setModalSenha(false)}
                    containerClassName="modal"
                >

                    <div className="modal-header">

                        <div>

                            <h2>
                                Mudar senha
                            </h2>

                            <p>
                                Digite sua senha atual e a nova senha.
                            </p>

                        </div>


                        <Button
                            type="button"
                            variant="modal-close"
                            onClick={() =>
                                setModalSenha(false)
                            }
                            aria-label="Fechar modal"
                        >
                            <i className="fa-solid fa-xmark"></i>
                        </Button>

                    </div>


                    <div className="modal-body">

                        <div className="form-group">

                            <label>
                                Senha atual
                            </label>

                            <input
                                type="password"
                                placeholder="Digite sua senha atual"
                                value={senhaAtual}
                                onChange={e =>
                                    setSenhaAtual(e.target.value)
                                }
                                disabled={carregandoSenha}
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Nova senha
                            </label>

                            <input
                                type="password"
                                placeholder="Digite sua nova senha"
                                value={novaSenha}
                                onChange={e =>
                                    setNovaSenha(e.target.value)
                                }
                                disabled={carregandoSenha}
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Confirmar nova senha
                            </label>

                            <input
                                type="password"
                                placeholder="Confirme sua nova senha"
                                value={confirmaSenha}
                                onChange={e =>
                                    setConfirmaSenha(e.target.value)
                                }
                                disabled={carregandoSenha}
                            />

                        </div>

                    </div>


                    <div className="modal-footer">

                        <Button
                            type="button"
                            variant="btn-secondary"
                            onClick={() =>
                                setModalSenha(false)
                            }
                            disabled={carregandoSenha}
                        >
                            Cancelar
                        </Button>

                        <Button
                            type="button"
                            variant="btn-primary"
                            onClick={handleMudarSenha}
                            disabled={carregandoSenha}
                        >
                            {carregandoSenha ? (
                                <>
                                    <i className="fa-solid fa-spinner fa-spin"></i>
                                    Salvando...
                                </>
                            ) : (
                                <>
                                    <i className="fa-solid fa-key"></i>
                                    Mudar senha
                                </>
                            )}
                        </Button>

                    </div>

                </Modal>

            )}


            {/* MODAL ALTERAR DADOS */}

            {modalAlteracao && (

                <Modal
                    onClose={() => setModalAlteracao(false)}
                    containerClassName="modal"
                >

                    <div className="modal-header">

                        <div>

                            <h2>
                                Solicitar alteração
                            </h2>

                            <p>
                                Explique quais informações precisam
                                ser alteradas.
                            </p>

                        </div>


                        <Button
                            type="button"
                            variant="modal-close"
                            onClick={() =>
                                setModalAlteracao(false)
                            }
                            aria-label="Fechar modal"
                        >
                            <i className="fa-solid fa-xmark"></i>
                        </Button>

                    </div>


                    <textarea
                        className="alteracao-textarea"
                        placeholder="Ex: Meu telefone mudou para (21) 99999-9999..."
                    />


                    <div className="modal-actions">

                        <Button
                            type="button"
                            label="Cancelar"
                            variant="btn-cancelar"
                            onClick={() =>
                                setModalAlteracao(false)
                            }
                        />


                        <Button
                            type="button"
                            variant="btn-enviar"
                        >
                            <i className="fa-solid fa-paper-plane"></i>
                            Enviar solicitação
                        </Button>

                    </div>

                </Modal>

            )}

        </main>
    )
}