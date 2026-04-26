<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <p class="text-xs text-gray-400 font-semibold mb-0.5">Panel Admin › Pembayaran</p>
        <h1 class="text-2xl font-extrabold text-gray-800">Verifikasi Pembayaran</h1>
      </div>
    </div>

    <!-- Filter -->
    <div class="bg-white rounded-2xl shadow-sm p-4 mb-5 flex gap-3">
      <select v-model="filterStatus"
        class="border-2 border-gray-100 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-red-300 transition bg-white">
        <option value="">Semua Status</option>
        <option value="unpaid">Belum Bayar</option>
        <option value="pending_verification">Menunggu Verifikasi</option>
        <option value="paid">Lunas</option>
        <option value="failed">Gagal</option>
      </select>
      <button @click="fetchPayments"
        class="bg-red-600 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-red-700 transition">
        Filter
      </button>
    </div>

    <div v-if="loading" class="text-center py-16 text-gray-400">Memuat...</div>
    <div v-else-if="payments.length === 0" class="text-center py-16 text-gray-300">
      <div class="text-4xl mb-3">💳</div>
      <p class="font-semibold">Tidak ada data pembayaran</p>
    </div>

    <div v-else class="space-y-4">
      <div v-for="p in payments" :key="p.id" class="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div class="flex flex-col md:flex-row">

          <!-- Bukti (kiri) -->
          <div class="md:w-56 flex-shrink-0 bg-gray-50 flex items-center justify-center p-4 border-b md:border-b-0 md:border-r border-gray-100 min-h-[180px]">
            <template v-if="p.proof_image">
              <a :href="storageUrl(p.proof_image)" target="_blank" class="block group">
                <img
                  :src="storageUrl(p.proof_image)"
                  alt="Bukti Pembayaran"
                  class="max-h-44 w-auto mx-auto rounded-xl object-contain shadow-sm group-hover:scale-105 transition-transform cursor-zoom-in"
                  @error="onImgError($event)"
                />
                <p class="text-center text-xs text-blue-500 mt-2 font-semibold group-hover:underline">
                  🔍 Klik untuk perbesar
                </p>
              </a>
            </template>
            <div v-else class="text-center text-gray-300">
              <div class="text-4xl mb-2">🖼️</div>
              <p class="text-xs font-semibold">Belum ada bukti</p>
            </div>
          </div>

          <!-- Info (kanan) -->
          <div class="flex-1 p-5 flex flex-col justify-between gap-4">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p class="text-xs text-gray-400 mb-1">No. Pesanan</p>
                <RouterLink :to="`/admin/orders/${p.order?.id}`"
                  class="font-bold text-red-600 hover:underline font-mono text-xs">
                  {{ p.order?.order_number || '-' }}
                </RouterLink>
                <p class="text-xs text-gray-400 mt-0.5">{{ formatDate(p.created_at) }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-400 mb-1">Pelanggan</p>
                <p class="font-bold">{{ p.order?.nama_pemesan || p.order?.user?.name || 'Guest' }}</p>
                <p class="text-xs text-gray-400">{{ p.order?.no_hp || p.order?.user?.phone || '-' }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-400 mb-1">Jumlah Transfer</p>
                <p class="font-extrabold text-red-600 text-base">{{ formatRupiah(p.amount) }}</p>
                <p class="text-xs text-gray-400 capitalize">{{ p.method || 'transfer bank' }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-400 mb-1">Status</p>
                <span :class="['text-xs px-2.5 py-1 rounded-full font-bold', paymentClass(p.status)]">
                  {{ paymentLabel(p.status) }}
                </span>
              </div>
            </div>

            <!-- Aksi -->
            <div class="flex gap-2 flex-wrap">
              <template v-if="p.status === 'pending_verification'">
                <button @click="handleVerify(p.id)"
                  class="inline-flex items-center gap-1.5 bg-green-600 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-green-700 transition shadow-sm">
                  ✅ Verifikasi — Tandai Lunas
                </button>
                <button @click="handleReject(p.id)"
                  class="inline-flex items-center gap-1.5 bg-red-500 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-red-600 transition shadow-sm">
                  ❌ Tolak Pembayaran
                </button>
              </template>
              <span v-else-if="p.status === 'paid'"
                class="inline-flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-xl text-sm font-bold">
                ✅ Pembayaran Terverifikasi
              </span>
              <span v-else-if="p.status === 'failed'"
                class="inline-flex items-center gap-1.5 bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-xl text-sm font-bold">
                ❌ Pembayaran Ditolak
              </span>
              <a v-if="p.proof_image" :href="storageUrl(p.proof_image)" target="_blank"
                class="inline-flex items-center gap-1.5 border-2 border-gray-200 text-gray-500 px-4 py-2 rounded-xl text-sm font-bold hover:border-blue-300 hover:text-blue-500 transition">
                🖼️ Buka Fullscreen
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getAdminPayments, verifyPayment, rejectPayment } from '@/api/admin'
import { storageUrl } from '@/api/helpers'

const payments = ref([])
const loading = ref(true)
const filterStatus = ref('')

const paymentMap = {
  unpaid:               { cls: 'bg-gray-100 text-gray-500',     lbl: 'Belum Bayar' },
  pending_verification: { cls: 'bg-yellow-100 text-yellow-700', lbl: 'Menunggu Verifikasi' },
  paid:                 { cls: 'bg-green-100 text-green-700',   lbl: 'Lunas' },
  failed:               { cls: 'bg-red-100 text-red-600',       lbl: 'Gagal' },
}

function paymentClass(s) { return (paymentMap[s] || paymentMap.unpaid).cls }
function paymentLabel(s) { return (paymentMap[s] || paymentMap.unpaid).lbl }
function formatRupiah(val) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val)
}
function formatDate(d) {
  return new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}

// Fallback kalau gambar error
function onImgError(e) {
  e.target.style.display = 'none'
  e.target.nextElementSibling && (e.target.nextElementSibling.style.display = 'block')
}

async function fetchPayments() {
  loading.value = true
  try {
    const res = await getAdminPayments({ status: filterStatus.value || undefined })
    const data = res.data.data || res.data
    payments.value = data.data || data
  } catch {
    payments.value = []
  } finally {
    loading.value = false
  }
}

async function handleVerify(id) {
  if (!confirm('Verifikasi pembayaran ini sebagai LUNAS?')) return
  await verifyPayment(id)
  await fetchPayments()
}

async function handleReject(id) {
  if (!confirm('Tolak pembayaran ini?')) return
  await rejectPayment(id)
  await fetchPayments()
}

onMounted(() => fetchPayments())
</script>
