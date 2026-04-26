<template>
  <div class="max-w-5xl mx-auto px-4 py-10">
    <div class="mb-8">
      <p class="text-xs font-extrabold uppercase tracking-widest text-red-600 mb-1">Satu langkah lagi</p>
      <h1 class="text-3xl font-extrabold text-gray-900">Checkout <span class="text-red-600">Pesanan</span></h1>
      <div class="w-12 h-1 bg-gradient-to-r from-red-600 to-orange-400 rounded mt-3"></div>
    </div>

    <!-- Keranjang kosong -->
    <div v-if="cartStore.items.length === 0"
      class="bg-white rounded-3xl shadow-md text-center py-16 px-6 max-w-md mx-auto">
      <div class="text-7xl opacity-40 mb-4">🛒</div>
      <h5 class="text-xl font-extrabold text-gray-700 mb-2">Keranjang masih kosong</h5>
      <RouterLink to="/menu"
        class="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-orange-500 text-white px-7 py-3 rounded-full font-bold shadow hover:-translate-y-0.5 transition">
        🍱 Lihat Menu
      </RouterLink>
    </div>

    <div v-else>
      <!-- Validasi min pax warning -->
      <div v-if="minPaxErrors.length > 0" class="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
        <p class="font-bold text-red-700 mb-2">⚠️ Perhatian Minimum Pesanan</p>
        <ul class="space-y-1">
          <li v-for="e in minPaxErrors" :key="e" class="text-sm text-red-600 flex gap-2">
            <span>•</span><span>{{ e }}</span>
          </li>
        </ul>
      </div>

      <!-- Peringatan harga berubah -->
      <div v-if="priceChangedItems.length > 0" class="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-6">
        <p class="font-bold text-yellow-700 mb-2">⚠️ Harga Menu Berubah</p>
        <p class="text-sm text-yellow-600 mb-2">Harga beberapa menu telah diperbarui sejak kamu menambahkan ke keranjang:</p>
        <ul class="space-y-1">
          <li v-for="item in priceChangedItems" :key="item.id" class="text-sm text-yellow-700 flex gap-2">
            <span>•</span>
            <span>{{ item.name }}: {{ formatRupiah(item.oldPrice) }} → <strong>{{ formatRupiah(item.newPrice) }}</strong></span>
          </li>
        </ul>
        <button @click="applyUpdatedPrices"
          class="mt-3 text-sm bg-yellow-500 text-white px-4 py-1.5 rounded-full font-bold hover:bg-yellow-600 transition">
          Perbarui Harga & Lanjutkan
        </button>
      </div>

      <form @submit.prevent="handleCheckout" class="grid lg:grid-cols-3 gap-6">
        <!-- Kiri -->
        <div class="lg:col-span-2 space-y-5">

          <!-- Data Pemesan -->
          <div class="bg-white rounded-3xl shadow-md overflow-hidden">
            <div class="flex items-center gap-3 px-6 py-4 border-b font-bold text-gray-700">
              <span class="w-7 h-7 rounded-full bg-red-600 text-white text-xs font-extrabold flex items-center justify-center">1</span>
              Data Pemesan
            </div>
            <div class="p-6 grid md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-1.5">Nama Lengkap <span class="text-red-500">*</span></label>
                <input v-model="form.nama_pemesan" type="text" required
                  class="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-red-400 transition"
                  placeholder="Contoh: Budi Santoso" />
              </div>
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-1.5">No. HP / WhatsApp <span class="text-red-500">*</span></label>
                <input v-model="form.no_hp" type="tel" required
                  class="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-red-400 transition"
                  placeholder="08123456789" />
              </div>
            </div>
          </div>

          <!-- Detail Acara -->
          <div class="bg-white rounded-3xl shadow-md overflow-hidden">
            <div class="flex items-center gap-3 px-6 py-4 border-b font-bold text-gray-700">
              <span class="w-7 h-7 rounded-full bg-red-600 text-white text-xs font-extrabold flex items-center justify-center">2</span>
              Detail Acara
            </div>
            <div class="p-6 grid md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-1.5">Tanggal Acara <span class="text-red-500">*</span></label>
                <input v-model="form.event_date" type="date" required :min="minDate"
                  class="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-red-400 transition" />
                <p class="text-xs text-gray-400 mt-1.5">⚠️ Pemesanan minimal H-2 sebelum acara</p>
              </div>
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-1.5">Wilayah Jakarta <span class="text-red-500">*</span></label>
                <select v-model="form.event_city" required
                  class="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-red-400 transition bg-white">
                  <option value="">— Pilih wilayah —</option>
                  <option v-for="k in kotaList" :key="k" :value="k">{{ k }}</option>
                </select>
                <p class="text-xs text-gray-400 mt-1.5">📍 Hanya melayani wilayah DKI Jakarta</p>
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-bold text-gray-700 mb-1.5">Alamat Lengkap <span class="text-red-500">*</span></label>
                <textarea v-model="form.event_address" rows="3" required
                  class="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-red-400 transition resize-none"
                  placeholder="Jalan, RT/RW, Kelurahan, Kecamatan…"></textarea>
              </div>
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-1.5">Jarak dari Dapur (km) <span class="text-red-500">*</span></label>
                <input v-model.number="form.distance_km" type="number" min="0" step="0.5" required
                  class="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-red-400 transition"
                  placeholder="Contoh: 5" />
                <p class="text-xs text-gray-400 mt-1.5">
                  ℹ️ Gratis ongkir radius {{ priceConfig.free_delivery_radius }} km.
                  Setelahnya {{ formatRupiah(priceConfig.delivery_fee_per_km) }}/km.
                </p>
              </div>
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-1.5">Catatan Tambahan</label>
                <input v-model="form.notes" type="text"
                  class="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-red-400 transition"
                  placeholder="Alergi, permintaan khusus…" />
              </div>
            </div>
          </div>

          <!-- Custom Menu -->
          <div class="bg-white rounded-3xl shadow-md overflow-hidden">
            <div class="flex items-center justify-between px-6 py-4 border-b">
              <div class="flex items-center gap-3 font-bold text-gray-700">
                <span class="w-7 h-7 rounded-full bg-gray-300 text-white text-xs font-extrabold flex items-center justify-center">3</span>
                Custom Menu
                <span class="text-xs text-gray-400 border border-gray-200 px-2 py-0.5 rounded-full">Opsional</span>
              </div>
              <button type="button" @click="addCustomMenu"
                class="text-sm text-red-600 border border-red-200 rounded-full px-4 py-1.5 hover:bg-red-50 font-semibold transition">
                + Tambah
              </button>
            </div>
            <div class="p-6">
              <p class="text-sm text-gray-400 mb-4">💡 Ada permintaan menu khusus? Admin akan menghubungi via WhatsApp untuk konfirmasi harga.</p>
              <div v-if="customMenus.length === 0" class="text-center py-4 text-gray-400 text-sm">Belum ada custom menu.</div>
              <div v-for="(cm, i) in customMenus" :key="i" class="rounded-2xl p-4 mb-3 border border-red-100 bg-red-50/50">
                <div class="flex justify-between items-center mb-3">
                  <span class="text-sm font-bold text-red-600">Menu Custom #{{ i + 1 }}</span>
                  <button type="button" @click="customMenus.splice(i, 1)"
                    class="w-7 h-7 rounded-full bg-red-100 hover:bg-red-200 text-red-500 flex items-center justify-center font-bold transition">×</button>
                </div>
                <div class="grid grid-cols-3 gap-2">
                  <input v-model="cm.item_name" type="text" placeholder="Nama menu"
                    class="col-span-2 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-red-400" />
                  <input v-model.number="cm.pax" type="number" min="1" placeholder="Pax"
                    class="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-red-400" />
                  <input v-model="cm.description" type="text" placeholder="Keterangan (opsional)"
                    class="col-span-3 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-red-400 mt-1" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Kanan - Ringkasan -->
        <div>
          <div class="bg-white rounded-3xl shadow-md p-6 sticky top-24">
            <h2 class="font-extrabold text-gray-800 mb-4">🧾 Ringkasan Pesanan</h2>

            <div v-for="item in cartStore.items" :key="item.id" class="flex justify-between text-sm text-gray-500 mb-2">
              <span class="truncate mr-2 max-w-[140px]">{{ item.name }} ×{{ item.qty }}</span>
              <span class="font-semibold flex-shrink-0">{{ formatRupiah(item.price * item.qty) }}</span>
            </div>

            <hr class="my-4" />

            <div class="space-y-2 text-sm mb-4">
              <div class="flex justify-between text-gray-500">
                <span>Subtotal ({{ totalPax }} pax)</span>
                <span class="font-semibold">{{ formatRupiah(cartStore.total) }}</span>
              </div>
              <div class="flex justify-between text-gray-500">
                <span>Ongkos Kirim</span>
                <span class="font-semibold">{{ deliveryFee === 0 ? 'Gratis 🎉' : formatRupiah(deliveryFee) }}</span>
              </div>
              <div class="flex justify-between text-gray-500">
                <span>Biaya Layanan</span>
                <span class="font-semibold">{{ formatRupiah(priceConfig.service_fee) }}</span>
              </div>
              <div v-if="couponDiscount > 0" class="flex justify-between text-green-600">
                <span>Diskon ({{ appliedCoupon?.code }})</span>
                <span class="font-semibold">− {{ formatRupiah(couponDiscount) }}</span>
              </div>
            </div>

            <!-- Input Kupon -->
            <div class="mb-4">
              <label class="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">🎟 Kode Kupon</label>
              <div class="flex gap-2">
                <input v-model="couponCode" type="text" placeholder="Masukkan kode kupon"
                  :disabled="!!appliedCoupon"
                  class="flex-1 border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-red-400 transition disabled:bg-gray-50 disabled:text-gray-400 uppercase" />
                <button v-if="!appliedCoupon" type="button" @click="handleCheckCoupon" :disabled="checkingCoupon || !couponCode.trim()"
                  class="px-4 py-2 bg-red-600 text-white text-sm font-bold rounded-xl hover:bg-red-700 disabled:opacity-50 transition flex-shrink-0">
                  {{ checkingCoupon ? '...' : 'Pakai' }}
                </button>
                <button v-else type="button" @click="removeCoupon"
                  class="px-4 py-2 bg-gray-200 text-gray-600 text-sm font-bold rounded-xl hover:bg-gray-300 transition flex-shrink-0">
                  ✕
                </button>
              </div>
              <p v-if="couponError" class="text-xs text-red-500 mt-1">{{ couponError }}</p>
              <p v-if="appliedCoupon" class="text-xs text-green-600 mt-1 font-semibold">
                ✅ {{ appliedCoupon.description || appliedCoupon.code }} — hemat {{ formatRupiah(couponDiscount) }}
              </p>
            </div>

            <hr class="my-4" />

            <div class="flex justify-between font-extrabold text-gray-800 text-lg mb-1">
              <span>Total</span>
              <span class="text-red-600">{{ formatRupiah(grandTotal) }}</span>
            </div>
            <p class="text-xs text-gray-400 mb-5">* Belum termasuk custom menu (jika ada)</p>

            <div v-if="error" class="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">{{ error }}</div>

            <button type="submit" :disabled="loading || minPaxErrors.length > 0 || priceChangedItems.length > 0"
              class="block w-full text-center bg-gradient-to-r from-red-600 to-orange-500 text-white py-3.5 rounded-2xl font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition disabled:opacity-50 disabled:cursor-not-allowed mb-3">
              <span v-if="loading" class="inline-flex items-center gap-2">
                <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>Memproses...
              </span>
              <span v-else>🛍️ Buat Pesanan</span>
            </button>

            <RouterLink to="/customer/cart"
              class="block w-full text-center border-2 border-gray-200 text-gray-500 py-3 rounded-2xl font-semibold hover:border-red-300 hover:text-red-500 transition text-sm">
              ← Kembali ke Keranjang
            </RouterLink>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { createOrder } from '@/api/orders'
import { getPriceConfig, checkCoupon, getMenus } from '@/api/menus'

const cartStore = useCartStore()
const router = useRouter()

const kotaList = ['Jakarta Utara', 'Jakarta Timur', 'Jakarta Pusat', 'Jakarta Selatan', 'Jakarta Barat']

// Price config dari server (default hardcode sampai fetch selesai)
const priceConfig = ref({
  service_fee:          5000,
  delivery_fee_per_km:  5000,
  free_delivery_radius: 5,
})

const form = ref({
  nama_pemesan: '', no_hp: '', event_date: '',
  event_city: '', event_address: '', distance_km: 0, notes: '',
})
const customMenus   = ref([])
const loading       = ref(false)
const error         = ref('')

// Kupon
const couponCode      = ref('')
const checkingCoupon  = ref(false)
const couponError     = ref('')
const appliedCoupon   = ref(null)
const couponDiscount  = ref(0)

// Validasi harga
const priceChangedItems = ref([])

// H-2: minimal 2 hari dari sekarang
const minDate = computed(() => {
  const d = new Date()
  d.setDate(d.getDate() + 2)
  return d.toISOString().split('T')[0]
})

const totalPax = computed(() => cartStore.items.reduce((s, i) => s + i.qty, 0))

const deliveryFee = computed(() => {
  const km = Number(form.value.distance_km) || 0
  const free = priceConfig.value.free_delivery_radius
  return km <= free ? 0 : (km - free) * priceConfig.value.delivery_fee_per_km
})

const subtotal = computed(() => cartStore.total)

const grandTotal = computed(() =>
  subtotal.value + deliveryFee.value + priceConfig.value.service_fee - couponDiscount.value
)

// Validasi min pax per item
const minPaxErrors = computed(() => {
  const errors = []
  cartStore.items.forEach(item => {
    const isAqiqah = item.name?.toLowerCase().includes('aqiqah')
    const minPax = isAqiqah ? 1 : (item.min_pax || 20)
    if (item.qty < minPax) {
      errors.push(`${item.name}: minimal ${minPax} pax (sekarang ${item.qty} pax)`)
    }
  })
  return errors
})

function formatRupiah(val) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val)
}

function addCustomMenu() {
  customMenus.value.push({ item_name: '', pax: 10, description: '' })
}

// Cek apakah ada harga yang berubah dibanding server
async function validateCartPrices() {
  if (cartStore.items.length === 0) return
  try {
    const ids = cartStore.items.map(i => i.id).join(',')
    const res = await getMenus({ ids, limit: 100 })
    const serverMenus = res.data?.data?.data || res.data?.data || []
    const changed = []
    cartStore.items.forEach(item => {
      const server = serverMenus.find(m => m.id === item.id)
      if (server && parseFloat(server.price) !== parseFloat(item.price)) {
        changed.push({ id: item.id, name: item.name, oldPrice: item.price, newPrice: parseFloat(server.price) })
      }
    })
    priceChangedItems.value = changed
  } catch {
    // Gagal cek — lanjutkan saja
  }
}

function applyUpdatedPrices() {
  priceChangedItems.value.forEach(item => {
    cartStore.items.find(i => i.id === item.id).price = item.newPrice
  })
  cartStore.saveToStorage?.()
  priceChangedItems.value = []
}

async function handleCheckCoupon() {
  if (!couponCode.value.trim()) return
  checkingCoupon.value = true
  couponError.value = ''
  try {
    const res = await checkCoupon(couponCode.value.trim(), subtotal.value)
    const data = res.data.data
    appliedCoupon.value  = data
    couponDiscount.value = data.discount
  } catch (err) {
    couponError.value = err.response?.data?.message || 'Kode kupon tidak valid.'
    appliedCoupon.value  = null
    couponDiscount.value = 0
  } finally {
    checkingCoupon.value = false
  }
}

function removeCoupon() {
  appliedCoupon.value  = null
  couponDiscount.value = 0
  couponCode.value     = ''
  couponError.value    = ''
}

onMounted(async () => {
  // Ambil price config dari server
  try {
    const res = await getPriceConfig()
    priceConfig.value = res.data.data
  } catch { /* pakai default */ }

  // Validasi harga cart
  await validateCartPrices()
})

async function handleCheckout() {
  error.value = ''
  if (minPaxErrors.value.length > 0) {
    error.value = 'Harap penuhi minimum pax untuk setiap menu.'
    return
  }
  if (priceChangedItems.value.length > 0) {
    error.value = 'Ada harga menu yang berubah. Silakan perbarui harga terlebih dahulu.'
    return
  }
  loading.value = true
  try {
    const payload = {
      nama_pemesan:  form.value.nama_pemesan,
      no_hp:         form.value.no_hp,
      event_date:    form.value.event_date,
      event_city:    form.value.event_city,
      event_address: form.value.event_address,
      distance_km:   form.value.distance_km,
      notes:         form.value.notes,
      coupon_code:   appliedCoupon.value?.code || null,
      items: cartStore.items.map(i => ({
        menu_id: i.id, menu_name: i.name, price: i.price, pax: i.qty,
      })),
      custom_menus: customMenus.value.filter(c => c.item_name.trim()),
    }
    const res = await createOrder(payload)
    cartStore.clearCart()
    const orderId = res.data?.data?.id || res.data?.id
    router.push(`/customer/payment/${orderId}`)
  } catch (err) {
    error.value = err.response?.data?.message || 'Gagal membuat pesanan. Silakan coba lagi.'
  } finally {
    loading.value = false
  }
}
</script>
