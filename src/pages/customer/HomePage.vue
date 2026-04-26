<template>
  <div>
    <!-- HERO -->
    <section class="relative bg-white overflow-hidden min-h-screen flex items-center">
      <div class="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-br from-red-50 to-orange-50 hidden lg:block"
           style="clip-path: polygon(12% 0%, 100% 0%, 100% 100%, 0% 100%)"></div>
      <div class="absolute top-0 right-0 w-1/2 h-full hidden lg:block"
           style="clip-path: polygon(12% 0%, 100% 0%, 100% 100%, 0% 100%);
                  background-image: radial-gradient(circle, rgba(192,57,43,.08) 1.5px, transparent 1.5px);
                  background-size: 28px 28px"></div>
      <div class="max-w-6xl mx-auto px-4 py-20 w-full">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <div class="relative z-10">
            <div class="inline-flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-full px-5 py-2 text-sm font-bold mb-6">
              <span class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              Melayani Seluruh Wilayah Jakarta
            </div>
            <h1 class="text-4xl lg:text-5xl font-extrabold leading-tight text-gray-900 mb-5">
              Catering Lezat untuk<br>Setiap Momen
              <span class="text-red-600 relative"> Spesial
                <span class="absolute bottom-1 left-0 w-full h-1.5 bg-gradient-to-r from-red-500 to-orange-400 rounded opacity-30"></span>
              </span>
            </h1>
            <p class="text-gray-500 text-lg leading-relaxed mb-8">
              Nasi box berkualitas & paket aqiqah lengkap dengan cita rasa terbaik.<br>
              Pesan online, terima di lokasi Anda — tepat waktu, selalu!
            </p>
            <div class="flex flex-wrap gap-3">
              <RouterLink to="/menu" class="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-orange-500 text-white px-7 py-3.5 rounded-full font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition">
                🍱 Lihat Menu
              </RouterLink>
              <RouterLink to="/track" class="inline-flex items-center gap-2 border-2 border-gray-200 text-gray-700 px-6 py-3 rounded-full font-bold hover:border-red-500 hover:text-red-600 transition">
                🔍 Lacak Pesanan
              </RouterLink>
            </div>
            <div class="flex gap-8 mt-10 pt-7 border-t border-gray-100">
              <div v-for="s in heroStats" :key="s.lbl">
                <div class="text-2xl font-extrabold text-gray-900">{{ s.num }}</div>
                <div class="text-xs text-gray-400 font-semibold mt-1">{{ s.lbl }}</div>
              </div>
            </div>
          </div>
          <div class="hidden lg:flex items-center justify-center relative">
            <div class="w-96 h-96 rounded-full bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center"
                 style="box-shadow: 0 0 0 20px rgba(192,57,43,.04), 0 0 0 40px rgba(192,57,43,.025)">
              <span style="font-size:8rem;filter:drop-shadow(0 20px 40px rgba(0,0,0,.15))">🍱</span>
            </div>
            <div class="absolute top-8 -left-4 bg-white rounded-2xl shadow-lg px-4 py-3 flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center text-lg">🚚</div>
              <div><div class="text-sm font-bold">Antar ke Lokasi</div><div class="text-xs text-gray-400">Seluruh area Jakarta</div></div>
            </div>
            <div class="absolute bottom-16 -right-4 bg-white rounded-2xl shadow-lg px-4 py-3 flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center text-lg">⭐</div>
              <div>
                <div class="text-sm font-bold">Rating {{ publicStats.avg_rating }}/5</div>
                <div class="text-xs text-gray-400">dari {{ publicStats.total_reviews || 10 }}+ review</div>
              </div>
            </div>
            <div class="absolute top-1/2 -left-10 bg-white rounded-2xl shadow-lg px-4 py-3 flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl bg-yellow-100 flex items-center justify-center text-lg">🍛</div>
              <div><div class="text-sm font-bold">Menu Segar</div><div class="text-xs text-gray-400">Dimasak tiap hari</div></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- STATS BAR -->
    <div class="bg-gradient-to-r from-red-600 to-orange-500 py-7">
      <div class="max-w-5xl mx-auto px-4 flex flex-wrap justify-center gap-8">
        <div v-for="s in statsBar" :key="s.lbl" class="text-center text-white">
          <div class="text-2xl font-extrabold">{{ s.num }}</div>
          <div class="text-xs opacity-75 mt-1 font-semibold">{{ s.lbl }}</div>
        </div>
      </div>
    </div>

    <!-- KATEGORI dari API -->
    <section class="py-16">
      <div class="max-w-6xl mx-auto px-4">
        <div class="flex items-end justify-between mb-8">
          <div>
            <p class="text-xs font-extrabold uppercase tracking-widest text-red-600 mb-1">Kategori</p>
            <h2 class="text-3xl font-extrabold text-gray-900">Pilih <span class="text-red-600">Kategori</span> Favorit</h2>
            <div class="w-12 h-1 bg-gradient-to-r from-red-600 to-orange-400 rounded mt-3"></div>
          </div>
          <RouterLink to="/menu" class="text-sm text-red-600 font-bold hover:underline hidden md:block">Semua Menu →</RouterLink>
        </div>

        <div v-if="loadingCategories" class="grid grid-cols-3 md:grid-cols-6 gap-3">
          <div v-for="i in 6" :key="i" class="bg-gray-100 rounded-2xl h-28 animate-pulse"></div>
        </div>
        <div v-else class="grid grid-cols-3 md:grid-cols-6 gap-3">
          <RouterLink v-for="cat in displayCategories" :key="cat.id || cat.name"
            :to="`/menu?category_id=${cat.id || ''}`"
            class="block bg-white rounded-2xl p-5 text-center shadow-sm border-2 border-transparent hover:border-red-500 hover:-translate-y-1 hover:shadow-lg transition">
            <div class="w-16 h-16 bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-3">{{ catIcon(cat.name) }}</div>
            <div class="text-xs font-bold text-gray-800 truncate">{{ cat.name }}</div>
            <div class="text-xs text-gray-400 mt-1">{{ cat.menus_count || 0 }} menu</div>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- MENU UNGGULAN -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-6xl mx-auto px-4">
        <div class="flex items-end justify-between mb-8">
          <div>
            <p class="text-xs font-extrabold uppercase tracking-widest text-red-600 mb-1">Menu Terpopuler</p>
            <h2 class="text-3xl font-extrabold text-gray-900">Menu <span class="text-red-600">Unggulan</span> Kami</h2>
            <div class="w-12 h-1 bg-gradient-to-r from-red-600 to-orange-400 rounded mt-3"></div>
          </div>
          <RouterLink to="/menu" class="text-sm text-red-600 font-bold hover:underline hidden md:block">Lihat Semua →</RouterLink>
        </div>

        <div v-if="loadingMenus" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="i in 6" :key="i" class="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
            <div class="h-40 bg-gray-100"></div>
            <div class="p-4 space-y-2">
              <div class="h-3 bg-gray-100 rounded w-1/3"></div>
              <div class="h-4 bg-gray-100 rounded w-2/3"></div>
              <div class="h-3 bg-gray-100 rounded w-1/2"></div>
            </div>
          </div>
        </div>
        <div v-else-if="featuredMenus.length === 0" class="text-center py-16 text-gray-300">
          <div class="text-4xl mb-3">🍱</div>
          <p class="text-gray-400">Menu sedang dipersiapkan...</p>
        </div>
        <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <MenuCard v-for="menu in featuredMenus" :key="menu.id" :menu="menu" />
        </div>
      </div>
    </section>

    <!-- CARA PESAN -->
    <section class="py-16 bg-white">
      <div class="max-w-5xl mx-auto px-4">
        <div class="text-center mb-12">
          <p class="text-xs font-extrabold uppercase tracking-widest text-red-600 mb-1">Mudah & Cepat</p>
          <h2 class="text-3xl font-extrabold text-gray-900">Cara <span class="text-red-600">Pesan</span></h2>
          <div class="w-12 h-1 bg-gradient-to-r from-red-600 to-orange-400 rounded mx-auto mt-3"></div>
          <p class="text-gray-400 mt-3">Hanya 4 langkah, pesanan langsung diproses</p>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div v-for="(step, i) in steps" :key="i" class="text-center relative">
            <div class="w-20 h-20 rounded-full bg-gradient-to-br from-red-50 to-orange-50 border-2 border-dashed border-red-200 flex items-center justify-center text-3xl mx-auto mb-4 relative hover:scale-110 transition">
              {{ step.icon }}
              <span class="absolute -top-1 -right-1 w-6 h-6 bg-red-600 text-white text-xs font-extrabold rounded-full flex items-center justify-center">{{ i+1 }}</span>
            </div>
            <div class="font-bold text-gray-800 text-sm mb-1">{{ step.title }}</div>
            <p class="text-xs text-gray-400 leading-relaxed">{{ step.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- KENAPA KAMI -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-6xl mx-auto px-4">
        <div class="grid lg:grid-cols-5 gap-10 items-center">
          <div class="lg:col-span-2">
            <p class="text-xs font-extrabold uppercase tracking-widest text-red-600 mb-1">Keunggulan Kami</p>
            <h2 class="text-3xl font-extrabold text-gray-900 mb-3">Kenapa Pilih <span class="text-red-600">Kami?</span></h2>
            <div class="w-12 h-1 bg-gradient-to-r from-red-600 to-orange-400 rounded mb-4"></div>
            <p class="text-gray-400 text-sm leading-relaxed mb-6">Kami berkomitmen memberikan pengalaman catering terbaik — dari kualitas makanan hingga ketepatan pengiriman.</p>
            <RouterLink to="/menu" class="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-orange-500 text-white px-6 py-3 rounded-full font-bold hover:-translate-y-0.5 transition shadow-md">
              Pesan Sekarang →
            </RouterLink>
          </div>
          <div class="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-for="w in whyUs" :key="w.title" class="flex items-start gap-4 bg-white rounded-2xl p-5 shadow-sm hover:-translate-y-1 hover:shadow-md transition">
              <div :class="`w-12 h-12 rounded-2xl flex items-center justify-center text-xl flex-shrink-0 ${w.bg}`">{{ w.icon }}</div>
              <div>
                <div class="font-bold text-gray-800 text-sm mb-1">{{ w.title }}</div>
                <p class="text-xs text-gray-400 leading-relaxed">{{ w.desc }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- TESTIMONI dari API -->
    <section class="py-16 bg-white">
      <div class="max-w-6xl mx-auto px-4">
        <div class="text-center mb-12">
          <p class="text-xs font-extrabold uppercase tracking-widest text-red-600 mb-1">Testimoni</p>
          <h2 class="text-3xl font-extrabold text-gray-900">Kata <span class="text-red-600">Pelanggan</span> Kami</h2>
          <div class="w-12 h-1 bg-gradient-to-r from-red-600 to-orange-400 rounded mx-auto mt-3"></div>
        </div>
        <div v-if="loadingReviews" class="grid md:grid-cols-3 gap-6">
          <div v-for="i in 3" :key="i" class="bg-gray-50 rounded-2xl p-6 animate-pulse h-40"></div>
        </div>
        <div v-else-if="reviews.length > 0" class="grid md:grid-cols-3 gap-6">
          <div v-for="r in reviews.slice(0,6)" :key="r.order_number || r.customer" class="bg-white rounded-2xl shadow-md p-6 relative border border-gray-50">
            <div class="absolute top-4 right-5 text-5xl text-red-100 font-serif leading-none">"</div>
            <div class="text-yellow-400 text-sm mb-3">{{ '★'.repeat(r.rating) }}{{ '☆'.repeat(5 - r.rating) }}</div>
            <p class="text-sm text-gray-500 leading-relaxed mb-5">{{ r.comment || 'Pelanggan puas dengan pelayanan kami.' }}</p>
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-orange-400 flex items-center justify-center text-white font-bold text-sm">{{ r.customer?.[0]?.toUpperCase() || 'A' }}</div>
              <div>
                <div class="text-sm font-bold text-gray-800">{{ r.customer }}</div>
                <div class="text-xs text-gray-400">{{ r.date }}</div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="grid md:grid-cols-3 gap-6">
          <div v-for="t in fallbackTestimonials" :key="t.name" class="bg-white rounded-2xl shadow-md p-6 relative border border-gray-50">
            <div class="absolute top-4 right-5 text-5xl text-red-100 font-serif leading-none">"</div>
            <div class="text-yellow-400 text-sm mb-3">★★★★★</div>
            <p class="text-sm text-gray-500 leading-relaxed mb-5">{{ t.text }}</p>
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-orange-400 flex items-center justify-center text-white font-bold text-sm">{{ t.name[0] }}</div>
              <div>
                <div class="text-sm font-bold text-gray-800">{{ t.name }}</div>
                <div class="text-xs text-gray-400">{{ t.role }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-16">
      <div class="max-w-6xl mx-auto px-4">
        <div class="rounded-3xl overflow-hidden relative p-12 md:p-16" style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 55%, #0f3460 100%)">
          <div class="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-red-600 opacity-10"></div>
          <div class="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-orange-400 opacity-10"></div>
          <div class="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <p class="text-xs font-extrabold uppercase tracking-widest text-white opacity-50 mb-2">Mulai Sekarang</p>
              <h2 class="text-3xl md:text-4xl font-extrabold text-white mb-3">Siap Buat Acara Anda<br><span class="text-yellow-400">Lebih Berkesan?</span></h2>
              <p class="text-white opacity-60 leading-relaxed">Percayakan kebutuhan catering Anda kepada kami.<br>Kualitas terjamin, harga bersahabat, pengiriman tepat waktu.</p>
            </div>
            <div class="flex flex-wrap gap-3 flex-shrink-0">
              <RouterLink to="/menu" class="inline-flex items-center gap-2 bg-white text-red-600 px-7 py-3.5 rounded-full font-extrabold shadow-xl hover:-translate-y-0.5 transition">🛒 Pesan Sekarang</RouterLink>
              <RouterLink to="/track" class="inline-flex items-center gap-2 bg-white/10 border-2 border-white/20 text-white px-6 py-3 rounded-full font-bold hover:bg-white/20 transition">🔍 Lacak Pesanan</RouterLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getMenus, getCategories, getPublicStats } from '@/api/menus'
import { getReviews } from '@/api/reviews'
import MenuCard from '@/components/MenuCard.vue'

const featuredMenus     = ref([])
const loadingMenus      = ref(true)
const reviews           = ref([])
const loadingReviews    = ref(true)
const apiCategories     = ref([])
const loadingCategories = ref(true)

// Stats dari API /stats (publik)
const publicStats = ref({
  total_completed: 0,
  total_menus: 0,
  avg_rating: 4.8,
  total_reviews: 0,
})

// ── Computed stats dinamis ───────────────────────────────────

const heroStats = computed(() => [
  {
    num: publicStats.value.total_completed > 0
      ? publicStats.value.total_completed + '+'
      : '500+',
    lbl: 'Pesanan Selesai',
  },
  {
    num: publicStats.value.avg_rating + '★',
    lbl: 'Rating Pelanggan',
  },
  {
    num: '10+',
    lbl: 'Tahun Pengalaman',
  },
])

const statsBar = computed(() => [
  {
    num: publicStats.value.total_completed > 0
      ? publicStats.value.total_completed + '+'
      : '500+',
    lbl: 'Pesanan Sukses',
  },
  {
    num: publicStats.value.total_menus > 0
      ? publicStats.value.total_menus + '+'
      : '50+',
    lbl: 'Menu Pilihan',
  },
  {
    num: publicStats.value.avg_rating + '★',
    lbl: 'Rating Rata-rata',
  },
  {
    num: '10+',
    lbl: 'Tahun Melayani',
  },
])

// ── Kategori ────────────────────────────────────────────────
const catIconMap = {
  'nasi box': '🍱', 'nasi': '🍚', 'ayam': '🍗', 'kambing': '🥩', 'sapi': '🥩',
  'prasmanan': '🥗', 'snack': '🍢', 'dessert': '🍰', 'kue': '🎂',
  'aqiqah': '🐑', 'paket': '🎁', 'soup': '🍲', 'sea': '🦐',
}
function catIcon(name = '') {
  const key = Object.keys(catIconMap).find(k => name.toLowerCase().includes(k))
  return key ? catIconMap[key] : '🍽️'
}

const fallbackCats = [
  { id: '', name: 'Nasi Box',  menus_count: null },
  { id: '', name: 'Ayam',      menus_count: null },
  { id: '', name: 'Kambing',   menus_count: null },
  { id: '', name: 'Prasmanan', menus_count: null },
  { id: '', name: 'Snack Box', menus_count: null },
  { id: '', name: 'Dessert',   menus_count: null },
]
const displayCategories = computed(() =>
  apiCategories.value.length > 0 ? apiCategories.value.slice(0, 6) : fallbackCats
)

// ── Static content ───────────────────────────────────────────
const steps = [
  { icon: '🛒', title: 'Pilih Menu',        desc: 'Jelajahi katalog dan tambahkan menu ke keranjang belanja' },
  { icon: '📝', title: 'Isi Detail',         desc: 'Lengkapi data acara, tanggal, dan alamat pengiriman' },
  { icon: '💳', title: 'Bayar via Transfer', desc: 'Bayar mudah lalu upload bukti transfer' },
  { icon: '🚚', title: 'Terima Pesanan',     desc: 'Pesanan dikirim tepat waktu ke lokasi acara Anda' },
]
const whyUs = [
  { icon: '🔥', bg: 'bg-red-100',    title: 'Masak Segar Tiap Hari',  desc: 'Dimasak fresh setiap hari dengan bahan pilihan berkualitas tanpa pengawet.' },
  { icon: '🚚', bg: 'bg-orange-100', title: 'Antar ke Lokasi',         desc: 'Pengiriman tepat waktu ke seluruh area Jakarta oleh tim berpengalaman.' },
  { icon: '💰', bg: 'bg-green-100',  title: 'Harga Terjangkau',        desc: 'Paket mulai Rp 35.000/pax, cocok untuk semua kalangan dan acara.' },
  { icon: '📱', bg: 'bg-blue-100',   title: 'Pesan 100% Online',       desc: 'Sistem pemesanan mudah, cepat, dan status bisa dipantau realtime.' },
]
const fallbackTestimonials = [
  { name: 'Anisa R.',  role: 'Ibu Rumah Tangga', text: 'Pesan untuk acara arisan, makanannya enak banget dan datang tepat waktu. Tamunya pada happy semua!' },
  { name: 'Budi S.',   role: 'Event Organizer',  text: 'Sudah bekerja sama untuk beberapa event kantor. Konsisten enak, porsi pas, dan harga bersahabat.' },
  { name: 'Dina K.',   role: 'Pelanggan Tetap',  text: 'Paket aqiqahnya komplit dan enak. Prosesnya gampang banget, pesan online langsung beres!' },
]

// ── Fetch semua data secara parallel ────────────────────────
onMounted(async () => {
  await Promise.all([
    // Featured menus
    getMenus({ limit: 6 })
      .then(res => {
        const outer = res.data?.data
        featuredMenus.value = Array.isArray(outer?.data) ? outer.data
          : Array.isArray(outer) ? outer : []
      })
      .catch(() => { featuredMenus.value = [] })
      .finally(() => { loadingMenus.value = false }),

    // Kategori
    getCategories()
      .then(res => {
        const d = res.data?.data
        apiCategories.value = Array.isArray(d) ? d : (d?.data ?? [])
      })
      .catch(() => { apiCategories.value = [] })
      .finally(() => { loadingCategories.value = false }),

    // Reviews — untuk testimoni
    getReviews()
      .then(res => { reviews.value = res.data?.data || [] })
      .catch(() => { reviews.value = [] })
      .finally(() => { loadingReviews.value = false }),

    // Public stats — total_completed, total_menus, avg_rating, total_reviews
    getPublicStats()
      .then(res => {
        const d = res.data?.data
        if (d) publicStats.value = { ...publicStats.value, ...d }
      })
      .catch(() => { /* biarkan fallback */ }),
  ])
})
</script>
