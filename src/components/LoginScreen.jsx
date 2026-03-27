import { useState } from 'react'
import { INITIAL_USERS, ROLE_LABELS } from '../data/initialData.js'
import Logo from './Logo.jsx'
import s from './LoginScreen.module.css'

export default function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [showDemo, setShowDemo] = useState(false)

  const handleLogin = () => {
    const user = INITIAL_USERS.find(
      (u) => u.username === username.toLowerCase() && u.password === password
    )
    if (user) { setError(''); onLogin(user) }
    else setError('Usuário ou senha incorretos')
  }

  return (
    <div className={s.wrap}>
      <div className={s.logoBox}>
        <Logo size={80} />
        <h1 className={s.brand}>ADMIRAI</h1>
        <p className={s.brandSub}>SISTEMA DA IGREJA</p>
      </div>

      <div className={s.card}>
        <h2 className={s.cardTitle}>Entrar</h2>

        <div className={s.field}>
          <label>USUÁRIO</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            placeholder="Digite seu usuário"
          />
        </div>

        <div className={s.field}>
          <label>SENHA</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            placeholder="Digite sua senha"
          />
        </div>

        {error && <p className={s.error}>{error}</p>}

        <button className={s.btnLogin} onClick={handleLogin}>ACESSAR</button>
        <button className={s.btnDemo} onClick={() => setShowDemo(!showDemo)}>
          {showDemo ? 'Ocultar usuários demo' : 'Ver usuários demo'}
        </button>
      </div>

      {showDemo && (
        <div className={s.demoPanel}>
          <p className={s.demoHeader}>USUÁRIOS DE DEMONSTRAÇÃO (senha: 123)</p>
          {INITIAL_USERS.map((u) => (
            <button
              key={u.id}
              className={s.demoItem}
              onClick={() => { setUsername(u.username); setPassword('123') }}
            >
              <span className={s.demoName}>{u.name}</span>
              <span className={s.demoRole}>{ROLE_LABELS[u.role]}</span>
              <span className={s.demoUser}>@{u.username}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
