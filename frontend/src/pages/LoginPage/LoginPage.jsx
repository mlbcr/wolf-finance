import './LoginPage.css'

import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

import Label from '@/components/Label/Label'
import Input from '@/components/Input/Input'
import Button from '@/components/Button/Button'
import Logo from '@/assets/logo1.png'

export default function LoginPage() {
  const [login, setLogin] = useState('')
  const [senha, setSenha] = useState('')

  const navigate = useNavigate()

  async function handleLogin(e) {
    e.preventDefault()

    const response = await fetch('http://localhost:8000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        login: login,
        senha: senha
      })
    })

    const data = await response.json()

    if (!response.ok) {
      console.log(data)
      alert('Login inválido')
      return
    }

    localStorage.setItem('token', data.access_token)

    navigate('/')
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

            <Input
              type="password"
              placeholder="••••••••"
              variant="login-input"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
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

