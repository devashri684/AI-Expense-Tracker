import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser, registerUser } from '../services/auth.js'

function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState('login')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (mode === 'register') {
        await registerUser(email, password)
      } else {
        await loginUser(email, password)
      }

      navigate('/')
    } catch (submitError) {
      setError(submitError.message || 'Unable to continue.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="page-stack">
      <div className="hero-card card">
        <div>
          <p className="eyebrow">Smart Finance</p>
          <h1>{mode === 'login' ? 'Login' : 'Create Account'}</h1>
          <p className="hero-copy">
            Sign in to access your dashboard and manage income and expense transactions.
          </p>
        </div>
      </div>

      <form className="card form-card" onSubmit={handleSubmit}>
        <div className="form-grid">
          <label className="field">
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
            />
          </label>

          <label className="field">
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter password"
              required
            />
          </label>
        </div>

        {error && <div className="form-error">{error}</div>}

        <div className="form-actions">
          <button type="submit" disabled={loading}>
            {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Register'}
          </button>
          <button type="button" className="button button-secondary" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
            {mode === 'login' ? 'Create account' : 'Back to login'}
          </button>
        </div>
      </form>

      <div className="state-card">
        Demo mode: use any email/password and it will be stored locally for this browser.
      </div>
    </section>
  )
}

export default LoginPage
