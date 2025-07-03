<script setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import Breadcrumb from '@/components/Breadcrumb.vue'

const router = useRouter()

function irARuta(ruta) {
    router.push(ruta)
}

const configCards = ref([
    { title: 'Usuarios', icon: 'bi bi-people', ruta: '/config/usuarios' },
    { title: 'Roles', icon: 'bi bi-person-badge', ruta: '/config/roles' },
    { title: 'Medidores', icon: 'bi bi-speedometer2', ruta: '/config/medidores' },
    { title: 'Áreas', icon: 'bi bi-diagram-3', ruta: '/config/areas' },
    { title: 'QR Generados', icon: 'bi bi-qr-code', ruta: '/config/qr' }
])
</script>

<template>
  <div>
    <Breadcrumb />
    <h5 class="mb-4">Catálogos del Sistema</h5>

    <div class="grid-catalogos">
      <div
        class="card shadow-sm text-center tarjeta-hover"
        v-for="card in configCards"
        :key="card.title"
        @click="irARuta(card.ruta)"
      >
        <div class="card-body d-flex flex-column justify-content-center align-items-center">
          <i :class="card.icon" style="font-size: 2rem;"></i>
          <h6 class="mt-2">{{ card.title }}</h6>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
.grid-catalogos {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.card {
  cursor: pointer;
}

.tarjeta-hover:hover {
  background-color: #f8f9fa;
  transition: background-color 0.3s ease;
}
</style>

