<template>
  <div class="max-w-4xl mx-auto px-4 py-10">
    <div class="mb-8">
      <h1 class="text-3xl font-extrabold text-gray-900">Keranjang <span class="text-red-600">Pesanan</span></h1>
      <div class="w-12 h-1 bg-gradient-to-r from-red-600 to-orange-400 rounded mt-3"></div>
    </div>

    <!-- Kosong -->
    <div v-if="cartStore.items.length === 0"
      class="bg-white rounded-3xl shadow-md text-center py-16 px-6 max-w-md mx-auto">
      <div class="text-7xl opacity-40 mb-4">🛒</div>
      <h5 class="text-xl font-extrabold text-gray-700 mb-2">Keranjang masih kosong</h5>
      <p class="text-gray-400 text-sm mb-6">Tambahkan menu favorit kamu dulu ya!</p>
      <RouterLink to="/menu"
        class="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-orange-500 text-white px-7 py-3 rounded-full font-bold shadow hover:-translate-y-0.5 transition">
        🍱 Lihat Menu
      </RouterLink>
    </div>

    <div v-else class="grid lg:grid-cols-3 gap-6">
      <!-- Daftar item -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-3xl shadow-md overflow-hidden">
          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-4 border-b">
            <div class="flex items-center gap-2 font-bold text-gray-700">
              🛍️ Item Pesanan
              <span class="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">
                {{ cartStore.items.length }}
              </span>
            </div>
            <button @click="cartStore.clearCart()"
              class="text-sm text-red-500 border border-red-200 rounded-full px-4 py-1.5 hover:bg-red-50 font-semibold">
              🗑 Kosongkan
            </button>
          </div>

          <!-- Item list -->
          <div v-for="item in cartStore.items" :key="item.id"
            class="flex items-center gap-4 px-6 py-4 border-b last:border-0">
            <!-- Thumbnail -->
            <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center text-2xl flex-shrink-0">
              <img v-if="item.image" :src="storageUrl(item.image)"
                class="w-16 h-16 rounded-2xl object-cover" />
              <span v-else>🍛</span>
            </div>

            <!-- Info -->
            <div class="flex-1 min-w-0">
              <p class="font-bold text-gray-800 truncate">{{ item.name }}</p>
              <p class="text-red-600 text-sm font-semibold">{{ formatRupiah(item.price) }}/pax</p>
            </div>

            <!-- Qty control -->
            <div class="flex items-center border border-gray-200 rounded-xl overflow-hidden">
              <button @click="cartStore.updateQty(item.id, item.qty - 1)"
                class="px-3 py-2 text-gray-500 hover:bg-gray-100 font-bold">−</button>
              <span class="px-3 py-2 font-bold text-gray-800 min-w-[2rem] text-center">{{ item.qty }}</span>
              <button @click="cartStore.updateQty(item.id, item.qty + 1)"
                class="px-3 py-2 text-gray-500 hover:bg-gray-100 font-bold">+</button>
            </div>

            <!-- Subtotal -->
            <div class="text-right min-w-[100px]">
              <div class="font-extrabold text-red-600">{{ formatRupiah(item.price * item.qty) }}</div>
              <div class="text-xs text-gray-400">{{ item.qty }} pax</div>
            </div>

            <!-- Hapus -->
            <button @click="cartStore.removeItem(item.id)"
              class="w-8 h-8 rounded-full bg-gray-100 hover:bg-red-100 hover:text-red-500 flex items-center justify-center text-gray-400 transition">
              ×
            </button>
          </div>
        </div>

        <RouterLink to="/menu"
          class="inline-flex items-center gap-2 mt-4 text-sm text-gray-500 border border-gray-200 rounded-full px-5 py-2 hover:border-red-300 hover:text-red-500 transition font-semibold">
          ← Tambah Menu Lain
        </RouterLink>
      </div>

      <!-- Ringkasan -->
      <div>
        <div class="bg-white rounded-3xl shadow-md p-6 sticky top-24">
          <h2 class="font-extrabold text-gray-800 mb-4 flex items-center gap-2">
            🧾 Ringkasan Pesanan
          </h2>

          <div v-for="item in cartStore.items" :key="item.id"
            class="flex justify-between text-sm text-gray-500 mb-2">
            <span class="truncate mr-2 max-w-[140px]">{{ item.name }} ×{{ item.qty }}</span>
            <span class="font-semibold flex-shrink-0">{{ formatRupiah(item.price * item.qty) }}</span>
          </div>

          <hr class="my-4" />

          <div class="flex justify-between font-extrabold text-gray-800 text-lg mb-1">
            <span>Subtotal</span>
            <span class="text-red-600">{{ formatRupiah(cartStore.total) }}</span>
          </div>
          <p class="text-xs text-gray-400 mb-5">* Ongkir & biaya layanan dihitung saat checkout</p>

          <RouterLink to="/customer/checkout"
            class="block w-full text-center bg-gradient-to-r from-red-600 to-orange-500 text-white py-3.5 rounded-2xl font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition">
            Lanjut Checkout →
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '@/stores/cart'
import { storageUrl } from '@/api/helpers'
const cartStore = useCartStore()

function formatRupiah(val) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val)
}
</script>
