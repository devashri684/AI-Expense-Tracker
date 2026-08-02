import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ExpenseForm from '../components/ExpenseForm.jsx'
import { addExpense } from '../services/api.js'

const formatApiError = (error) => {
  const responseData = error?.response?.data

  if (typeof responseData === 'string') {
    return responseData
  }

  if (responseData && typeof responseData === 'object') {
    return (
      responseData.message ||
      responseData.error ||
      responseData.detail ||
      JSON.stringify(responseData)
    )
  }

  return error?.response?.statusText || error?.message || 'Failed to create expense'
}

function AddExpense() {
  const navigate = useNavigate()
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (expense) => {
    setApiError('')
    setLoading(true)

    try {
      // ✅ expense already correctly formatted from ExpenseForm
      const createdExpense = await addExpense(expense)

      console.log('Expense created successfully:', createdExpense)

      // ✅ redirect after success
      navigate('/')
    } catch (error) {
      console.error('API Error:', error)

      const errorMsg = formatApiError(error)

      setApiError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="page-stack">
      
      {/* Header */}
      <div className="hero-card card">
        <div>
          <p className="eyebrow">Expense Tracker</p>
          <h1>Add Expense</h1>
          <p className="hero-copy">
            Create a new expense and return to the dashboard after saving.
          </p>
        </div>

        <Link className="button button-secondary" to="/">
          Back to Dashboard
        </Link>
      </div>

      {/* API Error */}
      {apiError && (
        <div className="state-card error-card">
          {apiError}
        </div>
      )}

      {/* Form */}
      <ExpenseForm
        onSubmit={handleSubmit}
        submitLabel={loading ? 'Saving...' : 'Create Expense'}
      />
    </section>
  )
}

export default AddExpense