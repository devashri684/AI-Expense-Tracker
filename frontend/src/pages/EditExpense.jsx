import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import ExpenseForm from '../components/ExpenseForm.jsx'
import { getExpenseById, updateExpense } from '../services/api.js'

function EditExpense() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [expense, setExpense] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const loadExpense = async () => {
        setLoading(true)
        setError('')

        try {
          const response = await getExpenseById(id)
          setExpense(response)
        } catch (fetchError) {
          setError(fetchError?.response?.data?.message || fetchError.message || 'Unable to load expense.')
          setExpense(null)
        } finally {
          setLoading(false)
        }
      }

      void loadExpense()
    }, 0)

    return () => clearTimeout(timeoutId)
  }, [id])

  const handleSubmit = async (updatedExpense) => {
    await updateExpense(id, updatedExpense)
    navigate('/')
  }

  return (
    <section className="page-stack">
      <div className="hero-card card">
        <div>
          <p className="eyebrow">Expense Tracker</p>
          <h1>Edit Expense</h1>
          <p className="hero-copy">Update an existing expense and return to the dashboard after saving.</p>
        </div>

        <Link className="button button-secondary" to="/">
          Back to Dashboard
        </Link>
      </div>

      {loading ? <div className="state-card">Loading expense...</div> : null}
      {error ? <div className="state-card error-card">{error}</div> : null}

      {!loading && !error && expense ? (
        <ExpenseForm
          key={expense.id}
          onSubmit={handleSubmit}
          submitLabel="Update Expense"
          initialValues={{
            title: expense.title ?? '',
            amount: expense.amount ?? '',
            userId: expense.userId ?? expense.user?.id ?? '',
            categoryId: expense.categoryId ?? expense.category?.id ?? '',
          }}
        />
      ) : null}
    </section>
  )
}

export default EditExpense