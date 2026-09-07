import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ExpenseForm from '../components/ExpenseForm.jsx'
import { addExpense } from '../services/api.js'
import ReceiptUploader from '../components/ReceiptUploader'

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

const getTodayDateString = () => {
  const d = new Date()
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function AddExpense() {
  const navigate = useNavigate()
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)
  const [scannedExpense, setScannedExpense] = useState(null)

  const handleScanComplete = (scannedData) => {
    if (!scannedData) return

    // Normalizes fallback keys across common OCR/AI response schemas
    const title =
      scannedData.title ||
      scannedData.merchant ||
      scannedData.store ||
      scannedData.storeName ||
      scannedData.vendor ||
      ''

    const amount =
      scannedData.amount !== undefined && scannedData.amount !== null
        ? scannedData.amount
        : scannedData.total !== undefined
          ? scannedData.total
          : ''

    const category =
      scannedData.category ||
      scannedData.categoryName ||
      'Food'

    const date =
      scannedData.date ||
      scannedData.transactionDate ||
      scannedData.expenseDate ||
      getTodayDateString()

    setScannedExpense({
      title,
      amount,
      category,
      type: 'EXPENSE',
      date,
    })
  }

  const handleSubmit = async (expense) => {
    setApiError('')
    setLoading(true)

    try {
      const createdExpense = await addExpense(expense)
      console.log('Expense created successfully:', createdExpense)
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
          <div>
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
          <p className="form-summary-copy">
            Choose a type, add a title, and save your transaction in seconds.
          </p>
        </div>
      </div>

      {/* AI Receipt Scanner */}
      <ReceiptUploader onScanComplete={handleScanComplete} />

      {/* API Error */}
      {apiError && (
        <div className="state-card error-card">
          {apiError}
        </div>
      )}

      {/* Form (key re-mounts component when scanned data arrives) */}
      <ExpenseForm
        key={scannedExpense ? JSON.stringify(scannedExpense) : 'empty-form'}
        initialData={scannedExpense || {}}
        onSubmit={handleSubmit}
        submitLabel={loading ? 'Saving...' : 'Save Transaction'}
      />
    </section>
  )
}

export default AddExpense