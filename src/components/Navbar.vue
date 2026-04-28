<template>
  <nav class="bg-white border-b border-gray-200/80 sticky top-0 z-50">
    <div class="max-w-6xl mx-auto px-4 h-[60px] flex items-center justify-between">
      <!-- Logo -->
      <RouterLink to="/" class="flex items-center gap-2.5 flex-shrink-0">
        <div class="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center flex-shrink-0">
          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
          </svg>
        </div>
        <span class="font-bold text-gray-900 text-[15px]">Catering Family</span>
      </RouterLink>

      <!-- Nav links desktop -->
      <div class="hidden md:flex items-center gap-1 text-sm font-medium text-gray-500">
        <RouterLink to="/"             class="px-3 py-1.5 rounded-lg hover:bg-gray-100 hover:text-gray-800 transition" active-class="text-red-600 bg-red-50">Beranda</RouterLink>
        <RouterLink to="/menu"         class="px-3 py-1.5 rounded-lg hover:bg-gray-100 hover:text-gray-800 transition" active-class="text-red-600 bg-red-50">Menu</RouterLink>
        <RouterLink to="/track"        class="px-3 py-1.5 rounded-lg hover:bg-gray-100 hover:text-gray-800 transition" active-class="text-red-600 bg-red-50">Lacak Pesanan</RouterLink>
        <RouterLink to="/tentang-kami" class="px-3 py-1.5 rounded-lg hover:bg-gray-100 hover:text-gray-800 transition" active-class="text-red-600 bg-red-50">Tentang Kami</RouterLink>
      </div>

      <!-- Right -->
      <div class="flex items-center gap-1.5">
        <!-- Cart -->
        <RouterLink to="/customer/cart" class="relative p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
          </svg>
          <span v-if="cartStore.count > 0"
            class="absolute -top-0.5 -right-0.5 bg-red-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
            {{ cartStore.count }}
          </span>
        </RouterLink>

        <!-- Admin (desktop only) -->
        <template v-if="authStore.isLoggedIn && authStore.isAdmin">
          <RouterLink to="/admin/dashboard"
            class="hidden md:block text-sm px-3.5 py-1.5 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition">
            Admin Panel
          </RouterLink>
          <button @click="doLogout" class="hidden md:block text-sm text-gray-400 hover:text-red-500 transition px-2 py-1.5">Logout</button>
        </template>

        <!-- Customer sudah login (desktop only) -->
        <template v-else-if="authStore.isLoggedIn">
          <div class="relative hidden md:block" ref="dropdownRef">
            <button @click="dropdownOpen = !dropdownOpen"
              class="flex items-center gap-2 border border-gray-200 rounded-lg px-2.5 py-1.5 hover:border-gray-300 hover:bg-gray-50 transition">
              <div class="w-6 h-6 rounded-md bg-red-600 flex items-center justify-center text-white font-bold text-xs">
                {{ authStore.user?.name?.[0]?.toUpperCase() || 'U' }}
              </div>
              <span class="text-sm font-medium text-gray-700 max-w-[80px] truncate">{{ authStore.user?.name }}</span>
              <svg class="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>

            <div v-if="dropdownOpen"
              class="absolute right-0 top-full mt-1.5 bg-white rounded-xl shadow-lg border border-gray-200 py-1.5 min-w-[160px] z-50">
              <RouterLink to="/customer/orders" @click="dropdownOpen = false"
                class="flex items-center gap-2.5 px-3.5 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition">
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                Pesanan Saya
              </RouterLink>
              <RouterLink to="/customer/profile" @click="dropdownOpen = false"
                class="flex items-center gap-2.5 px-3.5 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition">
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                Profil Saya
              </RouterLink>
              <div class="border-t border-gray-100 my-1"></div>
              <button @click="doLogout"
                class="flex items-center gap-2.5 px-3.5 py-2 text-sm text-red-500 hover:bg-red-50 transition w-full text-left">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                Logout
              </button>
            </div>
          </div>
        </template>

        <!-- Guest (desktop only) -->
        <template v-else>
          <RouterLink to="/menu"
            class="hidden md:block bg-red-600 text-white text-sm px-4 py-1.5 rounded-lg font-semibold hover:bg-red-700 transition">
            Pesan Sekarang
          </RouterLink>
        </template>

        <!-- Hamburger (mobile only) -->
        <button @click="mobileMenuOpen = !mobileMenuOpen"
          class="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition">
          <svg v-if="!mobileMenuOpen" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile Menu Drawer -->
    <Transition name="slide-down">
      <div v-if="mobileMenuOpen" class="md:hidden border-t border-gray-100 bg-white shadow-lg">
        <div class="px-4 py-3 space-y-1">
          <RouterLink to="/" @click="mobileMenuOpen = false"
            class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition"
            active-class="bg-red-50 text-red-600">
            🏠 Beranda
          </RouterLink>
          <RouterLink to="/menu" @click="mobileMenuOpen = false"
            class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition"
            active-class="bg-red-50 text-red-600">
            🍱 Menu
          </RouterLink>
          <RouterLink to="/track" @click="mobileMenuOpen = false"
            class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition"
            active-class="bg-red-50 text-red-600">
            🔍 Lacak Pesanan
          </RouterLink>
          <RouterLink to="/tentang-kami" @click="mobileMenuOpen = false"
            class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition"
            active-class="bg-red-50 text-red-600">
            ℹ️ Tentang Kami
          </RouterLink>
        </div>

        <!-- Mobile Auth Section -->
        <div class="px-4 pb-4 pt-1 border-t border-gray-100 mt-1">
          <!-- Admin mobile -->
          <template v-if="authStore.isLoggedIn && authStore.isAdmin">
            <RouterLink to="/admin/dashboard" @click="mobileMenuOpen = false"
              class="flex items-center justify-center gap-2 w-full bg-red-600 text-white py-2.5 rounded-xl font-semibold text-sm mb-2 hover:bg-red-700 transition">
              🖥️ Admin Panel
            </RouterLink>
            <button @click="doLogout"
              class="flex items-center justify-center gap-2 w-full border-2 border-gray-200 text-gray-500 py-2.5 rounded-xl font-semibold text-sm hover:border-red-300 hover:text-red-500 transition">
              Logout
            </button>
          </template>

          <!-- Customer logged in mobile -->
          <template v-else-if="authStore.isLoggedIn">
            <div class="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 mb-3">
              <div class="w-9 h-9 rounded-lg bg-red-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {{ authStore.user?.name?.[0]?.toUpperCase() || 'U' }}
              </div>
              <div class="min-w-0">
                <div class="text-sm font-bold text-gray-800 truncate">{{ authStore.user?.name }}</div>
                <div class="text-xs text-gray-400 truncate">{{ authStore.user?.email }}</div>
              </div>
            </div>
            <RouterLink to="/customer/orders" @click="mobileMenuOpen = false"
              class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
              📋 Pesanan Saya
            </RouterLink>
            <RouterLink to="/customer/profile" @click="mobileMenuOpen = false"
              class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
              👤 Profil Saya
            </RouterLink>
            <button @click="doLogout"
              class="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition mt-1">
              🚪 Logout
            </button>
          </template>

          <!-- Guest mobile -->
          <template v-else>
            <RouterLink to="/menu" @click="mobileMenuOpen = false"
              class="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-red-600 to-orange-500 text-white py-2.5 rounded-xl font-bold text-sm shadow hover:-translate-y-0.5 transition">
              🍱 Pesan Sekarang
            </RouterLink>
          </template>
        </div>
      </div>
    </Transition>
  </nav>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { useRouter } from 'vue-router'

const authStore    = useAuthStore()
const cartStore    = useCartStore()
const router       = useRouter()
const dropdownOpen = ref(false)
const dropdownRef  = ref(null)
const mobileMenuOpen = ref(false)

async function doLogout() {
  dropdownOpen.value = false
  mobileMenuOpen.value = false
  await authStore.logout()
  router.push('/')
}

function handleOutsideClick(e) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    dropdownOpen.value = false
  }
}

onMounted(() => document.addEventListener('click', handleOutsideClick))
onBeforeUnmount(() => document.removeEventListener('click', handleOutsideClick))
</script>

<style scoped>
.slide-down-enter-active { transition: all 0.2s ease-out; }
.slide-down-leave-active { transition: all 0.15s ease-in; }
.slide-down-enter-from  { opacity: 0; transform: translateY(-8px); }
.slide-down-leave-to    { opacity: 0; transform: translateY(-8px); }
</style>
