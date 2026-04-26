<template>
  <div>
    <!-- Page Header -->
    <div class="flex items-start justify-between mb-6">
      <div>
        <h1 class="text-xl font-bold text-gray-900">Dashboard</h1>
        <p class="text-sm text-gray-500 mt-0.5">Selamat datang kembali, <span class="font-semibold text-gray-700">{{ authStore.user?.name }}</span></p>
      </div>
      <RouterLink to="/admin/orders"
        class="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-red-700 transition">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
        </svg>
        Kelola Pesanan
      </RouterLink>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-24 text-gray-300">
      <div class="text-center">
        <div class="w-10 h-10 border-2 border-gray-200 border-t-red-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-sm font-medium text-gray-400">Memuat data dashboard...</p>
      </div>
    </div>

    <template v-else>
      <!-- Alert Banners -->
      <div v-if="stats.pending_payments > 0 || stats.pending_custom_menus > 0" class="flex flex-wrap gap-2 mb-5">
        <RouterLink v-if="stats.pending_payments > 0" to="/admin/payments"
          class="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5 hover:bg-amber-100 transition text-sm font-semibold text-amber-800">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
          </svg>
          {{ stats.pending_payments }} pembayaran menunggu verifikasi
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
        </RouterLink>
        <RouterLink v-if="stats.pending_custom_menus > 0" to="/admin/orders"
          class="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-4 py-2.5 hover:bg-blue-100 transition text-sm font-semibold text-blue-800">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
          </svg>
          {{ stats.pending_custom_menus }} custom menu belum disetujui
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
        </RouterLink>
      </div>

      <!-- Stat Cards -->
      <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mb-5">
        <div v-for="s in statCards" :key="s.label"
          class="bg-white rounded-xl p-4 border border-gray-200/80 hover:border-gray-300 transition-all">
          <div class="flex items-center justify-between mb-3">
            <div :class="['w-9 h-9 rounded-lg flex items-center justify-center', s.bg]" v-html="s.icon"></div>
          </div>
          <div class="text-xl font-bold text-gray-900 leading-tight tabular-nums">{{ s.value }}</div>
          <div class="text-[11px] text-gray-400 font-medium mt-0.5 truncate">{{ s.label }}</div>
        </div>
      </div>

      <!-- Chart + Info -->
      <div class="grid lg:grid-cols-5 gap-4 mb-5">

        <!-- Chart -->
        <div class="lg:col-span-3 bg-white rounded-xl border border-gray-200/80 overflow-hidden">
          <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div>
              <p class="font-semibold text-sm text-gray-800">Ringkasan Pesanan</p>
              <p class="text-[11px] text-gray-400 mt-0.5">{{ activePeriod }} hari terakhir</p>
            </div>
            <div class="flex items-center gap-4 text-[11px] text-gray-400">
              <span class="flex items-center gap-1.5">
                <span class="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span>Total
              </span>
              <span class="flex items-center gap-1.5">
                <span class="w-2.5 h-2.5 rounded-full bg-orange-400 inline-block"></span>Selesai
              </span>
            </div>
          </div>
          <div class="flex gap-1 px-5 pt-3 pb-0">
            <button
              v-for="p in periodOptions" :key="p.value"
              @click="changePeriod(p.value)"
              :disabled="chartLoading"
              :class="['text-[11px] font-semibold px-3 py-1 rounded-md transition disabled:opacity-50',
                activePeriod === p.value ? 'bg-gray-900 text-white' : 'text-gray-400 hover:bg-gray-100']">
              {{ p.label }}
            </button>
          </div>
          <div class="p-4 pt-3 relative">
            <div v-if="chartLoading" class="absolute inset-0 flex items-center justify-center bg-white/80 z-10 rounded-b-xl">
              <span class="text-xs text-gray-400">Memuat grafik...</span>
            </div>
            <canvas ref="chartRef" height="150"></canvas>
          </div>
        </div>

        <!-- Right Panel -->
        <div class="lg:col-span-2 flex flex-col gap-4">
          <!-- System card -->
          <div class="rounded-xl p-5 relative overflow-hidden text-white flex-1"
            style="background: linear-gradient(135deg, #111827 0%, #1f2937 55%, #111827 100%)">
            <div class="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5"></div>
            <div class="relative z-10">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                  </svg>
                </div>
                <div>
                  <p class="font-bold text-sm leading-tight">Catering Family</p>
                  <p class="text-[10px] text-white/40 font-medium">Jakarta · Production</p>
                </div>
              </div>
              <div class="grid grid-cols-3 gap-2 mb-4">
                <div v-for="h in heroStats" :key="h.label" class="bg-white/10 rounded-lg p-2.5 text-center">
                  <div class="text-sm font-bold leading-tight tabular-nums">{{ h.value }}</div>
                  <div class="text-[9px] text-white/40 mt-0.5">{{ h.label }}</div>
                </div>
              </div>
              <div v-if="avgRating" class="text-xs text-white/40 mb-3 font-medium">
                {{ avgRating }}/5 · {{ totalReviews }} ulasan
              </div>
              <div class="flex flex-wrap gap-x-4 gap-y-1">
                <div class="flex items-center gap-2 text-[10px]">
                  <span class="text-white/40">Stack</span>
                  <span class="text-white/70 font-semibold">Laravel + Vue 3</span>
                </div>
                <div class="text-[10px]">
                  <span class="inline-flex items-center gap-1 bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full font-semibold">
                    <span class="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block"></span> Online
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="bg-white rounded-xl border border-gray-200/80 overflow-hidden">
            <div class="px-4 py-3 border-b border-gray-100 font-semibold text-xs text-gray-700 uppercase tracking-wide">Aksi Cepat</div>
            <div class="p-1.5 space-y-0.5">
              <RouterLink v-for="qa in quickActions" :key="qa.to" :to="qa.to"
                class="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-gray-50 transition group">
                <div :class="['w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0', qa.bg]" v-html="qa.icon"></div>
                <div class="flex-1 min-w-0">
                  <p class="text-xs font-semibold text-gray-700 group-hover:text-red-600 transition">{{ qa.title }}</p>
                  <p class="text-[10px] text-gray-400">{{ qa.desc }}</p>
                </div>
                <svg class="w-3.5 h-3.5 text-gray-300 group-hover:text-red-400 transition" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
                </svg>
              </RouterLink>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Orders Table -->
      <div class="bg-white rounded-xl border border-gray-200/80 overflow-hidden">
        <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <p class="font-semibold text-sm text-gray-800">Pesanan Terbaru</p>
            <p class="text-[11px] text-gray-400 mt-0.5">Daftar pesanan masuk terkini</p>
          </div>
          <RouterLink to="/admin/orders"
            class="text-xs text-red-600 border border-red-200 bg-red-50 px-3 py-1.5 rounded-lg font-semibold hover:bg-red-100 transition">
            Lihat Semua
          </RouterLink>
        </div>

        <div v-if="recentOrders.length === 0" class="text-center py-14 text-gray-300">
          <svg class="w-10 h-10 mx-auto mb-3 text-gray-200" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
          </svg>
          <p class="text-xs font-medium text-gray-400">Belum ada pesanan</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full text-xs">
            <thead>
              <tr class="bg-gray-50 border-b border-gray-100">
                <th class="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">No. Pesanan</th>
                <th class="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">Pelanggan</th>
                <th class="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">Total</th>
                <th class="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</th>
                <th class="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">Tanggal</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr v-for="o in recentOrders" :key="o.id" class="hover:bg-gray-50/60 transition-colors">
                <td class="px-5 py-3.5">
                  <RouterLink :to="`/admin/orders/${o.id}`" class="font-bold text-red-600 hover:underline font-mono text-[11px]">
                    {{ o.order_number }}
                  </RouterLink>
                </td>
                <td class="px-5 py-3.5">
                  <div class="flex items-center gap-2">
                    <div class="w-6 h-6 rounded-md bg-red-100 flex items-center justify-center text-red-600 font-bold text-[9px] flex-shrink-0">
                      {{ (o.customer || 'G')[0].toUpperCase() }}
                    </div>
                    <span class="font-medium text-gray-700 truncate max-w-[100px]">{{ o.customer || 'Guest' }}</span>
                  </div>
                </td>
                <td class="px-5 py-3.5 font-bold text-gray-800 tabular-nums">{{ o.total }}</td>
                <td class="px-5 py-3.5">
                  <span :class="['text-[10px] px-2 py-0.5 rounded-md font-semibold', statusClass(o.status)]">
                    {{ statusLabel(o.status) }}
                  </span>
                </td>
                <td class="px-5 py-3.5 text-gray-400">{{ o.created_at }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { getDashboard } from '@/api/admin'

const authStore = useAuthStore()
const loading     = ref(true)
const chartLoading = ref(false)
const activePeriod = ref(7)

const periodOptions = [
  { value: 7,  label: '7H' },
  { value: 30, label: '30H' },
  { value: 90, label: '90H' },
]

const stats = ref({
  total_orders: 0, total_pending: 0, total_completed: 0,
  total_revenue: 0, total_menus: 0, total_customers: 0,
  pending_payments: 0, pending_custom_menus: 0,
})
const recentOrders   = ref([])
const chartRef       = ref(null)
const chartLabels    = ref([])
const chartData      = ref([])
const chartCompleted = ref([])
const avgRating      = ref(0)
const totalReviews   = ref(0)

let chartInstance = null

const icOrders     = `<svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>`
const icPending    = `<svg class="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`
const icCompleted  = `<svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`
const icRevenue    = `<svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/></svg>`
const icMenus      = `<svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>`
const icCustomers  = `<svg class="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>`

const qaOrders  = `<svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>`
const qaPayment = `<svg class="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>`
const qaMenus   = `<svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>`

const statCards = computed(() => [
  { label: 'Total Pesanan',   value: stats.value.total_orders,    icon: icOrders,    bg: 'bg-red-50'    },
  { label: 'Menunggu',        value: stats.value.total_pending,   icon: icPending,   bg: 'bg-amber-50'  },
  { label: 'Selesai',         value: stats.value.total_completed, icon: icCompleted, bg: 'bg-green-50'  },
  { label: 'Pendapatan',      value: `Rp${(stats.value.total_revenue/1e6).toFixed(1)}jt`, icon: icRevenue, bg: 'bg-purple-50' },
  { label: 'Menu Aktif',      value: stats.value.total_menus,     icon: icMenus,     bg: 'bg-blue-50'   },
  { label: 'Pelanggan',       value: stats.value.total_customers, icon: icCustomers, bg: 'bg-teal-50'   },
])

const heroStats = computed(() => [
  { label: 'Pending',  value: stats.value.total_pending },
  { label: 'Selesai',  value: stats.value.total_completed },
  { label: 'Revenue',  value: `Rp${(stats.value.total_revenue/1e6).toFixed(1)}jt` },
])

const quickActions = [
  { to: '/admin/orders',   icon: qaOrders,  bg: 'bg-red-50',   title: 'Kelola Pesanan',   desc: 'Lihat & proses pesanan' },
  { to: '/admin/payments', icon: qaPayment, bg: 'bg-amber-50', title: 'Verifikasi Bayar', desc: 'Cek bukti pembayaran' },
  { to: '/admin/menus',    icon: qaMenus,   bg: 'bg-green-50', title: 'Tambah Menu',      desc: 'Tambah item menu baru' },
]

const statusMap = {
  pending:    { cls: 'bg-amber-100 text-amber-700',   lbl: 'Menunggu' },
  confirmed:  { cls: 'bg-blue-100 text-blue-700',     lbl: 'Dikonfirmasi' },
  processing: { cls: 'bg-purple-100 text-purple-700', lbl: 'Diproses' },
  delivered:  { cls: 'bg-teal-100 text-teal-700',     lbl: 'Dikirim' },
  completed:  { cls: 'bg-green-100 text-green-700',   lbl: 'Selesai' },
  cancelled:  { cls: 'bg-red-100 text-red-600',       lbl: 'Dibatalkan' },
}
function statusClass(s) { return (statusMap[s] || statusMap.pending).cls }
function statusLabel(s) { return (statusMap[s] || statusMap.pending).lbl }

async function fetchDashboard(period) {
  const res = await getDashboard(period)
  const d = res.data?.data || res.data || {}
  stats.value          = d.stats || stats.value
  recentOrders.value   = d.recent_orders || []
  chartLabels.value    = d.chart_labels || []
  chartData.value      = d.chart_data || []
  chartCompleted.value = d.chart_completed || []
  avgRating.value      = d.avg_rating || 0
  totalReviews.value   = d.total_reviews || 0
}

async function renderChart() {
  if (!chartRef.value) return
  const { Chart, registerables } = await import('chart.js')
  Chart.register(...registerables)
  if (chartInstance) { chartInstance.destroy(); chartInstance = null }
  const ctx = chartRef.value.getContext('2d')
  const gradRed = ctx.createLinearGradient(0, 0, 0, 180)
  gradRed.addColorStop(0, 'rgba(239,68,68,.12)')
  gradRed.addColorStop(1, 'rgba(239,68,68,0)')
  const gradOrange = ctx.createLinearGradient(0, 0, 0, 180)
  gradOrange.addColorStop(0, 'rgba(249,115,22,.08)')
  gradOrange.addColorStop(1, 'rgba(249,115,22,0)')
  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: chartLabels.value,
      datasets: [
        { label: 'Total', data: chartData.value, borderColor: '#ef4444', backgroundColor: gradRed, borderWidth: 2, fill: true, tension: 0.4, pointRadius: 3, pointBackgroundColor: '#ef4444', pointBorderColor: '#fff', pointBorderWidth: 2 },
        { label: 'Selesai', data: chartCompleted.value, borderColor: '#f97316', backgroundColor: gradOrange, borderWidth: 2, fill: true, tension: 0.4, pointRadius: 3, pointBackgroundColor: '#f97316', pointBorderColor: '#fff', pointBorderWidth: 2 },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: true,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: { backgroundColor: '#111827', titleColor: '#fff', bodyColor: 'rgba(255,255,255,.6)', padding: 10, cornerRadius: 8 },
      },
      scales: {
        x: { grid: { display: false }, border: { display: false }, ticks: { font: { size: 10 }, color: '#9CA3AF', maxRotation: 0 } },
        y: { grid: { color: '#F3F4F6' }, border: { display: false }, ticks: { font: { size: 10 }, color: '#9CA3AF', stepSize: 1 }, beginAtZero: true },
      },
    },
  })
}

async function changePeriod(period) {
  if (activePeriod.value === period || chartLoading.value) return
  activePeriod.value = period
  chartLoading.value = true
  try {
    await fetchDashboard(period)
    await nextTick()
    await renderChart()
  } catch (err) { console.error(err) }
  finally { chartLoading.value = false }
}

onMounted(async () => {
  try { await fetchDashboard(activePeriod.value) }
  catch (err) { console.error(err) }
  finally { loading.value = false }
  await nextTick()
  if (chartRef.value && chartLabels.value.length > 0) {
    try { await renderChart() } catch (err) { console.error(err) }
  }
})
</script>
