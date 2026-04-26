<template>
  <footer class="bg-gray-900 text-gray-400 pt-14 pb-6 mt-16">
    <div class="max-w-6xl mx-auto px-4">
      <div class="grid md:grid-cols-4 gap-10 mb-10">
        <!-- Brand -->
        <div class="md:col-span-2">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
            </div>
            <div>
              <div class="text-white font-bold text-base">Catering Family Jakarta</div>
              <div class="text-xs text-gray-500">Catering Jakarta Terpercaya</div>
            </div>
          </div>
          <p class="text-sm leading-relaxed max-w-sm mb-5 text-gray-400">
            Melayani kebutuhan catering nasi box dan paket aqiqah untuk seluruh wilayah Jakarta
            dengan cita rasa terbaik dan harga terjangkau.
          </p>
          <div class="flex gap-2">
            <a href="https://wa.me/6281234567890" target="_blank"
               class="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-green-600 hover:border-green-600 hover:text-white transition text-gray-400">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </a>
            <a href="#"
               class="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-pink-600 hover:border-pink-600 hover:text-white transition text-gray-400">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke-linecap="round" stroke-linejoin="round"/>
                <path stroke-linecap="round" stroke-linejoin="round" d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"/>
              </svg>
            </a>
          </div>
        </div>

        <!-- Navigasi -->
        <div>
          <h6 class="text-white font-bold text-xs uppercase tracking-widest mb-4">Navigasi</h6>
          <div class="space-y-2.5">
            <RouterLink to="/"             class="block text-sm hover:text-white transition">Beranda</RouterLink>
            <RouterLink to="/menu"         class="block text-sm hover:text-white transition">Katalog Menu</RouterLink>
            <RouterLink to="/tentang-kami" class="block text-sm hover:text-white transition">Tentang Kami</RouterLink>
            <RouterLink to="/track"        class="block text-sm hover:text-white transition">Lacak Pesanan</RouterLink>
            <RouterLink to="/customer/cart" class="block text-sm hover:text-white transition">Keranjang</RouterLink>
          </div>
        </div>

        <!-- Kontak -->
        <div>
          <h6 class="text-white font-bold text-xs uppercase tracking-widest mb-4">Kontak</h6>
          <div class="space-y-3 text-sm">
            <div class="flex items-start gap-2.5">
              <svg class="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
              <span>+62 812-3456-7890</span>
            </div>
            <div class="flex items-start gap-2.5">
              <svg class="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              <span>info@cateringfamilyjakarta.com</span>
            </div>
            <div class="flex items-start gap-2.5">
              <svg class="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              <span>Jakarta, Indonesia</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom -->
      <div class="border-t border-white/10 pt-5 flex justify-center text-xs text-gray-500">
        <p>© {{ new Date().getFullYear() }} Catering Family Jakarta. Semua hak dilindungi.</p>
      </div>
    </div>
  </footer>
</template>
