<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import ApexChart from 'vue3-apexcharts'

const API_URL = import.meta.env.VITE_API_URL
const router = useRouter()

function irARuta(ruta) {
  router.push(ruta)
}
const incidencias = ref([
  {
    fecha: '2025-07-12',
    detectadoPor: 'Juan Pérez',
    medidor: 'Medidor A1',
    descripcion: 'Lectura anormal detectada fuera de rango durante la inspección de rutina.'
  },
  {
    fecha: '2025-07-10',
    detectadoPor: 'Ana Torres',
    medidor: 'Medidor B3',
    descripcion: 'Falla de comunicación intermitente detectada con el servidor MQTT.'
  }
]);

const expandedRow = ref(null);

function toggleExpand(index) {
  expandedRow.value = expandedRow.value === index ? null : index;
}

const cards = ref([
  { title: 'Usuarios', value: 0, icon: 'bi bi-people', ruta: '/config/usuarios' },
  { title: 'Áreas', value: 0, icon: 'bi bi-diagram-3', ruta: '/config/areas' },
  { title: 'QR Generados/medidores', value: 0, icon: 'bi bi-qr-code', ruta: '/config/qr' }
])

// 🔄 Fetch cantidad de usuarios
onMounted(async () => {
  const token = localStorage.getItem('token')

  try {
    // 🔹 Contar usuarios
    const userRes = await fetch(`${API_URL}/api/users/count`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!userRes.ok) throw new Error(await userRes.text());
    const userData = await userRes.json();
    const userCard = cards.value.find(c => c.title === 'Usuarios');
    if (userCard) userCard.value = userData.total;

    // 🔹 Contar QRs
    const qrRes = await fetch(`${API_URL}/api/qrs/count`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!qrRes.ok) throw new Error(await qrRes.text());
    const qrData = await qrRes.json();
    const qrCard = cards.value.find(c => c.title.includes('QR'));
    if (qrCard) qrCard.value = qrData.total;

  } catch (err) {
    console.error('🔥 Error al obtener datos del dashboard:', err.message);
  }
  // 🔹 Contar Áreas
  const areaRes = await fetch(`${API_URL}/api/areas/count`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!areaRes.ok) throw new Error(await areaRes.text());
  const areaData = await areaRes.json();
  const areaCard = cards.value.find(c => c.title === 'Áreas');
  if (areaCard) areaCard.value = areaData.total;
});

// 📊 Gráfico de barras dinámico
const barOptions = computed(() => ({
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
}))

const barSeries = computed(() => [{
  name: 'Cantidad',
  data: cards.value.map(c => c.value)
}])

// 📈 Otros datos y gráficos
const radialOptions = {
  chart: { type: 'radialBar' },
  labels: ['Avance General']
}
const radialSeries = [70]



</script>


<template>
  <div>
    <h5 class="mb-4">Bienvenido al Panel de Control</h5>

    <!-- Tarjetas resumen -->
    <div class="row">
      <div class="col-md-4 mb-4" v-for="card in cards" :key="card.title">
        <div class="card shadow-sm text-center tarjeta-hover" @click="irARuta(card.ruta)" style="cursor: pointer;">
          <div class="card-body">
            <i :class="card.icon" style="font-size: 2rem;"></i>
            <h6 class="mt-2">{{ card.title }}</h6>
            <p class="fw-bold fs-4">{{ card.value }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabla de incidencias -->
    <div class="row">
      <div class="col-md-12 mb-3">
        <div class="card shadow-sm p-3">
          <h6 class="mb-3">Resumen de Incidencias</h6>
          <table class="table table-hover table-bordered align-middle">
            <thead class="table-light">
              <tr>
                <th>Fecha de Detección</th>
                <th>Detectado por</th>
                <th>Medidor</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(incidencia, index) in incidencias" :key="index" @click="toggleExpand(index)"
                style="cursor: pointer;">
                <td>{{ incidencia.fecha }}</td>
                <td>{{ incidencia.detectadoPor }}</td>
                <td>{{ incidencia.medidor }}</td>
              </tr>
              <tr v-if="expandedRow === index" class="bg-light">
                <td colspan="3">
                  <strong>Detalles:</strong><br>
                  {{ incidencia.descripcion }}
                </td>
              </tr>
            </tbody>
          </table>
          <p v-if="incidencias.length === 0" class="text-center text-muted">No hay incidencias registradas.</p>
        </div>
      </div>
    </div>
    <!-- Gráficos: Resumen por Categoría y Avance -->
    <div class="row mt-4">
      <div class="col-md-8 mb-3">
        <div class="card shadow-sm p-3">
          <h6 class="mb-2">Resumen por Categoría</h6>
          <ApexChart type="bar" height="300" :options="barOptions" :series="barSeries" />
        </div>
      </div>
      <div class="col-md-4 mb-3">
        <div class="card shadow-sm p-3 text-center">
          <h6 class="mb-2">Avance General</h6>
          <ApexChart type="radialBar" height="300" :options="radialOptions" :series="radialSeries" />
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
