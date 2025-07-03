<template>
  <div>
    <Breadcrumb />
    <h5 class="mb-3">Gestión de Roles</h5>

    <div class="card p-3 shadow-sm">
      <!-- Botón Crear -->
      <button class="btn btn-success mb-3" @click="abrirFormulario()">Crear Rol</button>

      <!-- Tabla -->
      <table class="table table-bordered table-striped">
        <thead class="table-light">
          <tr>
            <th>#</th>
            <th>Nombre del Rol</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(rol, index) in roles" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ rol.nombre }}</td>
            <td>{{ rol.descripcion }}</td>
            <td>
              <button class="btn btn-sm btn-primary me-1" @click="abrirFormulario(rol, index)">Editar</button>
              <button class="btn btn-sm btn-danger" @click="eliminarRol(index)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Crear/Editar Rol -->
    <div class="modal fade" tabindex="-1" :class="{ show: mostrarModal }" style="display: block;" v-if="mostrarModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ editando ? 'Editar Rol' : 'Crear Rol' }}</h5>
            <button type="button" class="btn-close" @click="cerrarFormulario"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Nombre del Rol</label>
              <input type="text" class="form-control" v-model="form.nombre" />
            </div>
            <div class="mb-3">
              <label class="form-label">Descripción</label>
              <textarea class="form-control" rows="3" v-model="form.descripcion"></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="cerrarFormulario">Cancelar</button>
            <button class="btn btn-primary" @click="guardarRol">{{ editando ? 'Guardar Cambios' : 'Crear' }}</button>
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

const roles = ref([
  { nombre: 'Administrador', descripcion: 'Acceso total al sistema' },
  { nombre: 'Supervisor', descripcion: 'Puede ver reportes y usuarios' },
  { nombre: 'Operador', descripcion: 'Acceso limitado a funciones básicas' }
])

const mostrarModal = ref(false)
const editando = ref(false)
const indiceEditando = ref(-1)

const form = ref({
  nombre: '',
  descripcion: ''
})

const abrirFormulario = (rol = null, index = -1) => {
  if (rol) {
    form.value = { ...rol }
    editando.value = true
    indiceEditando.value = index
  } else {
    form.value = { nombre: '', descripcion: '' }
    editando.value = false
    indiceEditando.value = -1
  }
  mostrarModal.value = true
}

const cerrarFormulario = () => {
  mostrarModal.value = false
}

const guardarRol = () => {
  if (editando.value && indiceEditando.value >= 0) {
    roles.value[indiceEditando.value] = { ...form.value }
  } else {
    roles.value.push({ ...form.value })
  }
  cerrarFormulario()
}

const eliminarRol = (index) => {
  if (confirm('¿Estás seguro de eliminar este rol?')) {
    roles.value.splice(index, 1)
  }
}
</script>

<style scoped>
.modal {
  background: rgba(0, 0, 0, 0.5);
}
</style>
