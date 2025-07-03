<template>
  <div>
    <Breadcrumb />

    <h5 class="mb-3">Gestión de Áreas</h5>

    <div class="card p-3 shadow-sm">
      <button class="btn btn-success mb-3" @click="abrirFormulario()">Crear Área</button>

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
            <tr v-for="(area, index) in areas" :key="index">
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
    <div class="modal fade" tabindex="-1" :class="{ show: mostrarModal }" style="display: block;" v-if="mostrarModal">
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
            <button class="btn btn-primary" @click="guardarArea">{{ editando ? 'Guardar Cambios' : 'Crear' }}</button>
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

const areas = ref([
  { nombre: 'Planta 1', responsable: 'Ing. Pérez', ubicacion: 'Edificio A - Piso 1' },
  { nombre: 'Laboratorio', responsable: 'Dra. Ramírez', ubicacion: 'Edificio C - Nivel 2' },
  { nombre: 'Oficinas', responsable: 'Lic. González', ubicacion: 'Edificio B - Planta Baja' }
])

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

const guardarArea = () => {
  if (editando.value && indiceEditando.value >= 0) {
    areas.value[indiceEditando.value] = { ...form.value }
  } else {
    areas.value.push({ ...form.value })
  }
  cerrarFormulario()
}

const eliminarArea = (index) => {
  if (confirm('¿Deseas eliminar esta área?')) {
    areas.value.splice(index, 1)
  }
}
</script>

<style scoped>
.modal {
  background: rgba(0, 0, 0, 0.5);
}
</style>
