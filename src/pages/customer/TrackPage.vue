<template>
  <div class="max-w-2xl mx-auto px-4 py-10">
    <div class="mb-8">
      <p class="text-xs font-extrabold uppercase tracking-widest text-red-600 mb-1">Status Pesanan</p>
      <h1 class="text-3xl font-extrabold text-gray-900">Lacak <span class="text-red-600">Pesanan</span></h1>
      <div class="w-12 h-1 bg-gradient-to-r from-red-600 to-orange-400 rounded mt-3"></div>
      <p class="text-gray-400 text-sm mt-3">Masukkan kode pesanan untuk melihat status terkini.</p>
    </div>

    <!-- Form -->
    <div class="bg-white rounded-3xl shadow-md p-6 mb-6">
      <label class="block text-sm font-extrabold text-gray-700 mb-2">Kode Pesanan</label>
      <div class="flex gap-3">
        <input v-model="kode" type="text" placeholder="Contoh: CFJ-20240101-0001"
          class="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-red-400 transition font-mono text-sm tracking-wider uppercase"
          @keyup.enter="handleTrack" />
        <button @click="handleTrack" :disabled="loading || !kode.trim()"
          class="bg-gradient-to-r from-red-600 to-orange-500 text-white px-6 py-3 rounded-xl font-bold shadow hover:-translate-y-0.5 transition disabled:opacity-40 disabled:transform-none">
          {{ loading ? '...' : '🔍 Cari' }}
        </button>
      </div>
      <p class="text-xs text-gray-400 mt-2">ℹ️ Kode dikirimkan saat pesanan berhasil dibuat.</p>
      <p v-if="error" class="text-red-500 text-sm mt-3 font-semibold bg-red-50 px-4 py-2 rounded-xl">⚠️ {{ error }}</p>
    </div>

    <!-- Hasil -->
    <div v-if="order" class="bg-white rounded-3xl shadow-md overflow-hidden">
      <!-- Status banner -->
      <div :class="['px-6 py-5 text-white text-center', statusBg(order.status)]">
        <div class="text-3xl mb-2">{{ statusIcon(order.status) }}</div>
        <p class="font-extrabold text-lg">{{ order.status_label }}</p>
        <p class="text-sm opacity-75 mt-1">Pesanan #{{ order.order_number }}</p>
      </div>

      <!-- Info Grid — LENGKAP dengan pax & alamat -->
      <div class="grid grid-cols-2 gap-4 px-6 py-5 border-b text-sm">
        <div>
          <p class="text-xs text-gray-400 font-semibold mb-1">Nama Pemesan</p>
          <p class="font-bold text-gray-800">{{ order.nama_pemesan || '-' }}</p>
        </div>
        <div>
          <p class="text-xs text-gray-400 font-semibold mb-1">No. HP</p>
          <p class="font-bold text-gray-800">{{ order.no_hp || '-' }}</p>
        </div>
        <div>
          <p class="text-xs text-gray-400 font-semibold mb-1">Tanggal Acara</p>
          <p class="font-bold text-gray-800">{{ order.event_date }}</p>
        </div>
        <div>
          <p class="text-xs text-gray-400 font-semibold mb-1">Jumlah Pax</p>
          <p class="font-bold text-gray-800">{{ order.total_pax ? order.total_pax + ' orang' : '-' }}</p>
        </div>
        <div class="col-span-2">
          <p class="text-xs text-gray-400 font-semibold mb-1">Alamat Acara</p>
          <p class="font-bold text-gray-800">
            {{ order.event_address ? order.event_address + (order.event_city ? ', ' + order.event_city : '') : '-' }}
          </p>
        </div>
        <div>
          <p class="text-xs text-gray-400 font-semibold mb-1">Total Pembayaran</p>
          <p class="font-extrabold text-red-600">{{ order.total }}</p>
        </div>
        <div>
          <p class="text-xs text-gray-400 font-semibold mb-1">Jumlah Item</p>
          <p class="font-bold text-gray-800">{{ order.items_count }} jenis menu</p>
        </div>
        <div class="col-span-2">
          <p class="text-xs text-gray-400 font-semibold mb-1">Dipesan pada</p>
          <p class="font-bold text-gray-800">{{ order.created_at }}</p>
        </div>
      </div>

      <!-- Timeline -->
      <div v-if="order.status !== 'cancelled'" class="px-6 py-5 border-b">
        <p class="text-xs font-extrabold uppercase tracking-wider text-gray-400 mb-5">Alur Status</p>
        <div class="flex items-start">
          <div v-for="(step, i) in statusSteps" :key="step.key" class="flex-1 flex flex-col items-center relative">
            <div v-if="i < statusSteps.length - 1"
              class="absolute top-4 left-1/2 w-full h-0.5 z-0"
              :class="isStepDone(statusSteps[i+1].key) ? 'bg-gradient-to-r from-red-500 to-orange-400' : 'bg-gray-100'">
            </div>
            <div :class="['w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold relative z-10 border-2 transition',
              isCurrentStep(step.key)
                ? 'bg-gradient-to-br from-red-600 to-orange-400 border-transparent text-white shadow-md ring-4 ring-red-100'
                : isStepDone(step.key)
                ? 'bg-gradient-to-br from-red-600 to-orange-400 border-transparent text-white shadow-md'
                : 'bg-white border-gray-200 text-gray-300']">
              <span v-if="isStepDone(step.key)">✓</span>
              <span v-else class="text-xs">{{ i + 1 }}</span>
            </div>
            <p :class="['text-xs font-bold text-center leading-tight mt-2 w-14',
              isCurrentStep(step.key) ? 'text-red-600' : isStepDone(step.key) ? 'text-gray-600' : 'text-gray-300']">
              {{ step.label }}
            </p>
          </div>
        </div>
      </div>

      <!-- Cancelled -->
      <div v-else class="mx-6 my-4 bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3 text-red-700 text-sm">
        <span class="text-2xl">❌</span>
        <div>
          <p class="font-bold">Pesanan Dibatalkan</p>
          <p v-if="order.cancelled_reason" class="text-xs opacity-75 mt-0.5">{{ order.cancelled_reason }}</p>
        </div>
      </div>

      <!-- Status Pembayaran -->
      <div v-if="order.payment" class="px-6 py-4 border-b">
        <div :class="['rounded-2xl p-4 flex items-center gap-3 text-sm font-semibold',
          order.payment.status === 'paid'
            ? 'bg-green-50 border border-green-200 text-green-700'
            : order.payment.status === 'pending_verification'
            ? 'bg-yellow-50 border border-yellow-200 text-yellow-700'
            : 'bg-gray-100 border border-gray-200 text-gray-600']">
          <span class="text-xl">💳</span>
          <div>
            <span class="font-extrabold">Pembayaran: </span>{{ order.payment.status_label }}
          </div>
        </div>
        <div v-if="order.payment.status === 'unpaid' && order.status !== 'cancelled'"
          class="mt-3 bg-orange-50 border border-orange-200 rounded-2xl p-4 text-sm">
          <p class="font-bold text-orange-700 mb-1">⚠️ Segera Selesaikan Pembayaran</p>
          <p class="text-orange-600 text-xs mb-3">Pesanan akan dibatalkan otomatis jika pembayaran belum dikonfirmasi dalam 24 jam.</p>
          <RouterLink :to="`/customer/payment/${order.id}`"
            class="inline-flex items-center gap-2 bg-orange-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-orange-600 transition">
            💳 Selesaikan Pembayaran
          </RouterLink>
        </div>
      </div>

      <!-- Footer CTA -->
      <div class="px-6 py-4 flex flex-wrap gap-3">
        <RouterLink to="/menu"
          class="flex-1 text-center border-2 border-gray-200 text-gray-500 py-2.5 rounded-xl font-semibold hover:border-red-300 hover:text-red-500 transition text-sm">
          🍱 Lihat Menu
        </RouterLink>
        <button @click="order = null; kode = ''"
          class="flex-1 text-center border-2 border-gray-200 text-gray-500 py-2.5 rounded-xl font-semibold hover:border-red-300 hover:text-red-500 transition text-sm">
          🔍 Cari Pesanan Lain
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { trackOrder } from '@/api/orders'

const kode    = ref('')
const order   = ref(null)
const loading = ref(false)
const error   = ref('')

const statusSteps = [
  { key: 'pending',    label: 'Menunggu' },
  { key: 'confirmed',  label: 'Dikonfirmasi' },
  { key: 'processing', label: 'Diproses' },
  { key: 'delivered',  label: 'Dikirim' },
  { key: 'completed',  label: 'Selesai' },
]
const statusOrder = ['pending', 'confirmed', 'processing', 'delivered', 'completed']

function isStepDone(key) {
  if (!order.value || order.value.status === 'cancelled') return false
  return statusOrder.indexOf(order.value.status) >= statusOrder.indexOf(key)
}
function isCurrentStep(key) {
  return order.value?.status === key
}

const statusBgMap = {
  pending:    'bg-gradient-to-r from-yellow-500 to-amber-400',
  confirmed:  'bg-gradient-to-r from-blue-500 to-blue-600',
  processing: 'bg-gradient-to-r from-purple-500 to-purple-600',
  delivered:  'bg-gradient-to-r from-teal-500 to-teal-600',
  completed:  'bg-gradient-to-r from-green-600 to-emerald-500',
  cancelled:  'bg-gradient-to-r from-red-600 to-red-500',
}
const statusIconMap = {
  pending: '⏳', confirmed: '✅', processing: '👨‍🍳',
  delivered: '🚚', completed: '🎉', cancelled: '❌',
}
function statusBg(s)   { return statusBgMap[s]   || 'bg-gray-500' }
function statusIcon(s) { return statusIconMap[s] || '❓' }

async function handleTrack() {
  const trimmed = kode.value.trim().toUpperCase()
  if (!trimmed) return
  loading.value = true
  error.value   = ''
  order.value   = null
  try {
    const res   = await trackOrder(trimmed)
    order.value = res.data?.data ?? res.data
  } catch (err) {
    error.value = err.response?.data?.message || 'Pesanan tidak ditemukan. Periksa kembali kode pesanan.'
  } finally {
    loading.value = false
  }
}
</script>
