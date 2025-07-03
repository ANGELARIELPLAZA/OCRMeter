<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ApexChart from 'vue3-apexcharts'

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

const barOptions = {
  chart: {
    type: 'bar',
    toolbar: { show: false }
  },
  xaxis: {
    categories: cards.value.map(c => c.title)
  },
  plotOptions: {
    bar: {
      borderRadius: 5,
      columnWidth: '50%'
    }
  }
}

const barSeries = [{
  name: 'Cantidad',
  data: cards.value.map(c => c.value)
}]

const radialOptions = {
  chart: {
    type: 'radialBar'
  },
  labels: ['Avance General']
}

const radialSeries = [70] // ejemplo de 70% de avance


const tiempo = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
const temperatura = [22, 24, 21, 25, 23, 26, 22]
const consumo = [12, 15, 13, 16, 14, 17, 13]
const agua = [120, 135, 110, 150, 140, 160, 130]


const lineOptions = {
  chart: {
    type: 'line',
    toolbar: { show: false }
  },
  stroke: {
    curve: 'smooth'
  },
  xaxis: {
    categories: tiempo
  },
  markers: {
    size: 4
  }
}

const lineSeries = [{
  name: 'Temperatura °C',
  data: temperatura
}]

const areaOptions = {
  chart: {
    type: 'area',
    toolbar: { show: false }
  },
  dataLabels: {
    enabled: false
  },
  xaxis: {
    categories: tiempo
  },
  stroke: {
    curve: 'smooth'
  }
}

const areaSeries = [{
  name: 'kWh consumidos',
  data: consumo
}]

const aguaOptions = {
  chart: {
    type: 'bar',
    toolbar: { show: false }
  },
  plotOptions: {
    bar: {
      columnWidth: '40%',
      distributed: true
    }
  },
  xaxis: {
    categories: tiempo
  },
  dataLabels: {
    enabled: false
  }
}

const aguaSeries = [{
  name: 'Litros de Agua',
  data: agua
}]


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

    <div class="row mt-4">
      <div class="col-md-8 mb-3">
        <div class="card shadow-sm p-3">
          <h6 class="mb-2">Resumen por Categoría</h6>
          <ApexChart
            type="bar"
            height="300"
            :options="barOptions"
            :series="barSeries"
          />
        </div>
      </div>
      <div class="col-md-4 mb-3">
        <div class="card shadow-sm p-3 text-center">
          <h6 class="mb-2">Avance General</h6>
          <ApexChart
            type="radialBar"
            height="300"
            :options="radialOptions"
            :series="radialSeries"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tarjeta-hover:hover {
  background-color: #f8f9fa;
  transform: scale(1.02);
  transition: all 0.2s ease-in-out;
}
</style>
