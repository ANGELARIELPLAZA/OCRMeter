<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const isCollapsed = ref(false)
const showCatalogos = ref(true)
const showInfo = ref(true)

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value

  // Al colapsar, también ocultamos las secciones
  if (isCollapsed.value) {
    showCatalogos.value = false
    showInfo.value = false
  }
}
const router = useRouter()

const logout = () => {
  localStorage.removeItem('token')
  router.push('/login')
  window.location.href = '/login' // ✅ redirige al login y recarga

}

</script>

<template>
  <aside :class="['sidebar border-end p-3 d-flex flex-column', isCollapsed ? 'collapsed' : '']">
    <button class="btn btn-sm btn-outline-secondary mb-3 align-self-end" @click="toggleCollapse">
      <i :class="isCollapsed ? 'bi bi-chevron-double-right' : 'bi bi-chevron-double-left'"></i>
    </button>

    <h5 v-if="!isCollapsed" class="fw-bold mb-3">Menú</h5>

    <ul class="nav flex-column">
      <!-- General -->
      <li>
        <router-link to="/dashboard" class="nav-link">
          <i class="bi bi-speedometer2 me-2"></i>
          <span v-if="!isCollapsed">Dashboard</span>
        </router-link>
      </li>
      <li>
        <router-link to="/medicion" class="nav-link">
          <i class="bi bi-building-add me-2"></i>
          <span v-if="!isCollapsed">Registro de medicion</span>
        </router-link>
      </li>
      <!-- Catálogos -->
      <li class="nav-section-title mt-3 d-flex justify-content-between align-items-center"
        @click="showCatalogos = !showCatalogos" style="cursor: pointer;">
        <span>
          <i class="bi bi-folder me-2"></i>
          <span v-if="!isCollapsed">Catálogos</span>
        </span>
        <i v-if="!isCollapsed" :class="['bi', showCatalogos ? 'bi-chevron-up' : 'bi-chevron-down']"></i>
      </li>
      <ul v-show="showCatalogos" class="nav flex-column ms-3">
        <li><router-link to="/config/usuarios" class="nav-link"><i class="bi bi-person me-2"></i><span
              v-if="!isCollapsed">Usuarios</span></router-link></li>
        <li><router-link to="/config/roles" class="nav-link"><i class="bi bi-people me-2"></i><span
              v-if="!isCollapsed">Roles</span></router-link></li>
        <li><router-link to="/config/medidores" class="nav-link"><i class="bi bi-lightning me-2"></i><span
              v-if="!isCollapsed">Medidores</span></router-link></li>
        <li><router-link to="/config/areas" class="nav-link"><i class="bi bi-grid-3x3-gap me-2"></i><span
              v-if="!isCollapsed">Áreas</span></router-link></li>
        <li><router-link to="/config/qr" class="nav-link"><i class="bi bi-qr-code me-2"></i><span
              v-if="!isCollapsed">QR</span></router-link></li>
      </ul>

      <!-- Información -->
      <li class="nav-section-title mt-3 d-flex justify-content-between align-items-center" @click="showInfo = !showInfo"
        style="cursor: pointer;">
        <span>
          <i class="bi bi-info-circle me-2"></i>
          <span v-if="!isCollapsed">Información</span>
        </span>
        <i v-if="!isCollapsed" :class="['bi', showInfo ? 'bi-chevron-up' : 'bi-chevron-down']"></i>
      </li>
      <ul v-show="showInfo" class="nav flex-column ms-3">
        <li><router-link to="/info/api" class="nav-link"><i class="bi bi-code-slash me-2"></i><span
              v-if="!isCollapsed">API</span></router-link></li>
        <li><router-link to="/info/reportes" class="nav-link"><i class="bi bi-file-earmark-bar-graph me-2"></i><span
              v-if="!isCollapsed">Reporte</span></router-link></li>
      </ul>
      <hr />
      <li>
        <button class="btn btn-outline-danger w-100 d-flex align-items-center" @click="logout">
          <i class="bi bi-box-arrow-right me-2"></i> Cerrar sesión
        </button>
      </li>

    </ul>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 240px;
  transition: width 0.3s ease;
  background-color: #f8f9fa;
  min-height: 100vh;
}

.sidebar.collapsed {
  width: 60px;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}

.nav-link {
  padding: 0.4rem 0.5rem;
  color: #007bff;
  display: flex;
  align-items: center;
  border-radius: 4px;
}

.nav-link i {
  width: 20px;
}

.nav-link span {
  white-space: nowrap;
}

.sidebar.collapsed .nav-link span {
  display: none;
}

.nav-link:hover {
  background-color: #e2e6ea;
}

.nav-section-title {
  font-size: 0.85rem;
  font-weight: bold;
  color: #495057;
  padding: 0.4rem 0.5rem;
  border-radius: 4px;
}
</style>
