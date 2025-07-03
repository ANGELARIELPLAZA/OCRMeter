<template>
  <div>
    <Breadcrumb />

    <h5 class="mb-3">Generar Reporte de Mediciones</h5>

    <div class="card p-3 shadow-sm">
      <p>Selecciona un rango de fechas y los filtros deseados para generar un reporte detallado de las mediciones.</p>

      <!-- Filtros -->
      <div class="row mb-3">
        <div class="col-md-4 mb-2">
          <label class="form-label">Fecha Inicio</label>
          <input type="date" class="form-control" v-model="filtros.fechaInicio" />
        </div>
        <div class="col-md-4 mb-2">
          <label class="form-label">Fecha Fin</label>
          <input type="date" class="form-control" v-model="filtros.fechaFin" />
        </div>
        <div class="col-md-4 mb-2">
          <label class="form-label">Tipo</label>
          <select class="form-select" v-model="filtros.tipo">
            <option value="">Todos</option>
            <option>Eléctrico</option>
            <option>Agua</option>
            <option>Gas</option>
          </select>
        </div>
      </div>

      <!-- Botón de búsqueda -->
      <button class="btn btn-primary mb-3" @click="filtrarMediciones">Buscar</button>

      <!-- Tabla de resultados -->
      <div class="table-responsive">
        <table class="table table-bordered table-striped">
          <thead class="table-light">
            <tr>
              <th>#</th>
              <th>Fecha</th>
              <th>Medidor</th>
              <th>Tipo</th>
              <th>Valor</th>
              <th>Unidad</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(med, index) in resultados" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ med.fecha }}</td>
              <td>{{ med.nombre }}</td>
              <td>{{ med.tipo }}</td>
              <td>{{ med.valor }}</td>
              <td>{{ med.unidad }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Exportar -->
      <div class="mt-3">
        <button class="btn btn-outline-success me-2">Exportar Excel</button>
        <button class="btn btn-outline-danger">Exportar PDF</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Breadcrumb from '@/components/Breadcrumb.vue'

// Datos simulados de mediciones
const mediciones = ref([
  { fecha: '2025-06-01', nombre: 'Medidor 001', tipo: 'Eléctrico', valor: 123, unidad: 'kWh' },
  { fecha: '2025-06-03', nombre: 'Medidor 002', tipo: 'Agua', valor: 56, unidad: 'L' },
  { fecha: '2025-06-05', nombre: 'Medidor 003', tipo: 'Gas', valor: 89, unidad: 'm³' },
  { fecha: '2025-06-10', nombre: 'Medidor 001', tipo: 'Eléctrico', valor: 150, unidad: 'kWh' },
])

const filtros = ref({
  fechaInicio: '',
  fechaFin: '',
  tipo: ''
})

const resultados = ref([])

const filtrarMediciones = () => {
  resultados.value = mediciones.value.filter(med => {
    const fechaOk =
      (!filtros.value.fechaInicio || med.fecha >= filtros.value.fechaInicio) &&
      (!filtros.value.fechaFin || med.fecha <= filtros.value.fechaFin)

    const tipoOk = !filtros.value.tipo || med.tipo === filtros.value.tipo

    return fechaOk && tipoOk
  })
}
</script>
