<template>
  <div class="max-w-6xl mx-auto px-4 py-8 sm:py-10">
    <div class="mb-6 sm:mb-8">
      <p class="text-xs font-extrabold uppercase tracking-widest text-red-600 mb-1">Temukan pilihan terbaik</p>
      <h1 class="text-2xl sm:text-3xl font-extrabold text-gray-900">Katalog <span class="text-red-600">Menu</span></h1>
      <div class="w-12 h-1 bg-gradient-to-r from-red-600 to-orange-400 rounded mt-3"></div>
    </div>

    <!-- Filter — scrollable on mobile -->
    <div class="mb-6 sm:mb-8 -mx-4 px-4 overflow-x-auto scrollbar-hide">
      <div class="flex gap-2 pb-1 w-max sm:w-auto sm:flex-wrap">
        <button @click="selectedCategory = null"
          :class="['inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border-2 transition whitespace-nowrap flex-shrink-0',
            selectedCategory === null ? 'bg-red-600 text-white border-red-600 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-red-400']">
          🍽️ Semua
        </button>
        <button v-for="cat in categories" :key="cat.id" @click="selectedCategory = cat.id"
          :class="['inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border-2 transition whitespace-nowrap flex-shrink-0',
            selectedCategory === cat.id ? 'bg-red-600 text-white border-red-600 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-red-400']">
          {{ cat.name }}
        </button>
      </div>
    </div>

    <div v-if="loading" class="text-center text-gray-400 py-20">
      <div class="text-5xl mb-4 opacity-40">🍽️</div>
      <p>Memuat menu...</p>
    </div>
    <div v-else-if="filtered.length === 0" class="text-center py-20">
      <div class="text-5xl opacity-40 mb-4">🍽️</div>
      <h5 class="font-extrabold text-gray-600 mb-2">Belum ada menu tersedia</h5>
      <button v-if="selectedCategory" @click="selectedCategory = null" class="text-red-500 hover:underline text-sm">
        Lihat semua menu
      </button>
    </div>
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
      <MenuCard v-for="menu in filtered" :key="menu.id" :menu="menu" />
    </div>

    <p v-if="!loading && filtered.length > 0" class="text-sm text-gray-400 mt-6 text-right">
      {{ filtered.length }} menu tersedia
    </p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getMenus, getCategories } from '@/api/menus'
import MenuCard from '@/components/MenuCard.vue'

const menus = ref([])
const categories = ref([])
const selectedCategory = ref(null)
const loading = ref(true)

const filtered = computed(() => {
  if (!selectedCategory.value) return menus.value
  return menus.value.filter((m) => m.category_id === selectedCategory.value)
})

onMounted(async () => {
  try {
    const [menuRes, catRes] = await Promise.all([getMenus({ limit: 100 }), getCategories()])

    const menuPayload = menuRes.data?.data
    if (menuPayload && Array.isArray(menuPayload.data)) {
      menus.value = menuPayload.data
    } else if (Array.isArray(menuPayload)) {
      menus.value = menuPayload
    } else {
      menus.value = []
    }

    const catPayload = catRes.data?.data ?? catRes.data
    categories.value = Array.isArray(catPayload) ? catPayload : []
  } catch (e) {
    console.error('Error loading menus:', e)
    menus.value = []
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>
