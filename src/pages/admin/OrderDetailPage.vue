<template>
  <div>
    <div class="flex items-center gap-3 mb-6">
      <RouterLink to="/admin/orders" class="text-gray-400 hover:text-red-500 transition text-sm">← Kembali</RouterLink>
      <h1 class="text-2xl font-extrabold text-gray-800">Detail Pesanan</h1>
    </div>

    <div v-if="loading" class="text-center py-20 text-gray-400">Memuat...</div>

    <div v-else-if="order" class="grid lg:grid-cols-3 gap-5">
      <!-- Kiri -->
      <div class="lg:col-span-2 space-y-5">

        <!-- Header -->
        <div class="bg-white rounded-2xl shadow-sm p-6 flex flex-wrap justify-between gap-4">
          <div>
            <p class="text-xs text-gray-400 mb-1">Nomor Pesanan</p>
            <p class="text-xl font-extrabold font-mono text-red-600">#{{ order.order_number }}</p>
            <p class="text-xs text-gray-400 mt-1">{{ formatDate(order.created_at) }}</p>
          </div>
          <div class="text-right">
            <span :class="['text-sm px-4 py-1.5 rounded-full font-bold', statusClass(order.status)]">
              {{ statusLabel(order.status) }}
            </span>
            <p class="text-2xl font-extrabold text-red-600 mt-2">{{ formatRupiah(order.total_price) }}</p>
          </div>
        </div>

        <!-- Customer Info -->
        <div class="bg-white rounded-2xl shadow-sm p-6">
          <h3 class="font-extrabold text-gray-700 mb-4">👤 Info Pelanggan</h3>
          <div class="grid grid-cols-2 gap-3 text-sm">
            <div><p class="text-xs text-gray-400 mb-1">Nama</p><p class="font-bold">{{ order.nama_pemesan_display || order.nama_pemesan || order.user?.name || 'Guest' }}</p></div>
            <div><p class="text-xs text-gray-400 mb-1">No. HP</p><p class="font-bold">{{ order.no_hp || order.user?.phone || '-' }}</p></div>
            <div><p class="text-xs text-gray-400 mb-1">Email</p><p class="font-bold">{{ order.user?.email || '-' }}</p></div>
            <div><p class="text-xs text-gray-400 mb-1">Tanggal Acara</p><p class="font-bold">{{ formatDate(order.event_date) }}</p></div>
            <div class="col-span-2"><p class="text-xs text-gray-400 mb-1">Alamat</p><p class="font-bold">{{ order.event_address }}, {{ order.event_city }}</p></div>
            <div><p class="text-xs text-gray-400 mb-1">Total Pax</p><p class="font-bold">{{ order.total_pax }} orang</p></div>
            <div v-if="order.notes"><p class="text-xs text-gray-400 mb-1">Catatan</p><p class="font-bold">{{ order.notes }}</p></div>
          </div>
        </div>

        <!-- Item Pesanan -->
        <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div class="px-6 py-4 border-b font-extrabold text-gray-700">🍱 Item Pesanan</div>
          <div v-for="item in order.order_items" :key="item.id"
            class="flex items-center gap-4 px-6 py-3 border-b last:border-0">
            <div class="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">🍛</div>
            <div class="flex-1">
              <p class="font-bold text-sm text-gray-800">{{ item.menu_name }}</p>
              <p class="text-xs text-gray-400">{{ item.pax }} pax × {{ formatRupiah(item.price) }}</p>
            </div>
            <p class="font-extrabold text-red-600 text-sm">{{ formatRupiah(item.subtotal) }}</p>
          </div>
        </div>

        <!-- Custom Menu -->
        <div v-if="order.custom_menus?.length" class="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div class="px-6 py-4 border-b font-extrabold text-gray-700">✏️ Custom Menu</div>
          <div v-for="cm in order.custom_menus" :key="cm.id" class="px-6 py-4 border-b last:border-0">
            <div class="flex justify-between items-start">
              <div>
                <p class="font-bold text-sm">{{ cm.item_name }}</p>
                <p class="text-xs text-gray-400">{{ cm.pax }} pax{{ cm.description ? ' · ' + cm.description : '' }}</p>
              </div>
              <div class="text-right">
                <span :class="['text-xs px-2.5 py-1 rounded-full font-bold',
                  cm.status === 'approved' ? 'bg-green-100 text-green-700' :
                  cm.status === 'rejected' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-700']">
                  {{ cm.status === 'approved' ? 'Disetujui' : cm.status === 'rejected' ? 'Ditolak' : 'Menunggu' }}
                </span>
                <p v-if="cm.estimated_price" class="text-sm font-extrabold text-red-600 mt-1">{{ formatRupiah(cm.subtotal) }}</p>
              </div>
            </div>
            <!-- Approve form -->
            <div v-if="cm.status === 'pending'" class="mt-3 flex gap-2">
              <input v-model.number="cm._price" type="number" placeholder="Harga estimasi/pax"
                class="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-red-300" />
              <button @click="approveCustomMenu(cm)"
                class="bg-green-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-green-700 transition">Setujui</button>
              <button @click="rejectCustomMenuFn(cm)"
                class="bg-red-500 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-red-600 transition">Tolak</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Kanan -->
      <div class="space-y-5">
        <!-- Update Status -->
        <div class="bg-white rounded-2xl shadow-sm p-6">
          <h3 class="font-extrabold text-gray-700 mb-4">🔄 Update Status</h3>
          <select v-model="newStatus"
            class="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-400 transition bg-white mb-3">
            <option value="pending">Menunggu</option>
            <option value="confirmed">Dikonfirmasi</option>
            <option value="processing">Diproses</option>
            <option value="delivered">Dikirim</option>
            <option value="completed">Selesai</option>
            <option value="cancelled">Dibatalkan</option>
          </select>
          <textarea v-if="newStatus === 'cancelled'" v-model="cancelReason" rows="2"
            placeholder="Alasan pembatalan..."
            class="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-400 mb-3 resize-none" />
          <button @click="handleUpdateStatus" :disabled="updating"
            class="w-full bg-gradient-to-r from-red-600 to-orange-500 text-white py-2.5 rounded-xl font-bold text-sm shadow hover:-translate-y-0.5 transition disabled:opacity-50">
            {{ updating ? 'Menyimpan...' : 'Simpan Status' }}
          </button>
          <div v-if="statusMsg" class="mt-3 bg-green-50 border border-green-200 text-green-700 text-xs rounded-xl px-4 py-2.5">
            {{ statusMsg }}
          </div>
        </div>

        <!-- Info Pembayaran -->
        <div class="bg-white rounded-2xl shadow-sm p-6">
          <h3 class="font-extrabold text-gray-700 mb-4">💳 Pembayaran</h3>
          <div v-if="order.payment">
            <span :class="['text-xs px-3 py-1.5 rounded-full font-bold', paymentClass(order.payment.status)]">
              {{ paymentLabel(order.payment.status) }}
            </span>
            <div v-if="order.payment.proof_image" class="mt-4">
              <p class="text-xs text-gray-400 mb-2">Bukti Transfer:</p>
              <img :src="storageUrl(order.payment.proof_image)"
                class="w-full rounded-2xl object-cover border border-gray-100 shadow-sm max-h-48 object-contain" />
            </div>
            <div v-if="order.payment.status === 'pending_verification'" class="mt-4 flex gap-2">
              <button @click="verifyPaymentFn" :disabled="verifying"
                class="flex-1 bg-green-600 text-white py-2 rounded-xl text-xs font-bold hover:bg-green-700 transition disabled:opacity-50">
                ✅ Verifikasi
              </button>
              <button @click="rejectPaymentFn" :disabled="verifying"
                class="flex-1 bg-red-500 text-white py-2 rounded-xl text-xs font-bold hover:bg-red-600 transition disabled:opacity-50">
                ❌ Tolak
              </button>
            </div>
          </div>
          <p v-else class="text-gray-400 text-sm">Belum ada pembayaran.</p>
        </div>

        <!-- Rincian Harga -->
        <div class="bg-white rounded-2xl shadow-sm p-6">
          <h3 class="font-extrabold text-gray-700 mb-4">🧾 Rincian Harga</h3>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between text-gray-500"><span>Subtotal</span><span>{{ formatRupiah(order.subtotal) }}</span></div>
            <div class="flex justify-between text-gray-500"><span>Ongkos Kirim</span><span>{{ formatRupiah(order.delivery_fee) }}</span></div>
            <div class="flex justify-between text-gray-500"><span>Biaya Layanan</span><span>{{ formatRupiah(order.service_fee) }}</span></div>
            <div v-if="order.discount > 0" class="flex justify-between text-green-600"><span>Diskon</span><span>-{{ formatRupiah(order.discount) }}</span></div>
            <hr />
            <div class="flex justify-between font-extrabold text-gray-800">
              <span>Total</span><span class="text-red-600">{{ formatRupiah(order.total_price) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getAdminOrder, updateOrderStatus, approveCustomMenu as apiApprove, rejectCustomMenu as apiReject, verifyPayment, rejectPayment } from '@/api/admin'
import { storageUrl } from '@/api/helpers'

const route = useRoute()
const order = ref(null)
const loading = ref(true)
const newStatus = ref('')
const cancelReason = ref('')
const updating = ref(false)
const statusMsg = ref('')
const verifying = ref(false)

const statusMap = {
  pending:    { cls: 'bg-yellow-100 text-yellow-700', lbl: 'Menunggu' },
  confirmed:  { cls: 'bg-blue-100 text-blue-700',     lbl: 'Dikonfirmasi' },
  processing: { cls: 'bg-purple-100 text-purple-700', lbl: 'Diproses' },
  delivered:  { cls: 'bg-teal-100 text-teal-700',     lbl: 'Dikirim' },
  completed:  { cls: 'bg-green-100 text-green-700',   lbl: 'Selesai' },
  cancelled:  { cls: 'bg-red-100 text-red-600',       lbl: 'Dibatalkan' },
}
const paymentMap = {
  unpaid:               { cls: 'bg-gray-100 text-gray-500',     lbl: 'Belum Bayar' },
  pending_verification: { cls: 'bg-yellow-100 text-yellow-700', lbl: 'Menunggu Verifikasi' },
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
  return new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })
}

async function loadOrder() {
  const res = await getAdminOrder(route.params.id)
  order.value = res.data.data || res.data
  newStatus.value = order.value.status
}

onMounted(async () => {
  try { await loadOrder() } catch {} finally { loading.value = false }
})

async function handleUpdateStatus() {
  updating.value = true
  statusMsg.value = ''
  try {
    await updateOrderStatus(route.params.id, newStatus.value, cancelReason.value)
    await loadOrder()
    statusMsg.value = 'Status berhasil diperbarui!'
    setTimeout(() => { statusMsg.value = '' }, 3000)
  } catch {} finally { updating.value = false }
}

async function approveCustomMenu(cm) {
  if (!cm._price) return alert('Masukkan harga estimasi')
  await apiApprove(cm.id, cm._price)
  await loadOrder()
}

async function rejectCustomMenuFn(cm) {
  await apiReject(cm.id)
  await loadOrder()
}

async function verifyPaymentFn() {
  verifying.value = true
  try {
    await verifyPayment(order.value.payment.id)
    await loadOrder()
  } catch {} finally { verifying.value = false }
}

async function rejectPaymentFn() {
  verifying.value = true
  try {
    await rejectPayment(order.value.payment.id)
    await loadOrder()
  } catch {} finally { verifying.value = false }
}
</script>
