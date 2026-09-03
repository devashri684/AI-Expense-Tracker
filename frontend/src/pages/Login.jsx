// import { useState } from 'react'
// import { Link, useNavigate } from 'react-router-dom'
// import { loginUser, registerUser } from '../services/auth.js'

// function LoginPage() {
//   const navigate = useNavigate()
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [mode, setMode] = useState('login')
//   const [error, setError] = useState('')
//   const [loading, setLoading] = useState(false)

//   const handleSubmit = async (event) => {
//     event.preventDefault()
//     setError('')
//     setLoading(true)

//     try {
//       if (mode === 'register') {
//         await registerUser(email, password)
//       } else {
//         await loginUser(email, password)
//       }

//       navigate('/')
//     } catch (submitError) {
//       setError(submitError.message || 'Unable to continue.')
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <section className="page-stack">
//       <div className="hero-card card">
//         <div>
//           <p className="eyebrow">Smart Finance</p>
//           <h1>{mode === 'login' ? 'Login' : 'Create Account'}</h1>
//           <p className="hero-copy">
//             Sign in to access your dashboard and manage income and expense transactions.
//           </p>
//         </div>
//       </div>

//       <form className="card form-card" onSubmit={handleSubmit}>
//         <div className="form-grid">
//           <label className="field">
//             <span>Email</span>
//             <input
//               type="email"
//               value={email}
//               onChange={(event) => setEmail(event.target.value)}
//               placeholder="you@example.com"
//               required
//             />
//           </label>

//           <label className="field">
//             <span>Password</span>
//             <input
//               type="password"
//               value={password}
//               onChange={(event) => setPassword(event.target.value)}
//               placeholder="Enter password"
//               required
//             />
//           </label>
//         </div>

//         {error && <div className="form-error">{error}</div>}

//         <div className="form-actions">
//           <button type="submit" disabled={loading}>
//             {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Register'}
//           </button>
//           <button type="button" className="button button-secondary" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
//             {mode === 'login' ? 'Create account' : 'Back to login'}
//           </button>
//         </div>
//       </form>

//       <div className="state-card">
//         Demo mode: use any email/password and it will be stored locally for this browser.
//       </div>
//     </section>
//   )
// }

// export default LoginPage
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginUser, registerUser } from '../services/auth.js'


const EmailIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M4 6h16v12H4z" />
    <path d="m4 7 8 6 8-6" />
  </svg>
)

const LockIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M7 11V8a5 5 0 0 1 10 0v3" />
    <rect x="5" y="11" width="14" height="10" rx="2" ry="2" />
  </svg>
)

const ToggleIcon = ({ open }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    {open ? (
      <>
        <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ) : (
      <>
        <path d="M3 3l18 18" />
        <path d="M10.6 10.6a3 3 0 0 0 4.24 4.24" />
        <path d="M5.5 5.5C3.8 6.7 2.6 8.2 2 9.1c0 0 3.5 6.9 10 6.9 1 0 1.9-.1 2.8-.3" />
      </>
    )}
  </svg>
)

const BrandIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M4 13c3-6 13-6 16 0" />
    <path d="M6 17c2-4 10-4 12 0" />
    <path d="M12 4v16" />
  </svg>
)


function LoginPage() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const [mode, setMode] = useState('login')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)


  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (mode === 'register') {
        await registerUser(email, password)
      } else {
        await loginUser(email, password)
      }

      navigate('/')

    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="login-page">
      <section className="login-hero card">
        <div className="login-hero-copy">
          <p className="eyebrow">AI Expense Tracker</p>
          <h1>Manage income, expenses, budgets and savings intelligently.</h1>
          <p className="hero-copy">
            A modern finance workspace for tracking spending, staying on budget, and making better decisions.
          </p>
        </div>

        <div className="login-feature-grid">
          <article className="feature-card">
            <span className="feature-icon feature-icon-blue" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M12 3v18" />
                <path d="M5 8h14" />
                <path d="M7.5 3.5h9" />
              </svg>
            </span>
            <div>
              <h2>Smart Expense Tracking</h2>
              <p>Organize transactions with a clear, fast dashboard workflow.</p>
            </div>
          </article>

          <article className="feature-card">
            <span className="feature-icon feature-icon-purple" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M4 18h16" />
                <path d="M6 18V9" />
                <path d="M12 18V6" />
                <path d="M18 18v-4" />
              </svg>
            </span>
            <div>
              <h2>Budget Alerts</h2>
              <p>Stay ahead of overspending with timely budget signals.</p>
            </div>
          </article>

          <article className="feature-card">
            <span className="feature-icon feature-icon-teal" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M12 2l2.4 5.5L20 10l-5.6 2.5L12 18l-2.4-5.5L4 10l5.6-2.5L12 2Z" />
              </svg>
            </span>
            <div>
              <h2>AI Financial Insights</h2>
              <p>Spot patterns and trends across your money flow faster.</p>
            </div>
          </article>
        </div>
      </section>

      <div className="login-panel">
        <div className="login-illustration" aria-hidden="true">
          <div className="illustration-glow illustration-glow-a" />
          <div className="illustration-glow illustration-glow-b" />
          <div className="illustration-card illustration-card-one">
            <span>$</span>
            <small>+24.8%</small>
          </div>
          <div className="illustration-card illustration-card-two">
            <span>Budget</span>
            <small>On track</small>
          </div>
          <div className="illustration-graph">
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
        </div>

        <form className="login-card card" onSubmit={handleSubmit}>
          <div className="login-card-header">
            <div className="login-logo" aria-hidden="true">
              <BrandIcon />
            </div>
            <p className="eyebrow">{mode === 'login' ? 'Sign in' : 'Get started'}</p>
            <h2>Welcome Back</h2>
            <p className="login-subtitle">Login to continue managing your finances</p>
          </div>

          <div className="input-group">
            <label htmlFor="login-email">Email</label>
            <div className="input-shell">
              <span className="input-icon" aria-hidden="true">
                <EmailIcon />
              </span>
              <input
                id="login-email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="login-password">Password</label>
            <div className="input-shell password-box">
              <span className="input-icon" aria-hidden="true">
                <LockIcon />
              </span>
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                required
              />

              <button
                type="button"
                className="eye"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <ToggleIcon open={showPassword} />
              </button>
            </div>
          </div>

          {error && <p className="error">{error}</p>}

          <button className="login-submit" type="submit" disabled={loading}>
            {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Register'}
          </button>

          <p className="switch-text">
            {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
            <span onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
              {mode === 'login' ? ' Register' : ' Login'}
            </span>
          </p>
        </form>
      </div>
    </div>
  )
}


export default LoginPage