// import { useEffect, useMemo, useState } from 'react'
// import { Link, useNavigate } from 'react-router-dom'
// import {
//   Bar,
//   BarChart,
//   CartesianGrid,
//   Cell,
//   Pie,
//   PieChart,
//   ResponsiveContainer,
//   Tooltip,
//   XAxis,
//   YAxis,
// } from 'recharts'
// import ExpenseList from '../components/ExpenseList.jsx'
// import { deleteExpense, getAllExpenses, getExpensesByUser } from '../services/api.js'
// import {
//   calculateFinanceSummary,
//   groupExpensesByCategory,
// } from '../utils/expenseAnalytics.js'
// import { getAuthUser, isAuthenticated, logoutUser } from '../services/auth.js'

// const formatINR = (amount) =>
//   new Intl.NumberFormat('en-IN', {
//     style: 'currency',
//     currency: 'INR',
//     maximumFractionDigits: 2,
//   }).format(Number(amount) || 0)

// const chartColors = ['#4f46e5', '#10b981', '#f59e0b', '#64748b', '#a78bfa']

// // Helper to normalize any incoming date format (string, array, epoch, Date object) to YYYY-MM-DD
// const normalizeDateKey = (rawDate) => {
//   if (!rawDate) return ''

//   // Handles Spring Boot Jackson array format: [year, month, day]
//   if (Array.isArray(rawDate) && rawDate.length >= 3) {
//     const y = rawDate[0]
//     const m = String(rawDate[1]).padStart(2, '0')
//     const d = String(rawDate[2]).padStart(2, '0')
//     return `${y}-${m}-${d}`
//   }

//   // Handles standard date strings (ISO, timestamps)
//   if (typeof rawDate === 'string') {
//     const clean = rawDate.trim().split('T')[0].split(' ')[0]
//     if (/^\d{4}-\d{2}-\d{2}$/.test(clean)) return clean
//     const parsed = new Date(rawDate)
//     if (!isNaN(parsed.getTime())) {
//       const y = parsed.getFullYear()
//       const m = String(parsed.getMonth() + 1).padStart(2, '0')
//       const d = String(parsed.getDate()).padStart(2, '0')
//       return `${y}-${m}-${d}`
//     }
//   }

//   // Handles raw timestamps or JS Date objects
//   const parsed = new Date(rawDate)
//   if (!isNaN(parsed.getTime())) {
//     const y = parsed.getFullYear()
//     const m = String(parsed.getMonth() + 1).padStart(2, '0')
//     const d = String(parsed.getDate()).padStart(2, '0')
//     return `${y}-${m}-${d}`
//   }

//   return ''
// }

// // Fixed 7-Day Rolling Calendar Aggregator
// const computeWeeklyExpenses = (items = []) => {
//   const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
//   const today = new Date()
//   const normalizedToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())

//   // Generate 7 consecutive buckets ending today
//   const bins = []
//   for (let i = 6; i >= 0; i--) {
//     const target = new Date(normalizedToday)
//     target.setDate(normalizedToday.getDate() - i)

//     const year = target.getFullYear()
//     const month = String(target.getMonth() + 1).padStart(2, '0')
//     const day = String(target.getDate()).padStart(2, '0')
//     const dateKey = `${year}-${month}-${day}`

//     bins.push({
//       dateKey,
//       label: i === 0 ? 'Today' : dayNames[target.getDay()],
//       value: 0,
//     })
//   }

//   items.forEach((item) => {
//     // Only accumulate expense entries
//     const type = String(item.type || '').toUpperCase()
//     if (type === 'INCOME') return

//     const numAmount = Number(item.amount) || 0
//     if (numAmount <= 0) return

//     // Check all possible property names used in your Spring entities
//     const rawDate =
//       item.date ||
//       item.expenseDate ||
//       item.transactionDate ||
//       item.localDate ||
//       item.createdAt ||
//       item.timestamp

//     const itemDateKey = normalizeDateKey(rawDate)

//     const matchedBin = bins.find((b) => b.dateKey === itemDateKey)
//     if (matchedBin) {
//       matchedBin.value += numAmount
//     }
//   })

//   return bins
// }

// // Custom Glassmorphic Tooltip for the Weekly Chart
// const CustomWeeklyTooltip = ({ active, payload }) => {
//   if (active && payload && payload.length) {
//     const data = payload[0].payload
//     return (
//       <div
//         style={{
//           background: 'rgba(15, 23, 42, 0.92)',
//           backdropFilter: 'blur(8px)',
//           color: '#ffffff',
//           padding: '8px 12px',
//           borderRadius: '8px',
//           boxShadow: '0 10px 20px -5px rgba(0, 0, 0, 0.25)',
//           fontSize: '0.8rem',
//           textAlign: 'center',
//           border: '1px solid rgba(255, 255, 255, 0.12)',
//         }}
//       >
//         <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.72rem' }}>
//           {data.label} {data.dateKey ? `(${data.dateKey})` : ''}
//         </p>
//         <p style={{ margin: '3px 0 0 0', fontWeight: 600, color: '#38bdf8', fontSize: '0.92rem' }}>
//           {formatINR(data.value)}
//         </p>
//       </div>
//     )
//   }
//   return null
// }

// function Dashboard() {
//   const navigate = useNavigate()
//   const [expenses, setExpenses] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState('')
//   const [deletingId, setDeletingId] = useState(null)
//   const [budget, setBudget] = useState('')
//   const [user, setUser] = useState(getAuthUser())

//   const fetchExpenses = async (userId = '') => {
//     try {
//       const normalizedUserId = String(userId).trim()
//       const response = normalizedUserId
//         ? await getExpensesByUser(normalizedUserId)
//         : await getAllExpenses()
//       setExpenses(Array.isArray(response) ? response : [])
//     } catch (fetchError) {
//       setError(
//         fetchError?.response?.data?.message ||
//           fetchError.message ||
//           'Unable to load expenses.'
//       )
//       setExpenses([])
//     } finally {
//       setLoading(false)
//     }
//   }

//   const loadExpenses = async (userId = '') => {
//     setLoading(true)
//     setError('')
//     await fetchExpenses(userId)
//   }

//   useEffect(() => {
//     if (!isAuthenticated()) {
//       navigate('/login')
//       return
//     }

//     setUser(getAuthUser())

//     const timeoutId = setTimeout(() => {
//       void fetchExpenses()
//     }, 0)

//     return () => clearTimeout(timeoutId)
//   }, [navigate])

//   const summary = useMemo(() => calculateFinanceSummary(expenses), [expenses])
//   const weeklyData = useMemo(() => computeWeeklyExpenses(expenses), [expenses])
//   const categoryData = useMemo(() => groupExpensesByCategory(expenses), [expenses])

//   // Total spent in this 7-day period for the badge
//   const weeklyTotalSpent = useMemo(
//     () => weeklyData.reduce((acc, curr) => acc + (Number(curr.value) || 0), 0),
//     [weeklyData]
//   )

//   const handleDelete = async (id) => {
//     const confirmed = window.confirm('Delete this expense?')
//     if (!confirmed) return

//     setDeletingId(id)
//     try {
//       await deleteExpense(id)
//       await loadExpenses('')
//     } catch (deleteError) {
//       setError(
//         deleteError?.response?.data?.message ||
//           deleteError.message ||
//           'Unable to delete expense.'
//       )
//     } finally {
//       setDeletingId(null)
//     }
//   }

//   const budgetValue = Number(budget)
//   const expensesTotal = Number(summary.totalExpenses || 0)
//   const budgetAlert = !budgetValue
//     ? ''
//     : expensesTotal > budgetValue
//       ? '⚠️ You have exceeded your budget!'
//       : expensesTotal >= budgetValue * 0.8
//         ? '⚠️ You are close to your budget limit'
//         : ''

//   const handleLogout = () => {
//     logoutUser()
//     navigate('/login')
//   }

//   const savingsRate =
//     summary.totalIncome > 0
//       ? `${Math.max(
//           0,
//           ((summary.totalIncome - summary.totalExpenses) / summary.totalIncome) * 100
//         ).toFixed(1)}%`
//       : '0.0%'

//   const recentTransactions = useMemo(() => expenses.slice(0, 5), [expenses])

//   return (
//     <section className="page-stack dashboard-shell">
//       {budgetAlert && (
//         <div className="state-card error-card budget-alert">{budgetAlert}</div>
//       )}

//       {/* Summary KPI Cards */}
//       <div className="summary-grid">
//         <div className="card summary-card balance-card">
//           <p className="eyebrow">Total Balance</p>
//           <h2 className="summary-value">{formatINR(summary.totalBalance)}</h2>
//         </div>
//         <div className="card summary-card income-card">
//           <p className="eyebrow">Total Income</p>
//           <h2>{formatINR(summary.totalIncome)}</h2>
//         </div>
//         <div className="card summary-card expense-card">
//           <p className="eyebrow">Total Expenses</p>
//           <h2>{formatINR(summary.totalExpenses)}</h2>
//         </div>
//         <div className="card summary-card savings-card">
//           <p className="eyebrow">Net Savings</p>
//           <h2>{savingsRate}</h2>
//         </div>
//       </div>

//       {/* Analytics Charts */}
//       <div className="stats-grid">
//         <div className="card chart-card">
//           <div
//             className="section-heading"
//             style={{
//               display: 'flex',
//               justifyContent: 'space-between',
//               alignItems: 'center',
//             }}
//           >
//             <h2>Weekly Expenses</h2>
//             <span
//               style={{
//                 background: '#f1f5f9',
//                 padding: '3px 10px',
//                 borderRadius: '999px',
//                 fontSize: '0.8rem',
//                 fontWeight: 600,
//                 color: '#475569',
//               }}
//             >
//               {formatINR(weeklyTotalSpent)}
//             </span>
//           </div>

//           <div className="chart-wrap">
//             <ResponsiveContainer width="100%" height={240}>
//               <BarChart data={weeklyData} margin={{ top: 12, right: 10, left: -20, bottom: 0 }}>
//                 <defs>
//                   {/* Subtle gradient for regular days */}
//                   <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="0%" stopColor="#6366f1" stopOpacity={0.95} />
//                     <stop offset="100%" stopColor="#4338ca" stopOpacity={0.7} />
//                   </linearGradient>

//                   {/* Highlight gradient for Today */}
//                   <linearGradient id="todayGradient" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
//                     <stop offset="100%" stopColor="#2563eb" stopOpacity={0.85} />
//                   </linearGradient>
//                 </defs>

//                 <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />

//                 <XAxis
//                   dataKey="label"
//                   tickLine={false}
//                   axisLine={false}
//                   tick={{ fontSize: 12, fill: '#64748b' }}
//                   dy={6}
//                 />

//                 <YAxis
//                   tickLine={false}
//                   axisLine={false}
//                   tick={{ fontSize: 12, fill: '#64748b' }}
//                   tickFormatter={(v) => (v >= 1000 ? `₹${(v / 1000).toFixed(1)}k` : `₹${v}`)}
//                   domain={[0, 'auto']}
//                 />

//                 <Tooltip
//                   content={<CustomWeeklyTooltip />}
//                   cursor={{ fill: 'rgba(255, 255, 255, 0.95)', radius: 8, stroke: '#e2e8f0', strokeWidth: 1 }}
//                 />

//                 <Bar
//                   dataKey="value"
//                   radius={[8, 8, 4, 4]}
//                   maxBarSize={38}
//                   animationDuration={800}
//                   background={{ fill: '#f8fafc', radius: [8, 8, 4, 4] }}
//                 >
//                   {weeklyData.map((entry, index) => {
//                     const isToday = entry.label === 'Today'
//                     return (
//                       <Cell
//                         key={`bar-${index}`}
//                         fill={isToday ? 'url(#todayGradient)' : 'url(#barGradient)'}
//                         style={{
//                           filter: isToday ? 'drop-shadow(0 4px 8px rgba(59, 130, 246, 0.3))' : 'none',
//                           transition: 'all 0.3s ease',
//                         }}
//                       />
//                     )
//                   })}
//                 </Bar>
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         <div className="card chart-card">
//           <div className="section-heading">
//             <h2>Category Breakdown</h2>
//           </div>
//           <div className="chart-wrap">
//             {categoryData && categoryData.length > 0 ? (
//               <div
//                 style={{
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'space-between',
//                   height: 240,
//                   gap: '1rem',
//                   padding: '0 0.5rem',
//                 }}
//               >
//                 <div style={{ width: '50%', height: '100%' }}>
//                   <ResponsiveContainer width="100%" height="100%">
//                     <PieChart>
//                       <Pie
//                         data={categoryData}
//                         dataKey="value"
//                         nameKey="label"
//                         innerRadius={50}
//                         outerRadius={80}
//                         paddingAngle={3}
//                       >
//                         {categoryData.map((entry, index) => (
//                           <Cell
//                             key={`${entry.label}-${index}`}
//                             fill={chartColors[index % chartColors.length]}
//                           />
//                         ))}
//                       </Pie>
//                       <Tooltip formatter={(value) => formatINR(value)} />
//                     </PieChart>
//                   </ResponsiveContainer>
//                 </div>

//                 <div
//                   style={{
//                     width: '50%',
//                     display: 'flex',
//                     flexDirection: 'column',
//                     gap: '0.55rem',
//                     justifyContent: 'center',
//                   }}
//                 >
//                   {categoryData.slice(0, 4).map((cat, idx) => (
//                     <div
//                       key={cat.label}
//                       style={{
//                         display: 'flex',
//                         alignItems: 'center',
//                         justifyContent: 'space-between',
//                         fontSize: '0.82rem',
//                       }}
//                     >
//                       <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
//                         <span
//                           style={{
//                             width: 8,
//                             height: 8,
//                             borderRadius: '50%',
//                             backgroundColor: chartColors[idx % chartColors.length],
//                             display: 'inline-block',
//                           }}
//                         />
//                         <span style={{ color: '#475569', fontWeight: 500 }}>{cat.label}</span>
//                       </span>
//                       <span style={{ fontWeight: 600, color: '#0f172a' }}>{formatINR(cat.value)}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             ) : (
//               <div
//                 style={{
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   height: '240px',
//                   color: '#94a3b8',
//                   fontSize: '0.9rem',
//                 }}
//               >
//                 No category data available
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Recent Activity Snapshot */}
//       <div className="transactions-section">
//         <div
//           className="section-meta"
//           style={{
//             display: 'flex',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//             marginBottom: '1rem',
//           }}
//         >
//           <div>
//             <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Recent Activity</h2>
//             <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
//               Showing latest {recentTransactions.length} of {expenses.length} records
//             </span>
//           </div>
//           <Link to="/transactions" className="button button-secondary button-small">
//             View All Transactions →
//           </Link>
//         </div>

//         <ExpenseList
//           expenses={recentTransactions}
//           loading={loading}
//           error={error}
//           deletingId={deletingId}
//           onDelete={handleDelete}
//         />
//       </div>

//       {/* Floating Logout */}
//       <button
//         type="button"
//         className="floating-logout"
//         onClick={handleLogout}
//         aria-label="Logout"
//       >
//         <svg
//           viewBox="0 0 24 24"
//           aria-hidden="true"
//           width="20"
//           height="20"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="2"
//         >
//           <path d="M10 17l5-5-5-5" />
//           <path d="M15 12H3" />
//           <path d="M15 3h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-2" />
//         </svg>
//       </button>
//     </section>
//   )
// }

// export default Dashboard
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import ExpenseList from '../components/ExpenseList.jsx'
import { deleteExpense, getAllExpenses, getExpensesByUser } from '../services/api.js'
import {
  calculateFinanceSummary,
  groupExpensesByCategory,
} from '../utils/expenseAnalytics.js'
import { getAuthUser, isAuthenticated, logoutUser } from '../services/auth.js'

const formatINR = (amount) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0)

const chartColors = ['#4f46e5', '#10b981', '#f59e0b', '#64748b', '#a78bfa']

// Helper to normalize any incoming date format (string, array, epoch, Date object) to YYYY-MM-DD
const normalizeDateKey = (rawDate) => {
  if (!rawDate) return ''

  // Handles Spring Boot Jackson array format: [year, month, day]
  if (Array.isArray(rawDate) && rawDate.length >= 3) {
    const y = rawDate[0]
    const m = String(rawDate[1]).padStart(2, '0')
    const d = String(rawDate[2]).padStart(2, '0')
    return `${y}-${m}-${d}`
  }

  // Handles standard date strings (ISO, timestamps)
  if (typeof rawDate === 'string') {
    const clean = rawDate.trim().split('T')[0].split(' ')[0]
    if (/^\d{4}-\d{2}-\d{2}$/.test(clean)) return clean
    const parsed = new Date(rawDate)
    if (!isNaN(parsed.getTime())) {
      const y = parsed.getFullYear()
      const m = String(parsed.getMonth() + 1).padStart(2, '0')
      const d = String(parsed.getDate()).padStart(2, '0')
      return `${y}-${m}-${d}`
    }
  }

  // Handles raw timestamps or JS Date objects
  const parsed = new Date(rawDate)
  if (!isNaN(parsed.getTime())) {
    const y = parsed.getFullYear()
    const m = String(parsed.getMonth() + 1).padStart(2, '0')
    const d = String(parsed.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
  }

  return ''
}

// Fixed 7-Day Rolling Calendar Aggregator
const computeWeeklyExpenses = (items = []) => {
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const today = new Date()
  const normalizedToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())

  // Generate 7 consecutive buckets ending today
  const bins = []
  for (let i = 6; i >= 0; i--) {
    const target = new Date(normalizedToday)
    target.setDate(normalizedToday.getDate() - i)

    const year = target.getFullYear()
    const month = String(target.getMonth() + 1).padStart(2, '0')
    const day = String(target.getDate()).padStart(2, '0')
    const dateKey = `${year}-${month}-${day}`

    bins.push({
      dateKey,
      label: i === 0 ? 'Today' : dayNames[target.getDay()],
      value: 0,
    })
  }

  items.forEach((item) => {
    // Only accumulate expense entries
    const type = String(item.type || '').toUpperCase()
    if (type === 'INCOME') return

    const numAmount = Number(item.amount) || 0
    if (numAmount <= 0) return

    // Check all possible property names used in Spring entities
    const rawDate =
      item.date ||
      item.expenseDate ||
      item.transactionDate ||
      item.localDate ||
      item.createdAt ||
      item.timestamp

    const itemDateKey = normalizeDateKey(rawDate)

    const matchedBin = bins.find((b) => b.dateKey === itemDateKey)
    if (matchedBin) {
      matchedBin.value += numAmount
    }
  })

  return bins
}

// Custom Glassmorphic Tooltip for the Weekly Chart
const CustomWeeklyTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.92)',
          backdropFilter: 'blur(8px)',
          color: '#ffffff',
          padding: '8px 12px',
          borderRadius: '8px',
          boxShadow: '0 10px 20px -5px rgba(0, 0, 0, 0.25)',
          fontSize: '0.8rem',
          textAlign: 'center',
          border: '1px solid rgba(255, 255, 255, 0.12)',
        }}
      >
        <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.72rem' }}>
          {data.label} {data.dateKey ? `(${data.dateKey})` : ''}
        </p>
        <p style={{ margin: '3px 0 0 0', fontWeight: 600, color: '#38bdf8', fontSize: '0.92rem' }}>
          {formatINR(data.value)}
        </p>
      </div>
    )
  }
  return null
}

function Dashboard() {
  const navigate = useNavigate()
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState(null)
  const [budget, setBudget] = useState('')
  const [user, setUser] = useState(getAuthUser())

  const fetchExpenses = async (userId = '') => {
    try {
      const normalizedUserId = String(userId).trim()
      const response = normalizedUserId
        ? await getExpensesByUser(normalizedUserId)
        : await getAllExpenses()
      setExpenses(Array.isArray(response) ? response : [])
    } catch (fetchError) {
      setError(
        fetchError?.response?.data?.message ||
          fetchError.message ||
          'Unable to load expenses.'
      )
      setExpenses([])
    } finally {
      setLoading(false)
    }
  }

  const loadExpenses = async (userId = '') => {
    setLoading(true)
    setError('')
    await fetchExpenses(userId)
  }

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login')
      return
    }

    setUser(getAuthUser())

    const timeoutId = setTimeout(() => {
      void fetchExpenses()
    }, 0)

    return () => clearTimeout(timeoutId)
  }, [navigate])

  const summary = useMemo(() => calculateFinanceSummary(expenses), [expenses])
  const weeklyData = useMemo(() => computeWeeklyExpenses(expenses), [expenses])
  const categoryData = useMemo(() => groupExpensesByCategory(expenses), [expenses])

  // Total spent in this 7-day period for the badge
  const weeklyTotalSpent = useMemo(
    () => weeklyData.reduce((acc, curr) => acc + (Number(curr.value) || 0), 0),
    [weeklyData]
  )

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Delete this expense?')
    if (!confirmed) return

    setDeletingId(id)
    try {
      await deleteExpense(id)
      await loadExpenses('')
    } catch (deleteError) {
      setError(
        deleteError?.response?.data?.message ||
          deleteError.message ||
          'Unable to delete expense.'
      )
    } finally {
      setDeletingId(null)
    }
  }

  const budgetValue = Number(budget)
  const expensesTotal = Number(summary.totalExpenses || 0)
  const budgetAlert = !budgetValue
    ? ''
    : expensesTotal > budgetValue
      ? '⚠️ You have exceeded your budget!'
      : expensesTotal >= budgetValue * 0.8
        ? '⚠️ You are close to your budget limit'
        : ''

  const handleLogout = () => {
    logoutUser()
    navigate('/login')
  }

  const savingsRate =
    summary.totalIncome > 0
      ? `${Math.max(
          0,
          ((summary.totalIncome - summary.totalExpenses) / summary.totalIncome) * 100
        ).toFixed(1)}%`
      : '0.0%'

  // Sort descending by date, then fallback to ID, so new additions always appear first
  const recentTransactions = useMemo(() => {
    return [...expenses]
      .sort((a, b) => {
        const dateA = new Date(a.date || a.expenseDate || a.createdAt || 0).getTime()
        const dateB = new Date(b.date || b.expenseDate || b.createdAt || 0).getTime()

        if (dateB !== dateA) {
          return dateB - dateA
        }
        return (Number(b.id) || 0) - (Number(a.id) || 0)
      })
      .slice(0, 5)
  }, [expenses])

  return (
    <section className="page-stack dashboard-shell">
      {budgetAlert && (
        <div className="state-card error-card budget-alert">{budgetAlert}</div>
      )}

      {/* Summary KPI Cards */}
      <div className="summary-grid">
        <div className="card summary-card balance-card">
          <p className="eyebrow">Total Balance</p>
          <h2 className="summary-value">{formatINR(summary.totalBalance)}</h2>
        </div>
        <div className="card summary-card income-card">
          <p className="eyebrow">Total Income</p>
          <h2>{formatINR(summary.totalIncome)}</h2>
        </div>
        <div className="card summary-card expense-card">
          <p className="eyebrow">Total Expenses</p>
          <h2>{formatINR(summary.totalExpenses)}</h2>
        </div>
        <div className="card summary-card savings-card">
          <p className="eyebrow">Net Savings</p>
          <h2>{savingsRate}</h2>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="stats-grid">
        <div className="card chart-card">
          <div
            className="section-heading"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <h2>Weekly Expenses</h2>
            <span
              style={{
                background: '#f1f5f9',
                padding: '3px 10px',
                borderRadius: '999px',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: '#475569',
              }}
            >
              {formatINR(weeklyTotalSpent)}
            </span>
          </div>

          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={weeklyData} margin={{ top: 12, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  {/* Subtle gradient for regular days */}
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.95} />
                    <stop offset="100%" stopColor="#4338ca" stopOpacity={0.7} />
                  </linearGradient>

                  {/* Highlight gradient for Today */}
                  <linearGradient id="todayGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity={0.85} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />

                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  dy={6}
                />

                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  tickFormatter={(v) => (v >= 1000 ? `₹${(v / 1000).toFixed(1)}k` : `₹${v}`)}
                  domain={[0, 'auto']}
                />

                <Tooltip
                  content={<CustomWeeklyTooltip />}
                  cursor={{ fill: 'rgba(255, 255, 255, 0.95)', radius: 8, stroke: '#e2e8f0', strokeWidth: 1 }}
                />

                <Bar
                  dataKey="value"
                  radius={[8, 8, 4, 4]}
                  maxBarSize={38}
                  animationDuration={800}
                  background={{ fill: '#f8fafc', radius: [8, 8, 4, 4] }}
                >
                  {weeklyData.map((entry, index) => {
                    const isToday = entry.label === 'Today'
                    return (
                      <Cell
                        key={`bar-${index}`}
                        fill={isToday ? 'url(#todayGradient)' : 'url(#barGradient)'}
                        style={{
                          filter: isToday ? 'drop-shadow(0 4px 8px rgba(59, 130, 246, 0.3))' : 'none',
                          transition: 'all 0.3s ease',
                        }}
                      />
                    )
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card chart-card">
          <div className="section-heading">
            <h2>Category Breakdown</h2>
          </div>
          <div className="chart-wrap">
            {categoryData && categoryData.length > 0 ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  height: 240,
                  gap: '1rem',
                  padding: '0 0.5rem',
                }}
              >
                <div style={{ width: '50%', height: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        dataKey="value"
                        nameKey="label"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={3}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell
                            key={`${entry.label}-${index}`}
                            fill={chartColors[index % chartColors.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatINR(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div
                  style={{
                    width: '50%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.55rem',
                    justifyContent: 'center',
                  }}
                >
                  {categoryData.slice(0, 4).map((cat, idx) => (
                    <div
                      key={cat.label}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '0.82rem',
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            backgroundColor: chartColors[idx % chartColors.length],
                            display: 'inline-block',
                          }}
                        />
                        <span style={{ color: '#475569', fontWeight: 500 }}>{cat.label}</span>
                      </span>
                      <span style={{ fontWeight: 600, color: '#0f172a' }}>{formatINR(cat.value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '240px',
                  color: '#94a3b8',
                  fontSize: '0.9rem',
                }}
              >
                No category data available
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity Snapshot */}
      <div className="transactions-section">
        <div
          className="section-meta"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
          }}
        >
          <div>
            <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Recent Activity</h2>
            <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
              Showing latest {recentTransactions.length} of {expenses.length} records
            </span>
          </div>
          <Link to="/transactions" className="button button-secondary button-small">
            View All Transactions →
          </Link>
        </div>

        <ExpenseList
          expenses={recentTransactions}
          loading={loading}
          error={error}
          deletingId={deletingId}
          onDelete={handleDelete}
        />
      </div>

      {/* Floating Logout */}
      <button
        type="button"
        className="floating-logout"
        onClick={handleLogout}
        aria-label="Logout"
      >
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M10 17l5-5-5-5" />
          <path d="M15 12H3" />
          <path d="M15 3h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-2" />
        </svg>
      </button>
    </section>
  )
}

export default Dashboard