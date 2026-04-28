<template>
  <div class="relative bg-white rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col h-full group">
    <RouterLink :to="`/menu/${menu.id}`" class="block relative overflow-hidden" style="height:190px">
      <img v-if="menu.image" :src="storageUrl(menu.image)" :alt="menu.name"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
      <div v-else class="w-full h-full flex items-center justify-center text-5xl"
        style="background: linear-gradient(135deg, #fff5f3, #fff0e8)">🍛</div>
      <span v-if="menu.category"
        class="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
        {{ menu.category.name }}
      </span>
    </RouterLink>

    <div class="p-4 flex flex-col flex-1">
      <span class="text-xs font-extrabold uppercase tracking-wider text-red-600 mb-1">
        {{ menu.category?.name || 'Catering' }}
      </span>
      <RouterLink :to="`/menu/${menu.id}`">
        <h3 class="font-extrabold text-gray-800 mb-1.5 leading-snug hover:text-red-600 transition text-sm sm:text-base">{{ menu.name }}</h3>
      </RouterLink>
      <p class="text-xs sm:text-sm text-gray-400 leading-relaxed line-clamp-2 flex-1 mb-2">{{ menu.description }}</p>
      <p class="text-xs text-gray-400 mb-3">Min. <strong class="text-gray-600">{{ menu.min_pax || 20 }} pax</strong></p>

      <div class="flex items-center justify-between mt-auto gap-2">
        <div class="min-w-0">
          <div class="text-base sm:text-lg font-extrabold text-red-600 leading-tight">{{ formatRupiah(menu.price) }}</div>
          <div class="text-xs text-gray-400">/pax</div>
        </div>
        <button @click.prevent="handleAddToCart"
          class="inline-flex items-center gap-1 sm:gap-1.5 bg-gradient-to-r from-red-600 to-orange-500 text-white text-xs font-bold px-3 sm:px-4 py-2 sm:py-2.5 rounded-full shadow hover:shadow-md hover:-translate-y-0.5 transition flex-shrink-0">
          🛒 <span class="hidden sm:inline">Tambah</span><span class="sm:hidden">+</span>
        </button>
      </div>
    </div>

    <Transition name="toast">
      <div v-if="showToast"
        class="absolute bottom-3 left-3 right-3 bg-gray-900 text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 z-10">
        <span class="text-green-400 text-base">✓</span>
        <span class="truncate">{{ menu.name }} ditambahkan!</span>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useCartStore } from '@/stores/cart'
import { storageUrl } from '@/api/helpers'

const props = defineProps({ menu: Object })
const cartStore = useCartStore()
const showToast = ref(false)

function formatRupiah(val) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val)
}

function handleAddToCart() {
  cartStore.addItem(props.menu)
  showToast.value = true
  setTimeout(() => { showToast.value = false }, 2200)
}
</script>

<style scoped>
.toast-enter-active { transition: all 0.2s ease-out; }
.toast-leave-active { transition: all 0.25s ease-in; }
.toast-enter-from  { opacity: 0; transform: translateY(8px); }
.toast-leave-to    { opacity: 0; transform: translateY(8px); }
</style>
