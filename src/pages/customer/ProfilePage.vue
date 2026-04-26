<template>
  <div class="max-w-xl mx-auto px-4 py-10">
    <div class="mb-8">
      <h1 class="text-3xl font-extrabold text-gray-900">Profil <span class="text-red-600">Saya</span></h1>
      <div class="w-12 h-1 bg-gradient-to-r from-red-600 to-orange-400 rounded mt-3"></div>
    </div>

    <!-- Data Profil -->
    <div class="bg-white rounded-3xl shadow-md p-8 mb-6">
      <!-- Avatar -->
      <div class="flex items-center gap-4 mb-8">
        <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600 to-orange-400 flex items-center justify-center text-white font-extrabold text-2xl">
          {{ authStore.user?.name?.[0]?.toUpperCase() || 'U' }}
        </div>
        <div>
          <p class="font-extrabold text-gray-800 text-lg">{{ authStore.user?.name }}</p>
          <p class="text-sm text-gray-400">{{ authStore.user?.email }}</p>
          <span class="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold mt-1 inline-block">
            {{ authStore.user?.role === 'admin' ? 'Admin' : 'Customer' }}
          </span>
        </div>
      </div>

      <!-- Form profil -->
      <form @submit.prevent="handleUpdate" class="space-y-4">
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-1.5">Nama Lengkap</label>
          <input v-model="form.name" type="text" required
            class="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-red-400 transition" />
        </div>
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-1.5">No. HP</label>
          <input v-model="form.phone" type="tel"
            class="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-red-400 transition" />
        </div>
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-1.5">Alamat</label>
          <textarea v-model="form.address" rows="3"
            class="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-red-400 transition resize-none"></textarea>
        </div>

        <div v-if="profileSuccess" class="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3">
          {{ profileSuccess }}
        </div>
        <div v-if="profileError" class="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
          {{ profileError }}
        </div>

        <button type="submit" :disabled="profileLoading"
          class="w-full bg-gradient-to-r from-red-600 to-orange-500 text-white py-3 rounded-xl font-bold shadow hover:-translate-y-0.5 transition disabled:opacity-50">
          {{ profileLoading ? 'Menyimpan...' : '💾 Simpan Perubahan' }}
        </button>
      </form>
    </div>

    <!-- Ganti Password -->
    <div class="bg-white rounded-3xl shadow-md p-8 mb-6">
      <div class="flex items-center gap-3 mb-6">
        <div class="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-xl">🔑</div>
        <div>
          <h2 class="font-extrabold text-gray-800">Ganti Password</h2>
          <p class="text-xs text-gray-400">Perbarui password akun kamu</p>
        </div>
      </div>

      <form @submit.prevent="handleChangePassword" class="space-y-4">
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-1.5">Password Saat Ini</label>
          <div class="relative">
            <input v-model="pwForm.current_password" :type="showPw.current ? 'text' : 'password'" required
              class="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 pr-11 focus:outline-none focus:border-red-400 transition" />
            <button type="button" @click="showPw.current = !showPw.current"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm">
              {{ showPw.current ? '🙈' : '👁' }}
            </button>
          </div>
        </div>
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-1.5">Password Baru</label>
          <div class="relative">
            <input v-model="pwForm.password" :type="showPw.new ? 'text' : 'password'" required minlength="8"
              class="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 pr-11 focus:outline-none focus:border-red-400 transition" />
            <button type="button" @click="showPw.new = !showPw.new"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm">
              {{ showPw.new ? '🙈' : '👁' }}
            </button>
          </div>
          <p class="text-xs text-gray-400 mt-1">Minimal 8 karakter</p>
        </div>
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-1.5">Konfirmasi Password Baru</label>
          <div class="relative">
            <input v-model="pwForm.password_confirmation" :type="showPw.confirm ? 'text' : 'password'" required
              class="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 pr-11 focus:outline-none focus:border-red-400 transition" />
            <button type="button" @click="showPw.confirm = !showPw.confirm"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm">
              {{ showPw.confirm ? '🙈' : '👁' }}
            </button>
          </div>
        </div>

        <div v-if="pwSuccess" class="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3">
          {{ pwSuccess }}
        </div>
        <div v-if="pwError" class="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
          {{ pwError }}
        </div>

        <button type="submit" :disabled="pwLoading"
          class="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 rounded-xl font-bold shadow hover:-translate-y-0.5 transition disabled:opacity-50">
          {{ pwLoading ? 'Menyimpan...' : '🔐 Ganti Password' }}
        </button>
      </form>
    </div>

    <!-- Logout -->
    <div class="bg-white rounded-3xl shadow-md p-8">
      <button @click="handleLogout"
        class="w-full border-2 border-gray-200 text-gray-600 py-3 rounded-xl font-bold hover:border-red-300 hover:text-red-500 transition text-sm">
        🚪 Logout dari Akun Ini
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { updateProfile, updatePassword } from '@/api/auth'

const authStore = useAuthStore()
const router    = useRouter()

// Profil
const form          = ref({ name: '', phone: '', address: '' })
const profileLoading= ref(false)
const profileSuccess= ref('')
const profileError  = ref('')

// Password
const pwForm    = ref({ current_password: '', password: '', password_confirmation: '' })
const pwLoading = ref(false)
const pwSuccess = ref('')
const pwError   = ref('')
const showPw    = ref({ current: false, new: false, confirm: false })

onMounted(() => {
  form.value = {
    name:    authStore.user?.name    || '',
    phone:   authStore.user?.phone   || '',
    address: authStore.user?.address || '',
  }
})

async function handleUpdate() {
  profileLoading.value = true
  profileSuccess.value = ''
  profileError.value   = ''
  try {
    const res = await updateProfile(form.value)
    authStore.user = res.data.data || res.data
    profileSuccess.value = '✅ Profil berhasil diperbarui!'
  } catch (err) {
    profileError.value = err.response?.data?.message || 'Gagal menyimpan perubahan.'
  } finally {
    profileLoading.value = false
  }
}

async function handleChangePassword() {
  pwLoading.value = true
  pwSuccess.value = ''
  pwError.value   = ''
  try {
    const res = await updatePassword(pwForm.value)
    // Token baru diterima — update store
    const newToken = res.data?.data?.token
    if (newToken) {
      authStore.token = newToken
      localStorage.setItem('token', newToken)
    }
    pwSuccess.value = '✅ Password berhasil diperbarui!'
    pwForm.value = { current_password: '', password: '', password_confirmation: '' }
  } catch (err) {
    pwError.value = err.response?.data?.message || 'Gagal mengganti password.'
  } finally {
    pwLoading.value = false
  }
}

async function handleLogout() {
  await authStore.logout()
  router.push('/')
}
</script>
