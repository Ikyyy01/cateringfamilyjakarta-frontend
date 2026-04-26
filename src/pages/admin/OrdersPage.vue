<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <p class="text-xs text-gray-400 font-medium mb-0.5">Admin / Pesanan</p>
        <h1 class="text-xl font-bold text-gray-900">Kelola Pesanan</h1>
      </div>
    </div>

    <!-- Filter -->
    <div class="bg-white rounded-xl border border-gray-200/80 p-4 mb-5 flex flex-wrap gap-3">
      <div class="flex-1 min-w-[180px] relative">
        <svg class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <input v-model="search" @keyup.enter="fetchOrders" type="text" placeholder="Cari nama atau no. pesanan..."
          class="w-full border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-100 transition" />
      </div>
      <select v-model="filterStatus"
        class="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-100 transition bg-white text-gray-700">
        <option value="">Semua Status</option>
        <option value="pending">Menunggu</option>
        <option value="confirmed">Dikonfirmasi</option>
        <option value="processing">Diproses</option>
        <option value="delivered">Dikirim</option>
        <option value="completed">Selesai</option>
        <option value="cancelled">Dibatalkan</option>
      </select>
      <button @click="fetchOrders"
        class="bg-red-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition">
        Filter
      </button>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-xl border border-gray-200/80 overflow-hidden">
      <div v-if="loading" class="flex items-center justify-center py-16 text-gray-400">
        <div class="w-6 h-6 border-2 border-gray-200 border-t-red-500 rounded-full animate-spin mr-3"></div>
        <span class="text-sm">Memuat pesanan...</span>
      </div>
      <div v-else-if="orders.length === 0" class="text-center py-16 text-gray-300">
        <svg class="w-10 h-10 mx-auto mb-3 text-gray-200" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
        </svg>
        <p class="font-medium text-sm text-gray-400">Tidak ada pesanan ditemukan</p>
      </div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 border-b border-gray-100">
            <tr>
              <th class="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">No. Pesanan</th>
              <th class="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">Pelanggan</th>
              <th class="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">Tgl Acara</th>
              <th class="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">Total</th>
              <th class="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">Pembayaran</th>
              <th class="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">Status</th>
              <th class="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="order in orders" :key="order.id" class="hover:bg-gray-50/60 transition-colors">
              <td class="px-4 py-3">
                <span class="font-bold text-red-600 text-xs font-mono">{{ order.order_number }}</span>
                <div class="text-xs text-gray-400 mt-0.5">{{ formatDate(order.created_at) }}</div>
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center gap-2.5">
                  <div class="w-7 h-7 rounded-md bg-red-100 flex items-center justify-center text-red-600 font-bold text-xs flex-shrink-0">
                    {{ (order.nama_pemesan_display || order.user?.name || 'G')[0].toUpperCase() }}
                  </div>
                  <div>
                    <p class="font-semibold text-sm text-gray-800">{{ order.nama_pemesan_display || order.user?.name || 'Guest' }}</p>
                    <p class="text-xs text-gray-400">{{ order.no_hp || order.user?.phone || '-' }}</p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 text-sm text-gray-600">{{ formatDate(order.event_date) }}</td>
              <td class="px-4 py-3 font-bold text-gray-900 tabular-nums">{{ formatRupiah(order.total_price) }}</td>
              <td class="px-4 py-3">
                <span :class="['text-[10px] px-2 py-0.5 rounded-md font-semibold', paymentClass(order.payment?.status)]">
                  {{ paymentLabel(order.payment?.status) }}
                </span>
              </td>
              <td class="px-4 py-3">
                <span :class="['text-[10px] px-2 py-0.5 rounded-md font-semibold', statusClass(order.status)]">
                  {{ statusLabel(order.status) }}
                </span>
              </td>
              <td class="px-4 py-3">
                <RouterLink :to="`/admin/orders/${order.id}`"
                  class="text-xs text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 hover:border-gray-300 font-medium transition">
                  Detail
                </RouterLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="pagination && pagination.last_page > 1" class="flex items-center justify-between px-5 py-3.5 border-t border-gray-100">
        <p class="text-xs text-gray-400">
          Halaman {{ pagination.current_page }} dari {{ pagination.last_page }}
          <span class="text-gray-300 mx-1">·</span>
          {{ pagination.total }} pesanan
        </p>
        <div class="flex gap-1.5">
          <button @click="changePage(pagination.current_page - 1)" :disabled="pagination.current_page <= 1"
            class="px-3 py-1.5 text-xs border border-gray-200 rounded-lg font-medium disabled:opacity-30 hover:border-gray-300 hover:bg-gray-50 transition">
            Sebelumnya
          </button>
          <button @click="changePage(pagination.current_page + 1)" :disabled="pagination.current_page >= pagination.last_page"
            class="px-3 py-1.5 text-xs border border-gray-200 rounded-lg font-medium disabled:opacity-30 hover:border-gray-300 hover:bg-gray-50 transition">
            Berikutnya
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getAdminOrders } from '@/api/admin'

const orders = ref([])
const pagination = ref(null)
const loading = ref(true)
const search = ref('')
const filterStatus = ref('')
const currentPage = ref(1)

const statusMap = {
  pending:    { cls: 'bg-amber-100 text-amber-700', lbl: 'Menunggu' },
  confirmed:  { cls: 'bg-blue-100 text-blue-700',     lbl: 'Dikonfirmasi' },
  processing: { cls: 'bg-purple-100 text-purple-700', lbl: 'Diproses' },
  delivered:  { cls: 'bg-teal-100 text-teal-700',     lbl: 'Dikirim' },
  completed:  { cls: 'bg-green-100 text-green-700',   lbl: 'Selesai' },
  cancelled:  { cls: 'bg-red-100 text-red-600',       lbl: 'Dibatalkan' },
}
const paymentMap = {
  unpaid:               { cls: 'bg-gray-100 text-gray-500',     lbl: 'Belum Bayar' },
  pending_verification: { cls: 'bg-amber-100 text-amber-700',   lbl: 'Menunggu Verifikasi' },
  paid:                 { cls: 'bg-green-100 text-green-700',   lbl: 'Lunas' },
  failed:               { cls: 'bg-red-100 text-red-600',       lbl: 'Gagal' },
}

function statusClass(s) { return (statusMap[s] || statusMap.pending).cls }
function statusLabel(s) { return (statusMap[s] || statusMap.pending).lbl }
function paymentClass(s) { return (paymentMap[s] || paymentMap.unpaid).cls }
function paymentLabel(s) { return (paymentMap[s] || paymentMap.unpaid).lbl }
function formatRupiah(val) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val)
}
function formatDate(d) {
  return new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}

async function fetchOrders() {
  loading.value = true
  try {
    const res = await getAdminOrders({ search: search.value || undefined, status: filterStatus.value || undefined, page: currentPage.value })
    const data = res.data.data || res.data
    orders.value = data.data || data
    if (data.meta || data.current_page) {
      pagination.value = data.meta || { current_page: data.current_page, last_page: data.last_page, total: data.total }
    }
  } catch { orders.value = [] }
  finally { loading.value = false }
}

function changePage(page) { currentPage.value = page; fetchOrders() }
onMounted(() => fetchOrders())
</script>
