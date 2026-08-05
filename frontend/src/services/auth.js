import axios from 'axios'

const AUTH_STORAGE_KEY = 'finance-dashboard-auth'
const USERS_STORAGE_KEY = 'finance-dashboard-users'

const authApi = axios.create({
  baseURL: '/auth',
  headers: {
    'Content-Type': 'application/json',
  },
})

const readStoredAuth = () => {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const storedValue = window.localStorage.getItem(AUTH_STORAGE_KEY)
    return storedValue ? JSON.parse(storedValue) : null
  } catch (error) {
    console.error(error)
    return null
  }
}

const persistAuth = (authData) => {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData))
}

const readStoredUsers = () => {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const storedValue = window.localStorage.getItem(USERS_STORAGE_KEY)
    return storedValue ? JSON.parse(storedValue) : []
  } catch (error) {
    console.error(error)
    return []
  }
}

const persistUsers = (users) => {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
}

export const getStoredAuth = () => readStoredAuth()

export const isAuthenticated = () => Boolean(readStoredAuth()?.token)

export const getAuthUser = () => readStoredAuth()?.user || null

export const logoutUser = () => {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY)
}

export const loginUser = async (email, password) => {
  const normalizedEmail = String(email || '').trim().toLowerCase()
  const normalizedPassword = String(password || '').trim()

  if (!normalizedEmail || !normalizedPassword) {
    throw new Error('Email and password are required.')
  }

  try {
    const response = await authApi.post('/login', {
      email: normalizedEmail,
      password: normalizedPassword,
    })

    const authData = {
      token: response?.data?.token || `mock-token-${Date.now()}`,
      user: response?.data?.user || {
        email: normalizedEmail,
        name: normalizedEmail.split('@')[0],
      },
    }

    persistAuth(authData)
    return authData
  } catch (error) {
    const users = readStoredUsers()
    const matchedUser = users.find((user) => user.email === normalizedEmail && user.password === normalizedPassword)

    if (matchedUser) {
      const authData = {
        token: `local-token-${Date.now()}`,
        user: {
          email: matchedUser.email,
          name: matchedUser.name || matchedUser.email.split('@')[0],
        },
      }

      persistAuth(authData)
      return authData
    }

    throw new Error(error?.response?.data?.message || 'Unable to sign in. Please check your details or register first.')
  }
}

export const registerUser = async (email, password) => {
  const normalizedEmail = String(email || '').trim().toLowerCase()
  const normalizedPassword = String(password || '').trim()

  if (!normalizedEmail || !normalizedPassword) {
    throw new Error('Email and password are required.')
  }

  const users = readStoredUsers()

  if (users.some((user) => user.email === normalizedEmail)) {
    throw new Error('This email is already registered.')
  }

  const newUser = {
    email: normalizedEmail,
    password: normalizedPassword,
    name: normalizedEmail.split('@')[0],
  }

  persistUsers([...users, newUser])

  return loginUser(normalizedEmail, normalizedPassword)
}

export default authApi
