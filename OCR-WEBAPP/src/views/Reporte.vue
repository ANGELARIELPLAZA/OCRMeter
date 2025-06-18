<template>
    <div class="container mt-4">
        <h3>Reporte de Mediciones</h3>

        <!-- Filtros -->
        <div class="card mb-3 shadow-sm">
            <div class="card-header">Filtros</div>
            <div class="card-body row g-3">
                <div class="col-md-4">
                    <label class="form-label">Filtrar por ID</label>
                    <select v-model="filtroId" class="form-select">
                        <option value="">Todos</option>
                        <option v-for="id in idUnicos" :key="id" :value="id">{{ id }}</option>
                    </select>
                </div>
                <div class="col-md-4">
                    <label class="form-label">Desde</label>
                    <input v-model="fechaInicio" type="date" class="form-control" />
                </div>
                <div class="col-md-4">
                    <label class="form-label">Hasta</label>
                    <input v-model="fechaFin" type="date" class="form-control" />
                </div>
            </div>
        </div>

        <!-- Tabla -->
        <div class="table-responsive">
            <table class="table table-bordered table-striped table-sm">
                <thead class="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Usuario</th>
                        <th>Fecha</th>
                        <th>Lectura</th>
                        <th>Comentario</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(r, i) in registrosFiltrados" :key="i">
                        <td>{{ r.id }}</td>
                        <td>{{ r.usuario }}</td>
                        <td>{{ r.fecha }}</td>
                        <td>{{ r.lectura }}</td>
                        <td>{{ r.comentario }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Botones de descarga -->
        <!-- Botones de descarga -->
        <div class="mt-3 d-flex flex-wrap gap-2 justify-content-center">
            <button @click="exportarCSV" class="btn btn-outline-primary">Descargar CSV</button>
            <button @click="exportarJSON" class="btn btn-outline-success">Descargar JSON</button>
            <button @click="exportarPDF" class="btn btn-outline-danger">Descargar PDF</button>
            <button @click="exportarExcel" class="btn btn-outline-info">Descargar Excel</button>
        </div>

    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import * as XLSX from 'xlsx'

const exportarExcel = () => {
  const worksheet = XLSX.utils.json_to_sheet(registrosFiltrados.value)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Reporte')

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' })

  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'reporte.xlsx'
  a.click()
}

// Simulación de datos
const registros = ref([
    { id: 'ID001', usuario: 'Angel', fecha: '2025-06-09', lectura: 12.5, comentario: 'Todo bien' },
    { id: 'ID002', usuario: 'Angel', fecha: '2025-06-08', lectura: 10.2, comentario: 'Revisión' },
    { id: 'ID001', usuario: 'Angel', fecha: '2025-06-07', lectura: 13.4, comentario: 'Correcto' },
    { id: 'ID003', usuario: 'Angel', fecha: '2025-06-07', lectura: 11.8, comentario: 'Estable' }
])

const filtroId = ref('')
const fechaInicio = ref('')
const fechaFin = ref('')

const idUnicos = computed(() => [...new Set(registros.value.map(r => r.id))])

const registrosFiltrados = computed(() => {
    return registros.value.filter(r => {
        const fechaValida =
            (!fechaInicio.value || r.fecha >= fechaInicio.value) &&
            (!fechaFin.value || r.fecha <= fechaFin.value)
        const idValido = !filtroId.value || r.id === filtroId.value
        return fechaValida && idValido
    })
})

const exportarCSV = () => {
    const rows = registrosFiltrados.value.map(r => [r.id, r.usuario, r.fecha, r.lectura, r.comentario])
    const csv = ['ID,Usuario,Fecha,Lectura,Comentario', ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'reporte.csv'
    a.click()
}

const exportarJSON = () => {
    const blob = new Blob([JSON.stringify(registrosFiltrados.value, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'reporte.json'
    a.click()
}

const exportarPDF = () => {
    const doc = new jsPDF()
    doc.text('Reporte de Mediciones', 14, 16)
    doc.autoTable({
        head: [['ID', 'Usuario', 'Fecha', 'Lectura', 'Comentario']],
        body: registrosFiltrados.value.map(r => [r.id, r.usuario, r.fecha, r.lectura, r.comentario]),
        startY: 20
    })
    doc.save('reporte.pdf')
}
</script>
