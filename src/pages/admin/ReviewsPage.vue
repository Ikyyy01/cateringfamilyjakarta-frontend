<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <p class="text-xs text-gray-400 font-semibold mb-0.5">Panel Admin › Review</p>
        <h1 class="text-2xl font-extrabold text-gray-800">Kelola Review</h1>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-white rounded-2xl p-4 shadow-sm text-center">
        <p class="text-2xl font-black text-yellow-500">{{ stats.avg_rating || '—' }}</p>
        <div class="flex justify-center gap-0.5 my-1">
          <span v-for="i in 5" :key="i" :class="i <= Math.round(stats.avg_rating) ? 'text-yellow-400' : 'text-gray-200'" class="text-sm">★</span>
        </div>
        <p class="text-xs text-gray-400">Rata-rata Rating</p>
      </div>
      <div class="bg-white rounded-2xl p-4 shadow-sm text-center">
        <p class="text-2xl font-black text-gray-800">{{ stats.total }}</p>
        <p class="text-xs text-gray-400 mt-1">Total Review</p>
      </div>
      <div v-for="star in [5,4,3]" :key="star" class="hidden md:block bg-white rounded-2xl p-4 shadow-sm">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-yellow-400 text-sm">{{ '★'.repeat(star) }}</span>
          <span class="text-xs text-gray-400 font-bold">{{ star }} bintang</span>
        </div>
        <div class="bg-gray-100 rounded-full h-2">
          <div class="bg-yellow-400 h-2 rounded-full transition-all" :style="`width:${stats.total ? (stats.distribution?.[star]||0)/stats.total*100 : 0}%`"></div>
        </div>
        <p class="text-xs text-gray-400 mt-1 text-right">{{ stats.distribution?.[star] || 0 }}</p>
      </div>
    </div>

    <!-- Filter -->
    <div class="bg-white rounded-2xl shadow-sm p-4 mb-5 flex flex-wrap gap-3">
      <input v-model="search" @keyup.enter="fetchReviews" type="text" placeholder="🔍 Cari nama atau komentar..."
        class="flex-1 min-w-[200px] border-2 border-gray-100 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-red-300 transition" />
      <select v-model="ratingFilter" @change="fetchReviews" class="border-2 border-gray-100 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-red-300 bg-white">
        <option value="">Semua Rating</option>
        <option v-for="r in [5,4,3,2,1]" :key="r" :value="r">{{ r }} Bintang</option>
      </select>
      <button @click="fetchReviews" class="bg-red-600 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-red-700 transition">Filter</button>
    </div>

    <!-- List Review -->
    <div v-if="loading" class="space-y-3">
      <div v-for="i in 5" :key="i" class="bg-white rounded-2xl h-28 animate-pulse"></div>
    </div>
    <div v-else-if="reviews.length === 0" class="text-center py-16 bg-white rounded-2xl">
      <div class="text-4xl mb-3">⭐</div>
      <p class="font-semibold text-gray-400">Belum ada review</p>
    </div>
    <div v-else class="space-y-3">
      <div v-for="r in reviews" :key="r.id" class="bg-white rounded-2xl shadow-sm p-5 flex gap-4">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-400 flex items-center justify-center text-white font-black text-sm flex-shrink-0">
          {{ (r.user?.name||'?')[0].toUpperCase() }}
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-start justify-between gap-2">
            <div>
              <p class="font-bold text-gray-800 text-sm">{{ r.user?.name || 'Pelanggan' }}</p>
              <div class="flex items-center gap-1 mt-0.5">
                <span v-for="i in 5" :key="i" :class="i <= r.rating ? 'text-yellow-400' : 'text-gray-200'" class="text-sm">★</span>
                <span class="text-xs text-gray-400 ml-1 font-mono">{{ r.order?.order_number }}</span>
              </div>
            </div>
            <div class="flex items-center gap-2 flex-shrink-0">
              <span class="text-xs text-gray-400">{{ formatDate(r.created_at) }}</span>
              <button @click="handleDelete(r.id)" class="text-xs border-2 border-red-100 text-red-400 px-3 py-1.5 rounded-xl font-bold hover:bg-red-50 transition">🗑️ Hapus</button>
            </div>
          </div>
          <p v-if="r.comment" class="text-sm text-gray-600 mt-2 leading-relaxed">{{ r.comment }}</p>
          <p v-else class="text-sm text-gray-300 mt-2 italic">Tidak ada komentar</p>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="meta.last_page > 1" class="flex items-center justify-between mt-5 bg-white rounded-2xl px-6 py-4 shadow-sm">
      <p class="text-xs text-gray-400">Halaman {{ meta.current_page }} dari {{ meta.last_page }} ({{ meta.total }} review)</p>
      <div class="flex gap-2">
        <button @click="changePage(meta.current_page-1)" :disabled="meta.current_page<=1" class="px-4 py-1.5 text-xs border-2 border-gray-200 rounded-lg font-bold disabled:opacity-30 hover:border-red-300 transition">← Prev</button>
        <button @click="changePage(meta.current_page+1)" :disabled="meta.current_page>=meta.last_page" class="px-4 py-1.5 text-xs border-2 border-gray-200 rounded-lg font-bold disabled:opacity-30 hover:border-red-300 transition">Next →</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getAdminReviews, deleteReview } from '@/api/admin'

const reviews     = ref([])
const loading     = ref(true)
const search      = ref('')
const ratingFilter = ref('')
const page        = ref(1)
const meta        = ref({ current_page:1, last_page:1, total:0 })
const stats       = ref({ avg_rating:0, total:0, distribution:{} })

function formatDate(d) { return new Date(d).toLocaleDateString('id-ID',{day:'2-digit',month:'short',year:'numeric'}) }

async function fetchReviews() {
  loading.value = true
  try {
    const res = await getAdminReviews({ search: search.value||undefined, rating: ratingFilter.value||undefined, page: page.value })
    const payload = res.data?.data ?? res.data
    reviews.value = payload?.data ?? (Array.isArray(payload) ? payload : [])
    meta.value = { current_page: payload?.current_page??1, last_page: payload?.last_page??1, total: payload?.total??0 }
    if (res.data?.meta) stats.value = res.data.meta
  } catch { reviews.value = [] } finally { loading.value = false }
}

function changePage(p) { page.value = p; fetchReviews() }

async function handleDelete(id) {
  if (!confirm('Hapus review ini?')) return
  try { await deleteReview(id); await fetchReviews() } catch(err) { alert(err.response?.data?.message||'Gagal menghapus.') }
}

onMounted(fetchReviews)
</script>
