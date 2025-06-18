<template>
    <div class="container mt-4">
        <h3>Dashboard</h3>

        <!-- KPIs -->
        <div class="row g-3 mt-2">
            <div class="col-12 col-md-6 col-lg-3" v-for="kpi in kpis" :key="kpi.titulo">
                <div class="card shadow" :style="{ backgroundColor: kpi.color, color: '#fff' }">
                    <div class="card-body">
                        <h6 class="card-title">{{ kpi.titulo }}</h6>
                        <p class="card-text display-6 fw-bold">{{ kpi.valor }}</p>
                    </div>
                </div>
            </div>
        </div>


        <!-- Gráfico: Lecturas semanales -->
        <div class="card mt-4 shadow-sm">
            <div class="card-header">Lecturas semanales</div>
            <div class="card-body">
                <KpiChart />
            </div>
        </div>
        <!-- Gráfico de Lecturas por ID -->
        <div class="card mt-4 shadow-sm">
            <div class="card-header">Lecturas por ID</div>
            <div class="card-body">
                <LecturasPorIdChart />
            </div>
        </div>
        <!-- Filtro por ID -->
        <div class="card mt-4 shadow-sm">
            <div class="card-header">Filtrar por ID</div>
            <div class="card-body">
                <select v-model="selectedId" class="form-select w-auto">
                    <option disabled value="">Seleccione un ID</option>
                    <option v-for="id in idOptions" :key="id" :value="id">{{ id }}</option>
                </select>
            </div>
        </div>
        <!-- Gráfico de Evolución por ID -->
        <div class="card mt-4 shadow-sm" v-if="selectedId">
            <div class="card-header">Evolución de lecturas - {{ selectedId }}</div>
            <div class="card-body">
                <LecturaEvolucionChart :selectedId="selectedId" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import LecturasPorIdChart from '../components/LecturasPorIdChart.vue'
import LecturaEvolucionChart from '../components/LecturaEvolucionChart.vue'
import KpiChart from '../components/KpiChart.vue'
const selectedId = ref('')
const idOptions = ['ID001', 'ID002', 'ID003', 'ID004', 'ID005']

const kpis = ref([
    { titulo: 'Lecturas hoy', valor: 124, color: '#6c757d' },
    { titulo: 'Dispositivos activos', valor: 6, color: '#5c9ead' },
    { titulo: 'Promedio lectura', valor: '87.4%', color: '#7ba05b' },
    { titulo: 'Alertas', valor: 2, color: '#c97d60' }
])
</script>
