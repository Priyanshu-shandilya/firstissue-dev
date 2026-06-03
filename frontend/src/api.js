import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
})

export const getIssues = (params) => api.get('/issues', { params })
export const getStats = () => api.get('/issues/stats')
export const getSubscriberCount = () => api.get('/subscribe/count')
export const subscribe = (data) => api.post('/subscribe', data)

export default api
