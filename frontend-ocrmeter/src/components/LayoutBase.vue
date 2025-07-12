<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import MobileNavbar from './MobileNavbar.vue'
import Sidebar from './Sidebar.vue'
import authService from '@/services/authService'

const isMobile = ref(false)
const isLoggedIn = authService.isLoggedIn // ref reactivo a `token`

const router = useRouter()

// ⏳ CONFIGURACIÓN DEL TIMEOUT
let timeout
const TIEMPO_INACTIVIDAD_MS = 30 * 60 * 1000 // 30 minutos

function cerrarSesionPorInactividad() {
  localStorage.removeItem('token')
  router.push('/login')
  alert('Sesión cerrada por inactividad.')
}

function reiniciarTemporizador() {
  clearTimeout(timeout)
  timeout = setTimeout(cerrarSesionPorInactividad, TIEMPO_INACTIVIDAD_MS)
}

function iniciarEscuchaInactividad() {
  window.addEventListener('mousemove', reiniciarTemporizador)
  window.addEventListener('keydown', reiniciarTemporizador)
  window.addEventListener('click', reiniciarTemporizador)
  reiniciarTemporizador()
}

function detenerEscuchaInactividad() {
  clearTimeout(timeout)
  window.removeEventListener('mousemove', reiniciarTemporizador)
  window.removeEventListener('keydown', reiniciarTemporizador)
  window.removeEventListener('click', reiniciarTemporizador)
}

onMounted(() => {
  const checkSize = () => {
    isMobile.value = window.innerWidth <= 576
  }
  checkSize()
  window.addEventListener('resize', checkSize)

  if (isLoggedIn) iniciarEscuchaInactividad()
})

onUnmounted(() => {
  detenerEscuchaInactividad()
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
