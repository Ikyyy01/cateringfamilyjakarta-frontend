<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <p class="text-xs text-gray-400 font-semibold mb-0.5">Panel Admin › Kupon</p>
        <h1 class="text-2xl font-extrabold text-gray-800">Kelola Kupon</h1>
      </div>
      <button @click="openModal()" class="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-orange-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow hover:-translate-y-0.5 transition">
        ➕ Buat Kupon
      </button>
    </div>

    <div class="bg-white rounded-2xl shadow-sm p-4 mb-5 flex gap-3">
      <input v-model="search" @keyup.enter="fetchCoupons" type="text" placeholder="🔍 Cari kode kupon..."
        class="flex-1 border-2 border-gray-100 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-red-300 transition" />
      <button @click="fetchCoupons" class="bg-red-600 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-red-700 transition">Cari</button>
    </div>

    <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div v-if="loading" class="p-8 space-y-3">
        <div v-for="i in 5" :key="i" class="h-14 bg-gray-100 rounded-xl animate-pulse"></div>
      </div>
      <div v-else-if="coupons.length === 0" class="text-center py-16">
        <div class="text-4xl mb-3">🎟️</div>
        <p class="font-semibold text-gray-400">Belum ada kupon</p>
      </div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 border-b border-gray-100">
            <tr>
              <th class="px-5 py-3 text-left text-xs font-black uppercase tracking-wider text-gray-400">Kode</th>
              <th class="px-5 py-3 text-left text-xs font-black uppercase tracking-wider text-gray-400">Diskon</th>
              <th class="px-5 py-3 text-left text-xs font-black uppercase tracking-wider text-gray-400">Min. Order</th>
              <th class="px-5 py-3 text-left text-xs font-black uppercase tracking-wider text-gray-400">Pemakaian</th>
              <th class="px-5 py-3 text-left text-xs font-black uppercase tracking-wider text-gray-400">Berlaku</th>
              <th class="px-5 py-3 text-left text-xs font-black uppercase tracking-wider text-gray-400">Status</th>
              <th class="px-5 py-3 text-right text-xs font-black uppercase tracking-wider text-gray-400">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="c in coupons" :key="c.id" class="hover:bg-gray-50/50 transition-colors">
              <td class="px-5 py-3.5">
                <span class="font-black text-gray-800 tracking-widest bg-gray-100 px-2.5 py-1 rounded-lg text-xs">{{ c.code }}</span>
              </td>
              <td class="px-5 py-3.5">
                <span class="font-bold text-red-600">{{ c.type === 'percentage' ? c.value + '%' : formatRp(c.value) }}</span>
                <span v-if="c.type === 'percentage' && c.max_discount" class="text-xs text-gray-400 ml-1">(maks {{ formatRp(c.max_discount) }})</span>
              </td>
              <td class="px-5 py-3.5 text-gray-600 font-medium">{{ formatRp(c.min_order) }}</td>
              <td class="px-5 py-3.5">
                <div class="flex items-center gap-2">
                  <div class="flex-1 bg-gray-100 rounded-full h-1.5 w-20">
                    <div class="bg-red-500 h-1.5 rounded-full" :style="`width:${Math.min(100,(c.used_count/c.usage_limit)*100)}%`"></div>
                  </div>
                  <span class="text-xs text-gray-500 font-bold">{{ c.used_count }}/{{ c.usage_limit }}</span>
                </div>
              </td>
              <td class="px-5 py-3.5 text-xs text-gray-500">{{ formatDate(c.start_date) }} – {{ formatDate(c.end_date) }}</td>
              <td class="px-5 py-3.5">
                <button @click="handleToggle(c)"
                  :class="['text-xs px-2.5 py-1 rounded-full font-bold transition', c.is_active ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200']">
                  {{ c.is_active ? '✓ Aktif' : '✗ Nonaktif' }}
                </button>
              </td>
              <td class="px-5 py-3.5 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button @click="openModal(c)" class="text-xs border-2 border-gray-200 text-gray-500 px-3 py-1.5 rounded-xl font-bold hover:border-red-300 hover:text-red-500 transition">✏️</button>
                  <button @click="handleDelete(c)" class="text-xs border-2 border-red-100 text-red-400 px-3 py-1.5 rounded-xl font-bold hover:bg-red-50 transition">🗑️</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="meta.last_page > 1" class="flex items-center justify-between px-6 py-4 border-t border-gray-50">
        <p class="text-xs text-gray-400">Halaman {{ meta.current_page }} dari {{ meta.last_page }}</p>
        <div class="flex gap-2">
          <button @click="changePage(meta.current_page-1)" :disabled="meta.current_page<=1" class="px-4 py-1.5 text-xs border-2 border-gray-200 rounded-lg font-bold disabled:opacity-30 hover:border-red-300 transition">← Prev</button>
          <button @click="changePage(meta.current_page+1)" :disabled="meta.current_page>=meta.last_page" class="px-4 py-1.5 text-xs border-2 border-gray-200 rounded-lg font-bold disabled:opacity-30 hover:border-red-300 transition">Next →</button>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black/50 z-50 flex items-start justify-center px-4 py-8 overflow-y-auto">
      <div class="bg-white rounded-3xl shadow-xl p-8 max-w-lg w-full">
        <h3 class="font-extrabold text-gray-800 text-lg mb-6">{{ editId ? '✏️ Edit Kupon' : '🎟️ Buat Kupon Baru' }}</h3>
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-3">
            <div class="col-span-2">
              <label class="block text-sm font-bold text-gray-700 mb-1.5">Kode Kupon <span class="text-red-500">*</span></label>
              <input v-model="form.code" type="text" class="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-400 uppercase" placeholder="HEMAT50" />
            </div>
            <div class="col-span-2">
              <label class="block text-sm font-bold text-gray-700 mb-1.5">Deskripsi</label>
              <input v-model="form.description" type="text" class="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-400" placeholder="Diskon spesial..." />
            </div>
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-1.5">Tipe Diskon <span class="text-red-500">*</span></label>
              <select v-model="form.type" class="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-400 bg-white">
                <option value="percentage">Persentase (%)</option>
                <option value="fixed">Nominal (Rp)</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-1.5">Nilai <span class="text-red-500">*</span></label>
              <input v-model.number="form.value" type="number" min="0" class="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-400" />
            </div>
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-1.5">Min. Order (Rp) <span class="text-red-500">*</span></label>
              <input v-model.number="form.min_order" type="number" min="0" class="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-400" placeholder="500000" />
            </div>
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-1.5">Maks. Diskon (Rp)</label>
              <input v-model.number="form.max_discount" type="number" min="0" class="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-400" placeholder="Opsional" />
            </div>
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-1.5">Batas Pemakaian <span class="text-red-500">*</span></label>
              <input v-model.number="form.usage_limit" type="number" min="1" class="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-400" placeholder="100" />
            </div>
            <div></div>
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-1.5">Tanggal Mulai <span class="text-red-500">*</span></label>
              <input v-model="form.start_date" type="date" class="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-400" />
            </div>
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-1.5">Tanggal Berakhir <span class="text-red-500">*</span></label>
              <input v-model="form.end_date" type="date" class="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-400" />
            </div>
          </div>
          <div class="flex items-center gap-3">
            <input v-model="form.is_active" type="checkbox" id="cpnActive" class="w-4 h-4 accent-red-600" />
            <label for="cpnActive" class="text-sm font-bold text-gray-700">Aktifkan kupon ini</label>
          </div>
          <div v-if="formError" class="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 flex gap-2">
            <span>⚠️</span><span>{{ formError }}</span>
          </div>
        </div>
        <div class="flex gap-3 mt-6">
          <button @click="showModal=false" class="flex-1 border-2 border-gray-200 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-50 transition text-sm">Batal</button>
          <button @click="handleSubmit" :disabled="saving" class="flex-1 bg-gradient-to-r from-red-600 to-orange-500 text-white py-3 rounded-xl font-bold shadow hover:-translate-y-0.5 transition text-sm disabled:opacity-50">
            {{ saving ? 'Menyimpan...' : (editId ? 'Simpan' : 'Buat Kupon') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getCoupons, createCoupon, updateCoupon, deleteCoupon, toggleCoupon } from '@/api/admin'

const coupons   = ref([])
const loading   = ref(true)
const search    = ref('')
const page      = ref(1)
const meta      = ref({ current_page:1, last_page:1, total:0 })
const showModal = ref(false)
const editId    = ref(null)
const saving    = ref(false)
const formError = ref('')

const emptyForm = () => ({ code:'', description:'', type:'percentage', value:0, min_order:0, max_discount:'', usage_limit:100, start_date:'', end_date:'', is_active:true })
const form = ref(emptyForm())

function formatRp(v) { return new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',minimumFractionDigits:0}).format(v) }
function formatDate(d) { if(!d) return '—'; return new Date(d).toLocaleDateString('id-ID',{day:'2-digit',month:'short',year:'numeric'}) }

async function fetchCoupons() {
  loading.value = true
  try {
    const res = await getCoupons({ search: search.value||undefined, page: page.value })
    const payload = res.data?.data ?? res.data
    coupons.value = payload?.data ?? (Array.isArray(payload) ? payload : [])
    meta.value = { current_page: payload?.current_page??1, last_page: payload?.last_page??1, total: payload?.total??0 }
  } catch { coupons.value = [] } finally { loading.value = false }
}

function changePage(p) { page.value = p; fetchCoupons() }

function openModal(c = null) {
  formError.value = ''; editId.value = c?.id || null
  form.value = c ? { code:c.code, description:c.description||'', type:c.type, value:c.value, min_order:c.min_order, max_discount:c.max_discount||'', usage_limit:c.usage_limit, start_date:c.start_date?.split('T')[0]||'', end_date:c.end_date?.split('T')[0]||'', is_active:!!c.is_active } : emptyForm()
  showModal.value = true
}

async function handleSubmit() {
  if (!form.value.code.trim()) { formError.value = 'Kode kupon wajib diisi.'; return }
  if (!form.value.start_date || !form.value.end_date) { formError.value = 'Tanggal berlaku wajib diisi.'; return }
  formError.value = ''; saving.value = true
  try {
    const payload = { ...form.value, code: form.value.code.toUpperCase(), max_discount: form.value.max_discount || null }
    if (editId.value) await updateCoupon(editId.value, payload)
    else await createCoupon(payload)
    showModal.value = false; await fetchCoupons()
  } catch(err) {
    const errors = err.response?.data?.errors
    formError.value = errors ? Object.values(errors).flat().join(' • ') : (err.response?.data?.message||'Gagal menyimpan.')
  } finally { saving.value = false }
}

async function handleToggle(c) {
  try {
    const res = await toggleCoupon(c.id)
    const idx = coupons.value.findIndex(x => x.id === c.id)
    if (idx >= 0) coupons.value[idx] = res.data?.data ?? res.data
  } catch { alert('Gagal mengubah status.') }
}

async function handleDelete(c) {
  if (!confirm(`Hapus kupon "${c.code}"?`)) return
  try { await deleteCoupon(c.id); await fetchCoupons() } catch(err) { alert(err.response?.data?.message||'Gagal menghapus.') }
}

onMounted(fetchCoupons)
</script>
