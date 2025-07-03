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
            <th>Nombre del Medidor</th>
            <th>Tipo</th>
            <th>Ubicación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(medidor, index) in medidores" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ medidor.nombre }}</td>
            <td>{{ medidor.tipo }}</td>
            <td>{{ medidor.ubicacion }}</td>
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
              <label class="form-label">Nombre</label>
              <input type="text" class="form-control" v-model="form.nombre" />
            </div>
            <div class="mb-3">
              <label class="form-label">Tipo</label>
              <input type="text" class="form-control" v-model="form.tipo" />
            </div>
            <div class="mb-3">
              <label class="form-label">Ubicación</label>
              <input type="text" class="form-control" v-model="form.ubicacion" />
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="cerrarFormulario">Cancelar</button>
            <button class="btn btn-primary" @click="guardarMedidor">{{ editando ? 'Guardar Cambios' : 'Crear' }}</button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade show" v-if="mostrarModal"></div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Breadcrumb from '@/components/Breadcrumb.vue'

const medidores = ref([
  { nombre: 'Medidor 001', tipo: 'Eléctrico', ubicacion: 'Edificio A - Planta Baja' },
  { nombre: 'Medidor 002', tipo: 'Agua', ubicacion: 'Edificio B - Nivel 2' },
  { nombre: 'Medidor 003', tipo: 'Gas', ubicacion: 'Exterior - Tanque Central' }
])

const mostrarModal = ref(false)
const editando = ref(false)
const indiceEditando = ref(-1)

const form = ref({
  nombre: '',
  tipo: '',
  ubicacion: ''
})

const abrirFormulario = (medidor = null, index = -1) => {
  if (medidor) {
    form.value = { ...medidor }
    editando.value = true
    indiceEditando.value = index
  } else {
    form.value = { nombre: '', tipo: '', ubicacion: '' }
    editando.value = false
    indiceEditando.value = -1
  }
  mostrarModal.value = true
}

const cerrarFormulario = () => {
  mostrarModal.value = false
}

const guardarMedidor = () => {
  if (editando.value && indiceEditando.value >= 0) {
    medidores.value[indiceEditando.value] = { ...form.value }
  } else {
    medidores.value.push({ ...form.value })
  }
  cerrarFormulario()
}

const eliminarMedidor = (index) => {
  if (confirm('¿Estás seguro de eliminar este medidor?')) {
    medidores.value.splice(index, 1)
  }
}
</script>

<style scoped>
.modal {
  background: rgba(0, 0, 0, 0.5);
}
</style>
