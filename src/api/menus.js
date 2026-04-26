import api from './axios'

export const getMenus      = (params) => api.get('/menus', { params })
export const getCategories = ()       => api.get('/categories')
export const getMenu       = (id)     => api.get(`/menus/${id}`)
export const getPriceConfig= ()       => api.get('/price-config')
export const getPublicStats= ()       => api.get('/stats')
export const checkCoupon   = (code, subtotal) => api.post('/coupons/check', { code, subtotal })

// Helper: unwrap array dari response menu (paginated atau plain)
export function extractMenus(res) {
  const outer = res?.data?.data
  if (outer && Array.isArray(outer.data)) return outer.data
  if (Array.isArray(outer)) return outer
  if (Array.isArray(res?.data)) return res.data
  return []
}

// Helper: unwrap categories
export function extractCategories(res) {
  const d = res?.data?.data ?? res?.data
  return Array.isArray(d) ? d : (d?.data ?? [])
}
