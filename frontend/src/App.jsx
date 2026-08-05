import { BrowserRouter, Navigate, NavLink, Route, Routes, Link } from 'react-router-dom'
import AddExpense from './pages/AddExpense.jsx'
import EditExpense from './pages/EditExpense.jsx'
import Dashboard from './pages/Dashboard.jsx'
import LoginPage from './pages/Login.jsx'
import { getAuthUser, isAuthenticated } from './services/auth.js'

const ProtectedRoute = ({ children }) => (isAuthenticated() ? children : <Navigate to="/login" replace />)

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 5v14M5 12h14" />
  </svg>
)

const DashboardIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M4 13h6V4H4z" />
    <path d="M14 20h6v-7h-6z" />
    <path d="M14 4h6v5h-6z" />
    <path d="M4 20h6v-5H4z" />
  </svg>
)

const LoginIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
    <path d="M10 17l5-5-5-5" />
    <path d="M15 12H3" />
  </svg>
)

const ProfileIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
    <path d="M5 20a7 7 0 0 1 14 0" />
  </svg>
)

function App() {
  const loggedIn = isAuthenticated()
  const currentUser = loggedIn ? getAuthUser() : null
  const userName = currentUser?.name || currentUser?.email || 'User'
  const initials = userName
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <BrowserRouter>
      <div className="app-shell">
        <aside className="sidebar">
          <div className="sidebar-brand">
            <div className="brand-badge">F</div>
            <div>
              <p className="brand-kicker">Finance</p>
              <h2 className="brand-title">Workspace</h2>
            </div>
          </div>

          <nav className="sidebar-nav" aria-label="Primary navigation">
            <NavLink to="/" end className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              <DashboardIcon />
              <span>Dashboard</span>
            </NavLink>
            <NavLink to="/add" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              <PlusIcon />
              <span>New</span>
            </NavLink>
          </nav>

          <div className="sidebar-footer">
            {loggedIn ? (
              <div className="profile-pill" title={userName}>
                <span className="profile-avatar">{initials}</span>
                <span className="profile-name">{userName}</span>
              </div>
            ) : (
              <Link className="icon-button" to="/login" aria-label="Login">
                <LoginIcon />
              </Link>
            )}
          </div>
        </aside>

        <div className="app-content">
          <main className="app-main">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/add" element={<ProtectedRoute><AddExpense /></ProtectedRoute>} />
              <Route path="/edit/:id" element={<ProtectedRoute><EditExpense /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
