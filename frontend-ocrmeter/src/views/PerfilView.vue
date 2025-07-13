<script setup>
import { ref, onMounted } from 'vue'
import authService from '@/services/authService'

const usuario = ref(null)

onMounted(() => {
  usuario.value = authService.getUsuario()
})
</script>

<template>
  <div class="container mt-4">
    <h3 class="mb-4">
      <i class="bi bi-person-circle me-2"></i>Mi perfil
    </h3>

    <div class="card shadow-sm p-4">
      <div v-if="usuario">
        <p><strong>Nombre:</strong> {{ usuario.name }}</p>
        <p><strong>Email:</strong> {{ usuario.email }}</p>
        <p><strong>Rol:</strong> {{ usuario.role }}</p>
        <p><strong>Estado:</strong> {{ usuario.status }}</p>
        <p><strong>ID:</strong> {{ usuario.id }}</p>
      </div>
      <div v-else class="text-muted">
        No hay datos de usuario disponibles.
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 600px;
}
</style>
    