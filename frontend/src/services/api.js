// import axios from 'axios'

// const api = axios.create({
//   baseURL: '/api/expenses',
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   withCredentials: true,
//   xsrfCookieName: 'XSRF-TOKEN',
//   xsrfHeaderName: 'X-XSRF-TOKEN',
// })

// // Add error interceptor to log and format errors
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     console.error('API Error Details:', {
//       status: error.response?.status,
//       statusText: error.response?.statusText,
//       data: error.response?.data,
//       message: error.message,
//       url: error.config?.url,
//     })
//     return Promise.reject(error)
//   },
// )

// const extractData = (response) => response.data

// const normalizeExpensePayload = (expense) => ({
//   title: expense.title,
//   amount: Number(expense.amount),
//   userId: Number(expense.userId),
//   categoryId: Number(expense.categoryId),
// })
// export const getAllExpenses = async () => {
//   const response = await api.get('')
//   return extractData(response)
// }

// export const addExpense = async (expense) => {
//   const payload = normalizeExpensePayload(expense)

//   console.info('POST /api/expenses payload:', payload)

//   const response = await api.post('', payload)

//   console.info('POST /api/expenses response:', response.data)

//   return extractData(response)
// }

// export const getExpenseById = async (id) => {
//   const response = await api.get(`/${id}`)
//   return extractData(response)
// }

// export const deleteExpense = async (id) => {
//   const response = await api.delete(`/${id}`)
//   return extractData(response)
// }

// export const updateExpense = async (id, expense) => {
//   const response = await api.put(`/${id}`, normalizeExpensePayload(expense))
//   return extractData(response)
// }

// export const getExpensesByUser = async (userId) => {
//   const response = await api.get(`/user/${userId}`)
//   return extractData(response)
// }

// export default api
import axios from 'axios'

const api = axios.create({
  baseURL: '/api/expenses',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
})

// Automatically attach Bearer token if stored in localStorage
api.interceptors.request.use(
  (config) => {
    try {
      const storedUser = localStorage.getItem('auth_user') || localStorage.getItem('user')
      if (storedUser) {
        const parsed = JSON.parse(storedUser)
        const token = parsed?.token || parsed?.accessToken
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
      }
    } catch (e) {
      // ignore JSON parse errors for non-JSON tokens
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error Details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      url: error.config?.url,
    })
    return Promise.reject(error)
  },
)

const extractData = (response) => response.data

const normalizeExpensePayload = (expense) => ({
  title: expense.title,
  amount: Number(expense.amount),
  type: expense.type || 'EXPENSE',
  user: { id: 1 },
  category: { id: expense.categoryId || 1 },
})

export const getAllExpenses = async () => {
  const response = await api.get('')
  return extractData(response)
}

export const addExpense = async (expense) => {
  const payload = normalizeExpensePayload(expense)
  const response = await api.post('', payload)
  return extractData(response)
}

export const getExpenseById = async (id) => {
  const response = await api.get(`/${id}`)
  return extractData(response)
}

export const deleteExpense = async (id) => {
  const response = await api.delete(`/${id}`)
  return extractData(response)
}

export const updateExpense = async (id, expense) => {
  const response = await api.put(`/${id}`, normalizeExpensePayload(expense))
  return extractData(response)
}

export const getExpensesByUser = async (userId) => {
  const response = await api.get(`/user/${userId}`)
  return extractData(response)
}

export const getAiInsights = async () => {
  const response = await api.get('/ai/insights')
  return extractData(response)
}
export const askAiAdvisor = async (message) => {
  const response = await api.post('/ai/chat', { message })
  return extractData(response)
}

export default api