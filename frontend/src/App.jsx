// // import { BrowserRouter, Navigate, NavLink, Route, Routes, Link, useLocation } from 'react-router-dom'
// // import AddExpense from './pages/AddExpense.jsx'
// // import EditExpense from './pages/EditExpense.jsx'
// // import Dashboard from './pages/Dashboard.jsx'
// // import LoginPage from './pages/Login.jsx'
// // import { getAuthUser, isAuthenticated } from './services/auth.js'



// // const ProtectedRoute = ({ children }) => (isAuthenticated() ? children : <Navigate to="/login" replace />)

// // const PlusIcon = () => (
// //   <svg viewBox="0 0 24 24" aria-hidden="true">
// //     <path d="M12 5v14M5 12h14" />
// //   </svg>
// // )


// // const DashboardIcon = () => (
// //   <svg viewBox="0 0 24 24" aria-hidden="true">
// //     <path d="M4 13h6V4H4z" />
// //     <path d="M14 20h6v-7h-6z" />
// //     <path d="M14 4h6v5h-6z" />
// //     <path d="M4 20h6v-5H4z" />
// //   </svg>
// // )
// // const LoginIcon = () => (
// //   <svg viewBox="0 0 24 24" aria-hidden="true">
// //     <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
// //     <path d="M10 17l5-5-5-5" />
// //     <path d="M15 12H3" />
// //   </svg>
// // )

// // function AppShell() {
// //   const location = useLocation()
// //   const loggedIn = isAuthenticated()
// //   const currentUser = loggedIn ? getAuthUser() : null
// //   const userName = currentUser?.name || currentUser?.email || 'User'
// //   const initials = userName
// //     .split(' ')
// //     .map((part) => part[0])
// //     .join('')
// //     .slice(0, 2)
// //     .toUpperCase()
// //   const isAuthPage = location.pathname === '/login' || location.pathname === '/register'

// //   return (
// //     <div className={`app-shell${isAuthPage ? ' auth-shell' : ''}`}>
// //       {!isAuthPage && (
// //         <aside className="sidebar">
// //           <div className="sidebar-brand">
// //             <div className="brand-badge">F</div>
// //             <div>
// //               <p className="brand-kicker">Finance</p>
// //               <h2 className="brand-title">Workspace</h2>
// //             </div>
// //           </div>

// //           <nav className="sidebar-nav" aria-label="Primary navigation">
// //             <NavLink to="/" end className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
// //               <DashboardIcon />
// //               <span>Dashboard</span>
// //             </NavLink>
// //             <NavLink to="/add" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
// //               <PlusIcon />
// //               <span>New</span>
// //             </NavLink>
// //           </nav>

// //           <div className="sidebar-footer">
// //             {loggedIn ? (
// //               <div className="profile-pill" title={userName}>
// //                 <span className="profile-avatar">{initials}</span>
// //                 <span className="profile-name">{userName}</span>
// //               </div>
// //             ) : (
// //               <Link className="icon-button" to="/login" aria-label="Login">
// //                 <LoginIcon />
// //               </Link>
// //             )}
// //           </div>
// //         </aside>
// //       )}

// //       <div className="app-content">
// //         <main className="app-main">
// //           <Routes>
// //             <Route path="/login" element={<LoginPage />} />
// //             <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
// //             <Route path="/add" element={<ProtectedRoute><AddExpense /></ProtectedRoute>} />
// //             <Route path="/edit/:id" element={<ProtectedRoute><EditExpense /></ProtectedRoute>} />
// //             <Route path="*" element={<Navigate to="/" replace />} />
// //           </Routes>
// //         </main>
// //       </div>
// //     </div>
// //   )
// // }

// // function App() {
// //   return (
// //     <BrowserRouter>
// //       <AppShell />
// //     </BrowserRouter>
// //   )
// // }

// // export default App
// import { BrowserRouter, Navigate, NavLink, Route, Routes, Link, useLocation } from 'react-router-dom'
// import AddExpense from './pages/AddExpense.jsx'
// import EditExpense from './pages/EditExpense.jsx'
// import Dashboard from './pages/Dashboard.jsx'
// import Transactions from './pages/Transactions.jsx'
// import LoginPage from './pages/Login.jsx'
// import { getAuthUser, isAuthenticated } from './services/auth.js'
// import AiInsights from './pages/AiInsights.jsx'

// const ProtectedRoute = ({ children }) => (isAuthenticated() ? children : <Navigate to="/login" replace />)

// const PlusIcon = () => (
//   <svg viewBox="0 0 24 24" aria-hidden="true">
//     <path d="M12 5v14M5 12h14" />
//   </svg>
// )

// const DashboardIcon = () => (
//   <svg viewBox="0 0 24 24" aria-hidden="true">
//     <path d="M4 13h6V4H4z" />
//     <path d="M14 20h6v-7h-6z" />
//     <path d="M14 4h6v5h-6z" />
//     <path d="M4 20h6v-5H4z" />
//   </svg>
// )

// const TransactionsIcon = () => (
//   <svg viewBox="0 0 24 24" aria-hidden="true">
//     <rect x="2" y="5" width="20" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
//     <line x1="2" y1="10" x2="22" y2="10" stroke="currentColor" strokeWidth="2" />
//   </svg>
// )

// const LoginIcon = () => (
//   <svg viewBox="0 0 24 24" aria-hidden="true">
//     <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
//     <path d="M10 17l5-5-5-5" />
//     <path d="M15 12H3" />
//   </svg>
// )
// const AiIcon = () => (
//   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//     <path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z" />
//     <path d="M16 14a6 6 0 0 1 6 6v2H2v-2a6 6 0 0 1 6-6" />
//     <circle cx="12" cy="11" r="1" />
//   </svg>
// )
// function AppShell() {
//   const location = useLocation()
//   const loggedIn = isAuthenticated()
//   const currentUser = loggedIn ? getAuthUser() : null
//   const userName = currentUser?.name || currentUser?.email || 'User'
//   const initials = userName
//     .split(' ')
//     .map((part) => part[0])
//     .join('')
//     .slice(0, 2)
//     .toUpperCase()
//   const isAuthPage = location.pathname === '/login' || location.pathname === '/register'

//   return (
//     <div className={`app-shell${isAuthPage ? ' auth-shell' : ''}`}>
//       {!isAuthPage && (
//         <aside className="sidebar">
//           <div className="sidebar-brand">
//             <div className="brand-badge">F</div>
//             <div>
//               <p className="brand-kicker">Finance</p>
//               <h2 className="brand-title">Workspace</h2>
//             </div>
//           </div>

//           <nav className="sidebar-nav" aria-label="Primary navigation">
//             <NavLink to="/" end className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
//               <DashboardIcon />
//               <span>Dashboard</span>
//             </NavLink>

//             <NavLink to="/transactions" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
//               <TransactionsIcon />
//               <span>Transactions</span>
//             </NavLink>

//             <NavLink to="/add" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
//               <PlusIcon />
//               <span>New</span>
//             </NavLink>
//           </nav>

//           <div className="sidebar-footer">
//             {loggedIn ? (
//               <div className="profile-pill" title={userName}>
//                 <span className="profile-avatar">{initials}</span>
//                 <span className="profile-name">{userName}</span>
//               </div>
//             ) : (
//               <Link className="icon-button" to="/login" aria-label="Login">
//                 <LoginIcon />
//               </Link>
//             )}
//           </div>
//         </aside>
//       )}

//       <div className="app-content">
//         <main className="app-main">
//           <Routes>
//             <Route path="/login" element={<LoginPage />} />
//             <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
//             <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
//             <Route path="/add" element={<ProtectedRoute><AddExpense /></ProtectedRoute>} />
//             <Route path="/edit/:id" element={<ProtectedRoute><EditExpense /></ProtectedRoute>} />
//             <Route path="*" element={<Navigate to="/" replace />} />
//           </Routes>
//         </main>
//       </div>
//     </div>


   
//   )
// }

// function App() {
//   return (
//     <BrowserRouter>
//       <AppShell />
//     </BrowserRouter>
//   )
// }

// export default App
import { BrowserRouter, Navigate, NavLink, Route, Routes, Link, useLocation } from 'react-router-dom'
import AddExpense from './pages/AddExpense.jsx'
import EditExpense from './pages/EditExpense.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Transactions from './pages/Transactions.jsx'
import AiInsights from './pages/AiInsights.jsx'
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

const TransactionsIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <rect x="2" y="5" width="20" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
    <line x1="2" y1="10" x2="22" y2="10" stroke="currentColor" strokeWidth="2" />
  </svg>
)

const AiIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z" />
    <path d="M16 14a6 6 0 0 1 6 6v2H2v-2a6 6 0 0 1 6-6" />
    <circle cx="12" cy="11" r="1" />
  </svg>
)

const LoginIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
    <path d="M10 17l5-5-5-5" />
    <path d="M15 12H3" />
  </svg>
)

function AppShell() {
  const location = useLocation()
  const loggedIn = isAuthenticated()
  const currentUser = loggedIn ? getAuthUser() : null
  const userName = currentUser?.name || currentUser?.email || 'User'
  const initials = userName
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register'

  return (
    <div className={`app-shell${isAuthPage ? ' auth-shell' : ''}`}>
      {!isAuthPage && (
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

            <NavLink to="/transactions" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              <TransactionsIcon />
              <span>Transactions</span>
            </NavLink>

            <NavLink to="/ai-insights" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              <AiIcon />
              <span>AI Advisor</span>
            </NavLink>

            <NavLink to="/add" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              <PlusIcon />
              <span>New</span>
            </NavLink>
          </nav>
        </aside>
      )}

      <div className="app-content">
        {/* Sticky top bar holding the profile badge */}
        {!isAuthPage && loggedIn && (
          <header className="top-navbar">
            <div className="profile-pill" title={userName}>
              <span className="profile-avatar">{initials}</span>
              <span className="profile-name">{userName}</span>
            </div>
          </header>
        )}

        <main className="app-main">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
            <Route path="/ai-insights" element={<ProtectedRoute><AiInsights /></ProtectedRoute>} />
            <Route path="/add" element={<ProtectedRoute><AddExpense /></ProtectedRoute>} />
            <Route path="/edit/:id" element={<ProtectedRoute><EditExpense /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  )
}

export default App
