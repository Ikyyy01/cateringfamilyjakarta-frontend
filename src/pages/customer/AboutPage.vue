<template>
  <div>
    <!-- Hero -->
    <section class="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-24 overflow-hidden">
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-0 left-1/4 w-96 h-96 bg-red-500 rounded-full blur-3xl"></div>
        <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500 rounded-full blur-3xl"></div>
      </div>
      <div class="max-w-4xl mx-auto px-4 text-center relative z-10">
        <span class="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-sm font-medium px-4 py-1.5 rounded-full mb-6 text-gray-300">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          Tentang Kami
        </span>
        <h1 class="text-4xl md:text-5xl font-bold mb-5 leading-tight">
          Catering Family<br/>
          <span class="text-red-400">Jakarta</span>
        </h1>
        <p class="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Melayani kebutuhan catering nasi box dan paket aqiqah untuk seluruh wilayah Jakarta
          dengan cita rasa terbaik, bahan segar, dan harga yang terjangkau.
        </p>
      </div>
    </section>

    <!-- Story -->
    <section class="py-20 bg-white">
      <div class="max-w-5xl mx-auto px-4">
        <div class="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span class="text-xs font-bold uppercase tracking-widest text-red-500 mb-3 block">Cerita Kami</span>
            <h2 class="text-3xl font-bold text-gray-900 mb-5 leading-tight">Berawal dari Dapur Rumah,<br/>Kini Melayani Ribuan Pelanggan</h2>
            <p class="text-gray-500 leading-relaxed mb-4">
              Catering Family Jakarta berdiri dengan semangat menyajikan masakan rumahan yang lezat dan bergizi
              untuk berbagai acara — mulai dari rapat kantor, arisan keluarga, pernikahan, hingga aqiqah.
            </p>
            <p class="text-gray-500 leading-relaxed mb-4">
              Kami percaya bahwa makanan yang baik lahir dari bahan-bahan segar pilihan, dimasak dengan
              penuh perhatian oleh tim yang berpengalaman. Setiap box yang kami sajikan mencerminkan
              kehangatan dan kepedulian kami terhadap pelanggan.
            </p>
            <p class="text-gray-500 leading-relaxed">
              Dengan sistem pemesanan online yang mudah dan layanan pengiriman ke seluruh Jakarta,
              kami hadir untuk memastikan acara Anda berjalan lancar dengan hidangan terbaik.
            </p>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div v-for="stat in stats" :key="stat.label"
              class="bg-gray-50 rounded-2xl p-6 text-center border border-gray-100">
              <div class="text-3xl font-bold text-red-600 mb-1">{{ stat.value }}</div>
              <div class="text-sm text-gray-500 font-medium">{{ stat.label }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Keunggulan -->
    <section class="py-20 bg-gray-50">
      <div class="max-w-5xl mx-auto px-4">
        <div class="text-center mb-12">
          <span class="text-xs font-bold uppercase tracking-widest text-red-500 mb-3 block">Keunggulan</span>
          <h2 class="text-3xl font-bold text-gray-900">Mengapa Memilih Kami?</h2>
        </div>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="feature in features" :key="feature.title"
            class="bg-white rounded-2xl p-6 border border-gray-100 hover:border-red-100 hover:shadow-sm transition">
            <div class="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center mb-4" v-html="feature.icon"></div>
            <h3 class="font-bold text-gray-800 mb-2">{{ feature.title }}</h3>
            <p class="text-sm text-gray-500 leading-relaxed">{{ feature.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Layanan -->
    <section class="py-20 bg-white">
      <div class="max-w-5xl mx-auto px-4">
        <div class="text-center mb-12">
          <span class="text-xs font-bold uppercase tracking-widest text-red-500 mb-3 block">Layanan</span>
          <h2 class="text-3xl font-bold text-gray-900">Yang Kami Sediakan</h2>
        </div>
        <div class="grid sm:grid-cols-2 gap-6">
          <div v-for="svc in services" :key="svc.title"
            class="flex gap-4 p-6 rounded-2xl border border-gray-100 hover:border-red-100 hover:shadow-sm transition">
            <div class="w-12 h-12 rounded-xl bg-red-600 flex items-center justify-center flex-shrink-0" v-html="svc.icon"></div>
            <div>
              <h3 class="font-bold text-gray-800 mb-1.5">{{ svc.title }}</h3>
              <p class="text-sm text-gray-500 leading-relaxed">{{ svc.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Tim (opsional – project) -->
    <section class="py-20 bg-gray-50">
      <div class="max-w-5xl mx-auto px-4">
        <div class="text-center mb-12">
          <span class="text-xs font-bold uppercase tracking-widest text-red-500 mb-3 block">Proyek Akademik</span>
          <h2 class="text-3xl font-bold text-gray-900">Informasi Proyek</h2>
          <p class="text-gray-500 mt-3 max-w-xl mx-auto text-sm leading-relaxed">
            Aplikasi ini dikembangkan sebagai Proyek Industri (PI) di Universitas Gunadarma,
            mengimplementasikan sistem pemesanan catering berbasis web menggunakan Laravel dan Vue 3.
          </p>
        </div>
        <div class="grid sm:grid-cols-3 gap-5">
          <div v-for="tech in techStack" :key="tech.name"
            class="bg-white rounded-2xl p-5 border border-gray-100 text-center hover:border-gray-200 hover:shadow-sm transition">
            <div class="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center mx-auto mb-3" v-html="tech.icon"></div>
            <div class="font-semibold text-gray-800 text-sm">{{ tech.name }}</div>
            <div class="text-xs text-gray-400 mt-1">{{ tech.desc }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-20 bg-red-600 text-white">
      <div class="max-w-3xl mx-auto px-4 text-center">
        <h2 class="text-3xl font-bold mb-4">Siap Memesan Catering?</h2>
        <p class="text-red-100 mb-8 leading-relaxed">
          Jelajahi menu kami dan temukan pilihan catering terbaik untuk acara Anda.
          Pemesanan mudah, pengiriman tepat waktu.
        </p>
        <div class="flex flex-wrap items-center justify-center gap-4">
          <RouterLink to="/menu"
            class="bg-white text-red-600 px-6 py-3 rounded-xl font-bold hover:bg-red-50 transition">
            Lihat Menu
          </RouterLink>
          <a href="https://wa.me/6281234567890" target="_blank"
            class="border-2 border-white/40 text-white px-6 py-3 rounded-xl font-bold hover:bg-white/10 transition flex items-center gap-2">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Hubungi Kami
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const stats = [
  { value: '1000+', label: 'Pelanggan Puas' },
  { value: '50+',   label: 'Varian Menu' },
  { value: '5+',    label: 'Tahun Pengalaman' },
  { value: '100%',  label: 'Bahan Segar' },
]

const icCheck   = `<svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>`
const icLeaf    = `<svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 3s3.5 0 7 3.5S16 12 16 12s-3.5 0-7-3.5S5 3 5 3zm0 0v18"/></svg>`
const icTruck   = `<svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"/></svg>`
const icStar    = `<svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>`
const icClock   = `<svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`
const icShield  = `<svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>`

const features = [
  { icon: icLeaf,   title: 'Bahan Segar Setiap Hari',   desc: 'Kami menggunakan bahan-bahan segar berkualitas yang dipilih setiap hari dari pemasok terpercaya.' },
  { icon: icStar,   title: 'Cita Rasa Autentik',        desc: 'Resep turun-temurun yang dipadukan teknik memasak modern untuk menghasilkan cita rasa terbaik.' },
  { icon: icTruck,  title: 'Pengiriman Tepat Waktu',    desc: 'Armada pengiriman kami memastikan catering sampai di lokasi acara Anda tepat waktu.' },
  { icon: icClock,  title: 'Pemesanan Fleksibel',       desc: 'Pesan kapan saja melalui website kami dengan konfirmasi pesanan yang cepat dan mudah.' },
  { icon: icShield, title: 'Higienitas Terjamin',       desc: 'Seluruh proses memasak dan pengemasan dilakukan dalam kondisi bersih dan higienis.' },
  { icon: icCheck,  title: 'Harga Transparan',          desc: 'Harga yang kami tampilkan sudah final, tidak ada biaya tersembunyi.' },
]

const svcIconBox  = `<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>`
const svcIconAqq  = `<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>`
const svcIconPest = `<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>`
const svcIconCust = `<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>`

const services = [
  { icon: svcIconBox,  title: 'Catering Nasi Box',       desc: 'Pilihan nasi box dengan berbagai lauk pauk untuk rapat, seminar, pelatihan, dan berbagai acara korporat maupun pribadi.' },
  { icon: svcIconAqq,  title: 'Paket Aqiqah',            desc: 'Layanan aqiqah lengkap dengan pilihan menu kambing/sapi yang diolah secara higienis dan dikemas dengan rapi.' },
  { icon: svcIconPest, title: 'Catering Pesta & Event',  desc: 'Layanan catering untuk pernikahan, ulang tahun, dan berbagai acara besar dengan pilihan menu yang beragam.' },
  { icon: svcIconCust, title: 'Menu Custom',              desc: 'Tidak menemukan menu yang cocok? Kami menerima pesanan menu custom sesuai kebutuhan dan selera Anda.' },
]

const techStack = [
  { name: 'Laravel 11',   desc: 'Backend & REST API', icon: `<svg class="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 24 24"><path d="M23.642 5.43a.364.364 0 01.014.1v5.149c0 .135-.073.26-.189.326l-4.323 2.49v4.934a.378.378 0 01-.188.326L9.93 23.949a.316.316 0 01-.066.027.29.29 0 01-.068.009.299.299 0 01-.067-.009.408.408 0 01-.068-.027L.533 18.755a.376.376 0 01-.189-.326V2.974c0-.035.006-.07.014-.104a.373.373 0 01.014-.073c.006-.014.014-.026.022-.04.013-.016.026-.033.04-.048l.04-.02.04-.026L5.044.534a.375.375 0 01.376 0L9.93 3.196h.002c.012.007.025.014.038.023l.04.02.04.047c.008.014.016.027.022.04.008.022.012.046.014.073v9.823l3.759-2.164V5.53c0-.035.005-.069.014-.104.006-.025.014-.05.022-.073.007-.014.015-.026.024-.04.012-.016.025-.033.04-.047l.04-.02.038-.026 4.512-2.663a.375.375 0 01.376 0l4.512 2.663.04.026.04.02c.014.014.028.031.04.047.01.014.017.027.024.04.008.023.016.048.021.073zm-.74 5.019V6.444l-1.572.906-2.187 1.258v3.999zm-4.511 7.75v-4.006l-2.153 1.232-6.133 3.51v4.044zM1.095 3.474v15.008l8.285 4.754v-4.044l-4.32-2.453-.002-.003-.002-.003c-.014-.01-.025-.021-.037-.031-.011-.01-.024-.02-.034-.032l-.003-.004c-.01-.011-.017-.024-.025-.037-.008-.012-.016-.024-.021-.037l-.003-.005c-.007-.014-.01-.028-.014-.043-.005-.014-.01-.028-.012-.043v-.005c-.003-.016-.003-.031-.003-.047V5.994L4.93 4.736zM5.424 1.16L1.713 3.295l3.711 2.136 3.712-2.136zm.376 7.602v-4.26L1.282 7.02v4.006l4.518-2.264zM9.552 3.675L5.841 5.81v4.26l4.511-2.264V3.675zm9.021 7.748V7.424L16.386 6.166l-2.188-1.258v4.006l2.187 1.258zm-4.51-8.243l-3.712 2.135 3.712 2.136 3.71-2.136zm-.377 4.927l-2.188-1.259-1.57-.907v3.999l2.187 1.258 1.571.906z"/></svg>` },
  { name: 'Vue 3',        desc: 'Frontend Framework', icon: `<svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24"><path d="M24 1.61h-9.94L12 5.16 9.94 1.61H0l12 20.78zM2.17 3.58H5.9l6.1 10.55L18.1 3.58h3.73L12 19.44z"/></svg>` },
  { name: 'MySQL',        desc: 'Database',           icon: `<svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><ellipse cx="12" cy="5" rx="9" ry="3"/><path stroke-linecap="round" stroke-linejoin="round" d="M21 12c0 1.657-4.03 3-9 3S3 13.657 3 12"/><path stroke-linecap="round" stroke-linejoin="round" d="M3 5v14c0 1.657 4.03 3 9 3s9-1.343 9-3V5"/></svg>` },
  { name: 'Tailwind CSS', desc: 'UI Framework',      icon: `<svg class="w-5 h-5 text-cyan-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z"/></svg>` },
  { name: 'Vite',         desc: 'Build Tool',        icon: `<svg class="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 24 24"><path d="M24 3.563L13.18 23.637c-.22.397-.776.397-.996 0L1.315 3.563a.573.573 0 01.529-.845l11.07 1.315a.572.572 0 00.128 0l10.83-1.315a.573.573 0 01.528.845z"/></svg>` },
  { name: 'Axios',        desc: 'HTTP Client',       icon: `<svg class="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>` },
]
</script>
