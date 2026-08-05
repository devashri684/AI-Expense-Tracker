// import { Link } from 'react-router-dom'

// const currencyFormatter = new Intl.NumberFormat('en-US', {
//   style: 'currency',
//   currency: 'USD',
// })

// const getTypeClassName = (type) => (type === 'INCOME' ? 'income-pill' : 'expense-pill')

// const formatRelatedEntity = (entity, fallbackId, fallbackLabel) => {
//   const name = entity?.name?.trim()
//   const id = entity?.id ?? fallbackId

//   if (name) {
//     return id ? `${name} (ID: ${id})` : name
//   }

//   if (id) {
//     return `${fallbackLabel} #${id}`
//   }

//   return 'N/A'
// }

// function ExpenseList({ expenses = [], loading = false, error = '', deletingId = null, onDelete }) {
//   if (loading) {
//     return <div className="state-card">Loading expenses...</div>
//   }

//   if (error) {
//     return <div className="state-card error-card">{error}</div>
//   }

//   if (!expenses.length) {
//     return <div className="state-card">No expenses found.</div>
//   }

//   return (
//     <div className="table-card">
//       <div className="table-wrap">
//         <table>
//           <thead>
//             <tr>
//               <th>Title</th>
//               <th>Amount</th>
//               <th>Type</th>
//               <th>User</th>
//               <th>Category</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {expenses.map((expense) => (
//               <tr key={expense.id}>
//                 <td>
//                   <strong>{expense.title ?? 'Untitled expense'}</strong>
//                 </td>
//                 <td>{currencyFormatter.format(Number(expense.amount ?? 0))}</td>
//                 <td>
//                   <span className={getTypeClassName(expense.type)}>{expense.type || 'EXPENSE'}</span>
//                 </td>
//                 <td>{formatRelatedEntity(expense.user, expense.userId, 'User')}</td>
//                 <td>{formatRelatedEntity(expense.category, expense.categoryId, 'Category')}</td>
//                 <td>
//                   <div className="action-group">
//                     <Link className="button button-secondary button-small" to={`/edit/${expense.id}`}>
//                       Edit
//                     </Link>
//                     <button
//                       type="button"
//                       className="button button-danger button-small"
//                       onClick={() => onDelete(expense.id)}
//                       disabled={deletingId === expense.id}
//                     >
//                       {deletingId === expense.id ? 'Deleting...' : 'Delete'}
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   )
// }

// export default ExpenseList
import { Link } from 'react-router-dom'

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

const getTypeClassName = (type) => (type === 'INCOME' ? 'income-pill' : 'expense-pill')

const formatRelatedEntity = (entity, fallbackId, fallbackLabel) => {
  const name = entity?.name?.trim()
  const id = entity?.id ?? fallbackId

  if (name) {
    return id ? `${name} (ID: ${id})` : name
  }

  if (id) {
    return `${fallbackLabel} #${id}`
  }

  return 'N/A'
}

function ExpenseList({ expenses = [], loading = false, error = '', deletingId = null, onDelete }) {
  if (loading) {
    return <div className="state-card">Loading expenses...</div>
  }

  if (error) {
    return <div className="state-card error-card">{error}</div>
  }

  if (!expenses.length) {
    return <div className="state-card">No expenses found.</div>
  }

  return (
    <div className="table-card">
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Amount</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id}>
                <td>
                  <strong>{expense.title ?? 'Untitled expense'}</strong>
                </td>
                <td>{currencyFormatter.format(Number(expense.amount ?? 0))}</td>
                <td>
                  <span className={getTypeClassName(expense.type)}>{expense.type || 'EXPENSE'}</span>
                </td>
                <td>
                  <div className="action-group">
                    <Link className="button button-secondary button-small" to={`/edit/${expense.id}`}>
                      Edit
                    </Link>
                    <button
                      type="button"
                      className="button button-danger button-small"
                      onClick={() => onDelete(expense.id)}
                      disabled={deletingId === expense.id}
                    >
                      {deletingId === expense.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ExpenseList