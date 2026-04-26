<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <p class="text-xs text-gray-400 font-medium mb-0.5">Admin / Pengaturan</p>
        <h1 class="text-xl font-bold text-gray-900">Pengaturan</h1>
      </div>
    </div>

    <div v-if="loading" class="space-y-4">
      <div v-for="i in 4" :key="i" class="bg-white rounded-xl border border-gray-200/80 h-20 animate-pulse"></div>
    </div>

    <div v-else class="max-w-2xl space-y-5">

      <!-- Alerts -->
      <div v-if="successMsg" class="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-5 py-3.5 flex items-center gap-3">
        <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        <span>{{ successMsg }}</span>
      </div>
      <div v-if="errorMsg" class="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-5 py-3.5 flex items-center gap-3">
        <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
        <span>{{ errorMsg }}</span>
      </div>

      <!-- Konfigurasi Harga -->
      <div class="bg-white rounded-xl border border-gray-200/80 overflow-hidden">
        <div class="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
            <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
          </div>
          <div>
            <h2 class="font-semibold text-gray-800 text-sm">Konfigurasi Harga & Layanan</h2>
            <p class="text-xs text-gray-400 mt-0.5">Perubahan langsung berlaku untuk perhitungan pesanan baru.</p>
          </div>
        </div>
        <div class="p-5 space-y-4">
          <div v-for="config in configs" :key="config.key" class="flex items-center gap-4">
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-800">{{ config.label }}</label>
              <p v-if="config.description" class="text-xs text-gray-400 mt-0.5">{{ config.description }}</p>
            </div>
            <div class="flex items-center gap-2 w-44">
              <span class="text-sm text-gray-400 font-medium flex-shrink-0">
                {{ config.key.includes('percentage') || config.key.includes('rate') ? '%' : 'Rp' }}
              </span>
              <input v-model.number="formValues[config.key]" type="number" min="0"
                class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-semibold text-gray-800 focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-100 text-right" />
            </div>
          </div>
        </div>
        <div class="px-5 pb-5">
          <button @click="handleSave" :disabled="saving"
            class="w-full bg-red-600 text-white py-2.5 rounded-lg font-semibold hover:bg-red-700 transition text-sm disabled:opacity-50 flex items-center justify-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/></svg>
            {{ saving ? 'Menyimpan...' : 'Simpan Pengaturan Harga' }}
          </button>
        </div>
      </div>

      <!-- Pengaturan Aplikasi -->
      <div class="bg-white rounded-xl border border-gray-200/80 overflow-hidden">
        <div class="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
            <svg class="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </div>
          <div>
            <h2 class="font-semibold text-gray-800 text-sm">Pengaturan Aplikasi</h2>
            <p class="text-xs text-gray-400 mt-0.5">Nomor kontak yang ditampilkan kepada pelanggan.</p>
          </div>
        </div>
        <div class="p-5 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-800 mb-1.5">Nomor WhatsApp</label>
            <p class="text-xs text-gray-400 mb-2">Format tanpa tanda + (contoh: 6281234567890)</p>
            <input v-model="appValues.whatsapp_number" type="text" placeholder="6281234567890"
              class="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm font-medium text-gray-800 focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-100" />
          </div>
        </div>
        <div class="px-5 pb-5">
          <button @click="handleSaveApp" :disabled="savingApp"
            class="w-full bg-red-600 text-white py-2.5 rounded-lg font-semibold hover:bg-red-700 transition text-sm disabled:opacity-50 flex items-center justify-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/></svg>
            {{ savingApp ? 'Menyimpan...' : 'Simpan Pengaturan Aplikasi' }}
          </button>
        </div>
      </div>

      <!-- QRIS Image -->
      <div class="bg-white rounded-xl border border-gray-200/80 overflow-hidden">
        <div class="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
            <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"/>
            </svg>
          </div>
          <div>
            <h2 class="font-semibold text-gray-800 text-sm">Gambar QRIS Pembayaran</h2>
            <p class="text-xs text-gray-400 mt-0.5">QR Code yang ditampilkan pada halaman pembayaran pelanggan.</p>
          </div>
        </div>
        <div class="p-5">
          <!-- Preview QRIS aktif -->
          <div v-if="qrisUrl && !qrisPreview" class="mb-5">
            <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">QRIS Aktif Saat Ini</p>
            <div class="relative inline-block">
              <img :src="qrisUrl" class="w-48 h-48 object-contain rounded-xl border border-gray-200 bg-white p-2" />
              <button @click="handleDeleteQris" :disabled="deletingQris"
                class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold hover:bg-red-600 transition shadow disabled:opacity-50">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <p class="text-xs text-gray-400 mt-2">Klik tombol × untuk hapus dan upload yang baru.</p>
          </div>

          <!-- Preview upload baru -->
          <div v-if="qrisPreview" class="mb-5">
            <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Preview</p>
            <div class="relative inline-block">
              <img :src="qrisPreview" class="w-48 h-48 object-contain rounded-xl border-2 border-green-200 bg-white p-2" />
              <button @click="clearQrisFile"
                class="absolute -top-2 -right-2 w-6 h-6 bg-gray-400 text-white rounded-full flex items-center justify-center text-xs font-bold hover:bg-gray-500 transition shadow">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
          </div>

          <!-- Drop zone -->
          <div v-if="!qrisPreview"
            @click="$refs.qrisInput.click()"
            class="border border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-red-300 hover:bg-red-50/20 transition">
            <svg class="w-10 h-10 mx-auto mb-3 text-gray-200" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
            </svg>
            <div class="font-medium text-sm text-gray-500 mb-1">
              {{ qrisUrl ? 'Klik untuk ganti gambar QRIS' : 'Klik untuk upload gambar QRIS' }}
            </div>
            <div class="text-xs text-gray-400">JPG, PNG, WebP — Maks. 2MB</div>
          </div>
          <input ref="qrisInput" type="file" accept="image/jpeg,image/png,image/jpg,image/webp"
            @change="onQrisFileChange" class="hidden" />

          <button v-if="qrisFile" @click="handleUploadQris" :disabled="uploadingQris"
            class="w-full mt-4 bg-red-600 text-white py-2.5 rounded-lg font-semibold hover:bg-red-700 transition text-sm disabled:opacity-50 flex items-center justify-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>
            {{ uploadingQris ? 'Mengupload...' : 'Upload Gambar QRIS' }}
          </button>
        </div>
      </div>

      <!-- Info -->
      <div class="bg-amber-50 border border-amber-200 rounded-xl p-5">
        <div class="flex items-center gap-2 mb-3">
          <svg class="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <p class="text-xs font-bold uppercase tracking-wider text-amber-700">Catatan</p>
        </div>
        <ul class="text-xs text-amber-700 space-y-1.5 list-disc list-inside">
          <li>Perubahan harga tidak mempengaruhi pesanan yang sudah ada.</li>
          <li>Radius gratis ongkir dihitung dari lokasi dapur Catering Family Jakarta.</li>
          <li>Biaya layanan dikenakan sebagai persentase dari subtotal.</li>
          <li>Gambar QRIS ditampilkan langsung di halaman pembayaran pelanggan.</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getSettings, updateSettings, updateAppSettings, uploadQris, deleteQris } from '@/api/admin'

const configs     = ref([])
const formValues  = ref({})
const appValues   = ref({ whatsapp_number: '' })
const qrisUrl     = ref(null)
const qrisFile    = ref(null)
const qrisPreview = ref(null)

const loading       = ref(true)
const saving        = ref(false)
const savingApp     = ref(false)
const uploadingQris = ref(false)
const deletingQris  = ref(false)
const successMsg    = ref('')
const errorMsg      = ref('')

function showSuccess(msg) { successMsg.value = msg; errorMsg.value = ''; setTimeout(() => { successMsg.value = '' }, 4000) }
function showError(msg)   { errorMsg.value = msg; successMsg.value = '' }

async function fetchSettings() {
  loading.value = true
  try {
    const res  = await getSettings()
    const data = res.data?.data ?? res.data
    const priceConfigs = Array.isArray(data) ? data : (data?.price_configs ?? [])
    configs.value = priceConfigs
    priceConfigs.forEach(c => { formValues.value[c.key] = parseFloat(c.value) })
    const appSettings = data?.app_settings ?? {}
    appValues.value.whatsapp_number = appSettings.whatsapp_number?.value ?? appSettings.whatsapp_number ?? ''
    const qrisPath = appSettings.qris_image?.value ?? appSettings.qris_image ?? null
    if (qrisPath) {
      const storageBase = import.meta.env.VITE_STORAGE_URL || (import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8000') + '/storage'
      qrisUrl.value = `${storageBase}/${qrisPath}`
    }
  } catch { showError('Gagal memuat pengaturan.') }
  finally { loading.value = false }
}

async function handleSave() {
  saving.value = true
  try { await updateSettings({ configs: formValues.value }); showSuccess('Pengaturan harga berhasil disimpan!') }
  catch(err) { showError(err.response?.data?.message || 'Gagal menyimpan pengaturan.') }
  finally { saving.value = false }
}

async function handleSaveApp() {
  savingApp.value = true
  try { await updateAppSettings(appValues.value); showSuccess('Pengaturan aplikasi berhasil disimpan!') }
  catch(err) { showError(err.response?.data?.message || 'Gagal menyimpan.') }
  finally { savingApp.value = false }
}

function onQrisFileChange(e) {
  const f = e.target.files[0]; if (!f) return
  if (f.size > 2 * 1024 * 1024) { showError('Ukuran file maksimal 2MB.'); return }
  qrisFile.value = f; qrisPreview.value = URL.createObjectURL(f)
}
function clearQrisFile() { qrisFile.value = null; qrisPreview.value = null }

async function handleUploadQris() {
  if (!qrisFile.value) return
  uploadingQris.value = true
  try {
    const fd = new FormData(); fd.append('qris_image', qrisFile.value)
    const res = await uploadQris(fd)
    qrisUrl.value = res.data?.data?.qris_url ?? null; qrisFile.value = null; qrisPreview.value = null
    showSuccess('Gambar QRIS berhasil diupload!')
  } catch(err) { showError(err.response?.data?.message || 'Gagal upload QRIS.') }
  finally { uploadingQris.value = false }
}

async function handleDeleteQris() {
  if (!confirm('Hapus gambar QRIS saat ini?')) return
  deletingQris.value = true
  try { await deleteQris(); qrisUrl.value = null; showSuccess('Gambar QRIS berhasil dihapus.') }
  catch(err) { showError(err.response?.data?.message || 'Gagal menghapus QRIS.') }
  finally { deletingQris.value = false }
}

onMounted(fetchSettings)
</script>
