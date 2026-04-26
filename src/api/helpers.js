/**
 * Unwrap Laravel API response
 * Format: { success: true, data: <payload> }
 */
export function unwrap(res) {
  const payload = res?.data?.data ?? res?.data ?? []
  if (Array.isArray(payload?.data)) return payload.data
  if (Array.isArray(payload)) return payload
  return []
}

export function unwrapOne(res) {
  return res?.data?.data ?? res?.data ?? null
}

export function unwrapPaginated(res) {
  const payload = res?.data?.data ?? res?.data ?? {}
  return {
    items: Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []),
    meta: {
      current_page: payload?.current_page ?? 1,
      last_page:    payload?.last_page    ?? 1,
      total:        payload?.total        ?? 0,
    },
  }
}

export const STORAGE_URL = import.meta.env.VITE_STORAGE_URL || '/storage'

export function storageUrl(path) {
  if (!path) return null
  if (path.startsWith('http')) return path
  return `${STORAGE_URL}/${path}`
}
