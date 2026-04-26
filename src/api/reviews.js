import api from './axios'

export const getReviews = () => api.get('/reviews')
export const submitReview = (orderId, data) => api.post(`/orders/${orderId}/review`, data)
