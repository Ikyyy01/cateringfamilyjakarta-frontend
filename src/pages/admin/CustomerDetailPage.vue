<template>
  <div>
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
      <div>
        <p class="text-xs text-gray-400 font-semibold mb-0.5">Panel Admin › Pelanggan › Detail</p>
        <h1 class="text-2xl font-extrabold text-gray-800">Detail Pelanggan</h1>
      </div>
      <RouterLink to="/admin/customers" class="text-sm text-gray-400 hover:text-red-500 transition">← Kembali</RouterLink>
    </div>

    <div v-if="loading" class="text-center py-20 text-gray-400 animate-pulse">Memuat data...</div>

    <div v-else-if="data" class="grid lg:grid-cols-3 gap-5">
      <!-- Kiri: Info Pelanggan -->
      <div class="space-y-5">
        <div class="bg-white rounded-2xl shadow-sm p-6 text-center">
          <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-orange-400 flex items-center justify-center text-white font-black text-2xl mx-auto mb-4">
            {{ customerInitial(data.customer) }}
          </div>
          <p class="font-extrabold text-gray-800 text-lg">{{ customerName(data.customer) }}</p>
          <p class="text-xs text-gray-400 mt-1">{{ data.customer.no_hp || 'No HP belum diisi' }}</p>
          <p class="text-xs text-gray-400">{{ data.customer.user_id ? `User #${data.customer.user_id}` : 'Guest' }}</p>
          <div class="grid grid-cols-3 gap-2 mt-5">
            <div class="bg-red-50 rounded-xl p-2.5 text-center">
              <p class="text-lg font-black text-red-600">{{ data.total_orders }}</p>
              <p class="text-[10px] text-gray-400">Pesanan</p>
            </div>
            <div class="bg-green-50 rounded-xl p-2.5 text-center">
              <p class="text-lg font-black text-green-600">{{ data.total_completed }}</p>
              <p class="text-[10px] text-gray-400">Selesai</p>
            </div>
            <div class="bg-purple-50 rounded-xl p-2.5 text-center">
              <p class="text-sm font-black text-purple-600">{{ formatRupiah(data.total_spent) }}</p>
              <p class="text-[10px] text-gray-400">Total</p>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-2xl shadow-sm p-5">
          <p class="text-xs font-black uppercase tracking-wider text-gray-400 mb-3">Info Pelanggan</p>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between"><span class="text-gray-400">Order Terakhir</span><span class="font-bold">{{ data.customer.latest_order_at ? formatDate(data.customer.latest_order_at) : '—' }}</span></div>
            <div class="flex justify-between"><span class="text-gray-400">Tipe</span><span class="font-bold text-right max-w-[180px]">{{ data.customer.user_id ? 'User' : 'Guest' }}</span></div>
          </div>
          <RouterLink v-if="isGuest" :to="`/admin/orders?search=${encodeURIComponent(data.customer.no_hp || data.customer.nama_pemesan || '')}`" class="block mt-4 text-center text-xs border-2 border-gray-200 text-gray-500 px-3 py-2 rounded-xl font-bold hover:border-red-300 hover:text-red-500 transition">
            Lihat Pesanan Guest →
          </RouterLink>
        </div>
      </div>

      <!-- Kanan: Riwayat Pesanan -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div class="px-5 py-4 border-b border-gray-50 font-extrabold text-sm text-gray-800">️ Riwayat Pesanan</div>
          <div v-if="!data.orders?.data?.length" class="text-center py-12 text-gray-300">
            <div class="text-3xl mb-2"></div><p class="text-sm">Belum ada pesanan</p>
          </div>
          <div v-else class="overflow-x-auto">
            <table class="w-full min-w-[560px] text-sm">
              <thead class="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-black uppercase text-gray-400">No. Pesanan</th>
                  <th class="px-4 py-3 text-left text-xs font-black uppercase text-gray-400">Total</th>
                  <th class="px-4 py-3 text-left text-xs font-black uppercase text-gray-400">Status</th>
                  <th class="px-4 py-3 text-left text-xs font-black uppercase text-gray-400">Tanggal</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-50">
                <tr v-for="o in data.orders.data" :key="o.id" class="hover:bg-gray-50/50">
                  <td class="px-4 py-3"><RouterLink :to="`/admin/orders/${o.id}`" class="font-bold text-red-600 hover:underline font-mono text-xs">{{ o.order_number }}</RouterLink></td>
                  <td class="px-4 py-3 font-bold">{{ formatRupiah(o.total_price) }}</td>
                  <td class="px-4 py-3"><span :class="['text-xs px-2.5 py-1 rounded-full font-bold', statusClass(o.status)]">{{ statusLabel(o.status) }}</span></td>
                  <td class="px-4 py-3 text-xs text-gray-400">{{ formatDate(o.created_at) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getCustomer } from '@/api/admin'

const route = useRoute()
const data    = ref(null)
const loading = ref(true)
const isGuest = computed(() => route.params.id === 'guest')
const guestCustomer = computed(() => ({
  nama_pemesan: route.query.nama_pemesan || 'Guest',
  no_hp: route.query.no_hp || '—',
  user_id: null,
  orders_count: Number(route.query.orders_count || 0),
  latest_order_at: route.query.latest_order_at || null,
}))

const statusMap = {
  pending: { cls: 'bg-yellow-100 text-yellow-700', lbl: 'Menunggu' },
  confirmed: { cls: 'bg-blue-100 text-blue-700', lbl: 'Dikonfirmasi' },
  processing: { cls: 'bg-purple-100 text-purple-700', lbl: 'Diproses' },
  delivered: { cls: 'bg-teal-100 text-teal-700', lbl: 'Dikirim' },
  completed: { cls: 'bg-green-100 text-green-700', lbl: 'Selesai' },
  cancelled: { cls: 'bg-red-100 text-red-600', lbl: 'Dibatalkan' },
}
function statusClass(s) { return (statusMap[s] || statusMap.pending).cls }
function statusLabel(s) { return (statusMap[s] || statusMap.pending).lbl }
function formatRupiah(v) { return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(v || 0) }
function formatDate(d) { return new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) }
function customerName(c) { return c?.nama_pemesan || c?.name || 'Guest' }
function customerInitial(c) { return customerName(c)[0]?.toUpperCase() || 'G' }

function normalizeCustomerDetail(payload) {
  if (payload?.customer) return payload
  const user = payload?.user || {}
  return {
    ...payload,
    customer: {
      nama_pemesan: user.name || payload?.nama_pemesan || 'Guest',
      no_hp: user.phone || payload?.no_hp || null,
      user_id: user.id || payload?.user_id || null,
      latest_order_at: payload?.latest_order_at || user.created_at || null,
    },
  }
}

onMounted(async () => {
  if (isGuest.value) {
    data.value = {
      customer: guestCustomer.value,
      orders: { data: [] },
      total_spent: 0,
      total_orders: guestCustomer.value.orders_count,
      total_completed: 0,
    }
    loading.value = false
    return
  }

  try { const res = await getCustomer(route.params.id); data.value = normalizeCustomerDetail(res.data?.data ?? res.data) }
  catch {} finally { loading.value = false }
})
</script>
