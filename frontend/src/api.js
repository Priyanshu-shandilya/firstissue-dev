import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'https://firstissue-dev.onrender.com/api'

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
})

export const getIssues = (params) => api.get('/issues', { params })
export const getStats = () => api.get('/issues/stats')
export const getSubscriberCount = () => api.get('/subscribe/count')
export const subscribe = (data) => api.post('/subscribe', data)

export default api