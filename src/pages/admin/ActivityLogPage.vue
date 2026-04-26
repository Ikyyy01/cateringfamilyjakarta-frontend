<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <p class="text-xs text-gray-400 font-semibold mb-0.5">Panel Admin › Activity Log</p>
        <h1 class="text-2xl font-extrabold text-gray-800">Log Aktivitas</h1>
      </div>
    </div>

    <!-- Filter -->
    <div class="bg-white rounded-2xl shadow-sm p-4 mb-5 flex flex-wrap gap-3">
      <input v-model="search" @keyup.enter="fetchLogs" type="text" placeholder="🔍 Cari deskripsi atau nama admin..."
        class="flex-1 min-w-[200px] border-2 border-gray-100 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-red-300 transition" />
      <select v-model="actionFilter" @change="fetchLogs" class="border-2 border-gray-100 rounded-xl px-4 py-2 text-sm focus:outline-none bg-white">
        <option value="">Semua Aksi</option>
        <option v-for="a in actions" :key="a" :value="a">{{ a }}</option>
      </select>
      <input v-model="fromDate" type="date" class="border-2 border-gray-100 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-red-300" @change="fetchLogs" />
      <input v-model="toDate" type="date" class="border-2 border-gray-100 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-red-300" @change="fetchLogs" />
      <button @click="resetFilter" class="text-xs border-2 border-gray-200 text-gray-500 px-4 py-2 rounded-xl font-bold hover:border-red-300 hover:text-red-500 transition">Reset</button>
    </div>

    <!-- Logs -->
    <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div v-if="loading" class="p-8 space-y-3">
        <div v-for="i in 8" :key="i" class="h-12 bg-gray-100 rounded-xl animate-pulse"></div>
      </div>
      <div v-else-if="logs.length === 0" class="text-center py-16">
        <div class="text-4xl mb-3">📋</div>
        <p class="font-semibold text-gray-400">Tidak ada log aktivitas</p>
      </div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 border-b border-gray-100">
            <tr>
              <th class="px-5 py-3 text-left text-xs font-black uppercase tracking-wider text-gray-400">Waktu</th>
              <th class="px-5 py-3 text-left text-xs font-black uppercase tracking-wider text-gray-400">Admin</th>
              <th class="px-5 py-3 text-left text-xs font-black uppercase tracking-wider text-gray-400">Aksi</th>
              <th class="px-5 py-3 text-left text-xs font-black uppercase tracking-wider text-gray-400">Deskripsi</th>
              <th class="px-5 py-3 text-left text-xs font-black uppercase tracking-wider text-gray-400">IP</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="log in logs" :key="log.id" class="hover:bg-gray-50/50 transition-colors">
              <td class="px-5 py-3 text-xs text-gray-400 whitespace-nowrap">{{ formatDateTime(log.created_at) }}</td>
              <td class="px-5 py-3">
                <div class="flex items-center gap-2">
                  <div class="w-7 h-7 rounded-lg bg-gradient-to-br from-red-500 to-orange-400 flex items-center justify-center text-white font-black text-[10px] flex-shrink-0">
                    {{ (log.user?.name||'S')[0].toUpperCase() }}
                  </div>
                  <span class="text-xs font-bold text-gray-700">{{ log.user?.name || 'System' }}</span>
                </div>
              </td>
              <td class="px-5 py-3">
                <span :class="['text-xs px-2.5 py-1 rounded-full font-bold', actionClass(log.action)]">{{ log.action }}</span>
              </td>
              <td class="px-5 py-3 text-xs text-gray-600 max-w-xs">{{ log.description || '—' }}</td>
              <td class="px-5 py-3 text-xs text-gray-400 font-mono">{{ log.ip_address || '—' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="meta.last_page > 1" class="flex items-center justify-between px-6 py-4 border-t border-gray-50">
        <p class="text-xs text-gray-400">Halaman {{ meta.current_page }} dari {{ meta.last_page }} ({{ meta.total }} log)</p>
        <div class="flex gap-2">
          <button @click="changePage(meta.current_page-1)" :disabled="meta.current_page<=1" class="px-4 py-1.5 text-xs border-2 border-gray-200 rounded-lg font-bold disabled:opacity-30 hover:border-red-300 transition">← Prev</button>
          <button @click="changePage(meta.current_page+1)" :disabled="meta.current_page>=meta.last_page" class="px-4 py-1.5 text-xs border-2 border-gray-200 rounded-lg font-bold disabled:opacity-30 hover:border-red-300 transition">Next →</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getActivityLogs } from '@/api/admin'

const logs         = ref([])
const actions      = ref([])
const loading      = ref(true)
const search       = ref('')
const actionFilter = ref('')
const fromDate     = ref('')
const toDate       = ref('')
const page         = ref(1)
const meta         = ref({ current_page:1, last_page:1, total:0 })

function formatDateTime(d) {
  return new Date(d).toLocaleString('id-ID',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'})
}

function actionClass(action) {
  const map = { created:'bg-green-100 text-green-700', updated:'bg-blue-100 text-blue-700', deleted:'bg-red-100 text-red-600', login:'bg-purple-100 text-purple-700' }
  return map[action] || 'bg-gray-100 text-gray-600'
}

async function fetchLogs() {
  loading.value = true
  try {
    const res = await getActivityLogs({ search: search.value||undefined, action: actionFilter.value||undefined, from: fromDate.value||undefined, to: toDate.value||undefined, page: page.value })
    const payload = res.data?.data ?? res.data
    logs.value    = payload?.data ?? (Array.isArray(payload) ? payload : [])
    meta.value    = { current_page: payload?.current_page??1, last_page: payload?.last_page??1, total: payload?.total??0 }
    if (res.data?.actions) actions.value = res.data.actions
  } catch { logs.value = [] } finally { loading.value = false }
}

function changePage(p) { page.value = p; fetchLogs() }
function resetFilter() { search.value=''; actionFilter.value=''; fromDate.value=''; toDate.value=''; page.value=1; fetchLogs() }

onMounted(fetchLogs)
</script>
