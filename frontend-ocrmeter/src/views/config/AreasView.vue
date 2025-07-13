<template>
  <div>
    <Breadcrumb />
    <h5 class="mb-3">Gestión de Áreas</h5>

    <div class="card p-3 shadow-sm">
      <button class="btn btn-success mb-3" @click="abrirFormulario()">Crear Área</button>
      <!-- Toast Bootstrap -->
      <div class="toast-container position-fixed bottom-0 end-0 p-3" style="z-index: 1055">
        <div class="toast align-items-center text-white border-0" :class="`bg-${toastTipo}`" role="alert"
          aria-live="assertive" aria-atomic="true" ref="toastRef">
          <div class="d-flex">
            <div class="toast-body">{{ toastMensaje }}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"
              aria-label="Cerrar"></button>
          </div>
        </div>
      </div>
    
      <!-- Tabla de áreas -->
      <div class="table-responsive">
        <table class="table table-bordered table-striped align-middle">
          <thead class="table-light">
            <tr>
              <th>#</th>
              <th>Nombre del Área</th>
              <th>Responsable</th>
              <th>Ubicación</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(area, index) in areas" :key="area.id">
              <td>{{ index + 1 }}</td>
              <td>{{ area.nombre }}</td>
              <td>{{ area.responsable }}</td>
              <td>{{ area.ubicacion }}</td>
              <td>
                <div class="d-flex flex-wrap gap-1">
                  <button class="btn btn-sm btn-primary" @click="abrirFormulario(area, index)">Editar</button>
                  <button class="btn btn-sm btn-danger" @click="eliminarArea(index)">Eliminar</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal -->
    <div class="modal fade show d-block" tabindex="-1" v-if="mostrarModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ editando ? 'Editar Área' : 'Crear Área' }}</h5>
            <button type="button" class="btn-close" @click="cerrarFormulario"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Nombre del Área</label>
              <input type="text" class="form-control" v-model="form.nombre" />
            </div>
            <div class="mb-3">
              <label class="form-label">Responsable</label>
              <input type="text" class="form-control" v-model="form.responsable" />
            </div>
            <div class="mb-3">
              <label class="form-label">Ubicación</label>
              <input type="text" class="form-control" v-model="form.ubicacion" />
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="cerrarFormulario">Cancelar</button>
            <button class="btn btn-primary" @click="guardarArea">
              {{ editando ? 'Guardar Cambios' : 'Crear' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade show" v-if="mostrarModal"></div>
  </div>


</template>

<script setup>
import Breadcrumb from '@/components/Breadcrumb.vue'
import { ref, onMounted, nextTick } from 'vue'
import { Toast } from 'bootstrap'

const toastRef = ref(null)
const toastMensaje = ref('')
const toastTipo = ref('success')

function mostrarToast(mensaje, tipo = 'success') {
  toastMensaje.value = mensaje
  toastTipo.value = tipo
  nextTick(() => {
    const toast = new Toast(toastRef.value, {
      delay: 3000,
      autohide: true
    })
    toast.show()
  })
}


const API_URL = import.meta.env.VITE_API_URL
const areas = ref([])
const mostrarModal = ref(false)
const editando = ref(false)
const indiceEditando = ref(-1)

const form = ref({
  nombre: '',
  responsable: '',
  ubicacion: ''
})

const abrirFormulario = (area = null, index = -1) => {
  if (area) {
    form.value = { ...area }
    editando.value = true
    indiceEditando.value = index
  } else {
    form.value = { nombre: '', responsable: '', ubicacion: '' }
    editando.value = false
    indiceEditando.value = -1
  }
  mostrarModal.value = true
}

const cerrarFormulario = () => {
  mostrarModal.value = false
}

const guardarArea = async () => {
  const payload = { ...form.value }

  try {
    const token = localStorage.getItem('token')
    const endpoint = editando.value
      ? `${API_URL}/api/areas/${areas.value[indiceEditando.value].id}`
      : `${API_URL}/api/areas`
    const method = editando.value ? 'PUT' : 'POST'

    const res = await fetch(endpoint, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.message)

    if (editando.value) {
      areas.value[indiceEditando.value] = { ...data, id: data._id }
    } else {
      areas.value.push({ ...data, id: data._id })
    }

    cerrarFormulario()
    mostrarToast(editando.value ? 'Área actualizada' : 'Área creada', 'success')


  } catch (err) {
    console.error('Error al guardar área:', err.message)
    mostrarToast('Error al guardar área', 'danger')
  }
}

const eliminarArea = async (index) => {
  if (!confirm('¿Deseas eliminar esta área?')) return

  try {
    const token = localStorage.getItem('token')
    const id = areas.value[index].id

    const res = await fetch(`${API_URL}/api/areas/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })

    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.message || 'Error al eliminar área')
    }

    areas.value.splice(index, 1)
    mostrarToast('Área eliminada correctamente', 'success')

  } catch (error) {
    console.error('Error al eliminar área:', error.message)
    mostrarToast('Error al Eliminar el  área', 'danger')
  }
}

onMounted(async () => {
  try {
    const token = localStorage.getItem('token')

    const res = await fetch(`${API_URL}/api/areas`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Error al obtener áreas')

    areas.value = data.map(area => ({
      id: area._id,
      nombre: area.nombre,
      responsable: area.responsable,
      ubicacion: area.ubicacion
    }))
  } catch (error) {
    console.error('Error al cargar áreas:', error.message)
  }
})
</script>

<style scoped>
.modal {
  background: rgba(0, 0, 0, 0.5);
}
</style>
