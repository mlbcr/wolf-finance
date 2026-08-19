import './RecuperarSenhaPage.css'

import { useState } from 'react'
import { Link } from 'react-router-dom'

import Label from '@/components/Label/Label'
import Input from '@/components/Input/Input'
import Button from '@/components/Button/Button'
import AlertModal from '@/components/AlertModal/AlertModal'
import LoadingModal from '@/components/LoadingModal/LoadingModal'

import recuperarSenha from '@/api/api'

export default function RecuperarSenhaPage() {
    const [login, setLogin] = useState('')
    const [enviado, setEnviado] = useState(false)
    const [erro, setErro] = useState(null)
    const [carregando, setCarregando] = useState(false)

    async function handleRecuperacao(e) {
        e.preventDefault()

        try {
            setCarregando(true)
            setErro(null)

            await recuperarSenha(login)

            setEnviado(true)
        } catch (error) {
            console.error(error)
            setErro('Não foi possível solicitar a recuperação da senha.')
        } finally {
            setCarregando(false)
        }
    }

    return (
        <div className="recuperar-page">
            {carregando && <LoadingModal mensagem="Processando..." />}
            {erro && (
                <AlertModal
                    titulo="Erro"
                    mensagem={erro}
                    onFechar={() => setErro(null)}
                    tipo="erro"
                />
            )}

            <div className="recuperar-card">

                <div className="recuperar-header">
                    <div className="recuperar-icon">
                        <i className="fa-solid fa-key" />
                    </div>

                    <h1>Recuperar senha</h1>

                    <p>
                        Informe seu e-mail ou matrícula e enviaremos
                        as instruções para recuperar sua conta.
                    </p>
                </div>

                {!enviado ? (
                    <form
                        className="recuperar-form"
                        onSubmit={handleRecuperacao}
                    >
                        <div className="input-group">
                            <Label
                                value="E-mail ou Matrícula"
                                variant="login-label"
                            />

                            <Input
                                type="text"
                                placeholder="Digite seu e-mail ou matrícula"
                                variant="login-input"
                                value={login}
                                onChange={(e) => setLogin(e.target.value)}
                            />
                        </div>

                        <Button
                            label="Enviar instruções"
                            variant="recuperar-senha"
                            loading={carregando}
                        />

                        <Link
                            to="/login"
                            className="common-link"
                        >
                            Voltar para o login
                        </Link>
                    </form>
                ) : (
                    <div className="recuperar-sucesso">

                        <div className="sucesso-icon">
                            <i className="fa-solid fa-check" />
                        </div>

                        <h2>E-mail enviado!</h2>

                        <p>
                            Se os dados informados estiverem cadastrados,
                            você receberá um e-mail com as instruções para
                            recuperar sua senha.
                        </p>

                        <Link
                            to="/login"
                            className="common-link"
                        >
                            Voltar para o login
                        </Link>

                    </div>
                )}

            </div>
        </div>
    )
}