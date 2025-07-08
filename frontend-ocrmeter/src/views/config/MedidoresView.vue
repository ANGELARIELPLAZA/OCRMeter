<template>
  <div>
    <Breadcrumb />
    <h5 class="mb-3">Gestión de Medidores</h5>

    <div class="card p-3 shadow-sm">
      <button class="btn btn-success mb-3" @click="abrirFormulario()">Crear Medidor</button>

      <!-- Tabla -->
      <table class="table table-bordered table-striped mt-2">
        <thead class="table-light">
          <tr>
            <th>#</th>
            <th>ID</th>
            <th>Nombre</th>
            <th>Tipo</th>
            <th>Marca</th>
            <th>Modelo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(medidor, index) in medidores" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ medidor.id }}</td>
            <td>{{ medidor.nombre }}</td>
            <td>{{ medidor.tipo }}</td>
            <td>{{ medidor.marca }}</td>
            <td>{{ medidor.modelo }}</td>
            <td>
              <button class="btn btn-sm btn-primary me-1" @click="abrirFormulario(medidor, index)">Editar</button>
              <button class="btn btn-sm btn-danger" @click="eliminarMedidor(index)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div class="modal fade" tabindex="-1" :class="{ show: mostrarModal }" style="display: block;" v-if="mostrarModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ editando ? 'Editar Medidor' : 'Crear Medidor' }}</h5>
            <button type="button" class="btn-close" @click="cerrarFormulario"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">ID del Medidor</label>
              <div class="input-group">
                <input type="text" class="form-control" v-model="form.id" placeholder="MD-XXXXXX" />
                <button class="btn btn-outline-secondary" type="button" @click="generarId">Generar</button>
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label">Nombre</label>
              <input type="text" class="form-control" v-model="form.nombre" />
            </div>
            <div class="mb-3">
              <label class="form-label">Tipo</label>
              <input type="text" class="form-control" v-model="form.tipo" readonly />
            </div>
            <div class="mb-3">
              <label class="form-label">Marca</label>
              <input type="text" class="form-control" v-model="form.marca" />
            </div>
            <div class="mb-3">
              <label class="form-label">Modelo</label>
              <input type="text" class="form-control" v-model="form.modelo" />
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="cerrarFormulario">Cancelar</button>
            <button class="btn btn-primary" @click="guardarMedidor">
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
import { ref, onMounted } from 'vue'
import Breadcrumb from '@/components/Breadcrumb.vue'

const API_URL = import.meta.env.VITE_API_URL
const token = localStorage.getItem('token')

const medidores = ref([])
const mostrarModal = ref(false)
const editando = ref(false)
const indiceEditando = ref(-1)

const form = ref({
  id: '',
  nombre: '',
  tipo: 'Agua',
  marca: '',
  modelo: ''
})

const generarId = () => {
  const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0')
  form.value.id = `MD-${random}`
}

const abrirFormulario = (medidor = null, index = -1) => {
  if (medidor) {
    form.value = { ...medidor }
    editando.value = true
    indiceEditando.value = index
  } else {
    form.value = { id: '', nombre: '', tipo: 'Agua', marca: '', modelo: '' }
    editando.value = false
    indiceEditando.value = -1
  }
  mostrarModal.value = true
}

const cerrarFormulario = () => {
  mostrarModal.value = false
}

const guardarMedidor = async () => {
  if (!form.value.id || !form.value.nombre || !form.value.marca || !form.value.modelo) {
    alert('Completa todos los campos')
    return
  }

  try {
    const endpoint = editando.value
      ? `${API_URL}/api/medidores/${form.value.id}`
      : `${API_URL}/api/medidores`
    const method = editando.value ? 'PUT' : 'POST'

    const res = await fetch(endpoint, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(form.value)
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.message)

    if (editando.value) {
      medidores.value[indiceEditando.value] = data
    } else {
      medidores.value.unshift(data)
    }

    cerrarFormulario()
  } catch (err) {
    alert(err.message)
  }
}

const eliminarMedidor = async (index) => {
  if (!confirm('¿Seguro que deseas eliminar este medidor?')) return

  try {
    const id = medidores.value[index].id
    const res = await fetch(`${API_URL}/api/medidores/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })

    if (!res.ok) throw new Error('Error al eliminar')
    medidores.value.splice(index, 1)
  } catch (err) {
    alert(err.message)
  }
}

onMounted(async () => {
  try {
    const res = await fetch(`${API_URL}/api/medidores`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message)
    medidores.value = data
  } catch (err) {
    console.error(err.message)
  }
})
</script>

<style scoped>
.modal {
  background: rgba(0, 0, 0, 0.5);
}
</style>
