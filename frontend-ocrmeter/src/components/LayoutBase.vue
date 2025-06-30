<script setup>
import { ref, onMounted } from 'vue'
import MobileNavbar from './MobileNavbar.vue'
import Sidebar from './Sidebar.vue'

const isMobile = ref(false)

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
    <MobileNavbar v-if="isMobile" />

    <!-- DESKTOP LAYOUT -->
    <div v-else class="d-flex flex-grow-1">
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
  </div>
</template>
