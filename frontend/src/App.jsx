import { BrowserRouter, Navigate, NavLink, Route, Routes } from 'react-router-dom'
import AddExpense from './pages/AddExpense.jsx'
import EditExpense from './pages/EditExpense.jsx'
import Dashboard from './pages/Dashboard.jsx'

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <header className="topbar">
          <div>
            <p className="brand-kicker">Finance workspace</p>
            <h2 className="brand-title">Expense Tracker</h2>
          </div>

          <nav className="nav-links" aria-label="Primary">
            <NavLink
              to="/"
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              end
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/add"
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            >
              Add Expense
            </NavLink>
          </nav>
        </header>

        <main className="app-main">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add" element={<AddExpense />} />
            <Route path="/edit/:id" element={<EditExpense />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
