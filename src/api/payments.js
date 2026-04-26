import api from './axios'

export const getPayment = (orderId) => api.get(`/orders/${orderId}/payment`)
export const uploadPayment = (orderId, formData) =>
  api.post(`/orders/${orderId}/payment/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
