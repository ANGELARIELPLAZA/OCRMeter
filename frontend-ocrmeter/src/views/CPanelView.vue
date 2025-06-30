<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

function irARuta(ruta) {
  router.push(ruta)
}

const cards = ref([
  { title: 'Usuarios', value: 18, icon: 'bi bi-people', ruta: '/config/usuarios' },
  { title: 'Medidores', value: 12, icon: 'bi bi-speedometer2', ruta: '/config/medidores' },
  { title: 'Áreas', value: 6, icon: 'bi bi-diagram-3', ruta: '/config/areas' },
  { title: 'QR Generados', value: 27, icon: 'bi bi-qr-code', ruta: '/config/qr' }
])
</script>

<template>
  <div>
    <h5 class="mb-4">Bienvenido al Panel de Control</h5>

    <!-- Tarjetas resumen -->
    <div class="row">
      <div
        class="col-md-3 mb-3"
        v-for="card in cards"
        :key="card.title"
      >
        <div
          class="card shadow-sm text-center tarjeta-hover"
          @click="irARuta(card.ruta)"
          style="cursor: pointer;"
        >
          <div class="card-body">
            <i :class="card.icon" style="font-size: 2rem;"></i>
            <h6 class="mt-2">{{ card.title }}</h6>
            <p class="fw-bold fs-4">{{ card.value }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Gráfica o tabla resumen -->
    <div class="card shadow-sm mt-4 p-3">
      <h6>Resumen general</h6>
      <p>Este espacio puede mostrar un gráfico, reporte, tabla o mensajes importantes.</p>
    </div>
  </div>
</template>

<style scoped>

</style>
