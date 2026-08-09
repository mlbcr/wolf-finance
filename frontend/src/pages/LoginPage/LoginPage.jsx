import './LoginPage.css'

import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

import useAuth from '@/contexts/useAuth'
import Label from '@/components/Label/Label'
import Input from '@/components/Input/Input'
import Button from '@/components/Button/Button'
import Logo from '@/assets/logo1.png'

export default function LoginPage() {
  const [login, setLogin] = useState(() => localStorage.getItem('savedLogin') ?? '')
  const [senha, setSenha] = useState(() => localStorage.getItem('savedSenha') ?? '')
  const [rememberMe, setRememberMe] = useState(() => Boolean(localStorage.getItem('savedLogin') || localStorage.getItem('savedSenha')))
  const [showPassword, setShowPassword] = useState(false)
  const { login: doLogin } = useAuth()

  const navigate = useNavigate()

  async function handleLogin(e) {
    e.preventDefault()

    try {
      await doLogin({
        login,
        senha,
      })

      if (rememberMe) {
        localStorage.setItem('savedLogin', login)
        localStorage.setItem('savedSenha', senha)
      } else {
        localStorage.removeItem('savedLogin')
        localStorage.removeItem('savedSenha')
      }

      navigate('/')
    } catch (error) {
      console.error(error)
      alert('Login inválido')
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">

        <div className="login-header">
          <img
            src={Logo}
            alt="Wolf Finance"
            className="login-logo"
          />

          <h1>Wolf Finance</h1>
          <h2>Acesse sua conta</h2>
        </div>

        <form className="login-form" onSubmit={handleLogin}>

          <div className="input-group">
            <Label
              value="E-mail ou Matrícula"
              variant="login-label"
            />

            <Input
              type="text"
              placeholder="Digite sua matrícula"
              variant="login-input"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
            />
          </div>

          <div className="input-group">
            <Label
              value="Senha"
              variant="login-label"
            />

            <div className="password-field">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                variant="login-input"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                <i
                  className={
                    showPassword
                      ? 'fa-solid fa-eye-slash'
                      : 'fa-solid fa-eye'
                  }
                />
              </button>
            </div>
          </div>

          <div className="remember-group">
            <label className="remember-checkbox">
                <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) =>
                        setRememberMe(e.target.checked)
                    }
                />

                <span className="custom-checkbox">
                    {rememberMe && (
                        <i className="fa-solid fa-check"></i>
                    )}
                </span>

                <span className="remember-text">
                    Lembrar login e senha
                </span>
            </label>
        </div>

          <Button
            label="Entrar"
            variant="login-button"
          />

          <Link
            className="common-link"
            to="/recuperar-senha"
          >
            Esqueci a senha
          </Link>

        </form>
      </div>
    </div>
  )
}

