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
      <div className="hero-card card page-intro-card">
        <div className="page-intro-copy">
          <div className="page-icon-badge">✦</div>
          <div>
            <p className="eyebrow">Transaction Manager</p>
            <h1>New Transaction</h1>
            <p className="hero-copy">
              Capture income or expense entries quickly and keep your balance updated in real time.
            </p>
          </div>
        </div>

        <Link className="button button-secondary" to="/">
          Back
        </Link>
      </div>

      <div className="card form-summary-card">
        <div>
          <p className="form-summary-title">Track every movement</p>
          <p className="form-summary-copy">Choose a type, add a title, and save your transaction in seconds.</p>
        </div>
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
        submitLabel={loading ? 'Saving...' : 'Save Transaction'}
      />
    </section>
  )
}

export default AddExpense