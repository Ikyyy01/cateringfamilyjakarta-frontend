<template>
  <div class="min-h-screen flex bg-gray-50">

    <!-- Sidebar -->
    <aside :class="[
      'flex flex-col flex-shrink-0 transition-all duration-300 sticky top-0 h-screen z-30',
      'bg-white border-r border-gray-200/80',
      sidebarOpen ? 'w-60' : 'w-[60px]',
    ]">
      <!-- Logo -->
      <div class="flex items-center gap-3 px-3.5 h-[60px] border-b border-gray-200/80 overflow-hidden flex-shrink-0">
        <div class="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center flex-shrink-0">
          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
          </svg>
        </div>
        <transition name="fade">
          <div v-if="sidebarOpen" class="overflow-hidden min-w-0">
            <p class="font-bold text-[13px] text-gray-900 leading-tight whitespace-nowrap tracking-tight">Catering Family</p>
            <p class="text-[10px] text-gray-400 whitespace-nowrap font-medium">Jakarta · Admin Panel</p>
          </div>
        </transition>
      </div>

      <!-- Nav -->
      <nav class="flex-1 py-3 px-2 overflow-y-auto space-y-0.5">
        <template v-for="group in navGroups" :key="group.label">
          <p v-if="sidebarOpen" class="text-[9px] font-bold uppercase tracking-[0.18em] text-gray-400 px-2.5 pb-1 pt-3 first:pt-1">{{ group.label }}</p>
          <div v-else class="border-t border-gray-100 my-2 mx-1.5"></div>

          <RouterLink v-for="link in group.links" :key="link.to" :to="link.to"
            :class="['flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-all text-sm group relative',
              isActive(link.to)
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800']">
            <component :is="'span'" class="flex-shrink-0 w-5 h-5 flex items-center justify-center" v-html="link.icon"></component>
            <transition name="fade">
              <span v-if="sidebarOpen" class="whitespace-nowrap flex-1 text-[12.5px] font-semibold">{{ link.label }}</span>
            </transition>
            <!-- Tooltip collapsed -->
            <div v-if="!sidebarOpen"
              class="absolute left-full ml-2.5 px-2.5 py-1.5 bg-gray-900 text-white text-xs font-semibold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition whitespace-nowrap z-50 shadow-lg">
              {{ link.label }}
            </div>
          </RouterLink>
        </template>
      </nav>

      <!-- User + Logout -->
      <div class="p-2 border-t border-gray-200/80 flex-shrink-0 space-y-1">
        <transition name="fade">
          <div v-if="sidebarOpen" class="flex items-center gap-2.5 px-2.5 py-2 rounded-lg bg-gray-50 mb-1">
            <div class="w-7 h-7 rounded-md bg-red-600 flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0">
              {{ authStore.user?.name?.[0]?.toUpperCase() || 'A' }}
            </div>
            <div class="overflow-hidden min-w-0">
              <p class="text-[12px] font-semibold text-gray-800 truncate leading-tight">{{ authStore.user?.name || 'Admin' }}</p>
              <p class="text-[10px] text-gray-400 truncate">{{ authStore.user?.email }}</p>
            </div>
          </div>
        </transition>
        <button @click="doLogout"
          class="flex items-center gap-2.5 w-full px-2.5 py-2 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all group relative">
          <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
          </svg>
          <transition name="fade">
            <span v-if="sidebarOpen" class="text-[12.5px] font-semibold">Logout</span>
          </transition>
          <div v-if="!sidebarOpen"
            class="absolute left-full ml-2.5 px-2.5 py-1.5 bg-gray-900 text-white text-xs font-semibold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition whitespace-nowrap z-50 shadow-lg">
            Logout
          </div>
        </button>
      </div>
    </aside>

    <!-- Main -->
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <!-- Topbar -->
      <header class="bg-white border-b border-gray-200/80 px-5 flex items-center justify-between h-[60px] sticky top-0 z-20 flex-shrink-0">
        <div class="flex items-center gap-3">
          <button @click="sidebarOpen = !sidebarOpen"
            class="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:border-gray-300 hover:text-gray-600 hover:bg-gray-50 transition-all">
            <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
              <rect width="14" height="1.5" rx="0.75" fill="currentColor"/>
              <rect y="4.25" width="9" height="1.5" rx="0.75" fill="currentColor"/>
              <rect y="8.5" width="14" height="1.5" rx="0.75" fill="currentColor"/>
            </svg>
          </button>
          <div class="hidden md:flex items-center gap-1.5 text-[12.5px] text-gray-400">
            <span>Admin</span>
            <svg class="w-3 h-3 text-gray-300" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
            </svg>
            <span class="text-gray-700 font-semibold">{{ currentPageTitle }}</span>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <div class="hidden md:flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full font-medium">
            <svg class="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            {{ todayStr }}
          </div>
          <a href="/" target="_blank"
            class="hidden md:inline-flex items-center gap-1.5 text-xs border border-gray-200 text-gray-500 px-3 py-1.5 rounded-full hover:border-gray-300 hover:text-gray-700 hover:bg-gray-50 transition font-medium">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
            </svg>
            Website
          </a>
          <div class="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white font-bold text-xs">
            {{ authStore.user?.name?.[0]?.toUpperCase() || 'A' }}
          </div>
        </div>
      </header>

      <!-- Content -->
      <main class="flex-1 overflow-y-auto p-5 lg:p-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore   = useAuthStore()
const router      = useRouter()
const route       = useRoute()
const sidebarOpen = ref(true)

const iconDashboard = `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>`
const iconOrders   = `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/></svg>`
const iconPayments = `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>`
const iconMenus    = `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>`
const iconCategory = `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/></svg>`
const iconCustomers= `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>`
const iconReviews  = `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>`
const iconCoupons  = `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"/></svg>`
const iconLog      = `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>`
const iconSettings = `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>`

const navGroups = [
  {
    label: 'Utama',
    links: [
      { to: '/admin/dashboard', icon: iconDashboard, label: 'Dashboard'   },
      { to: '/admin/orders',    icon: iconOrders,    label: 'Pesanan'     },
      { to: '/admin/payments',  icon: iconPayments,  label: 'Pembayaran'  },
    ],
  },
  {
    label: 'Katalog',
    links: [
      { to: '/admin/menus',      icon: iconMenus,    label: 'Menu'       },
      { to: '/admin/categories', icon: iconCategory, label: 'Kategori'   },
    ],
  },
  {
    label: 'Pelanggan',
    links: [
      { to: '/admin/customers', icon: iconCustomers, label: 'Pelanggan'  },
      { to: '/admin/reviews',   icon: iconReviews,   label: 'Ulasan'     },
      { to: '/admin/coupons',   icon: iconCoupons,   label: 'Kupon'      },
    ],
  },
  {
    label: 'Sistem',
    links: [
      { to: '/admin/activity-log', icon: iconLog,      label: 'Activity Log' },
      { to: '/admin/settings',     icon: iconSettings, label: 'Pengaturan'   },
    ],
  },
]

const pageMap = {
  '/admin/dashboard':    'Dashboard',
  '/admin/orders':       'Kelola Pesanan',
  '/admin/payments':     'Verifikasi Pembayaran',
  '/admin/menus':        'Kelola Menu',
  '/admin/categories':   'Kelola Kategori',
  '/admin/customers':    'Data Pelanggan',
  '/admin/coupons':      'Kelola Kupon',
  '/admin/reviews':      'Kelola Ulasan',
  '/admin/activity-log': 'Activity Log',
  '/admin/settings':     'Pengaturan',
}

function isActive(to) {
  if (to === '/admin/dashboard') return route.path === '/admin/dashboard'
  return route.path.startsWith(to)
}

const currentPageTitle = computed(() => {
  for (const [path, label] of Object.entries(pageMap)) {
    if (route.path.startsWith(path)) return label
  }
  return 'Admin'
})

const todayStr = computed(() =>
  new Date().toLocaleDateString('id-ID', { weekday:'short', day:'numeric', month:'short', year:'numeric' })
)

async function doLogout() {
  await authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.15s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
