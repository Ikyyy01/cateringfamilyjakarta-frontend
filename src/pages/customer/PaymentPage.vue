<template>
  <div class="max-w-2xl mx-auto px-4 py-10">
    <!-- Header -->
    <div class="text-center mb-8">
      <div class="text-5xl mb-4" style="filter:drop-shadow(0 4px 16px rgba(192,57,43,.25))">🧾</div>
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
        🔍 Lacak Pesanan
      </RouterLink>
    </div>

    <!-- MENUNGGU VERIFIKASI -->
    <div v-else-if="payment?.payment?.status === 'pending_verification'"
      class="bg-white rounded-3xl shadow-md text-center p-12">
      <div class="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-5">⏳</div>
      <h2 class="text-xl font-extrabold mb-2 text-gray-800">Bukti Sedang Diverifikasi</h2>
      <p class="text-gray-400 leading-relaxed mb-6">
        Tim kami akan memverifikasi pembayaran Anda dalam <strong>1×24 jam</strong>.<br>
        Simpan kode pesanan untuk memantau statusnya.
      </p>
      <div class="inline-block bg-red-50 border border-red-200 rounded-2xl px-8 py-4 mb-6">
        <p class="text-xs text-gray-400 mb-1">Kode Pesanan Anda</p>
        <p class="text-2xl font-extrabold font-mono text-red-600">{{ payment.order_number }}</p>
      </div>
      <RouterLink to="/track"
        class="inline-flex items-center gap-2 border-2 border-red-500 text-red-600 px-7 py-3 rounded-full font-bold hover:bg-red-50 transition">
        🔍 Pantau Status Pesanan
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

      <!-- Kode Pesanan -->
      <div class="bg-white rounded-3xl shadow-md p-5 text-center">
        <p class="text-xs text-gray-400 mb-2 font-semibold uppercase tracking-wider">📌 Simpan Kode Ini</p>
        <p class="text-2xl font-extrabold font-mono text-red-600 mb-1">{{ payment?.order_number }}</p>
        <p class="text-xs text-gray-400">Gunakan kode ini untuk melacak status pesanan Anda di halaman
          <RouterLink to="/track" class="text-red-500 hover:underline font-semibold">Lacak Pesanan</RouterLink>
        </p>
      </div>

      <!-- QRIS -->
      <div class="bg-white rounded-3xl shadow-md overflow-hidden">
        <div class="flex items-center gap-3 px-6 py-4 border-b">
          <div class="w-9 h-9 bg-red-100 rounded-xl flex items-center justify-center text-lg">📱</div>
          <div>
            <p class="font-extrabold text-gray-800">Bayar via QRIS</p>
            <p class="text-xs text-gray-400">Scan QR dengan aplikasi dompet digital apapun</p>
          </div>
        </div>
        <div class="p-6 text-center">
          <!-- QR Code — gambar asli dari settings, fallback ke placeholder -->
          <div class="inline-block border-4 border-gray-100 rounded-2xl p-3 mb-4 bg-white shadow-sm">
            <div class="w-52 h-52 rounded-xl flex items-center justify-center overflow-hidden bg-gray-50">

              <!-- Gambar QRIS asli -->
              <img v-if="qrisUrl"
                :src="qrisUrl"
                alt="QRIS Catering Family Jakarta"
                class="w-full h-full object-contain"
                @error="qrisUrl = null" />

              <!-- Loading QRIS -->
              <div v-else-if="loadingQris" class="flex flex-col items-center justify-center w-full h-full gap-2">
                <div class="w-8 h-8 border-2 border-red-200 border-t-red-500 rounded-full animate-spin"></div>
                <p class="text-xs text-gray-400">Memuat QRIS...</p>
              </div>

              <!-- Placeholder — QRIS belum diupload admin -->
              <div v-else class="flex flex-col items-center justify-center w-full h-full gap-3 px-4">
                <div class="text-4xl opacity-20">📲</div>
                <p class="text-xs text-gray-400 text-center leading-relaxed">
                  QRIS belum tersedia.<br>Hubungi admin untuk info pembayaran.
                </p>
              </div>

            </div>
          </div>

          <p class="text-sm font-bold text-gray-700 mb-1">Catering Family Jakarta</p>
          <p class="text-xs text-gray-400 mb-4">QRIS berlaku untuk semua dompet digital & m-banking</p>

          <div class="grid grid-cols-4 gap-2 text-xs text-gray-400 mb-4">
            <div class="flex flex-col items-center gap-1.5">
              <div class="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-base">🟢</div>GoPay
            </div>
            <div class="flex flex-col items-center gap-1.5">
              <div class="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-base">🔵</div>OVO
            </div>
            <div class="flex flex-col items-center gap-1.5">
              <div class="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-base">🟠</div>Dana
            </div>
            <div class="flex flex-col items-center gap-1.5">
              <div class="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-base">💳</div>m-BCA
            </div>
          </div>

          <div class="bg-red-50 border border-red-100 rounded-2xl p-4 text-sm text-left">
            <p class="font-bold text-gray-700 mb-2">Cara Bayar:</p>
            <ol class="space-y-1 text-gray-500 text-xs list-none">
              <li class="flex gap-2"><span class="font-extrabold text-red-600">1.</span> Buka aplikasi dompet digital / m-banking</li>
              <li class="flex gap-2"><span class="font-extrabold text-red-600">2.</span> Pilih menu QRIS / Scan QR</li>
              <li class="flex gap-2"><span class="font-extrabold text-red-600">3.</span> Arahkan kamera ke QR Code di atas</li>
              <li class="flex gap-2"><span class="font-extrabold text-red-600">4.</span> Masukkan nominal <strong class="text-red-600">{{ formatRupiah(payment?.total_price || 0) }}</strong></li>
              <li class="flex gap-2"><span class="font-extrabold text-red-600">5.</span> Selesaikan pembayaran & screenshot buktinya</li>
            </ol>
          </div>
        </div>
      </div>

      <!-- Upload Bukti -->
      <div class="bg-white rounded-3xl shadow-md overflow-hidden">
        <div class="flex items-center gap-3 px-6 py-4 border-b">
          <div class="w-9 h-9 bg-orange-100 rounded-xl flex items-center justify-center text-lg">📤</div>
          <div>
            <p class="font-extrabold text-gray-800">Upload Bukti Pembayaran</p>
            <p class="text-xs text-gray-400">Screenshot / foto bukti transfer QRIS</p>
          </div>
        </div>
        <div class="p-6">
          <!-- Preview gambar -->
          <div v-if="preview" class="mb-4 relative">
            <img :src="preview" class="max-h-64 rounded-2xl mx-auto object-contain shadow-sm border border-gray-100 w-full" />
            <button @click="clearFile"
              class="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold hover:bg-red-600 transition">
              ×
            </button>
          </div>

          <!-- Drop zone -->
          <div v-if="!preview"
            @click="$refs.fileInput.click()"
            class="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center cursor-pointer hover:border-red-300 hover:bg-red-50/30 transition">
            <div class="text-4xl opacity-30 mb-3">🖼️</div>
            <div class="font-bold text-sm text-gray-500 mb-1">Klik untuk pilih foto</div>
            <div class="text-xs text-gray-400">JPG, PNG — Maks. 2MB</div>
          </div>
          <input ref="fileInput" type="file" accept="image/jpeg,image/png,image/jpg" @change="onFileChange" class="hidden" />

          <div v-if="error" class="mt-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm">{{ error }}</div>
          <div v-if="success" class="mt-4 bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-green-700 text-sm font-semibold">{{ success }}</div>

          <button @click="handleUpload" :disabled="!file || uploading"
            class="w-full mt-5 bg-gradient-to-r from-red-600 to-orange-500 text-white py-3.5 rounded-2xl font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none">
            <span v-if="uploading" class="inline-flex items-center gap-2">
              <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
              </svg>
              Mengunggah...
            </span>
            <span v-else>📤 Kirim Bukti Pembayaran</span>
          </button>
        </div>
      </div>

      <!-- Info -->
      <div class="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-sm text-blue-700 flex gap-3">
        <span class="text-xl flex-shrink-0">ℹ️</span>
        <div>
          <p class="font-bold mb-1">Informasi</p>
          <p class="text-xs leading-relaxed opacity-80">
            Pembayaran akan diverifikasi admin dalam <strong>1×24 jam</strong>.
            Pertanyaan? Hubungi WhatsApp
            <a :href="`https://wa.me/${whatsappNumber}`" target="_blank"
              class="font-bold underline hover:text-blue-900">
              +{{ whatsappNumber }}
            </a>.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getPayment, uploadPayment } from '@/api/payments'
import api from '@/api/axios'

const route = useRoute()

const payment    = ref(null)
const file       = ref(null)
const preview    = ref(null)
const loading    = ref(true)
const uploading  = ref(false)
const error      = ref('')
const success    = ref('')

// QRIS dari settings
const qrisUrl      = ref(null)
const loadingQris  = ref(true)
const whatsappNumber = ref('6281234567890')

function formatRupiah(val) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val)
}

// Fetch QRIS dari endpoint publik /settings/qris
async function fetchQris() {
  loadingQris.value = true
  try {
    const res = await api.get('/settings/qris')
    const d   = res.data?.data
    if (d?.qris_url)        qrisUrl.value       = d.qris_url
    if (d?.whatsapp_number) whatsappNumber.value = d.whatsapp_number
  } catch {
    // Gagal fetch QRIS — tampilkan placeholder
  } finally {
    loadingQris.value = false
  }
}

onMounted(async () => {
  await Promise.all([
    // Data pembayaran
    getPayment(route.params.orderId)
      .then(res => { payment.value = res.data.data || res.data })
      .catch(() => { error.value = 'Gagal memuat data pembayaran.' })
      .finally(() => { loading.value = false }),

    // QRIS settings
    fetchQris(),
  ])
})

function onFileChange(e) {
  const f = e.target.files[0]
  if (!f) return
  if (f.size > 2 * 1024 * 1024) { error.value = 'Ukuran file maksimal 2MB.'; return }
  file.value    = f
  preview.value = URL.createObjectURL(f)
  error.value   = ''
}

function clearFile() {
  file.value    = null
  preview.value = null
}

async function handleUpload() {
  if (!file.value) return
  uploading.value = true
  error.value     = ''
  success.value   = ''
  try {
    const fd = new FormData()
    fd.append('proof_image', file.value)
    fd.append('method', 'qris')
    await uploadPayment(route.params.orderId, fd)
    success.value = '✅ Bukti pembayaran berhasil dikirim! Menunggu verifikasi admin.'
    file.value    = null
    preview.value = null
    // Reload data pembayaran
    const res     = await getPayment(route.params.orderId)
    payment.value = res.data.data || res.data
  } catch (err) {
    error.value = err.response?.data?.message || 'Gagal mengunggah bukti. Coba lagi.'
  } finally {
    uploading.value = false
  }
}
</script>
