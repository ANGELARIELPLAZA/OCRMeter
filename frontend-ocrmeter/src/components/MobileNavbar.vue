<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const showMenu = ref(false)
const showCatalogos = ref(false)
const showInfo = ref(false)

const toggleMenu = () => showMenu.value = !showMenu.value
const router = useRouter()

const logout = () => {
  localStorage.removeItem('token')
  router.push('/login')
  window.location.href = '/login' // ✅ redirige al login y recarga

}

</script>

<template>
  <nav class=" navbar-light bg-light shadow-sm px-3">
    <div class="d-flex justify-content-between w-100 align-items-center">
      <button class="btn btn-outline-secondary" @click="toggleMenu">
        <i class="bi bi-list"></i>
      </button>
      <span class="fw-bold">Cabecera del sistema</span>
    </div>

    <div v-if="showMenu" class="mt-2 bg-white rounded shadow-sm p-3">
      <ul class="nav flex-column">

        <!-- Dashboard -->
        <li>
          <router-link to="/dashboard" class="nav-link d-flex align-items-center w-100">
            <i class="bi bi-speedometer2 me-2"></i> Dashboard
          </router-link>
        </li>
        <li>
          <router-link to="/medicion" class="nav-link d-flex align-items-center w-100">
            <i class="bi bi-building-add me-2"></i>
            <span v-if="!isCollapsed">Registro de medicion</span>
          </router-link>
        </li>
        <!-- Submenú Catálogos -->
        <li>
          <a href="#" class="nav-link d-flex align-items-center justify-content-between"
            @click.prevent="showCatalogos = !showCatalogos">
            <span><i class="bi bi-folder me-2"></i> Catálogos</span>
            <i class="bi" :class="showCatalogos ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
          </a>
          <ul v-show="showCatalogos" class="nav flex-column ms-3 mt-1">
            <li><router-link to="/config/usuarios" class="nav-link d-flex align-items-center"><i
                  class="bi bi-person me-2"></i>Usuarios</router-link></li>
            <li><router-link to="/config/roles" class="nav-link d-flex align-items-center"><i
                  class="bi bi-people me-2"></i>Roles</router-link></li>
            <li><router-link to="/config/medidores" class="nav-link d-flex align-items-center"><i
                  class="bi bi-lightning me-2"></i>Medidores</router-link></li>
            <li><router-link to="/config/areas" class="nav-link d-flex align-items-center"><i
                  class="bi bi-grid-3x3-gap me-2"></i>Áreas</router-link></li>
            <li><router-link to="/config/qr" class="nav-link d-flex align-items-center"><i
                  class="bi bi-qr-code me-2"></i>QR</router-link></li>
          </ul>
        </li>

        <!-- Submenú Información -->
        <li class="mt-2">
          <a href="#" class="nav-link d-flex align-items-center justify-content-between"
            @click.prevent="showInfo = !showInfo">
            <span><i class="bi bi-info-circle me-2"></i> Información</span>
            <i class="bi" :class="showInfo ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
          </a>
          <ul v-show="showInfo" class="nav flex-column ms-3 mt-1">
            <li><router-link to="/info/api" class="nav-link d-flex align-items-center"><i
                  class="bi bi-code-slash me-2"></i>API</router-link></li>
            <li><router-link to="/info/reportes" class="nav-link d-flex align-items-center"><i
                  class="bi bi-file-earmark-bar-graph me-2"></i>Reporte</router-link></li>
          </ul>
        </li>

        <hr />
        <li>
          <button class="btn btn-outline-danger w-100 d-flex align-items-center" @click="logout">
            <i class="bi bi-box-arrow-right me-2"></i> Cerrar sesión
          </button>
        </li>

      </ul>
    </div>

    <!-- Contenido debajo del menú -->
    <div class="p-3">
      <router-view />
    </div>
  </nav>
</template>

<style scoped>
.nav-link {
  color: #007bff;
  padding: 0.5rem 0;
  border-radius: 4px;
}

.nav-link:hover {
  background-color: #f0f0f0;
  text-decoration: none;
}
</style>
