import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ExpenseList from '../components/ExpenseList.jsx'
import { deleteExpense, getAllExpenses, getExpensesByUser } from '../services/api.js'

function Dashboard() {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [userIdInput, setUserIdInput] = useState('')
  const [activeUserId, setActiveUserId] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  const fetchExpenses = async (userId = '') => {
    try {
      const normalizedUserId = String(userId).trim()
      const response = normalizedUserId ? await getExpensesByUser(normalizedUserId) : await getAllExpenses()
      setExpenses(Array.isArray(response) ? response : [])
      setActiveUserId(normalizedUserId)
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
    const timeoutId = setTimeout(() => {
      void fetchExpenses()
    }, 0)

    return () => clearTimeout(timeoutId)
  }, [])

  const handleSearch = async (event) => {
    event.preventDefault()
    await loadExpenses(userIdInput)
  }

  const handleReset = async () => {
    setUserIdInput('')
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
      await loadExpenses(activeUserId)
    } catch (deleteError) {
      setError(deleteError?.response?.data?.message || deleteError.message || 'Unable to delete expense.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <section className="page-stack">
      <div className="hero-card card">
        <div>
          <p className="eyebrow">Expense Tracker</p>
          <h1>Dashboard</h1>
          <p className="hero-copy">
            Track spending, filter by user, and keep the latest expenses in one place.
          </p>
        </div>

        <Link className="button button-primary" to="/add">
          Add Expense
        </Link>
      </div>

      <form className="card filter-card" onSubmit={handleSearch}>
        <label className="field inline-field">
          <span>Filter by User ID</span>
          <input
            type="number"
            value={userIdInput}
            onChange={(event) => setUserIdInput(event.target.value)}
            placeholder="Enter user ID"
            min="1"
            step="1"
          />
        </label>

        <div className="filter-actions">
          <button type="submit" className="button button-primary">
            Search
          </button>
          <button type="button" className="button button-secondary" onClick={handleReset}>
            Reset
          </button>
        </div>
      </form>

      <div className="section-meta">
        <span>{activeUserId ? `Showing results for user ${activeUserId}` : 'Showing all expenses'}</span>
        <span>{expenses.length} records</span>
      </div>

      <ExpenseList
        expenses={expenses}
        loading={loading}
        error={error}
        deletingId={deletingId}
        onDelete={handleDelete}
      />
    </section>
  )
}

export default Dashboard