// import { useState } from 'react'

// const initialFormState = {
//   title: '',
//   amount: '',
//   type: 'EXPENSE',
// }

// const mergeInitialValues = (values) => ({
//   ...initialFormState,
//   ...values,
// })

// function ExpenseForm({
//   onSubmit,
//   submitLabel = 'Save Expense',
//   initialValues = {},
// }) {
//   const [formData, setFormData] = useState({
//     ...mergeInitialValues(initialValues),
//   })

//   const [submitting, setSubmitting] = useState(false)
//   const [error, setError] = useState('')

//   // ✅ Handle input change
//   const handleChange = (e) => {
//     const { name, value } = e.target
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }))
//   }

//   // ✅ Handle submit
//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setError('')

//     const title = formData.title.trim()
//     const amount = Number(formData.amount)
//     const type = formData.type === 'INCOME' ? 'INCOME' : 'EXPENSE'

//     console.log('Expense form values:', {
//       title,
//       amount,
//       type,
//     })

//     // ✅ Validation
//     if (!title) {
//       setError('Title is required')
//       return
//     }

//     if (!Number.isFinite(amount) || amount <= 0) {
//       setError('Enter a valid amount')
//       return
//     }

//     // Send the flat payload expected by the backend API.
//     const payload = {
//       title,
//       amount,
//       type,
//     }

//     setSubmitting(true)

//     try {
//       await onSubmit(payload)

//       // ✅ Reset form after success
//       setFormData(initialFormState)

//     } catch (err) {
//       console.error(err)
//       setError(
//         err?.response?.data?.message ||
//         err.message ||
//         'Failed to save expense'
//       )
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   return (
//     <form className="card form-card form-card-enhanced" onSubmit={handleSubmit}>
//       <div className="form-card-header">
//         <h2>Transaction Details</h2>
//         <p>Fill in the details below to save your entry.</p>
//       </div>

//       <div className="form-grid">

//         {/* Title */}
//         <label className="field">
//           <span>Title</span>
//           <input
//             type="text"
//             name="title"
//             value={formData.title}
//             onChange={handleChange}
//             placeholder="Lunch, transport, groceries..."
//             required
//           />
//         </label>

//         {/* Amount */}
//         <label className="field">
//           <span>Amount</span>
//           <input
//             type="number"
//             name="amount"
//             value={formData.amount}
//             onChange={handleChange}
//             placeholder="0.00"
//             step="0.01"
//             required
//           />
//         </label>

//         <label className="field">
//           <span>Type</span>
//           <select name="type" value={formData.type} onChange={handleChange}>
//             <option value="EXPENSE">Expense</option>
//             <option value="INCOME">Income</option>
//           </select>
//         </label>

//       </div>

//       {/* Error Message */}
//       {error && <div className="form-error">{error}</div>}

//       {/* Submit Button */}
//       <div className="form-actions">
//         <button type="submit" disabled={submitting}>
//           {submitting ? 'Saving...' : submitLabel}
//         </button>
//       </div>
//     </form>
//   )
// }

// export default ExpenseForm
import { useState } from 'react'

const initialFormState = {
  title: '',
  amount: '',
  type: 'EXPENSE',
  categoryId: 1, // ✅ Added default category ID
}

const mergeInitialValues = (values) => ({
  ...initialFormState,
  ...values,
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

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const title = formData.title.trim()
    const amount = Number(formData.amount)
    const type = formData.type === 'INCOME' ? 'INCOME' : 'EXPENSE'
    const categoryId = Number(formData.categoryId) // ✅ Parse the ID as a number

    if (!title) {
      setError('Title is required')
      return
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      setError('Enter a valid amount')
      return
    }

    // ✅ Include the categoryId in the payload sent to api.js
    const payload = {
      title,
      amount,
      type,
      categoryId, 
    }

    setSubmitting(true)

    try {
      await onSubmit(payload)
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
    <form className="card form-card form-card-enhanced" onSubmit={handleSubmit}>
      <div className="form-card-header">
        <h2>Transaction Details</h2>
        <p>Fill in the details below to save your entry.</p>
      </div>

      <div className="form-grid">
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

        <label className="field">
          <span>Type</span>
          <select name="type" value={formData.type} onChange={handleChange}>
            <option value="EXPENSE">Expense</option>
            <option value="INCOME">Income</option>
          </select>
        </label>

        {/* ✅ NEW CATEGORY DROPDOWN */}
        <label className="field">
          <span>Category</span>
          <select name="categoryId" value={formData.categoryId} onChange={handleChange}>
            <option value={1}>Food</option>
            <option value={2}>Transport</option>
            <option value={3}>Groceries</option>
          </select>
        </label>
      </div>

      {error && <div className="form-error">{error}</div>}

      <div className="form-actions">
        <button type="submit" disabled={submitting}>
          {submitting ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  )
}

export default ExpenseForm