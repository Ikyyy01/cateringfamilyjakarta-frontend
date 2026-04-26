<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <p class="text-xs text-gray-400 font-semibold mb-0.5">Panel Admin › Kategori</p>
        <h1 class="text-2xl font-extrabold text-gray-800">Kelola Kategori</h1>
      </div>
      <button @click="openModal()" class="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-orange-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow hover:-translate-y-0.5 transition">
        ➕ Tambah Kategori
      </button>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-3 gap-4 mb-6">
      <div class="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
        <p class="text-2xl font-black text-gray-800">{{ categories.length }}</p>
        <p class="text-xs text-gray-400 mt-1">Total Kategori</p>
      </div>
      <div class="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
        <p class="text-2xl font-black text-green-600">{{ categories.filter(c => c.is_active).length }}</p>
        <p class="text-xs text-gray-400 mt-1">Aktif</p>
      </div>
      <div class="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
        <p class="text-2xl font-black text-gray-400">{{ categories.filter(c => !c.is_active).length }}</p>
        <p class="text-xs text-gray-400 mt-1">Nonaktif</p>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div v-if="loading" class="p-8 space-y-3">
        <div v-for="i in 5" :key="i" class="h-12 bg-gray-100 rounded-xl animate-pulse"></div>
      </div>
      <div v-else-if="categories.length === 0" class="text-center py-16 text-gray-300">
        <div class="text-4xl mb-3">📂</div>
        <p class="font-semibold text-gray-400">Belum ada kategori</p>
      </div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 border-b border-gray-100">
            <tr>
              <th class="px-5 py-3 text-left text-xs font-black uppercase tracking-wider text-gray-400">Nama</th>
              <th class="px-5 py-3 text-left text-xs font-black uppercase tracking-wider text-gray-400">Deskripsi</th>
              <th class="px-5 py-3 text-left text-xs font-black uppercase tracking-wider text-gray-400">Jumlah Menu</th>
              <th class="px-5 py-3 text-left text-xs font-black uppercase tracking-wider text-gray-400">Status</th>
              <th class="px-5 py-3 text-right text-xs font-black uppercase tracking-wider text-gray-400">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="cat in categories" :key="cat.id" class="hover:bg-gray-50/50 transition-colors">
              <td class="px-5 py-3.5">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center text-base flex-shrink-0">🍽️</div>
                  <span class="font-bold text-gray-800">{{ cat.name }}</span>
                </div>
              </td>
              <td class="px-5 py-3.5 text-gray-500 text-xs max-w-xs truncate">{{ cat.description || '—' }}</td>
              <td class="px-5 py-3.5">
                <span class="inline-flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-full">
                  🍱 {{ cat.menus_count ?? 0 }} menu
                </span>
              </td>
              <td class="px-5 py-3.5">
                <span :class="['text-xs px-2.5 py-1 rounded-full font-bold', cat.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500']">
                  {{ cat.is_active ? 'Aktif' : 'Nonaktif' }}
                </span>
              </td>
              <td class="px-5 py-3.5 text-right">
                <button @click="openModal(cat)" class="text-xs border-2 border-gray-200 text-gray-500 px-3 py-1.5 rounded-xl font-bold hover:border-red-300 hover:text-red-500 transition mr-2">✏️ Edit</button>
                <button @click="handleDelete(cat)" :disabled="(cat.menus_count ?? 0) > 0"
                  class="text-xs border-2 border-red-100 text-red-400 px-3 py-1.5 rounded-xl font-bold hover:bg-red-50 transition disabled:opacity-30 disabled:cursor-not-allowed">
                  🗑️ Hapus
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
      <div class="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full">
        <h3 class="font-extrabold text-gray-800 text-lg mb-6">{{ editId ? '✏️ Edit Kategori' : '➕ Tambah Kategori' }}</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-1.5">Nama Kategori <span class="text-red-500">*</span></label>
            <input v-model="form.name" type="text" class="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-400" placeholder="Contoh: Nasi Box" />
          </div>
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-1.5">Deskripsi</label>
            <textarea v-model="form.description" rows="3" class="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-400 resize-none" placeholder="Deskripsi singkat kategori..."></textarea>
          </div>
          <div class="flex items-center gap-3">
            <input v-model="form.is_active" type="checkbox" id="catActive" class="w-4 h-4 accent-red-600" />
            <label for="catActive" class="text-sm font-bold text-gray-700">Kategori Aktif</label>
          </div>
          <div v-if="formError" class="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 flex items-start gap-2">
            <span>⚠️</span><span>{{ formError }}</span>
          </div>
        </div>
        <div class="flex gap-3 mt-6">
          <button @click="showModal = false" class="flex-1 border-2 border-gray-200 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-50 transition text-sm">Batal</button>
          <button @click="handleSubmit" :disabled="saving" class="flex-1 bg-gradient-to-r from-red-600 to-orange-500 text-white py-3 rounded-xl font-bold shadow hover:-translate-y-0.5 transition text-sm disabled:opacity-50">
            {{ saving ? 'Menyimpan...' : (editId ? 'Simpan' : 'Tambah') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getAdminCategories, createCategory, updateCategory, deleteCategory } from '@/api/admin'

const categories = ref([])
const loading    = ref(true)
const showModal  = ref(false)
const editId     = ref(null)
const saving     = ref(false)
const formError  = ref('')
const form       = ref({ name: '', description: '', is_active: true })

async function fetchCategories() {
  loading.value = true
  try {
    const res = await getAdminCategories()
    const payload = res.data?.data ?? res.data
    categories.value = Array.isArray(payload) ? payload : (payload?.data ?? [])
  } catch { categories.value = [] }
  finally { loading.value = false }
}

function openModal(cat = null) {
  formError.value = ''
  editId.value = cat?.id || null
  form.value = cat ? { name: cat.name, description: cat.description || '', is_active: !!cat.is_active } : { name: '', description: '', is_active: true }
  showModal.value = true
}

async function handleSubmit() {
  if (!form.value.name.trim()) { formError.value = 'Nama kategori wajib diisi.'; return }
  formError.value = ''; saving.value = true
  try {
    if (editId.value) await updateCategory(editId.value, form.value)
    else await createCategory(form.value)
    showModal.value = false
    await fetchCategories()
  } catch (err) {
    const errors = err.response?.data?.errors
    formError.value = errors ? Object.values(errors).flat().join(' • ') : (err.response?.data?.message || 'Gagal menyimpan.')
  } finally { saving.value = false }
}

async function handleDelete(cat) {
  if ((cat.menus_count ?? 0) > 0) { alert('Kategori masih punya menu, tidak bisa dihapus.'); return }
  if (!confirm(`Hapus kategori "${cat.name}"?`)) return
  try { await deleteCategory(cat.id); await fetchCategories() }
  catch (err) { alert(err.response?.data?.message || 'Gagal menghapus.') }
}

onMounted(fetchCategories)
</script>
