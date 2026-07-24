<template>
  <div class="max-w-2xl mx-auto px-4 py-10">
    <!-- Header -->
    <div class="text-center mb-8">
      <div class="text-5xl mb-4" style="filter:drop-shadow(0 4px 16px rgba(192,57,43,.25))">✨</div>
      <h1 class="text-2xl font-extrabold text-gray-800 mb-1">Selesaikan Pembayaran</h1>
      <p v-if="payment?.order_number" class="text-gray-400">
        Pesanan <strong class="text-red-600">#{{ payment.order_number }}</strong>
      </p>
    </div>

    <div v-if="loading" class="text-center text-gray-400 py-20">
      <div class="text-4xl opacity-30 animate-pulse mb-3">⏳</div>
      Memuat data pembayaran...
    </div>

    <!-- SUDAH LUNAS -->
    <div v-else-if="payment?.payment?.status === 'paid'"
      class="bg-white rounded-3xl shadow-md text-center p-12">
      <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-5">✅</div>
      <h2 class="text-xl font-extrabold mb-2 text-gray-800">Pembayaran Lunas!</h2>
      <p class="text-gray-400 leading-relaxed mb-6">
        Terima kasih! Pesanan Anda sedang diproses oleh tim kami.<br>
        Lacak status pesanan menggunakan kode di bawah.
      </p>
      <div class="inline-block bg-red-50 border border-red-200 rounded-2xl px-8 py-4 mb-6">
        <p class="text-xs text-gray-400 mb-1">Kode Pesanan Anda</p>
        <p class="text-2xl font-extrabold font-mono text-red-600">{{ payment.order_number }}</p>
        <p class="text-xs text-gray-400 mt-1">Simpan kode ini untuk melacak pesanan</p>
      </div>
      <RouterLink to="/track"
        class="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-orange-500 text-white px-7 py-3 rounded-full font-bold shadow hover:-translate-y-0.5 transition">
        🚀 Lacak Pesanan
      </RouterLink>
    </div>

    <!-- MENUNGGU VERIFIKASI -->
    <div v-else-if="payment?.payment?.status === 'pending_verification'"
      class="bg-white rounded-3xl shadow-md text-center p-12">
      <div class="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-5">🔍</div>
      <h2 class="text-xl font-extrabold mb-2 text-gray-800">Bukti Sedang Diverifikasi</h2>
      <p class="text-gray-400 leading-relaxed mb-6">
        Tim kami akan memverifikasi pembayaran Anda dalam <strong>1×24 jam</strong>.<br>
        Simpan kode pesanan untuk memantau statusnya.
      </p>

      <!-- Auto Redirect Message -->
      <div v-if="autoRedirectCountdown > 0" class="mb-6 py-3 px-4 bg-blue-50 border border-blue-100 rounded-2xl text-blue-600 text-sm font-semibold animate-pulse">
        Otomatis pindah ke halaman pelacakan dalam {{ autoRedirectCountdown }} detik...
      </div>

      <div class="inline-block bg-red-50 border border-red-200 rounded-2xl px-8 py-4 mb-6">
        <p class="text-xs text-gray-400 mb-1">Kode Pesanan Anda</p>
        <p class="text-2xl font-extrabold font-mono text-red-600">{{ payment.order_number }}</p>
      </div>
      <RouterLink to="/track"
        class="inline-flex items-center gap-2 border-2 border-red-500 text-red-600 px-7 py-3 rounded-full font-bold hover:bg-red-50 transition">
        🎯 Pantau Status Pesanan
      </RouterLink>
    </div>

    <!-- FORM BAYAR -->
    <div v-else class="space-y-5">

      <!-- Tagihan -->
      <div class="rounded-3xl p-6 text-white text-center"
        style="background: linear-gradient(135deg, #C0392B, #E67E22)">
        <div class="text-xs font-bold uppercase tracking-wider opacity-70 mb-2">Total yang harus dibayar</div>
        <div class="text-4xl font-extrabold mb-1">{{ formatRupiah(payment?.total_price || 0) }}</div>
        <div class="text-sm opacity-70 mt-1">Pesanan #{{ payment?.order_number }}</div>
      </div>

      <!-- QRIS Section ... (keep original logic) -->
      <div class="bg-white rounded-3xl shadow-md overflow-hidden">
        <div class="flex items-center gap-3 px-6 py-4 border-b">
          <div class="w-9 h-9 bg-red-100 rounded-xl flex items-center justify-center text-lg">📱</div>
          <div>
            <p class="font-extrabold text-gray-800">Bayar via QRIS</p>
            <p class="text-xs text-gray-400">Scan QR dengan aplikasi dompet digital apapun</p>
          </div>
        </div>
        <div class="p-6 text-center">
          <div class="inline-block border-4 border-gray-100 rounded-2xl p-3 mb-4 bg-white shadow-sm">
            <div class="w-52 h-52 rounded-xl flex items-center justify-center overflow-hidden bg-gray-50">
              <img v-if="qrisUrl" :src="qrisUrl" alt="QRIS" class="w-full h-full object-contain" />
              <div v-else-if="loadingQris" class="flex flex-col items-center justify-center gap-2">
                <div class="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <div v-else class="text-xs text-gray-400 px-4">QRIS belum tersedia</div>
            </div>
          </div>
          <p class="text-sm font-bold text-gray-700 mb-4">Catering Family Jakarta</p>
          <div class="bg-red-50 border border-red-100 rounded-2xl p-4 text-sm text-left">
            <p class="font-bold text-gray-700 mb-2">Cara Bayar:</p>
            <ol class="space-y-1 text-gray-500 text-xs">
              <li>1. Buka aplikasi dompet digital / m-banking</li>
              <li>2. Scan QR Code di atas</li>
              <li>3. Bayar <strong class="text-red-600">{{ formatRupiah(payment?.total_price || 0) }}</strong></li>
              <li>4. Screenshot buktinya</li>
            </ol>
          </div>
        </div>
      </div>

      <!-- Upload Section -->
      <div class="bg-white rounded-3xl shadow-md overflow-hidden">
        <div class="flex items-center gap-3 px-6 py-4 border-b">
          <div class="w-9 h-9 bg-orange-100 rounded-xl flex items-center justify-center text-lg">📤</div>
          <p class="font-extrabold text-gray-800">Upload Bukti Pembayaran</p>
        </div>
        <div class="p-6">
          <div v-if="preview" class="mb-4 relative">
            <img :src="preview" class="max-h-64 rounded-2xl mx-auto shadow-sm border" />
            <button @click="clearFile" class="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full">×</button>
          </div>
          <div v-if="!preview" @click="$refs.fileInput.click()" class="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center cursor-pointer hover:bg-red-50">
            <div class="text-4xl mb-3">🖼️</div>
            <div class="font-bold text-sm text-gray-500">Klik untuk pilih foto</div>
          </div>
          <input ref="fileInput" type="file" accept="image/*" @change="onFileChange" class="hidden" />

          <button @click="handleUpload" :disabled="!file || uploading" class="w-full mt-5 bg-gradient-to-r from-red-600 to-orange-500 text-white py-3.5 rounded-2xl font-bold">
            <span v-if="uploading">Mengunggah...</span>
            <span v-else>Kirim Bukti Pembayaran</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getPayment, uploadPayment } from '@/api/payments'
import api from '@/api/axios'

const route = useRoute()
const router = useRouter()

const payment = ref(null)
const file = ref(null)
const preview = ref(null)
const loading = ref(true)
const uploading = ref(false)
const error = ref('')
const success = ref('')
const autoRedirectCountdown = ref(0)
let countdownInterval = null

const qrisUrl = ref(null)
const loadingQris = ref(true)
const whatsappNumber = ref('6281234567890')

function formatRupiah(val) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val)
}

async function fetchQris() {
  try {
    const res = await api.get('/settings/qris')
    const d = res.data?.data
    if (d?.qris_url) qrisUrl.value = d.qris_url
    if (d?.whatsapp_number) whatsappNumber.value = d.whatsapp_number
  } catch {} finally { loadingQris.value = false }
}

onMounted(async () => {
  await Promise.all([
    getPayment(route.params.orderId)
      .then(res => { payment.value = res.data.data || res.data })
      .catch(() => { error.value = 'Gagal memuat data.' })
      .finally(() => { loading.value = false }),
    fetchQris()
  ])
})

onUnmounted(() => {
  if (countdownInterval) clearInterval(countdownInterval)
})

function onFileChange(e) {
  const f = e.target.files[0]
  if (!f) return
  file.value = f
  preview.value = URL.createObjectURL(f)
}

function clearFile() {
  file.value = null
  preview.value = null
}

async function startAutoRedirect() {
  autoRedirectCountdown.value = 5
  countdownInterval = setInterval(() => {
    autoRedirectCountdown.value--
    if (autoRedirectCountdown.value <= 0) {
      clearInterval(countdownInterval)
      router.push({ name: 'Track', query: { order_number: payment.value.order_number } })
    }
  }, 1000)
}

async function handleUpload() {
  if (!file.value) return
  uploading.value = true
  try {
    const fd = new FormData()
    fd.append('proof_image', file.value)
    fd.append('method', 'qris')
    await uploadPayment(route.params.orderId, fd)
    
    // Refresh data
    const res = await getPayment(route.params.orderId)
    payment.value = res.data.data || res.data
    
    // Auto-continue logic
    startAutoRedirect()
  } catch (err) {
    alert('Gagal mengunggah bukti.')
  } finally {
    uploading.value = false
  }
}
</script>