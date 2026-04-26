import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login as apiLogin, logout as apiLogout, getUser } from '@/api/auth'

export const useAuthStore = defineStore('auth', () => {
  const user  = ref(null)
  const token = ref(localStorage.getItem('token') || null)

  const isLoggedIn = computed(() => !!token.value)
  const isAdmin    = computed(() => user.value?.role === 'admin')

  async function fetchUser() {
    try {
      const res  = await getUser()
      user.value = res.data.data
    } catch {
      user.value  = null
      token.value = null
      localStorage.removeItem('token')
    }
  }

  async function login(credentials) {
    const res   = await apiLogin(credentials)
    token.value = res.data.data.token
    user.value  = res.data.data.user
    localStorage.setItem('token', res.data.data.token)
    return res.data.data.user
  }

  async function logout() {
    try { await apiLogout() } catch {}
    token.value = null
    user.value  = null
    localStorage.removeItem('token')
  }

  return { user, token, isLoggedIn, isAdmin, fetchUser, login, logout }
})
