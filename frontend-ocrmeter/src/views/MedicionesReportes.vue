  <template>
    <div>
      <Breadcrumb />

      <h5 class="mb-3">Generar Reporte de Mediciones</h5>

      <div class="card p-3 shadow-sm">
        <p>Selecciona un rango de fechas y los filtros deseados para generar un reporte detallado de las mediciones.</p>

        <!-- Filtros -->
        <div class="row mb-3">
          <div class="col-md-4">
            <label class="form-label">Fecha Inicio</label>
            <input type="date" class="form-control" v-model="filtros.fechaInicio" />
          </div>
          <div class="col-md-4">
            <label class="form-label">Fecha Fin</label>
            <input type="date" class="form-control" v-model="filtros.fechaFin" />
          </div>
          <div class="col-md-4">
            <label class="form-label">Tipo</label>
            <select class="form-select" v-model="filtros.tipo">
              <option value="">Todos</option>
              <option>Agua</option>
            </select>
          </div>
        </div>

        <button class="btn btn-primary mb-3" @click="filtrarMediciones">Buscar</button>

        <div class="table-responsive">
          <table class="table table-bordered table-striped">
            <thead class="table-light">
              <tr>
                <th>#</th>
                <th>Contador</th>
                <th>Fecha</th>
                <th>Medición</th>
                <th>Estatus</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(med, index) in resultados" :key="index">
                <td>{{ index + 1 }}</td>
                <td>{{ med.contador }}</td>
                <td>{{ med.fecha }}</td>
                <td>{{ med.lectura }} {{ med.unidad }}</td>
                <td>
                  <button class="btn btn-sm btn-outline-info" @click="abrirModal(med)">Ver</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="mt-3">
          <button class="btn btn-outline-success me-2">Exportar Excel</button>
          <button class="btn btn-outline-danger">Exportar PDF</button>
        </div>
      </div>

      <!-- Modal Detalle -->
      <div class="modal fade" id="modalDetalle" tabindex="-1" aria-hidden="true" v-if="modalData">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Detalle de Medición</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <p><strong>Contador:</strong> {{ modalData.contador }}</p>
              <p><strong>Fecha:</strong> {{ modalData.fecha }}</p>
              <p><strong>Lectura:</strong> {{ modalData.lectura }} {{ modalData.unidad }}</p>
              <p><strong>Comentario:</strong> {{ modalData.comentario }}</p>
              <p><strong>Usuario:</strong> {{ modalData.usuario }}</p>
              <img :src="modalData.imagen" class="img-fluid rounded border" v-if="modalData.imagen" />

              <!-- Incidencia -->
              <!-- Incidencia -->
              <div class="mt-3">
                <label>Incidencia</label>
                <select class="form-select mb-2" v-model="modalData.incidencia">
                  <option value="">-- Selecciona una respuesta rápida --</option>
                  <option v-for="(inc, idx) in respuestasRapidas" :key="idx" :value="inc">{{ inc }}</option>
                </select>

                <!-- Solo muestra si hay incidencia seleccionada -->
                <div v-if="modalData.incidencia && modalData.incidencia.trim() !== ''">
                  <textarea class="form-control mb-3" v-model="modalData.incidencia"
                    placeholder="O escribe una descripción personalizada..." rows="3"></textarea>

                  <label>Asignar incidencia a:</label>
                  <select class="form-select" v-model="modalData.asignadoA">
                    <option disabled value="">-- Selecciona un usuario --</option>
                    <option v-for="user in usuariosDisponibles" :key="user.value" :value="user.value">
                      {{ user.label }}
                    </option>
                  </select>
                </div>
              </div>


            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>

              <button v-if="mostrarBotonIncidencia" class="btn btn-warning" @click="guardarRevision('incidencia')">
                Enviar Incidencia
              </button>

              <button v-else class="btn btn-success" @click="guardarRevision('validar')">
                Validar Medición
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Breadcrumb from '@/components/Breadcrumb.vue'
import { Modal } from 'bootstrap'

const filtros = ref({ fechaInicio: '', fechaFin: '', tipo: '' })
const resultados = ref([])
const modalData = ref({})
const respuestasRapidas = ['Lectura borrosa', 'Imagen incompleta', 'Lectura ilegible', 'Otro']

const mostrarBotonIncidencia = computed(() => {
  return modalData.value?.incidencia?.trim()?.length > 0
})
const usuariosDisponibles = ref([])
onMounted(async () => {
  try {
    const token = localStorage.getItem('token')
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = await res.json()
    usuariosDisponibles.value = data.map(user => ({
      label: user.name,
      value: user.name
    }))
  } catch (err) {
    console.error('❌ Error al cargar usuarios:', err.message)
  }
})

const filtrarMediciones = async () => {
  try {
    const params = new URLSearchParams()
    if (filtros.value.fechaInicio) params.append('fechaInicio', filtros.value.fechaInicio)
    if (filtros.value.fechaFin) params.append('fechaFin', filtros.value.fechaFin)
    if (filtros.value.tipo) params.append('tipo', filtros.value.tipo)

    const token = localStorage.getItem('token')
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/scan/reporte?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` }
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.message)

    resultados.value = data.map(item => ({
      ...item,
      contador: item.area || 'Sin área',
      estatus: item.estatus || 'Por validar'

    }))
  } catch (err) {
    console.error('❌ Error al obtener reporte:', err.message)
  }
}

const abrirModal = (registro) => {
  modalData.value = {
    ...registro,
    incidencia: '',
      asignadoA: '',

    validado: registro.estatus === 'Correcta'
  }
  const modalEl = document.getElementById('modalDetalle')
  const modalInstance = new Modal(modalEl)
  modalInstance.show()
}

const guardarRevision = async (accion) => {
  try {
    const token = localStorage.getItem('token')
    const user = JSON.parse(localStorage.getItem('usuario')) || {}

    if (accion === 'validar') {
      // ✅ Solo actualiza el Scan
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/scan/update/${modalData.value._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ estatus: 'Validado' })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message)

      // Actualiza tabla
      const index = resultados.value.findIndex(r => r._id === modalData.value._id)
      resultados.value[index].estatus = 'Validado'

    } else if (accion === 'incidencia') {
      // ✅ 1. Crear la incidencia
      const res1 = await fetch(`${import.meta.env.VITE_API_URL}/api/incidencias`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          medicionId: modalData.value._id,
          comentario: modalData.value.incidencia,
          usuario: user.name || 'Desconocido',
          asignadoA: modalData.value.asignadoA || 'Sin asignar'  // ✅ Agregado aquí
        })
      })


      const data1 = await res1.json()
      if (!res1.ok) throw new Error(data1.message)

      // ✅ 2. Actualizar estatus del Scan a "Incidencia reportada"
      const res2 = await fetch(`${import.meta.env.VITE_API_URL}/api/scan/update/${modalData.value._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ estatus: 'Incidencia reportada' })
      })

      const data2 = await res2.json()
      if (!res2.ok) throw new Error(data2.message)

      // Actualiza la fila en resultados
      const index = resultados.value.findIndex(r => r._id === modalData.value._id)
      resultados.value[index].estatus = 'Incidencia reportada'
    }

    // ✅ Cierra modal
    Modal.getInstance(document.getElementById('modalDetalle')).hide()

  } catch (err) {
    console.error('❌ Error al guardar revisión:', err.message)
    alert('❌ Error al guardar revisión')
  }
}

</script>

<style scoped>
.modal-body img {
  max-height: 300px;
  object-fit: contain;
}
</style>
