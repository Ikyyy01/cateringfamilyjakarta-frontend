<template>
  <div class="max-w-3xl mx-auto px-4 py-10">
    <div class="flex items-center gap-3 mb-8">
      <RouterLink to="/customer/orders" class="text-gray-400 hover:text-red-500 transition text-sm">← Kembali</RouterLink>
      <h1 class="text-2xl font-extrabold text-gray-900">Detail <span class="text-red-600">Pesanan</span></h1>
    </div>

    <div v-if="loading" class="text-center py-20 text-gray-400 animate-pulse">Memuat...</div>
    <div v-else-if="!order" class="text-center py-20 text-gray-400">Pesanan tidak ditemukan.</div>

    <div v-else class="space-y-5">
      <!-- Header -->
      <div class="bg-white rounded-3xl shadow-md p-6">
        <div class="flex flex-wrap justify-between gap-4">
          <div>
            <p class="text-xs text-gray-400 font-semibold mb-1">Nomor Pesanan</p>
            <p class="text-xl font-extrabold font-mono text-red-600">#{{ order.order_number }}</p>
            <p class="text-xs text-gray-400 mt-1">Dipesan {{ formatDate(order.created_at) }}</p>
          </div>
          <div class="text-right">
            <span :class="['text-sm px-4 py-1.5 rounded-full font-bold', statusClass(order.status)]">
              {{ statusLabel(order.status) }}
            </span>
            <p class="text-2xl font-extrabold text-red-600 mt-2">{{ formatRupiah(order.total_price) }}</p>
          </div>
        </div>

        <!-- Tombol konfirmasi terima (delivered → completed) -->
        <div v-if="order.status === 'delivered'"
          class="mt-5 bg-teal-50 border border-teal-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div class="flex-1">
            <p class="font-bold text-teal-800 text-sm">Pesanan sudah tiba?</p>
            <p class="text-xs text-teal-600 mt-0.5">Tekan tombol di bawah jika pesanan sudah Anda terima dan sesuai.</p>
          </div>
          <button @click="handleConfirmReceived" :disabled="confirming"
            class="flex-shrink-0 bg-teal-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-teal-700 transition disabled:opacity-50">
            {{ confirming ? 'Memproses...' : '✅ Sudah Diterima' }}
          </button>
        </div>
      </div>

      <!-- Detail Acara -->
      <div class="bg-white rounded-3xl shadow-md p-6">
        <h3 class="font-extrabold text-gray-700 mb-4">📅 Detail Acara</h3>
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p class="text-xs text-gray-400 font-semibold mb-1">Tanggal Acara</p>
            <p class="font-bold text-gray-800">{{ formatDate(order.event_date) }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-400 font-semibold mb-1">Total Pax</p>
            <p class="font-bold text-gray-800">{{ order.total_pax }} orang</p>
          </div>
          <div class="col-span-2">
            <p class="text-xs text-gray-400 font-semibold mb-1">Alamat Acara</p>
            <p class="font-bold text-gray-800">{{ order.event_address }}, {{ order.event_city }}</p>
          </div>
          <div v-if="order.notes" class="col-span-2">
            <p class="text-xs text-gray-400 font-semibold mb-1">Catatan</p>
            <p class="font-bold text-gray-800">{{ order.notes }}</p>
          </div>
        </div>
      </div>

      <!-- Item Pesanan -->
      <div class="bg-white rounded-3xl shadow-md overflow-hidden">
        <div class="px-6 py-4 border-b font-extrabold text-gray-700">🍱 Item Pesanan</div>
        <div v-for="item in order.order_items" :key="item.id" class="flex items-center gap-4 px-6 py-4 border-b last:border-0">
          <div class="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-lg flex-shrink-0">🍛</div>
          <div class="flex-1">
            <p class="font-bold text-gray-800">{{ item.menu_name }}</p>
            <p class="text-xs text-gray-400">{{ item.pax }} pax × {{ formatRupiah(item.price) }}</p>
          </div>
          <p class="font-extrabold text-red-600">{{ formatRupiah(item.subtotal) }}</p>
        </div>
        <div v-if="!order.order_items?.length" class="px-6 py-8 text-center text-gray-300 text-sm">Tidak ada item</div>
      </div>

      <!-- Rincian Harga -->
      <div class="bg-white rounded-3xl shadow-md p-6">
        <h3 class="font-extrabold text-gray-700 mb-4">🧾 Rincian Harga</h3>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between text-gray-500"><span>Subtotal</span><span>{{ formatRupiah(order.subtotal) }}</span></div>
          <div class="flex justify-between text-gray-500"><span>Ongkos Kirim</span><span>{{ formatRupiah(order.delivery_fee) }}</span></div>
          <div class="flex justify-between text-gray-500"><span>Biaya Layanan</span><span>{{ formatRupiah(order.service_fee) }}</span></div>
          <div v-if="order.discount > 0" class="flex justify-between text-green-600"><span>Diskon Kupon</span><span>-{{ formatRupiah(order.discount) }}</span></div>
          <hr class="my-2 border-gray-100" />
          <div class="flex justify-between font-extrabold text-gray-800 text-base">
            <span>Total</span><span class="text-red-600">{{ formatRupiah(order.total_price) }}</span>
          </div>
        </div>
      </div>

      <!-- Pembayaran -->
      <div class="bg-white rounded-3xl shadow-md p-6">
        <h3 class="font-extrabold text-gray-700 mb-4">💳 Status Pembayaran</h3>
        <div v-if="order.payment">
          <span :class="['text-sm px-4 py-1.5 rounded-full font-bold', paymentClass(order.payment.status)]">
            {{ paymentLabel(order.payment.status) }}
          </span>
          <div v-if="order.payment.proof_image" class="mt-4">
            <p class="text-xs text-gray-400 font-semibold mb-2">Bukti Pembayaran:</p>
            <img :src="`${storageBase}/${order.payment.proof_image}`"
              class="max-h-48 rounded-2xl object-contain border border-gray-100 shadow-sm"
              @error="e => e.target.style.display='none'" />
          </div>
          <RouterLink v-if="order.payment.status === 'unpaid'" :to="`/customer/payment/${order.id}`"
            class="inline-flex items-center gap-2 mt-4 bg-gradient-to-r from-red-600 to-orange-500 text-white px-6 py-3 rounded-full font-bold shadow hover:-translate-y-0.5 transition">
            💳 Selesaikan Pembayaran
          </RouterLink>
        </div>
        <p v-else class="text-gray-400 text-sm">Belum ada data pembayaran.</p>
      </div>

      <!-- Review — tampil kalau sudah completed dan belum review -->
      <div v-if="order.status === 'completed' && !order.review" class="bg-yellow-50 border border-yellow-200 rounded-2xl p-5">
        <p class="font-bold text-yellow-800 mb-1">⭐ Berikan Review</p>
        <p class="text-xs text-yellow-700 mb-4">Bagaimana pengalaman Anda? Tinggalkan ulasan untuk membantu pelanggan lain.</p>
        <div class="flex gap-1 mb-3">
          <button v-for="s in 5" :key="s" @click="reviewForm.rating = s"
            :class="['text-2xl transition', s <= reviewForm.rating ? 'text-yellow-400' : 'text-gray-200 hover:text-yellow-300']">★</button>
        </div>
        <textarea v-model="reviewForm.comment" rows="2" placeholder="Tulis komentar Anda..."
          class="w-full border-2 border-yellow-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-400 bg-white mb-3 resize-none" />
        <button @click="handleReview" :disabled="submittingReview || !reviewForm.rating"
          class="bg-yellow-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-yellow-600 transition disabled:opacity-50">
          {{ submittingReview ? 'Mengirim...' : 'Kirim Review' }}
        </button>
      </div>
      <div v-else-if="order.review" class="bg-green-50 border border-green-200 rounded-2xl p-5 flex items-center gap-3">
        <span class="text-2xl">⭐</span>
        <div>
          <p class="font-bold text-green-800 text-sm">Review sudah dikirim</p>
          <p class="text-xs text-green-600">{{ '★'.repeat(order.review.rating) }} — {{ order.review.comment || 'Terima kasih!' }}</p>
        </div>
      </div>

      <!-- Batalkan -->
      <div v-if="order.status === 'pending'" class="bg-red-50 border border-red-200 rounded-2xl p-5">
        <p class="font-bold text-red-700 mb-1">Batalkan Pesanan</p>
        <p class="text-xs text-red-600 mb-4">Pesanan hanya bisa dibatalkan selama masih berstatus Menunggu.</p>
        <button @click="showCancelModal = true" class="text-sm border-2 border-red-400 text-red-600 px-5 py-2 rounded-full font-bold hover:bg-red-100 transition">
          ❌ Batalkan Pesanan
        </button>
      </div>
    </div>

    <!-- Modal Batalkan -->
    <div v-if="showCancelModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
      <div class="bg-white rounded-3xl shadow-xl p-8 max-w-sm w-full">
        <div class="text-3xl text-center mb-3">⚠️</div>
        <h3 class="font-extrabold text-gray-800 text-center text-lg mb-2">Batalkan Pesanan?</h3>
        <p class="text-gray-400 text-sm text-center mb-5">Pesanan yang dibatalkan tidak dapat dikembalikan.</p>
        <textarea v-model="cancelReason" rows="2" placeholder="Alasan pembatalan (opsional)"
          class="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-400 mb-4 resize-none" />
        <div class="flex gap-3">
          <button @click="showCancelModal = false" class="flex-1 border-2 border-gray-200 text-gray-600 py-2.5 rounded-xl font-bold hover:bg-gray-50 transition text-sm">Kembali</button>
          <button @click="handleCancel" :disabled="cancelling" class="flex-1 bg-red-600 text-white py-2.5 rounded-xl font-bold hover:bg-red-700 transition text-sm disabled:opacity-50">
            {{ cancelling ? 'Membatalkan...' : 'Ya, Batalkan' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getOrder, cancelOrder } from '@/api/orders'
import { submitReview } from '@/api/reviews'
import api from '@/api/axios'

const route = useRoute()
const order           = ref(null)
const loading         = ref(true)
const showCancelModal = ref(false)
const cancelReason    = ref('')
const cancelling      = ref(false)
const confirming      = ref(false)
const submittingReview = ref(false)
const reviewForm      = ref({ rating: 0, comment: '' })
const storageBase     = import.meta.env.VITE_STORAGE_URL || 'http://localhost:8000/storage'

const statusMap = {
  pending:    { cls: 'bg-yellow-100 text-yellow-700', lbl: 'Menunggu' },
  confirmed:  { cls: 'bg-blue-100 text-blue-700',     lbl: 'Dikonfirmasi' },
  processing: { cls: 'bg-purple-100 text-purple-700', lbl: 'Diproses' },
  delivered:  { cls: 'bg-teal-100 text-teal-700',     lbl: 'Dikirim — Menunggu Konfirmasi' },
  completed:  { cls: 'bg-green-100 text-green-700',   lbl: 'Selesai' },
  cancelled:  { cls: 'bg-red-100 text-red-600',       lbl: 'Dibatalkan' },
}
const paymentMap = {
  unpaid:               { cls: 'bg-gray-100 text-gray-600',    lbl: 'Belum Dibayar' },
  pending_verification: { cls: 'bg-yellow-100 text-yellow-700', lbl: 'Verifikasi Pembayaran' },
  paid:                 { cls: 'bg-green-100 text-green-700',   lbl: 'Lunas ✓' },
  failed:               { cls: 'bg-red-100 text-red-600',       lbl: 'Gagal' },
}

function statusClass(s) { return (statusMap[s] || statusMap.pending).cls }
function statusLabel(s) { return (statusMap[s] || statusMap.pending).lbl }
function paymentClass(s) { return (paymentMap[s] || paymentMap.unpaid).cls }
function paymentLabel(s) { return (paymentMap[s] || paymentMap.unpaid).lbl }
function formatRupiah(v) { return new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',minimumFractionDigits:0}).format(v) }
function formatDate(d) { return new Date(d).toLocaleDateString('id-ID',{day:'2-digit',month:'long',year:'numeric'}) }

async function reload() {
  const res = await getOrder(route.params.id)
  order.value = res.data?.data ?? res.data
}

onMounted(async () => {
  try { await reload() } catch { order.value = null } finally { loading.value = false }
})

async function handleConfirmReceived() {
  if (!confirm('Konfirmasi pesanan sudah diterima dan sesuai?')) return
  confirming.value = true
  try {
    await api.post(`/orders/${route.params.id}/confirm-received`)
    await reload()
  } catch(err) {
    alert(err.response?.data?.message || 'Gagal mengkonfirmasi. Coba lagi.')
  } finally { confirming.value = false }
}

async function handleReview() {
  if (!reviewForm.value.rating) return
  submittingReview.value = true
  try {
    await submitReview(route.params.id, reviewForm.value)
    await reload()
  } catch(err) {
    alert(err.response?.data?.message || 'Gagal mengirim review.')
  } finally { submittingReview.value = false }
}

async function handleCancel() {
  cancelling.value = true
  try {
    await cancelOrder(route.params.id, cancelReason.value)
    await reload()
    showCancelModal.value = false
  } catch(err) {
    alert(err.response?.data?.message || 'Gagal membatalkan pesanan.')
  } finally { cancelling.value = false }
}
</script>
