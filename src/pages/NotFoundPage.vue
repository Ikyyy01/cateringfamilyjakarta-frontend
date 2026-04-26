<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div class="text-center max-w-md">
      <div class="text-8xl mb-6" style="filter:drop-shadow(0 8px 24px rgba(0,0,0,.1))">🍱</div>
      <h1 class="text-6xl font-extrabold text-red-600 mb-2">404</h1>
      <h2 class="text-2xl font-extrabold text-gray-800 mb-3">Halaman Tidak Ditemukan</h2>
      <p class="text-gray-400 leading-relaxed mb-8">
        Maaf, halaman yang kamu cari tidak ada atau sudah dipindahkan.<br>
        Yuk kembali ke beranda!
      </p>
      <div class="flex flex-wrap gap-3 justify-center">
        <RouterLink to="/"
          class="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-orange-500 text-white px-7 py-3 rounded-full font-bold shadow hover:-translate-y-0.5 transition">
          🏠 Ke Beranda
        </RouterLink>
        <RouterLink to="/menu"
          class="inline-flex items-center gap-2 border-2 border-gray-200 text-gray-600 px-6 py-3 rounded-full font-bold hover:border-red-400 hover:text-red-600 transition">
          🍛 Lihat Menu
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
// 404 Page
</script>
