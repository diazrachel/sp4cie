import { useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'

export default function Login() {
  const { login, goTo } = useAuth()
  const [form, setForm]   = useState({ emailOrUsername:'', password:'' })
  const [error, setError] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!form.emailOrUsername || !form.password) { setError('fill in both fields to enter orbit ✦'); return }
    setLoading(true)
    const res = await login({ emailOrUsername: form.emailOrUsername.trim(), password: form.password })
    setLoading(false)
    if (res.error) setError(res.error)
  }

  return (
    <div className="auth-shell">
      <div className="cloud-layer" aria-hidden>{[1,2,3,4].map(i=><div key={i} className={`cloud-drift cd${i}`}/>)}</div>
      <div className="auth-card">
        <button className="auth-back" onClick={() => goTo('landing')}>← back</button>
        <div className="auth-logo-small">✦ sp4cie</div>
        <div className="auth-title">welcome back 🌙</div>
        <div className="auth-sub">good to see you floating by again ✨</div>
        {error && <div className="auth-error">{error}</div>}
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="field-group">
            <label className="field-label">email</label>
            <input className="field-input" type="email" placeholder="your@email.com"
              value={form.emailOrUsername} onChange={e=>{setForm(f=>({...f,emailOrUsername:e.target.value}));setError('')}} autoComplete="email"/>
          </div>
          <div className="field-group">
            <label className="field-label">password</label>
            <div className="pw-row">
              <input className="field-input" type={showPw?'text':'password'} placeholder="your password"
                value={form.password} onChange={e=>{setForm(f=>({...f,password:e.target.value}));setError('')}} autoComplete="current-password"/>
              <button type="button" className="pw-toggle" onClick={()=>setShowPw(s=>!s)}>{showPw?'🙈':'👁️'}</button>
            </div>
          </div>
          <button className="auth-submit" type="submit" disabled={loading}>
            {loading ? 'drifting into orbit... 🌙' : 'log in ✦'}
          </button>
        </form>
        <div className="auth-switch">new to sp4cie? <button onClick={()=>goTo('signup')}>join the orbit</button></div>
      </div>
    </div>
  )
}
