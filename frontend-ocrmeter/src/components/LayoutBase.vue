<script setup>
import { ref, onMounted } from 'vue'
import MobileNavbar from './MobileNavbar.vue'
import Sidebar from './Sidebar.vue'
import authService from '@/services/authService'

const isMobile = ref(false)
const isLoggedIn = authService.isLoggedIn // ✅ usar el ref directamente

onMounted(() => {
  const checkSize = () => {
    isMobile.value = window.innerWidth <= 576
  }
  checkSize()
  window.addEventListener('resize', checkSize)
})
</script>


<template>
  <div class="d-flex flex-column min-vh-100">
    <!-- MOBILE NAV -->
    <MobileNavbar v-if="isLoggedIn && isMobile" />

    <!-- DESKTOP LAYOUT -->
    <div v-else-if="isLoggedIn" class="d-flex flex-grow-1">
      <Sidebar />
      <div class="flex-grow-1 p-4">
        <header class="mb-3 border-bottom pb-2">
          <h4 class="mb-0">Cabecera del sistema</h4>
        </header>
        <main>
          <router-view />
        </main>
      </div>
    </div>

    <!-- VISTA PÚBLICA (sin login) -->
    <div v-else class="flex-grow-1 d-flex align-items-center justify-content-center bg-light">
      <router-view />
    </div>
  </div>
</template>
