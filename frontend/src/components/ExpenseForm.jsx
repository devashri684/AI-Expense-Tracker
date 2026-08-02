import { useState } from 'react'

const initialFormState = {
  title: '',
  amount: '',
  userId: '',
  categoryId: '',
}

const mergeInitialValues = (values) => ({
  ...initialFormState,
  ...values,
  userId: values.userId ?? values.user?.id ?? '',
  categoryId: values.categoryId ?? values.category?.id ?? '',
})

function ExpenseForm({
  onSubmit,
  submitLabel = 'Save Expense',
  initialValues = {},
}) {
  const [formData, setFormData] = useState({
    ...mergeInitialValues(initialValues),
  })

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // ✅ Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const title = formData.title.trim()
    const amount = Number(formData.amount)
    const userId = Number(formData.userId)
    const categoryId = Number(formData.categoryId)

    console.log('Expense form values:', {
      title,
      amount,
      userId,
      categoryId,
    })

    // ✅ Validation
    if (!title) {
      setError('Title is required')
      return
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      setError('Enter a valid amount')
      return
    }

    if (!Number.isInteger(userId) || userId <= 0) {
      setError('Enter a valid User ID')
      return
    }

    if (!Number.isInteger(categoryId) || categoryId <= 0) {
      setError('Enter a valid Category ID')
      return
    }

    // Send the flat payload expected by the backend API.
    const payload = {
      title,
      amount,
      userId,
      categoryId,
    }

    setSubmitting(true)

    try {
      await onSubmit(payload)

      // ✅ Reset form after success
      setFormData(initialFormState)

    } catch (err) {
      console.error(err)
      setError(
        err?.response?.data?.message ||
        err.message ||
        'Failed to save expense'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="card form-card" onSubmit={handleSubmit}>
      <div className="form-grid">

        {/* Title */}
        <label className="field">
          <span>Title</span>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Lunch, transport, groceries..."
            required
          />
        </label>

        {/* Amount */}
        <label className="field">
          <span>Amount</span>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0.00"
            step="0.01"
            required
          />
        </label>

        {/* User ID */}
        <label className="field">
          <span>User ID</span>
          <input
            type="number"
            name="userId"
            value={formData.userId}
            onChange={handleChange}
            placeholder="1"
            required
          />
        </label>

        {/* Category ID */}
        <label className="field">
          <span>Category ID</span>
          <input
            type="number"
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            placeholder="1"
            required
          />
        </label>

      </div>

      {/* Error Message */}
      {error && <div className="form-error">{error}</div>}

      {/* Submit Button */}
      <div className="form-actions">
        <button type="submit" disabled={submitting}>
          {submitting ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  )
}

export default ExpenseForm