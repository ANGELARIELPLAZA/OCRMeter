<template>
  <Bar :data="chartData" :options="chartOptions" />
</template>

<script setup>
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

// Datos simulados por ID
const chartData = {
  labels: ['ID001', 'ID002', 'ID003', 'ID004', 'ID005'],
  datasets: [{
    label: 'Lecturas por ID',
    data: [15, 8, 12, 6, 18],
    backgroundColor: '#4682B4'
  }]
}

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { display: false }
  },
  scales: {
    y: {
      beginAtZero: true
    }
  }
}
</script>
