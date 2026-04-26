<template>
  <div class="max-w-5xl mx-auto px-4 py-10">
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-extrabold text-gray-900">Riwayat <span class="text-red-600">Pesanan</span></h1>
        <div class="w-12 h-1 bg-gradient-to-r from-red-600 to-orange-400 rounded mt-3"></div>
      </div>
    </div>

    <!-- Filter Status -->
    <div class="flex flex-wrap gap-2 mb-5">
      <button v-for="f in statusFilters" :key="f.value"
        @click="activeFilter = f.value"
        :class="['text-xs px-4 py-1.5 rounded-full font-bold transition border-2',
          activeFilter === f.value
            ? 'bg-red-600 text-white border-red-600 shadow'
            : 'bg-white text-gray-500 border-gray-200 hover:border-red-300 hover:text-red-500']">
        {{ f.label }}
        <span v-if="f.value !== '' && statusCount(f.value) > 0" class="ml-1 opacity-70">({{ statusCount(f.value) }})</span>
      </button>
    </div>

    <div v-if="loading" class="text-center text-gray-400 py-20 animate-pulse">Memuat pesanan...</div>

    <div v-else-if="filteredOrders.length === 0" class="bg-white rounded-3xl shadow-md text-center py-16 px-6 max-w-md mx-auto">
      <div class="text-6xl opacity-40 mb-4">📋</div>
      <h5 class="text-xl font-extrabold text-gray-700 mb-2">
        {{ activeFilter ? 'Tidak ada pesanan ' + statusLabel(activeFilter) : 'Belum ada pesanan' }}
      </h5>
      <p class="text-gray-400 text-sm mb-6">Yuk, mulai pesan catering untuk acara Anda!</p>
      <RouterLink to="/menu" class="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-orange-500 text-white px-7 py-3 rounded-full font-bold shadow">
        🍱 Lihat Menu
      </RouterLink>
    </div>

    <div v-else class="space-y-3">
      <div v-for="order in filteredOrders" :key="order.id"
        class="bg-white rounded-2xl shadow-sm border border-gray-50 overflow-hidden hover:shadow-md transition">
        <div class="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
          <div class="flex items-center gap-4">
            <div class="w-11 h-11 rounded-xl bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center text-xl flex-shrink-0">🍱</div>
            <div>
              <p class="font-black text-red-600 font-mono text-sm">{{ order.order_number }}</p>
              <p class="text-xs text-gray-400 mt-0.5">Dipesan {{ formatDate(order.created_at) }}</p>
            </div>
          </div>

          <div class="flex items-center gap-4 flex-wrap">
            <div class="text-right">
              <p class="font-extrabold text-gray-800">{{ formatRupiah(order.total_price) }}</p>
              <p class="text-xs text-gray-400">Acara: {{ formatDate(order.event_date) }}</p>
            </div>
            <span :class="['text-xs px-3 py-1.5 rounded-full font-bold', statusClass(order.status)]">
              {{ statusLabel(order.status) }}
            </span>
            <RouterLink :to="`/customer/orders/${order.id}`"
              class="inline-flex items-center gap-1 text-sm border-2 border-red-200 text-red-600 px-4 py-1.5 rounded-full hover:bg-red-50 font-semibold transition">
              Detail →
            </RouterLink>
          </div>
        </div>

        <!-- Payment status bar -->
        <div v-if="order.payment" :class="['text-xs px-5 py-2 border-t flex items-center gap-2',
          order.payment.status === 'paid' ? 'bg-green-50 border-green-100 text-green-700' :
          order.payment.status === 'pending_verification' ? 'bg-yellow-50 border-yellow-100 text-yellow-700' :
          'bg-gray-50 border-gray-100 text-gray-500']">
          <span>💳</span>
          <span class="font-semibold">
            {{ order.payment.status === 'paid' ? 'Pembayaran dikonfirmasi' :
               order.payment.status === 'pending_verification' ? 'Bukti pembayaran sedang diverifikasi' :
               'Belum melakukan pembayaran' }}
          </span>
          <RouterLink v-if="order.payment.status === 'unpaid'" :to="`/customer/payment/${order.id}`"
            class="ml-auto font-bold underline">Bayar sekarang →</RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getOrders } from '@/api/orders'

const orders      = ref([])
const loading     = ref(true)
const activeFilter = ref('')

const statusFilters = [
  { value: '',           label: 'Semua' },
  { value: 'pending',    label: '⏳ Menunggu' },
  { value: 'confirmed',  label: '✅ Dikonfirmasi' },
  { value: 'processing', label: '🔄 Diproses' },
  { value: 'delivered',  label: '🚚 Dikirim' },
  { value: 'completed',  label: '🎉 Selesai' },
  { value: 'cancelled',  label: '❌ Dibatalkan' },
]

const statusMap = {
  pending:    { cls: 'bg-yellow-100 text-yellow-700', lbl: 'Menunggu' },
  confirmed:  { cls: 'bg-blue-100 text-blue-700',     lbl: 'Dikonfirmasi' },
  processing: { cls: 'bg-purple-100 text-purple-700', lbl: 'Diproses' },
  delivered:  { cls: 'bg-teal-100 text-teal-700',     lbl: 'Dikirim' },
  completed:  { cls: 'bg-green-100 text-green-800',   lbl: 'Selesai' },
  cancelled:  { cls: 'bg-red-100 text-red-600',       lbl: 'Dibatalkan' },
}

function statusClass(s) { return (statusMap[s] || statusMap.pending).cls }
function statusLabel(s) { return (statusMap[s] || statusMap.pending).lbl }
function statusCount(s) { return orders.value.filter(o => o.status === s).length }
function formatRupiah(v) { return new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',minimumFractionDigits:0}).format(v) }
function formatDate(d) { return new Date(d).toLocaleDateString('id-ID',{day:'2-digit',month:'short',year:'numeric'}) }

const filteredOrders = computed(() =>
  activeFilter.value ? orders.value.filter(o => o.status === activeFilter.value) : orders.value
)

onMounted(async () => {
  try {
    const res = await getOrders()
    const payload = res.data?.data ?? res.data
    orders.value = Array.isArray(payload) ? payload : (payload?.data ?? [])
  } catch { orders.value = [] } finally { loading.value = false }
})
</script>
