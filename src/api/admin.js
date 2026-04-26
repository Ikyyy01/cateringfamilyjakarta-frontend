import api from './axios'

// ── Dashboard ─────────────────────────────────────────────
export const getDashboard = (period = 7) => api.get('/admin/dashboard', { params: { period } })

// ── Menus ─────────────────────────────────────────────────
export const getAdminMenus = (params) => api.get('/admin/menus', { params })
export const getAdminMenu  = (id)     => api.get(`/admin/menus/${id}`)
export const createMenu    = (fd)     => api.post('/admin/menus', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
export const updateMenu    = (id, fd) => api.post(`/admin/menus/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
export const deleteMenu    = (id)     => api.delete(`/admin/menus/${id}`)

// ── Categories ────────────────────────────────────────────
export const getAdminCategories = (params)      => api.get('/admin/categories', { params })
export const getAdminCategory   = (id)          => api.get(`/admin/categories/${id}`)
export const createCategory     = (data)        => api.post('/admin/categories', data)
export const updateCategory     = (id, data)    => api.put(`/admin/categories/${id}`, data)
export const deleteCategory     = (id)          => api.delete(`/admin/categories/${id}`)

// ── Orders ────────────────────────────────────────────────
export const getAdminOrders    = (params)              => api.get('/admin/orders', { params })
export const getAdminOrder     = (id)                  => api.get(`/admin/orders/${id}`)
export const updateOrderStatus = (id, status, cancelledReason = null) =>
  api.patch(`/admin/orders/${id}/status`, { status, ...(cancelledReason ? { cancelled_reason: cancelledReason } : {}) })
export const approveCustomMenu = (customMenuId, estimatedPrice) =>
  api.post(`/admin/custom-menus/${customMenuId}/approve`, { estimated_price: estimatedPrice })
export const rejectCustomMenu  = (customMenuId, reason = '') =>
  api.post(`/admin/custom-menus/${customMenuId}/reject`, { reason })

// ── Payments ──────────────────────────────────────────────
export const getAdminPayments = (params)     => api.get('/admin/payments', { params })
export const verifyPayment    = (id)         => api.post(`/admin/payments/${id}/verify`)
export const rejectPayment    = (id, reason = '') => api.post(`/admin/payments/${id}/reject`, { reason })

// ── Customers ─────────────────────────────────────────────
export const getCustomers  = (params) => api.get('/admin/customers', { params })
export const getCustomer   = (id)     => api.get(`/admin/customers/${id}`)
export const deleteCustomer= (id)     => api.delete(`/admin/customers/${id}`)

// ── Coupons ───────────────────────────────────────────────
export const getCoupons     = (params)     => api.get('/admin/coupons', { params })
export const createCoupon   = (data)       => api.post('/admin/coupons', data)
export const updateCoupon   = (id, data)   => api.put(`/admin/coupons/${id}`, data)
export const deleteCoupon   = (id)         => api.delete(`/admin/coupons/${id}`)
export const toggleCoupon   = (id)         => api.patch(`/admin/coupons/${id}/toggle`)

// ── Reviews ───────────────────────────────────────────────
export const getAdminReviews = (params) => api.get('/admin/reviews', { params })
export const deleteReview    = (id)     => api.delete(`/admin/reviews/${id}`)

// ── Activity Logs ─────────────────────────────────────────
export const getActivityLogs = (params) => api.get('/admin/activity-logs', { params })

// ── Settings ──────────────────────────────────────────────
export const getSettings    = ()       => api.get('/admin/settings')
export const updateSettings = (data)   => api.patch('/admin/settings', data)
export const updateAppSettings = (data) => api.patch('/admin/settings/app', { settings: data })

// ── Settings — QRIS ───────────────────────────────────────
export const uploadQris  = (fd)  => api.post('/admin/settings/qris', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
export const deleteQris  = ()    => api.delete('/admin/settings/qris')
