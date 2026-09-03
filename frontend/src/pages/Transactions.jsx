import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import ExpenseList from '../components/ExpenseList.jsx'
import { deleteExpense, getAllExpenses } from '../services/api.js'
import {
  exportExpensesToCsv,
  filterExpenses,
  sortExpenses,
} from '../utils/expenseAnalytics.js'

function Transactions() {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState(null)
  const [exporting, setExporting] = useState(false)

  // Filter and sort state
  const [categoryFilter, setCategoryFilter] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [sortOption, setSortOption] = useState('date-desc')

  const fetchExpenses = async () => {
    try {
      setLoading(true)
      const data = await getAllExpenses()
      setExpenses(Array.isArray(data) ? data : [])
    } catch (fetchError) {
      setError(
        fetchError?.response?.data?.message ||
          fetchError.message ||
          'Unable to load transactions.'
      )
      setExpenses([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchExpenses()
  }, [])

  const categories = useMemo(() => {
    const values = expenses
      .map((expense) => expense?.category?.name?.trim() || 'General')
      .filter(Boolean)
    return [...new Set(values)]
  }, [expenses])

  const filteredExpenses = useMemo(() => {
    const filtered = filterExpenses(expenses, {
      category: categoryFilter,
      dateFrom,
      dateTo,
    })
    return sortExpenses(filtered, sortOption)
  }, [categoryFilter, dateFrom, dateTo, expenses, sortOption])

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Delete this transaction?')
    if (!confirmed) return

    setDeletingId(id)
    try {
      await deleteExpense(id)
      setExpenses((prev) => prev.filter((item) => item.id !== id))
    } catch (deleteError) {
      setError(
        deleteError?.response?.data?.message ||
          deleteError.message ||
          'Unable to delete transaction.'
      )
    } finally {
      setDeletingId(null)
    }
  }

  const handleReset = () => {
    setCategoryFilter('')
    setDateFrom('')
    setDateTo('')
    setSortOption('date-desc')
  }

  const handleExport = () => {
    if (!filteredExpenses.length) return
    setExporting(true)
    try {
      exportExpensesToCsv(filteredExpenses, 'all-transactions.csv')
    } finally {
      setExporting(false)
    }
  }

  return (
    <section className="page-stack">
      <div className="hero-card card page-intro-card">
        <div className="page-intro-copy">
          <div>
            <h1>Transactions</h1>
            <p className="hero-copy">
              Filter, audit, sort, and export your entire financial history.
            </p>
          </div>
        </div>
        <Link className="button button-primary" to="/add">
          + New Transaction
        </Link>
      </div>

      <div className="card filter-card">
        <div className="filter-grid">
          <label className="field">
            <span>Filter by Category</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Start Date</span>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </label>

          <label className="field">
            <span>End Date</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </label>

          <label className="field">
            <span>Sort By</span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="date-desc">Date (latest first)</option>
              <option value="date-asc">Date (oldest first)</option>
              <option value="amount-asc">Amount (low to high)</option>
              <option value="amount-desc">Amount (high to low)</option>
            </select>
          </label>
        </div>

        <div className="filter-actions controls-footer">
          <button
            type="button"
            className="button button-secondary"
            onClick={handleReset}
          >
            Reset
          </button>
          <button
            type="button"
            className="button button-secondary"
            onClick={handleExport}
            disabled={exporting || !filteredExpenses.length}
          >
            {exporting ? 'Exporting...' : 'Export to CSV'}
          </button>
        </div>
      </div>

      <div className="transactions-section">
        <div className="section-meta">
          <span>Showing transactions</span>
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
    </section>
  )
}

export default Transactions