<template>
  <Line :data="chartData" :options="chartOptions" />
</template>

<script setup>
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale)

const props = defineProps({
  selectedId: String
})

// Datos simulados por ID (puedes hacer esto dinámico desde localStorage o API)
const dataPorId = {
  ID001: [12, 15, 13, 16, 14],
  ID002: [8, 9, 10, 7, 6],
  ID003: [11, 13, 15, 14, 13],
  ID004: [5, 7, 6, 8, 6],
  ID005: [18, 17, 19, 20, 22]
}

const chartData = computed(() => {
  return {
    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie'],
    datasets: [{
      label: `Evolución de lectura (${props.selectedId})`,
      data: dataPorId[props.selectedId] || [],
      fill: false,
      borderColor: '#4682B4',
      tension: 0.4
    }]
  }
})

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { display: true }
  },
  scales: {
    y: {
      beginAtZero: true
    }
  }
}
</script>
