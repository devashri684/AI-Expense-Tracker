// import { useEffect, useMemo, useState } from 'react'
// import { useNavigate } from 'react-router-dom'
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
//   exportExpensesToCsv,
//   filterExpenses,
//   formatCurrency,
//   groupExpensesByCategory,
//   groupExpensesByDay,
//   sortExpenses,
// } from '../utils/expenseAnalytics.js'
// import { getAuthUser, isAuthenticated, logoutUser } from '../services/auth.js'

// const chartColors = ['#4f46e5', '#10b981', '#f59e0b', '#64748b', '#a78bfa']

// function Dashboard() {
//   const navigate = useNavigate()
//   const [expenses, setExpenses] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState('')
//   const [deletingId, setDeletingId] = useState(null)
//   const [categoryFilter, setCategoryFilter] = useState('')
//   const [dateFrom, setDateFrom] = useState('')
//   const [dateTo, setDateTo] = useState('')
//   const [sortOption, setSortOption] = useState('date-desc')
//   const [exporting, setExporting] = useState(false)
//   const [budget, setBudget] = useState('')
//   const [user, setUser] = useState(getAuthUser())

//   const fetchExpenses = async (userId = '') => {
//     try {
//       const normalizedUserId = String(userId).trim()
//       const response = normalizedUserId ? await getExpensesByUser(normalizedUserId) : await getAllExpenses()
//       setExpenses(Array.isArray(response) ? response : [])
//     } catch (fetchError) {
//       setError(fetchError?.response?.data?.message || fetchError.message || 'Unable to load expenses.')
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

//   const categories = useMemo(() => {
//     const values = expenses
//       .map((expense) => {
//         const categoryName = expense?.category?.name?.trim() || expense?.categoryName || ''
//         if (categoryName) {
//           return categoryName
//         }

//         if (expense?.categoryId) {
//           return `Category ${expense.categoryId}`
//         }

//         return ''
//       })
//       .filter(Boolean)

//     return [...new Set(values)]
//   }, [expenses])

//   const filteredExpenses = useMemo(() => {
//     const filtered = filterExpenses(expenses, {
//       category: categoryFilter,
//       dateFrom,
//       dateTo,
//     })

//     return sortExpenses(filtered, sortOption)
//   }, [categoryFilter, dateFrom, dateTo, expenses, sortOption])

//   const summary = useMemo(() => calculateFinanceSummary(filteredExpenses), [filteredExpenses])
//   const weeklyData = useMemo(() => groupExpensesByDay(filteredExpenses), [filteredExpenses])
//   const categoryData = useMemo(() => groupExpensesByCategory(filteredExpenses), [filteredExpenses])

//   const handleSearch = async (event) => {
//     event.preventDefault()
//     await loadExpenses('')
//   }

//   const handleReset = async () => {
//     setCategoryFilter('')
//     setDateFrom('')
//     setDateTo('')
//     setSortOption('date-desc')
//     await loadExpenses('')
//   }

//   const handleDelete = async (id) => {
//     const confirmed = window.confirm('Delete this expense?')

//     if (!confirmed) {
//       return
//     }

//     setDeletingId(id)

//     try {
//       await deleteExpense(id)
//       await loadExpenses('')
//     } catch (deleteError) {
//       setError(deleteError?.response?.data?.message || deleteError.message || 'Unable to delete expense.')
//     } finally {
//       setDeletingId(null)
//     }
//   }

//   const handleExport = async () => {
//     if (!filteredExpenses.length) {
//       return
//     }

//     setExporting(true)

//     try {
//       exportExpensesToCsv(filteredExpenses, 'filtered-expenses.csv')
//     } finally {
//       setExporting(false)
//     }
//   }

//   const budgetValue = Number(budget)
//   const expensesTotal = Number(summary.totalExpenses)
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

//   return (
//     <section className="page-stack dashboard-shell">
//       {budgetAlert && (
//         <div className="state-card error-card budget-alert">{budgetAlert}</div>
//       )}

//       <div className="summary-grid">
//         <div className="card summary-card balance-card">
//           <p className="eyebrow">Total Balance</p>
//           <h2 className="summary-value">{formatCurrency(summary.totalBalance)}</h2>
//         </div>
//         <div className="card summary-card income-card">
//           <p className="eyebrow">Total Income</p>
//           <h2>{formatCurrency(summary.totalIncome)}</h2>
//         </div>
//         <div className="card summary-card expense-card">
//           <p className="eyebrow">Total Expenses</p>
//           <h2>{formatCurrency(summary.totalExpenses)}</h2>
//         </div>
//         <div className="card summary-card savings-card">
//           <p className="eyebrow">Net Savings</p>
//           <h2>{formatCurrency(summary.totalBalance)}</h2>
//         </div>
//       </div>

//       <div className="stats-grid">
//         <div className="card chart-card">
//           <div className="section-heading">
//             <h2>Weekly Expenses</h2>
//           </div>
//           <div className="chart-wrap">
//             <ResponsiveContainer width="100%" height={240}>
//               <BarChart data={weeklyData}>
//                 <CartesianGrid strokeDasharray="3 3" vertical={false} />
//                 <XAxis dataKey="label" tickLine={false} axisLine={false} />
//                 <YAxis tickLine={false} axisLine={false} />
//                 <Tooltip formatter={(value) => formatCurrency(value)} />
//                 <Bar dataKey="value" fill="#0f766e" radius={[6, 6, 0, 0]} />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         <div className="card chart-card">
//           <div className="section-heading">
//             <h2>Category Breakdown</h2>
//           </div>
//           <div className="chart-wrap">
//             <ResponsiveContainer width="100%" height={240}>
//               <PieChart>
//                 <Pie data={categoryData} dataKey="value" nameKey="label" innerRadius={50} outerRadius={88} paddingAngle={2}>
//                   {categoryData.map((entry, index) => (
//                     <Cell key={`${entry.label}-${index}`} fill={chartColors[index % chartColors.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip formatter={(value) => formatCurrency(value)} />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </div>

//       <form className="card filter-card" onSubmit={handleSearch}>
//         <div className="filter-grid">
//           <label className="field">
//             <span>Monthly Budget</span>
//             <input
//               type="number"
//               value={budget}
//               onChange={(event) => setBudget(event.target.value)}
//               placeholder="0"
//               min="0"
//               step="0.01"
//             />
//           </label>

//           <label className="field">
//             <span>Filter by Category</span>
//             <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
//               <option value="">All Categories</option>
//               {categories.map((category) => (
//                 <option key={category} value={category}>
//                   {category}
//                 </option>
//               ))}
//             </select>
//           </label>

//           <label className="field">
//             <span>Start Date</span>
//             <input type="date" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} />
//           </label>

//           <label className="field">
//             <span>End Date</span>
//             <input type="date" value={dateTo} onChange={(event) => setDateTo(event.target.value)} />
//           </label>

//           <label className="field">
//             <span>Sort By</span>
//             <select value={sortOption} onChange={(event) => setSortOption(event.target.value)}>
//               <option value="date-desc">Date (latest first)</option>
//               <option value="date-asc">Date (oldest first)</option>
//               <option value="amount-asc">Amount (low to high)</option>
//               <option value="amount-desc">Amount (high to low)</option>
//             </select>
//           </label>
//         </div>

//         <div className="filter-actions controls-footer">
//           <button type="submit" className="button button-primary">
//             Search
//           </button>
//           <button type="button" className="button button-secondary" onClick={handleReset}>
//             Reset
//           </button>
//           <button type="button" className="button button-secondary" onClick={handleExport} disabled={exporting || !filteredExpenses.length}>
//             {exporting ? 'Exporting...' : 'Export to CSV'}
//           </button>
//         </div>
//       </form>

//       <div className="transactions-section">
//         <div className="section-meta">
//           <span>Showing all transactions</span>
//           <span>{filteredExpenses.length} records</span>
//         </div>

//         <ExpenseList
//           expenses={filteredExpenses}
//           loading={loading}
//           error={error}
//           deletingId={deletingId}
//           onDelete={handleDelete}
//         />
//       </div>

//       <button type="button" className="floating-logout" onClick={handleLogout} aria-label="Logout">
//         <svg viewBox="0 0 24 24" aria-hidden="true">
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
import { useNavigate } from 'react-router-dom'
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
  exportExpensesToCsv,
  filterExpenses,
  formatCurrency,
  groupExpensesByCategory,
  groupExpensesByDay,
  sortExpenses,
} from '../utils/expenseAnalytics.js'
import { getAuthUser, isAuthenticated, logoutUser } from '../services/auth.js'

const chartColors = ['#4f46e5', '#10b981', '#f59e0b', '#64748b', '#a78bfa']

function Dashboard() {
  const navigate = useNavigate()
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState(null)
  const [categoryFilter, setCategoryFilter] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [sortOption, setSortOption] = useState('date-desc')
  const [exporting, setExporting] = useState(false)
  const [budget, setBudget] = useState('')
  const [user, setUser] = useState(getAuthUser())

  const fetchExpenses = async (userId = '') => {
    try {
      const normalizedUserId = String(userId).trim()
      const response = normalizedUserId ? await getExpensesByUser(normalizedUserId) : await getAllExpenses()
      setExpenses(Array.isArray(response) ? response : [])
    } catch (fetchError) {
      setError(fetchError?.response?.data?.message || fetchError.message || 'Unable to load expenses.')
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

const categories = useMemo(() => {
    const values = expenses
      .map((expense) => {
        // Look directly for the nested name, default to 'General' if missing
        return expense?.category?.name?.trim() || 'General';
      })
      .filter(Boolean);

    // Return an array of unique category names
    return [...new Set(values)];
  }, [expenses])

  const filteredExpenses = useMemo(() => {
    const filtered = filterExpenses(expenses, {
      category: categoryFilter,
      dateFrom,
      dateTo,
    })

    return sortExpenses(filtered, sortOption)
  }, [categoryFilter, dateFrom, dateTo, expenses, sortOption])

  const summary = useMemo(() => calculateFinanceSummary(filteredExpenses), [filteredExpenses])
  const weeklyData = useMemo(() => groupExpensesByDay(filteredExpenses), [filteredExpenses])
  const categoryData = useMemo(() => groupExpensesByCategory(filteredExpenses), [filteredExpenses])

  const handleSearch = async (event) => {
    event.preventDefault()
    await loadExpenses('')
  }

  const handleReset = async () => {
    setCategoryFilter('')
    setDateFrom('')
    setDateTo('')
    setSortOption('date-desc')
    await loadExpenses('')
  }

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Delete this expense?')

    if (!confirmed) {
      return
    }

    setDeletingId(id)

    try {
      await deleteExpense(id)
      await loadExpenses('')
    } catch (deleteError) {
      setError(deleteError?.response?.data?.message || deleteError.message || 'Unable to delete expense.')
    } finally {
      setDeletingId(null)
    }
  }

  const handleExport = async () => {
    if (!filteredExpenses.length) {
      return
    }

    setExporting(true)

    try {
      exportExpensesToCsv(filteredExpenses, 'filtered-expenses.csv')
    } finally {
      setExporting(false)
    }
  }

  const budgetValue = Number(budget)
  const expensesTotal = Number(summary.totalExpenses)
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

  return (
    <section className="page-stack dashboard-shell">
      {budgetAlert && (
        <div className="state-card error-card budget-alert">{budgetAlert}</div>
      )}

      <div className="summary-grid">
        <div className="card summary-card balance-card">
          <p className="eyebrow">Total Balance</p>
          <h2 className="summary-value">{formatCurrency(summary.totalBalance)}</h2>
        </div>
        <div className="card summary-card income-card">
          <p className="eyebrow">Total Income</p>
          <h2>{formatCurrency(summary.totalIncome)}</h2>
        </div>
        <div className="card summary-card expense-card">
          <p className="eyebrow">Total Expenses</p>
          <h2>{formatCurrency(summary.totalExpenses)}</h2>
        </div>
        <div className="card summary-card savings-card">
          <p className="eyebrow">Net Savings</p>
          <h2>{formatCurrency(summary.totalBalance)}</h2>
        </div>
      </div>

      <div className="stats-grid">
        <div className="card chart-card">
          <div className="section-heading">
            <h2>Weekly Expenses</h2>
          </div>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Bar dataKey="value" fill="#0f766e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card chart-card">
          <div className="section-heading">
            <h2>Category Breakdown</h2>
          </div>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={categoryData} dataKey="value" nameKey="label" innerRadius={50} outerRadius={88} paddingAngle={2}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`${entry.label}-${index}`} fill={chartColors[index % chartColors.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <form className="card filter-card" onSubmit={handleSearch}>
        <div className="filter-grid">
          <label className="field">
            <span>Monthly Budget</span>
            <input
              type="number"
              value={budget}
              onChange={(event) => setBudget(event.target.value)}
              placeholder="0"
              min="0"
              step="0.01"
            />
          </label>

          <label className="field">
            <span>Filter by Category</span>
            <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Start Date</span>
            <input type="date" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} />
          </label>

          <label className="field">
            <span>End Date</span>
            <input type="date" value={dateTo} onChange={(event) => setDateTo(event.target.value)} />
          </label>

          <label className="field">
            <span>Sort By</span>
            <select value={sortOption} onChange={(event) => setSortOption(event.target.value)}>
              <option value="date-desc">Date (latest first)</option>
              <option value="date-asc">Date (oldest first)</option>
              <option value="amount-asc">Amount (low to high)</option>
              <option value="amount-desc">Amount (high to low)</option>
            </select>
          </label>
        </div>

        <div className="filter-actions controls-footer">
          <button type="submit" className="button button-primary">
            Search
          </button>
          <button type="button" className="button button-secondary" onClick={handleReset}>
            Reset
          </button>
          <button type="button" className="button button-secondary" onClick={handleExport} disabled={exporting || !filteredExpenses.length}>
            {exporting ? 'Exporting...' : 'Export to CSV'}
          </button>
        </div>
      </form>

      <div className="transactions-section">
        <div className="section-meta">
          <span>Showing all transactions</span>
          <span>{filteredExpenses.length} records</span>
        </div>

        <ExpenseList
          expenses={filteredExpenses}
          loading={loading}
          error={error}
          deletingId={deletingId}
          onDelete={handleDelete}
        />
      </div>

      <button type="button" className="floating-logout" onClick={handleLogout} aria-label="Logout">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M10 17l5-5-5-5" />
          <path d="M15 12H3" />
          <path d="M15 3h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-2" />
        </svg>
      </button>
      
    </section>
  )
}

export default Dashboard