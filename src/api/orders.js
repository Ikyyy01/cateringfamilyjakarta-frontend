import api from './axios'

export const getOrders = () => api.get('/orders')
export const getOrder = (id) => api.get(`/orders/${id}`)
export const createOrder = (data) => api.post('/orders', data)
export const cancelOrder = (id, reason) => api.post(`/orders/${id}/cancel`, { reason })
export const trackOrder = (code) => api.get('/track', { params: { kode: code } })
