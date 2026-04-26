<template>
  <div class="min-h-screen flex overflow-hidden">

    <!-- ─── Kiri: Form ──────────────────────────────────── -->
    <div class="flex flex-col justify-center w-full lg:w-[480px] xl:w-[520px] flex-shrink-0 px-8 sm:px-14 xl:px-16 bg-white">
      <div class="max-w-[360px] w-full mx-auto">

        <!-- Logo -->
        <div class="mb-10">
          <div class="w-11 h-11 rounded-xl bg-red-600 flex items-center justify-center shadow-sm mb-5">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-gray-900 leading-tight">Catering Family Jakarta</h1>
          <p class="text-sm text-gray-400 mt-1.5">Selamat datang kembali — silakan masuk</p>
        </div>

        <!-- Form -->
        <div class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Email</label>
            <input v-model="form.email" type="email" @keyup.enter="handleLogin"
              class="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400 focus:bg-white focus:ring-1 focus:ring-red-100 transition-all placeholder:text-gray-300"
              placeholder="email@contoh.com" />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Password</label>
            <div class="relative">
              <input v-model="form.password" :type="showPass ? 'text' : 'password'" @keyup.enter="handleLogin"
                class="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400 focus:bg-white focus:ring-1 focus:ring-red-100 transition-all placeholder:text-gray-300 pr-11"
                placeholder="••••••••" />
              <button type="button" @click="showPass = !showPass"
                class="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition">
                <svg v-if="showPass" class="w-4.5 h-4.5 w-[18px] h-[18px]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                </svg>
                <svg v-else class="w-[18px] h-[18px]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Error -->
          <div v-if="error" class="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
            <svg class="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
            <span>{{ error }}</span>
          </div>

          <!-- Submit -->
          <button @click="handleLogin" :disabled="loading"
            class="w-full bg-red-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-red-700 transition-all disabled:opacity-50 mt-1">
            {{ loading ? 'Memproses...' : 'Masuk Sekarang' }}
          </button>
        </div>

        <p class="text-center mt-6">
          <RouterLink to="/" class="text-xs text-gray-300 hover:text-gray-500 transition">← Kembali ke Beranda</RouterLink>
        </p>
      </div>
    </div>

    <!-- ─── Kanan: Branding ─────────────────────────────── -->
    <div class="hidden lg:flex flex-col flex-1 relative overflow-hidden"
         style="background: linear-gradient(135deg, #dc2626 0%, #ea580c 60%, #c2410c 100%)">

      <!-- Decorative circles -->
      <div class="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5 pointer-events-none"></div>
      <div class="absolute top-1/3 -left-16 w-64 h-64 rounded-full bg-white/5 pointer-events-none"></div>
      <div class="absolute -bottom-20 right-1/4 w-80 h-80 rounded-full bg-white/5 pointer-events-none"></div>

      <!-- Content -->
      <div class="relative z-10 flex flex-col justify-center h-full px-12 xl:px-16 text-white">

        <!-- Headline -->
        <div class="mb-10">
          <p class="text-[10px] font-bold uppercase tracking-[0.3em] text-white/50 mb-4">Admin Panel</p>
          <h2 class="text-4xl xl:text-5xl font-bold leading-tight mb-4">
            Kelola bisnis<br/>catering Anda<br/>dengan mudah.
          </h2>
          <p class="text-white/60 text-sm leading-relaxed max-w-xs">
            Dashboard terpadu untuk pesanan, pembayaran, dan menu — semua dalam satu tempat.
          </p>
        </div>

        <!-- Feature cards -->
        <div class="space-y-3 max-w-sm">
          <div v-for="f in features" :key="f.title"
               class="flex items-center gap-4 bg-white/10 rounded-2xl px-5 py-4 border border-white/10">
            <div class="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0" v-html="f.icon"></div>
            <div>
              <p class="font-semibold text-sm">{{ f.title }}</p>
              <p class="text-white/50 text-xs mt-0.5">{{ f.desc }}</p>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="mt-10 flex items-center gap-3 text-white/30 text-xs">
          <span>Powered by</span>
          <span class="font-semibold text-white/50">Laravel + Vue 3</span>
          <span>·</span>
          <span class="inline-flex items-center gap-1.5 text-green-300 font-semibold">
            <span class="w-1.5 h-1.5 rounded-full bg-green-400 inline-block animate-pulse"></span>
            Sistem Online
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const form = ref({ email: '', password: '' })
const loading = ref(false)
const error = ref('')
const showPass = ref(false)

const icOrders  = `<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>`
const icPayment = `<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>`
const icMenu    = `<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>`

const features = [
  { icon: icOrders,  title: 'Kelola Pesanan',        desc: 'Pantau & proses setiap pesanan masuk' },
  { icon: icPayment, title: 'Verifikasi Pembayaran',  desc: 'Konfirmasi bukti bayar dengan cepat' },
  { icon: icMenu,    title: 'Manajemen Menu',         desc: 'Tambah & edit menu kapan saja' },
]

async function handleLogin() {
  if (!form.value.email || !form.value.password) return
  loading.value = true
  error.value = ''
  try {
    const user = await authStore.login(form.value)
    const redirect = route.query.redirect || (user.role === 'admin' ? '/admin/dashboard' : '/')
    router.push(redirect)
  } catch (err) {
    const data = err.response?.data
    if (data?.errors) {
      error.value = Object.values(data.errors).flat()[0] || 'Email atau password salah.'
    } else {
      error.value = data?.message || 'Email atau password salah.'
    }
  } finally {
    loading.value = false
  }
}
</script>
