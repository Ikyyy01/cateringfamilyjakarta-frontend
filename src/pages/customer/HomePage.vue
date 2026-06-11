<template>
  <div>
    <!-- HERO -->
    <section class="relative bg-white overflow-hidden flex items-center min-h-[85vh] sm:min-h-screen">
      <div class="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-br from-red-50 to-orange-50 hidden lg:block"
           style="clip-path: polygon(12% 0%, 100% 0%, 100% 100%, 0% 100%)"></div>
      <div class="absolute top-0 right-0 w-1/2 h-full hidden lg:block"
           style="clip-path: polygon(12% 0%, 100% 0%, 100% 100%, 0% 100%);
                  background-image: radial-gradient(circle, rgba(192,57,43,.08) 1.5px, transparent 1.5px);
                  background-size: 28px 28px"></div>
      <!-- Mobile bg decoration -->
      <div class="absolute inset-0 lg:hidden"
           style="background: radial-gradient(ellipse at 80% 0%, rgba(255,235,230,.6) 0%, transparent 60%)"></div>

      <div class="max-w-6xl mx-auto px-4 py-14 sm:py-20 w-full">
        <div class="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div class="relative z-10">
            <div class="inline-flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-full px-4 py-1.5 text-xs sm:text-sm font-bold mb-5">
              <span class="w-2 h-2 rounded-full bg-red-500 animate-pulse flex-shrink-0"></span>
              Melayani Seluruh Wilayah Jakarta
            </div>
            <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight text-gray-900 mb-4">
              Catering Lezat untuk<br class="hidden sm:block">
              <span class="sm:hidden"> </span>Setiap Momen
              <span class="text-red-600 relative"> Spesial
                <span class="absolute bottom-1 left-0 w-full h-1.5 bg-gradient-to-r from-red-500 to-orange-400 rounded opacity-30"></span>
              </span>
            </h1>
            <p class="text-gray-500 text-base sm:text-lg leading-relaxed mb-7">
              Nasi box berkualitas & paket aqiqah lengkap dengan cita rasa terbaik.
              Pesan online, terima di lokasi Anda — tepat waktu, selalu!
            </p>
            <div class="flex flex-wrap gap-3">
              <RouterLink to="/menu" class="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-orange-500 text-white px-6 sm:px-7 py-3 sm:py-3.5 rounded-full font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition text-sm sm:text-base">
                Lihat Menu
              </RouterLink>
              <RouterLink to="/track" class="inline-flex items-center gap-2 border-2 border-gray-200 text-gray-700 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-bold hover:border-red-500 hover:text-red-600 transition text-sm sm:text-base">
                Lacak Pesanan
              </RouterLink>
            </div>
            <div class="flex gap-6 sm:gap-8 mt-8 pt-6 border-t border-gray-100">
              <div v-for="s in heroStats" :key="s.lbl">
                <div class="text-xl sm:text-2xl font-extrabold text-gray-900">{{ s.num }}</div>
                <div class="text-xs text-gray-400 font-semibold mt-0.5">{{ s.lbl }}</div>
              </div>
            </div>
          </div>
          <div class="hidden lg:flex items-center justify-center relative">
            <div class="w-96 h-96 rounded-full bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center"
                 style="box-shadow: 0 0 0 20px rgba(192,57,43,.04), 0 0 0 40px rgba(192,57,43,.025)">
              <svg class="w-40 h-40 text-red-200" fill="none" stroke="currentColor" stroke-width="1" viewBox="0 0 24 24" style="filter:drop-shadow(0 20px 40px rgba(0,0,0,.10))"><path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
            </div>
            <div class="absolute top-8 -left-4 bg-white rounded-2xl shadow-lg px-4 py-3 flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center">
                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"/></svg>
              </div>
              <div><div class="text-sm font-bold">Antar ke Lokasi</div><div class="text-xs text-gray-400">Seluruh area Jakarta</div></div>
            </div>
            <div class="absolute bottom-16 -right-4 bg-white rounded-2xl shadow-lg px-4 py-3 flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center">
                <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>
              </div>
              <div>
                <div class="text-sm font-bold">Rating {{ publicStats.avg_rating }}/5</div>
                <div class="text-xs text-gray-400">dari {{ publicStats.total_reviews || 10 }}+ review</div>
              </div>
            </div>
            <div class="absolute top-1/2 -left-10 bg-white rounded-2xl shadow-lg px-4 py-3 flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl bg-yellow-100 flex items-center justify-center">
                <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
              </div>
              <div><div class="text-sm font-bold">Menu Segar</div><div class="text-xs text-gray-400">Dimasak tiap hari</div></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- STATS BAR -->
    <div class="bg-gradient-to-r from-red-600 to-orange-500 py-6">
      <div class="max-w-5xl mx-auto px-4">
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8">
          <div v-for="s in statsBar" :key="s.lbl" class="text-center text-white">
            <div class="text-xl sm:text-2xl font-extrabold">{{ s.num }}</div>
            <div class="text-xs opacity-75 mt-0.5 font-semibold">{{ s.lbl }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- KATEGORI dari API -->
    <section class="py-12 sm:py-16">
      <div class="max-w-6xl mx-auto px-4">
        <div class="flex items-end justify-between mb-6 sm:mb-8">
          <div>
            <p class="text-xs font-extrabold uppercase tracking-widest text-red-600 mb-1">Kategori</p>
            <h2 class="text-2xl sm:text-3xl font-extrabold text-gray-900">Pilih <span class="text-red-600">Kategori</span> Favorit</h2>
            <div class="w-12 h-1 bg-gradient-to-r from-red-600 to-orange-400 rounded mt-3"></div>
          </div>
          <RouterLink to="/menu" class="text-sm text-red-600 font-bold hover:underline hidden md:block">Semua Menu →</RouterLink>
        </div>

        <div v-if="loadingCategories" class="grid grid-cols-3 md:grid-cols-6 gap-3">
          <div v-for="i in 6" :key="i" class="bg-gray-100 rounded-2xl h-24 sm:h-28 animate-pulse"></div>
        </div>
        <div v-else class="grid grid-cols-3 md:grid-cols-6 gap-3">
          <RouterLink v-for="cat in displayCategories" :key="cat.id || cat.name"
            :to="`/menu?category_id=${cat.id || ''}`"
            class="block bg-white rounded-2xl p-3 sm:p-5 text-center shadow-sm border-2 border-transparent hover:border-red-500 hover:-translate-y-1 hover:shadow-lg transition">
            <div class="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-3">
              <svg class="w-6 h-6 text-red-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
            </div>
            <div class="text-xs font-bold text-gray-800 truncate">{{ cat.name }}</div>
            <div class="text-xs text-gray-400 mt-0.5">{{ cat.menus_count || 0 }} menu</div>
          </RouterLink>
        </div>

        <div class="mt-5 md:hidden text-center">
          <RouterLink to="/menu" class="text-sm text-red-600 font-bold hover:underline">Semua Menu →</RouterLink>
        </div>
      </div>
    </section>

    <!-- MENU UNGGULAN -->
    <section class="py-12 sm:py-16 bg-gray-50">
      <div class="max-w-6xl mx-auto px-4">
        <div class="flex items-end justify-between mb-6 sm:mb-8">
          <div>
            <p class="text-xs font-extrabold uppercase tracking-widest text-red-600 mb-1">Menu Terpopuler</p>
            <h2 class="text-2xl sm:text-3xl font-extrabold text-gray-900">Menu <span class="text-red-600">Unggulan</span> Kami</h2>
            <div class="w-12 h-1 bg-gradient-to-r from-red-600 to-orange-400 rounded mt-3"></div>
          </div>
          <RouterLink to="/menu" class="text-sm text-red-600 font-bold hover:underline hidden md:block">Lihat Semua →</RouterLink>
        </div>

        <div v-if="loadingMenus" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
          <svg class="w-12 h-12 mx-auto mb-3 text-gray-200" fill="none" stroke="currentColor" stroke-width="1" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
          <p class="text-gray-400">Menu sedang dipersiapkan...</p>
        </div>
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          <MenuCard v-for="menu in featuredMenus" :key="menu.id" :menu="menu" />
        </div>

        <div class="mt-6 md:hidden text-center">
          <RouterLink to="/menu" class="text-sm text-red-600 font-bold hover:underline">Lihat Semua Menu →</RouterLink>
        </div>
      </div>
    </section>

    <!-- CARA PESAN -->
    <section class="py-12 sm:py-16 bg-white">
      <div class="max-w-5xl mx-auto px-4">
        <div class="text-center mb-8 sm:mb-12">
          <p class="text-xs font-extrabold uppercase tracking-widest text-red-600 mb-1">Mudah & Cepat</p>
          <h2 class="text-2xl sm:text-3xl font-extrabold text-gray-900">Cara <span class="text-red-600">Pesan</span></h2>
          <div class="w-12 h-1 bg-gradient-to-r from-red-600 to-orange-400 rounded mx-auto mt-3"></div>
          <p class="text-gray-400 mt-3 text-sm">Hanya 4 langkah, pesanan langsung diproses</p>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div v-for="(step, i) in steps" :key="i" class="text-center relative">
            <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-red-50 to-orange-50 border-2 border-dashed border-red-200 flex items-center justify-center mx-auto mb-3 sm:mb-4 relative hover:scale-110 transition">
              <component :is="step.iconComponent" class="w-7 h-7 sm:w-8 sm:h-8 text-red-500" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" />
              <span class="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-red-600 text-white text-[10px] sm:text-xs font-extrabold rounded-full flex items-center justify-center">{{ i+1 }}</span>
            </div>
            <div class="font-bold text-gray-800 text-xs sm:text-sm mb-1">{{ step.title }}</div>
            <p class="text-xs text-gray-400 leading-relaxed hidden sm:block">{{ step.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- KENAPA KAMI -->
    <section class="py-12 sm:py-16 bg-gray-50">
      <div class="max-w-6xl mx-auto px-4">
        <div class="grid lg:grid-cols-5 gap-8 lg:gap-10 items-center">
          <div class="lg:col-span-2">
            <p class="text-xs font-extrabold uppercase tracking-widest text-red-600 mb-1">Keunggulan Kami</p>
            <h2 class="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3">Kenapa Pilih <span class="text-red-600">Kami?</span></h2>
            <div class="w-12 h-1 bg-gradient-to-r from-red-600 to-orange-400 rounded mb-4"></div>
            <p class="text-gray-400 text-sm leading-relaxed mb-6">Kami berkomitmen memberikan pengalaman catering terbaik — dari kualitas makanan hingga ketepatan pengiriman.</p>
            <RouterLink to="/menu" class="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-orange-500 text-white px-6 py-3 rounded-full font-bold hover:-translate-y-0.5 transition shadow-md text-sm sm:text-base">
              Pesan Sekarang →
            </RouterLink>
          </div>
          <div class="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div v-for="w in whyUs" :key="w.title" class="flex items-start gap-4 bg-white rounded-2xl p-4 sm:p-5 shadow-sm hover:-translate-y-1 hover:shadow-md transition">
              <div :class="`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${w.bg}`">
                <component :is="w.iconComponent" class="w-5 h-5" :class="w.iconColor" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" />
              </div>
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
    <section class="py-12 sm:py-16 bg-white">
      <div class="max-w-6xl mx-auto px-4">
        <div class="text-center mb-8 sm:mb-12">
          <p class="text-xs font-extrabold uppercase tracking-widest text-red-600 mb-1">Testimoni</p>
          <h2 class="text-2xl sm:text-3xl font-extrabold text-gray-900">Kata <span class="text-red-600">Pelanggan</span> Kami</h2>
          <div class="w-12 h-1 bg-gradient-to-r from-red-600 to-orange-400 rounded mx-auto mt-3"></div>
        </div>
        <div v-if="loadingReviews" class="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
          <div v-for="i in 3" :key="i" class="bg-gray-50 rounded-2xl p-6 animate-pulse h-40"></div>
        </div>
        <div v-else-if="reviews.length > 0" class="grid sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6">
          <div v-for="r in reviews.slice(0,6)" :key="r.order_number || r.customer" class="bg-white rounded-2xl shadow-md p-5 sm:p-6 relative border border-gray-50">
            <div class="absolute top-4 right-5 text-4xl sm:text-5xl text-red-100 font-serif leading-none">"</div>
            <div class="text-yellow-400 text-sm mb-3">{{ '★'.repeat(r.rating) }}{{ '☆'.repeat(5 - r.rating) }}</div>
            <p class="text-sm text-gray-500 leading-relaxed mb-5">{{ r.comment || 'Pelanggan puas dengan pelayanan kami.' }}</p>
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-orange-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">{{ r.customer?.[0]?.toUpperCase() || 'A' }}</div>
              <div class="min-w-0">
                <div class="text-sm font-bold text-gray-800 truncate">{{ r.customer }}</div>
                <div class="text-xs text-gray-400">{{ r.date }}</div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="grid sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6">
          <div v-for="t in fallbackTestimonials" :key="t.name" class="bg-white rounded-2xl shadow-md p-5 sm:p-6 relative border border-gray-50">
            <div class="absolute top-4 right-5 text-4xl sm:text-5xl text-red-100 font-serif leading-none">"</div>
            <div class="text-yellow-400 text-sm mb-3">★★★★★</div>
            <p class="text-sm text-gray-500 leading-relaxed mb-5">{{ t.text }}</p>
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-orange-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">{{ t.name[0] }}</div>
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
    <section class="py-12 sm:py-16">
      <div class="max-w-6xl mx-auto px-4">
        <div class="rounded-3xl overflow-hidden relative p-8 sm:p-12 md:p-16" style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 55%, #0f3460 100%)">
          <div class="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-red-600 opacity-10"></div>
          <div class="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-orange-400 opacity-10"></div>
          <div class="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-7 md:gap-8">
            <div>
              <p class="text-xs font-extrabold uppercase tracking-widest text-white opacity-50 mb-2">Mulai Sekarang</p>
              <h2 class="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-3">Siap Buat Acara Anda<br><span class="text-yellow-400">Lebih Berkesan?</span></h2>
              <p class="text-white opacity-60 leading-relaxed text-sm sm:text-base">Percayakan kebutuhan catering Anda kepada kami.<br class="hidden sm:block">Kualitas terjamin, harga bersahabat, pengiriman tepat waktu.</p>
            </div>
            <div class="flex flex-col sm:flex-row gap-3 w-full md:w-auto flex-shrink-0">
              <RouterLink to="/menu" class="inline-flex items-center justify-center gap-2 bg-white text-red-600 px-6 sm:px-7 py-3 sm:py-3.5 rounded-full font-extrabold shadow-xl hover:-translate-y-0.5 transition text-sm sm:text-base">Pesan Sekarang</RouterLink>
              <RouterLink to="/track" class="inline-flex items-center justify-center gap-2 bg-white/10 border-2 border-white/20 text-white px-5 sm:px-6 py-3 rounded-full font-bold hover:bg-white/20 transition text-sm sm:text-base">Lacak Pesanan</RouterLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, defineComponent, h } from 'vue'
import { getMenus, getCategories, getPublicStats } from '@/api/menus'
import { getReviews } from '@/api/reviews'
import MenuCard from '@/components/MenuCard.vue'

const featuredMenus     = ref([])
const loadingMenus      = ref(true)
const reviews           = ref([])
const loadingReviews    = ref(true)
const apiCategories     = ref([])
const loadingCategories = ref(true)

const publicStats = ref({
  total_completed: 0,
  total_menus: 0,
  avg_rating: 4.8,
  total_reviews: 0,
})

const heroStats = computed(() => [
  { num: '1000+', lbl: 'Pelanggan Puas' },
  { num: '50+',   lbl: 'Varian Menu' },
  { num: '5+',    lbl: 'Tahun Pengalaman' },
])

const statsBar = computed(() => [
  { num: '1000+', lbl: 'Pelanggan Puas' },
  { num: '50+',   lbl: 'Varian Menu' },
  { num: '5+',    lbl: 'Tahun Pengalaman' },
  { num: '100%',  lbl: 'Bahan Segar' },
])

// SVG icon components (inline functional)
const IconCart = { render: () => h('svg', { fill: 'none', stroke: 'currentColor', 'stroke-width': '2', viewBox: '0 0 24 24', class: 'w-7 h-7 sm:w-8 sm:h-8 text-red-500' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z' })
]) }
const IconClipboard = { render: () => h('svg', { fill: 'none', stroke: 'currentColor', 'stroke-width': '2', viewBox: '0 0 24 24', class: 'w-7 h-7 sm:w-8 sm:h-8 text-red-500' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' })
]) }
const IconCreditCard = { render: () => h('svg', { fill: 'none', stroke: 'currentColor', 'stroke-width': '2', viewBox: '0 0 24 24', class: 'w-7 h-7 sm:w-8 sm:h-8 text-red-500' }, [
  h('rect', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', x: '1', y: '4', width: '22', height: '16', rx: '2', ry: '2' }),
  h('line', { x1: '1', y1: '10', x2: '23', y2: '10' })
]) }
const IconTruck = { render: () => h('svg', { fill: 'none', stroke: 'currentColor', 'stroke-width': '2', viewBox: '0 0 24 24', class: 'w-7 h-7 sm:w-8 sm:h-8 text-red-500' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z' }),
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0' })
]) }

const steps = [
  { iconComponent: IconCart,       title: 'Pilih Menu',        desc: 'Jelajahi katalog dan tambahkan menu ke keranjang belanja' },
  { iconComponent: IconClipboard,  title: 'Isi Detail',         desc: 'Lengkapi data acara, tanggal, dan alamat pengiriman' },
  { iconComponent: IconCreditCard, title: 'Bayar via Transfer', desc: 'Bayar mudah lalu upload bukti transfer' },
  { iconComponent: IconTruck,      title: 'Terima Pesanan',     desc: 'Pesanan dikirim tepat waktu ke lokasi acara Anda' },
]

// WhyUs icon components
const IconFire = { render: () => h('svg', { fill: 'none', stroke: 'currentColor', 'stroke-width': '2', viewBox: '0 0 24 24', class: 'w-5 h-5 text-red-600' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z' }),
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z' })
]) }
const IconTruckSmall = { render: () => h('svg', { fill: 'none', stroke: 'currentColor', 'stroke-width': '2', viewBox: '0 0 24 24', class: 'w-5 h-5 text-orange-600' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z' }),
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0' })
]) }
const IconTag = { render: () => h('svg', { fill: 'none', stroke: 'currentColor', 'stroke-width': '2', viewBox: '0 0 24 24', class: 'w-5 h-5 text-green-600' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z' })
]) }
const IconDevice = { render: () => h('svg', { fill: 'none', stroke: 'currentColor', 'stroke-width': '2', viewBox: '0 0 24 24', class: 'w-5 h-5 text-blue-600' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z' })
]) }

const whyUs = [
  { iconComponent: IconFire,     bg: 'bg-red-100',    title: 'Masak Segar Tiap Hari',  desc: 'Dimasak fresh setiap hari dengan bahan pilihan berkualitas tanpa pengawet.' },
  { iconComponent: IconTruckSmall, bg: 'bg-orange-100', title: 'Antar ke Lokasi',       desc: 'Pengiriman tepat waktu ke seluruh area Jakarta oleh tim berpengalaman.' },
  { iconComponent: IconTag,      bg: 'bg-green-100',  title: 'Harga Terjangkau',       desc: 'Paket mulai Rp 35.000/pax, cocok untuk semua kalangan dan acara.' },
  { iconComponent: IconDevice,   bg: 'bg-blue-100',   title: 'Pesan 100% Online',      desc: 'Sistem pemesanan mudah, cepat, dan status bisa dipantau realtime.' },
]

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

const fallbackTestimonials = [
  { name: 'Anisa R.',  role: 'Ibu Rumah Tangga', text: 'Pesan untuk acara arisan, makanannya enak banget dan datang tepat waktu. Tamunya pada happy semua!' },
  { name: 'Budi S.',   role: 'Event Organizer',  text: 'Sudah bekerja sama untuk beberapa event kantor. Konsisten enak, porsi pas, dan harga bersahabat.' },
  { name: 'Dina K.',   role: 'Pelanggan Tetap',  text: 'Paket aqiqahnya komplit dan enak. Prosesnya gampang banget, pesan online langsung beres!' },
]

onMounted(async () => {
  await Promise.all([
    getMenus({ limit: 6 })
      .then(res => {
        const outer = res.data?.data
        featuredMenus.value = Array.isArray(outer?.data) ? outer.data
          : Array.isArray(outer) ? outer : []
      })
      .catch(() => { featuredMenus.value = [] })
      .finally(() => { loadingMenus.value = false }),

    getCategories()
      .then(res => {
        const d = res.data?.data
        apiCategories.value = Array.isArray(d) ? d : (d?.data ?? [])
      })
      .catch(() => { apiCategories.value = [] })
      .finally(() => { loadingCategories.value = false }),

    getReviews()
      .then(res => { reviews.value = res.data?.data || [] })
      .catch(() => { reviews.value = [] })
      .finally(() => { loadingReviews.value = false }),

    getPublicStats()
      .then(res => {
        const d = res.data?.data
        if (d) publicStats.value = { ...publicStats.value, ...d }
      })
      .catch(() => {}),
  ])
})
</script>
