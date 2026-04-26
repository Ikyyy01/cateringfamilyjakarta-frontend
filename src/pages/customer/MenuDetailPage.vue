<template>
  <div class="max-w-5xl mx-auto px-4 py-10">
    <!-- Breadcrumb -->
    <nav class="flex items-center gap-2 text-sm text-gray-400 mb-8">
      <RouterLink to="/" class="text-red-500 hover:underline">Beranda</RouterLink>
      <span>/</span>
      <RouterLink to="/menu" class="text-red-500 hover:underline">Menu</RouterLink>
      <span>/</span>
      <span class="text-gray-600 font-medium truncate">{{ menu?.name }}</span>
    </nav>

    <div v-if="loading" class="text-center text-gray-400 py-20">Memuat...</div>
    <div v-else-if="!menu" class="text-center py-20 text-gray-400">
      <div class="text-5xl mb-4 opacity-40">🍽️</div>
      <p>Menu tidak ditemukan.</p>
      <RouterLink to="/menu" class="text-red-500 hover:underline mt-2 inline-block">← Kembali ke Menu</RouterLink>
    </div>

    <div v-else class="grid lg:grid-cols-2 gap-12 items-start">
      <!-- Foto -->
      <div>
        <img v-if="menu.image" :src="storageUrl(menu.image)" :alt="menu.name"
          class="w-full rounded-3xl shadow-md object-cover max-h-96" />
        <div v-else class="w-full h-80 rounded-3xl flex items-center justify-center relative overflow-hidden"
          style="background: linear-gradient(135deg,#fff5f3,#fff0e8)">
          <span class="text-8xl relative z-10" style="filter:drop-shadow(0 8px 24px rgba(0,0,0,.12))">🍱</span>
        </div>
      </div>

      <!-- Detail -->
      <div>
        <span class="inline-block bg-red-100 text-red-600 text-xs font-bold px-3 py-1.5 rounded-full mb-3">
          {{ menu.category?.name || 'Catering' }}
        </span>
        <h1 class="text-3xl font-extrabold text-gray-900 mb-3">{{ menu.name }}</h1>
        <p class="text-gray-500 leading-relaxed mb-6">{{ menu.description }}</p>

        <div class="bg-red-50 border border-red-100 rounded-2xl p-5 mb-6">
          <div class="grid grid-cols-2 gap-4 text-center">
            <div>
              <div class="text-2xl font-extrabold text-red-600">{{ formatRupiah(menu.price) }}</div>
              <div class="text-xs text-gray-400 font-semibold mt-1">Per Pax</div>
            </div>
            <div>
              <div class="text-2xl font-extrabold text-gray-800">{{ menu.min_pax || 1 }}</div>
              <div class="text-xs text-gray-400 font-semibold mt-1">Min. Pax</div>
            </div>
          </div>
        </div>

        <label class="block font-bold text-sm text-gray-700 mb-2">Jumlah Porsi</label>
        <div class="flex items-center gap-4 mb-3">
          <div class="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
            <button @click="qty > minPax && qty--" class="px-4 py-2.5 text-gray-600 hover:bg-gray-100 font-bold text-lg">−</button>
            <span class="px-5 py-2.5 font-bold text-gray-800 text-lg">{{ qty }}</span>
            <button @click="qty++" class="px-4 py-2.5 text-gray-600 hover:bg-gray-100 font-bold text-lg">+</button>
          </div>
          <div>
            <div class="text-xs text-gray-400">Total estimasi:</div>
            <div class="text-xl font-extrabold text-red-600">{{ formatRupiah(menu.price * qty) }}</div>
          </div>
        </div>

        <button @click="addToCart"
          class="w-full bg-gradient-to-r from-red-600 to-orange-500 text-white py-3.5 rounded-2xl font-bold text-base hover:shadow-lg hover:-translate-y-0.5 transition mb-3">
          🛒 Tambah ke Keranjang
        </button>
        <RouterLink to="/menu"
          class="block w-full text-center border-2 border-gray-200 text-gray-600 py-3 rounded-2xl font-semibold hover:border-red-300 hover:text-red-500 transition">
          ← Kembali ke Menu
        </RouterLink>

        <p v-if="added" class="text-green-600 text-sm mt-3 font-semibold text-center">✓ Berhasil ditambahkan ke keranjang!</p>
      </div>
    </div>

    <!-- Menu Terkait -->
    <div v-if="related.length > 0" class="mt-16 pt-8 border-t">
      <h2 class="text-xl font-extrabold text-gray-800 mb-6">Menu <span class="text-red-600">Terkait</span></h2>
      <div class="grid md:grid-cols-3 gap-6">
        <MenuCard v-for="r in related" :key="r.id" :menu="r" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getMenu, getMenus } from '@/api/menus'
import { unwrap, storageUrl } from '@/api/helpers'
import { useCartStore } from '@/stores/cart'
import MenuCard from '@/components/MenuCard.vue'

const route = useRoute()
const cartStore = useCartStore()

const menu = ref(null)
const related = ref([])
const loading = ref(true)
const qty = ref(1)
const added = ref(false)
const minPax = computed(() => menu.value?.min_pax || 1)

function formatRupiah(val) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val)
}

async function load() {
  loading.value = true
  try {
    const res = await getMenu(route.params.id)
    // Laravel: { success: true, data: { ...menu } }
    menu.value = res.data.data ?? res.data
    qty.value = menu.value.min_pax || 1

    const allRes = await getMenus({ limit: 100 })
    const all = unwrap(allRes)
    related.value = all.filter(m => m.id !== menu.value.id && m.category_id === menu.value.category_id).slice(0, 3)
  } catch {
    menu.value = null
  } finally {
    loading.value = false
  }
}

function addToCart() {
  for (let i = 0; i < qty.value; i++) cartStore.addItem(menu.value)
  added.value = true
  setTimeout(() => (added.value = false), 2500)
}

onMounted(load)
watch(() => route.params.id, load)
</script>
