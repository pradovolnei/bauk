import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

const api = axios.create({
  baseURL,
  headers: {
    Accept: 'application/json'
  }
})

// adiciona token automaticamente às requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auth
export const login = (username: string, password: string) =>
  api.post('/auth/login', { username, password })

export const register = (payload: { username: string; password: string; name?: string }) =>
  api.post('/auth/signup', payload) // 👈 confira se a sua API usa esse endpoint

export const me = () => api.get('/auth/me') // 👈 ou '/me' se for esse o endpoint

// Transactions
export const getTransactions = (params?: any) => api.get('/transactions', { params })

export const createTransfer = (payload: { to_username: string; amount: number; description?: string }) =>
  api.post('/transfer', payload)

export default api
