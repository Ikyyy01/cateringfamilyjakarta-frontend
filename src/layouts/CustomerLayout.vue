<template>
  <div class="min-h-screen flex flex-col overflow-x-hidden">
    <Navbar />
    <main class="flex-1 w-full min-w-0">
      <RouterView />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
</script>
