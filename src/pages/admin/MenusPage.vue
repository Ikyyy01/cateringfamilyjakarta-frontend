<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <p class="text-xs text-gray-400 font-medium mb-0.5">Admin / Menu</p>
        <h1 class="text-xl font-bold text-gray-900">Kelola Menu</h1>
      </div>
      <button @click="openModal()"
        class="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-red-700 transition">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
        </svg>
        Tambah Menu
      </button>
    </div>

    <!-- Filter -->
    <div class="bg-white rounded-xl border border-gray-200/80 p-4 mb-5 flex flex-wrap gap-3">
      <div class="flex-1 min-w-[200px] relative">
        <svg class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <input v-model="search" type="text" placeholder="Cari menu..."
          class="w-full border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-100 transition"
          @keyup.enter="fetchMenus" />
      </div>
      <button @click="fetchMenus" class="bg-red-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition">Cari</button>
    </div>

    <!-- Error State -->
    <div v-if="fetchError" class="bg-red-50 border border-red-200 text-red-600 rounded-xl px-5 py-4 mb-5 flex items-center gap-3">
      <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
      </svg>
      <div>
        <p class="font-semibold text-sm">Gagal memuat menu</p>
        <p class="text-xs mt-0.5">{{ fetchError }}</p>
      </div>
      <button @click="fetchMenus" class="ml-auto text-xs bg-red-600 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-red-700 transition">Coba lagi</button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="i in 6" :key="i" class="bg-white rounded-xl border border-gray-200/80 overflow-hidden animate-pulse">
        <div class="h-36 bg-gray-100"></div>
        <div class="p-4 space-y-2">
          <div class="h-3 bg-gray-100 rounded w-1/3"></div>
          <div class="h-4 bg-gray-100 rounded w-2/3"></div>
          <div class="h-3 bg-gray-100 rounded w-1/2"></div>
        </div>
      </div>
    </div>

    <!-- Empty -->
    <div v-else-if="!fetchError && menus.length === 0" class="bg-white rounded-xl border border-gray-200/80 py-16 text-center">
      <svg class="w-10 h-10 mx-auto mb-3 text-gray-200" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
      </svg>
      <p class="font-medium text-gray-400">Belum ada menu</p>
      <p class="text-sm mt-1 text-gray-300">Klik "Tambah Menu" untuk menambahkan menu pertama</p>
    </div>

    <!-- Grid Menu -->
    <div v-else-if="!loading && menus.length > 0" class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="menu in menus" :key="menu.id"
        class="bg-white rounded-xl border border-gray-200/80 overflow-hidden hover:border-gray-300 hover:shadow-sm transition">
        <div class="h-36 bg-gray-50 flex items-center justify-center relative overflow-hidden">
          <img v-if="menu.image" :src="storageUrl(menu.image)"
               :alt="menu.name" class="w-full h-full object-cover"
               @error="e => e.target.style.display='none'" />
          <svg v-else class="w-10 h-10 text-gray-200" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          <span :class="['absolute top-2.5 right-2.5 text-[10px] px-2 py-0.5 rounded-md font-semibold',
            menu.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500']">
            {{ menu.is_active ? 'Aktif' : 'Nonaktif' }}
          </span>
        </div>
        <div class="p-4">
          <p class="text-xs text-red-500 font-semibold mb-1">{{ menu.category?.name || '—' }}</p>
          <p class="font-bold text-gray-800 mb-1 line-clamp-1 text-sm">{{ menu.name }}</p>
          <p class="font-semibold text-red-600 text-sm mb-1">{{ formatRupiah(menu.price) }}/pax</p>
          <p class="text-xs text-gray-400 mb-3">
            Min {{ menu.min_pax }} pax{{ menu.max_pax ? ' · Maks ' + menu.max_pax + ' pax' : '' }}
          </p>
          <div class="flex gap-2">
            <button @click="openModal(menu)"
              class="flex-1 text-xs border border-gray-200 text-gray-600 py-1.5 rounded-lg font-medium hover:border-gray-300 hover:bg-gray-50 transition flex items-center justify-center gap-1.5">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
              Edit
            </button>
            <button @click="handleDelete(menu.id)"
              class="flex-1 text-xs border border-red-100 text-red-500 py-1.5 rounded-lg font-medium hover:bg-red-50 hover:border-red-200 transition flex items-center justify-center gap-1.5">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
              Hapus
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="meta.last_page > 1" class="flex justify-center gap-1.5 mt-6">
      <button v-for="p in meta.last_page" :key="p"
        @click="page = p; fetchMenus()"
        :class="['w-9 h-9 rounded-lg text-sm font-semibold transition',
          page === p ? 'bg-red-600 text-white' : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-300 hover:bg-gray-50']">
        {{ p }}
      </button>
    </div>

    <!-- Modal Tambah/Edit -->
    <div v-if="showModal" class="fixed inset-0 bg-black/40 z-50 flex items-start justify-center px-4 py-8 overflow-y-auto backdrop-blur-sm">
      <div class="bg-white rounded-2xl shadow-xl p-6 max-w-lg w-full mt-4">
        <div class="flex items-center justify-between mb-5">
          <h3 class="font-bold text-gray-900 text-base">{{ editId ? 'Edit Menu' : 'Tambah Menu Baru' }}</h3>
          <button @click="closeModal" class="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 transition">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1.5">Nama Menu <span class="text-red-500">*</span></label>
            <input v-model="form.name" type="text"
              class="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-100"
              placeholder="Contoh: Nasi Box Ayam Goreng" />
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1.5">Kategori <span class="text-red-500">*</span></label>
            <select v-model="form.category_id"
              class="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-100 bg-white">
              <option value="">-- Pilih Kategori --</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
            </select>
            <p v-if="categories.length === 0" class="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
              <svg class="w-3.5 h-3.5 text-amber-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
              Tidak ada kategori — tambah di halaman Kategori terlebih dahulu.
            </p>
          </div>
          <div class="grid grid-cols-3 gap-3">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1.5">Harga/pax <span class="text-red-500">*</span></label>
              <input v-model.number="form.price" type="number" min="0"
                class="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-100"
                placeholder="35000" />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1.5">Min Pax <span class="text-red-500">*</span></label>
              <input v-model.number="form.min_pax" type="number" min="1"
                class="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-100" />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1.5">Max Pax</label>
              <input v-model.number="form.max_pax" type="number" min="1"
                class="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-100" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1.5">Deskripsi</label>
            <textarea v-model="form.description" rows="3"
              class="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-100 resize-none"
              placeholder="Deskripsi menu, bahan-bahan, dll..." />
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1.5">Foto Menu</label>
            <div v-if="editId && currentImageUrl" class="mb-2.5 flex items-center gap-3">
              <img :src="currentImageUrl" class="w-14 h-14 rounded-lg object-cover border border-gray-200"
                   @error="e => e.target.style.display='none'" />
              <p class="text-xs text-gray-400">Foto saat ini. Upload baru untuk mengganti.</p>
            </div>
            <input type="file" accept="image/*" @change="e => { imageFile = e.target.files[0]; previewNewImage(e) }"
              class="w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-gray-600 hover:file:bg-gray-200 transition" />
            <img v-if="imagePreview" :src="imagePreview" class="mt-2 w-14 h-14 rounded-lg object-cover border border-gray-200" />
            <p class="text-xs text-gray-400 mt-1">Maks. 2MB. Format: JPG, PNG, WEBP.</p>
          </div>
          <label class="flex items-center gap-2.5 cursor-pointer">
            <input v-model="form.is_active" type="checkbox" class="w-4 h-4 accent-red-600 rounded" />
            <span class="text-sm font-medium text-gray-700">Aktifkan menu ini (tampil ke pelanggan)</span>
          </label>
          <div v-if="formError" class="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 flex items-start gap-2">
            <svg class="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            <span>{{ formError }}</span>
          </div>
        </div>
        <div class="flex gap-3 mt-5">
          <button @click="closeModal"
            class="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-lg font-semibold hover:bg-gray-50 transition text-sm">
            Batal
          </button>
          <button @click="handleSubmit" :disabled="saving"
            class="flex-1 bg-red-600 text-white py-2.5 rounded-lg font-semibold hover:bg-red-700 transition text-sm disabled:opacity-50">
            {{ saving ? 'Menyimpan...' : (editId ? 'Simpan Perubahan' : 'Tambah Menu') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getAdminMenus, createMenu, updateMenu, deleteMenu } from '@/api/admin'
import { getCategories } from '@/api/menus'
import { storageUrl } from '@/api/helpers'

const menus        = ref([])
const categories   = ref([])
const loading      = ref(true)
const fetchError   = ref('')
const search       = ref('')
const page         = ref(1)
const meta         = ref({ current_page: 1, last_page: 1, total: 0 })
const showModal    = ref(false)
const editId       = ref(null)
const saving       = ref(false)
const formError    = ref('')
const imageFile    = ref(null)
const imagePreview = ref(null)
const currentImageUrl = ref(null)

const form = ref({ name: '', category_id: '', price: 0, min_pax: 50, max_pax: '', description: '', is_active: true })

function formatRupiah(val) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val)
}
function previewNewImage(e) {
  const file = e.target.files[0]; if (!file) return
  const reader = new FileReader()
  reader.onload = ev => { imagePreview.value = ev.target.result }
  reader.readAsDataURL(file)
}

async function fetchMenus() {
  loading.value = true; fetchError.value = ''
  try {
    const res = await getAdminMenus({ search: search.value, page: page.value })
    const payload = res.data?.data ?? res.data
    if (Array.isArray(payload)) { menus.value = payload; meta.value = { current_page: 1, last_page: 1, total: payload.length } }
    else { menus.value = payload?.data ?? []; meta.value = { current_page: payload?.current_page ?? 1, last_page: payload?.last_page ?? 1, total: payload?.total ?? 0 } }
  } catch (err) {
    menus.value = []
    const status = err.response?.status
    if (status === 401) fetchError.value = 'Sesi habis atau belum login. Silakan login ulang.'
    else if (status === 403) fetchError.value = 'Akses ditolak. Pastikan akun kamu adalah admin.'
    else fetchError.value = err.response?.data?.message || err.message || 'Tidak dapat terhubung ke server.'
  } finally { loading.value = false }
}

function openModal(menu = null) {
  formError.value = ''; imageFile.value = null; imagePreview.value = null
  editId.value = menu?.id || null
  currentImageUrl.value = menu?.image ? storageUrl(menu.image) : null
  form.value = menu ? { name: menu.name, category_id: menu.category_id, price: menu.price, min_pax: menu.min_pax, max_pax: menu.max_pax || '', description: menu.description || '', is_active: !!menu.is_active }
    : { name: '', category_id: '', price: 0, min_pax: 50, max_pax: '', description: '', is_active: true }
  showModal.value = true
}
function closeModal() { showModal.value = false; imagePreview.value = null; imageFile.value = null }

async function handleSubmit() {
  if (!form.value.name.trim()) { formError.value = 'Nama menu wajib diisi.'; return }
  if (!form.value.category_id) { formError.value = 'Pilih kategori terlebih dahulu.'; return }
  if (!form.value.price || form.value.price <= 0) { formError.value = 'Harga harus lebih dari 0.'; return }
  formError.value = ''; saving.value = true
  try {
    const fd = new FormData()
    fd.append('name', form.value.name); fd.append('category_id', form.value.category_id)
    fd.append('price', form.value.price); fd.append('min_pax', form.value.min_pax || 50)
    if (form.value.max_pax) fd.append('max_pax', form.value.max_pax)
    if (form.value.description) fd.append('description', form.value.description)
    fd.append('is_active', form.value.is_active ? '1' : '0')
    if (imageFile.value) fd.append('image', imageFile.value)
    if (editId.value) { fd.append('_method', 'PUT'); await updateMenu(editId.value, fd) }
    else await createMenu(fd)
    closeModal(); await fetchMenus()
  } catch (err) {
    const errors = err.response?.data?.errors
    if (errors) formError.value = Object.values(errors).flat().join(' · ')
    else formError.value = err.response?.data?.message || 'Gagal menyimpan menu. Coba lagi.'
  } finally { saving.value = false }
}

async function handleDelete(id) {
  if (!confirm('Yakin ingin menghapus menu ini?')) return
  try { await deleteMenu(id); await fetchMenus() }
  catch (err) { alert(err.response?.data?.message || 'Gagal menghapus menu.') }
}

onMounted(async () => {
  await Promise.all([
    fetchMenus(),
    getCategories().then(res => { const p = res.data?.data ?? res.data; categories.value = Array.isArray(p) ? p : (p?.data ?? []) }).catch(() => { categories.value = [] }),
  ])
})
</script>
