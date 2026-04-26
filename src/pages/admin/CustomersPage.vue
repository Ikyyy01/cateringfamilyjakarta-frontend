<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <p class="text-xs text-gray-400 font-semibold mb-0.5">Panel Admin › Pelanggan</p>
        <h1 class="text-2xl font-extrabold text-gray-800">Data Pelanggan</h1>
      </div>
    </div>

    <!-- Filter -->
    <div class="bg-white rounded-2xl shadow-sm p-4 mb-5 flex gap-3">
      <input v-model="search" @keyup.enter="fetchCustomers" type="text" placeholder="🔍 Cari nama, email, HP..."
        class="flex-1 border-2 border-gray-100 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-red-300 transition" />
      <button @click="fetchCustomers" class="bg-red-600 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-red-700 transition">Cari</button>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div v-if="loading" class="p-8 space-y-3">
        <div v-for="i in 6" :key="i" class="h-14 bg-gray-100 rounded-xl animate-pulse"></div>
      </div>
      <div v-else-if="customers.length === 0" class="text-center py-16 text-gray-300">
        <div class="text-4xl mb-3">👥</div>
        <p class="font-semibold text-gray-400">Tidak ada pelanggan ditemukan</p>
      </div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 border-b border-gray-100">
            <tr>
              <th class="px-5 py-3 text-left text-xs font-black uppercase tracking-wider text-gray-400">Pelanggan</th>
              <th class="px-5 py-3 text-left text-xs font-black uppercase tracking-wider text-gray-400">Kontak</th>
              <th class="px-5 py-3 text-left text-xs font-black uppercase tracking-wider text-gray-400">Total Pesanan</th>
              <th class="px-5 py-3 text-left text-xs font-black uppercase tracking-wider text-gray-400">Bergabung</th>
              <th class="px-5 py-3 text-right text-xs font-black uppercase tracking-wider text-gray-400">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="c in customers" :key="c.id" class="hover:bg-gray-50/50 transition-colors">
              <td class="px-5 py-3.5">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-orange-400 flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                    {{ c.name[0].toUpperCase() }}
                  </div>
                  <div>
                    <p class="font-bold text-gray-800">{{ c.name }}</p>
                    <p class="text-xs text-gray-400">ID #{{ c.id }}</p>
                  </div>
                </div>
              </td>
              <td class="px-5 py-3.5">
                <p class="text-sm text-gray-700">{{ c.email }}</p>
                <p class="text-xs text-gray-400">{{ c.phone || '—' }}</p>
              </td>
              <td class="px-5 py-3.5">
                <span class="text-sm font-bold text-red-600">{{ c.orders_count ?? 0 }} pesanan</span>
              </td>
              <td class="px-5 py-3.5 text-xs text-gray-400">{{ formatDate(c.created_at) }}</td>
              <td class="px-5 py-3.5 text-right flex items-center justify-end gap-2">
                <RouterLink :to="`/admin/customers/${c.id}`" class="text-xs border-2 border-gray-200 text-gray-500 px-3 py-1.5 rounded-xl font-bold hover:border-red-300 hover:text-red-500 transition">Detail →</RouterLink>
                <button @click="handleDelete(c)" :disabled="(c.orders_count ?? 0) > 0"
                  class="text-xs border-2 border-red-100 text-red-400 px-3 py-1.5 rounded-xl font-bold hover:bg-red-50 transition disabled:opacity-30 disabled:cursor-not-allowed">🗑️</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="meta.last_page > 1" class="flex items-center justify-between px-6 py-4 border-t border-gray-50">
        <p class="text-xs text-gray-400">Halaman {{ meta.current_page }} dari {{ meta.last_page }} ({{ meta.total }} pelanggan)</p>
        <div class="flex gap-2">
          <button @click="changePage(meta.current_page - 1)" :disabled="meta.current_page <= 1" class="px-4 py-1.5 text-xs border-2 border-gray-200 rounded-lg font-bold disabled:opacity-30 hover:border-red-300 transition">← Prev</button>
          <button @click="changePage(meta.current_page + 1)" :disabled="meta.current_page >= meta.last_page" class="px-4 py-1.5 text-xs border-2 border-gray-200 rounded-lg font-bold disabled:opacity-30 hover:border-red-300 transition">Next →</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getCustomers, deleteCustomer } from '@/api/admin'

const customers = ref([])
const loading   = ref(true)
const search    = ref('')
const page      = ref(1)
const meta      = ref({ current_page: 1, last_page: 1, total: 0 })

function formatDate(d) {
  return new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}

async function fetchCustomers() {
  loading.value = true
  try {
    const res = await getCustomers({ search: search.value || undefined, page: page.value })
    const payload = res.data?.data ?? res.data
    customers.value = payload?.data ?? (Array.isArray(payload) ? payload : [])
    meta.value = { current_page: payload?.current_page ?? 1, last_page: payload?.last_page ?? 1, total: payload?.total ?? 0 }
  } catch { customers.value = [] }
  finally { loading.value = false }
}

function changePage(p) { page.value = p; fetchCustomers() }

async function handleDelete(c) {
  if (!confirm(`Hapus pelanggan "${c.name}"? Data tidak bisa dikembalikan.`)) return
  try { await deleteCustomer(c.id); await fetchCustomers() }
  catch (err) { alert(err.response?.data?.message || 'Gagal menghapus.') }
}

onMounted(fetchCustomers)
</script>
