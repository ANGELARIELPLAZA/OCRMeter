<template>
  <div>
    <h5 class="mb-3">Gestión de Usuarios</h5>

    <div class="card p-3 shadow-sm">
      <button class="btn btn-success mb-3" @click="abrirFormulario()">Crear Usuario</button>
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

      <div class="table-responsive">
        <table class="table table-bordered table-striped">
          <thead class="table-light">
            <tr>
              <th>#</th>
              <th>Nombre</th>
              <th>Correo electrónico</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(user, index) in usuarios" :key="user.id">
              <td>{{ index + 1 }}</td>
              <td>{{ user.nombre }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.rol }}</td>
              <td>
                <button class="btn btn-sm btn-primary me-1" @click="abrirFormulario(user, index)">Editar</button>
                <button class="btn btn-sm btn-danger" @click="eliminarUsuario(index)">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
        <!-- Modal Crear/Editar -->
        <div class="modal fade show d-block" tabindex="-1" role="dialog" v-if="mostrarModal">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">{{ editando ? 'Editar Usuario' : 'Crear Usuario' }}</h5>
                <button type="button" class="btn-close" @click="cerrarFormulario"></button>
              </div>
              <div class="modal-body">
                <div class="mb-3">
                  <label class="form-label">Nombre</label>
                  <input type="text" class="form-control" v-model="form.nombre" />
                </div>
                <div class="mb-3">
                  <label class="form-label">Correo electrónico</label>
                  <input type="email" class="form-control" v-model="form.email" />
                </div>
                <div class="mb-3" v-if="!editando">
                  <label class="form-label">Contraseña</label>
                  <input type="password" class="form-control" v-model="form.password" />
                </div>
                <div class="mb-3">
                  <label class="form-label">Rol</label>
                  <select class="form-select" v-model="form.rol">
                    <option value="">Seleccione un rol</option>
                    <option>admin</option>
                    <option>operador</option>
                    <option>supervisor</option>
                  </select>
                </div>
              </div>
              <div class="modal-footer">
                <button class="btn btn-secondary" @click="cerrarFormulario">Cancelar</button>
                <button class="btn btn-primary" @click="guardarUsuario">
                  {{ editando ? 'Guardar Cambios' : 'Crear Usuario' }}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-backdrop fade show" v-if="mostrarModal"></div>

      </div>
    </div>
  </div>
  <!-- Modal Confirmación de Eliminación -->
<div class="modal fade show d-block" tabindex="-1" v-if="mostrarConfirmacion">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header bg-danger text-white">
        <h5 class="modal-title">¿Eliminar usuario?</h5>
        <button type="button" class="btn-close" @click="cerrarConfirmacion"></button>
      </div>
      <div class="modal-body">
        <p>¿Estás seguro de que deseas eliminar al usuario <strong>{{ usuarioSeleccionado?.nombre }}</strong>?</p>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" @click="cerrarConfirmacion">Cancelar</button>
        <button class="btn btn-danger" @click="confirmarEliminacion">Eliminar</button>
      </div>
    </div>
  </div>
</div>
<div class="modal-backdrop fade show" v-if="mostrarConfirmacion"></div>

</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { Toast } from 'bootstrap'
const toastRef = ref(null)
const toastMensaje = ref('')
const toastTipo = ref('success')
const mostrarConfirmacion = ref(false)
const usuarioSeleccionado = ref(null)
let indiceAEliminar = -1

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

const usuarios = ref([])

const form = ref({
  nombre: '',
  email: '',
  password: '',
  rol: ''
})

const mostrarModal = ref(false)
const editando = ref(false)
const indiceEditando = ref(-1)

const abrirFormulario = (usuario = null, index = -1) => {
  if (usuario) {
    form.value = { ...usuario }
    editando.value = true
    indiceEditando.value = index
  } else {
    form.value = { nombre: '', email: '', password: '', rol: '' }
    editando.value = false
    indiceEditando.value = -1
  }
  mostrarModal.value = true
}

const cerrarFormulario = () => {
  mostrarModal.value = false
}

const guardarUsuario = async () => {
  const payload = {
    name: form.value.nombre,
    email: form.value.email,
    password: form.value.password,
    role: form.value.rol.toLowerCase(),
    status: 'active'
  }

  try {
    const token = localStorage.getItem('token')
    const endpoint = editando.value
      ? `${API_URL}/api/users/${usuarios.value[indiceEditando.value].id}`
      : `${API_URL}/api/auth/register`

    const method = editando.value ? 'PUT' : 'POST'

    const res = await fetch(endpoint, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    })

    const data = await res.json()
  

    if (editando.value) {
      usuarios.value[indiceEditando.value] = {
        id: usuarios.value[indiceEditando.value].id,
        nombre: payload.name,
        email: payload.email,
        rol: payload.role,
        password: '******'
      }
    } else {
      usuarios.value.push({
        id: data._id,
        nombre: payload.name,
        email: payload.email,
        rol: payload.role,
        password: '******'
      })
    }

    cerrarFormulario()
    mostrarToast(editando.value ? 'Usuario actualizado' : 'Usuario creado', 'success')

  } catch (err) {
    console.error('Error al guardar:', err.message)
    mostrarToast('Error al guardar usuario', 'danger')
  }
}
const cerrarConfirmacion = () => {
  mostrarConfirmacion.value = false
  usuarioSeleccionado.value = null
  indiceAEliminar = -1
}

const confirmarEliminacion = async () => {
  if (indiceAEliminar === -1 || !usuarioSeleccionado.value) return

  try {
    const token = localStorage.getItem('token')
    const id = usuarioSeleccionado.value.id

    const res = await fetch(`${API_URL}/api/users/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })

    if (!res.ok) {
      const text = await res.text()
      throw new Error(text || 'Error al eliminar usuario')
    }

    usuarios.value.splice(indiceAEliminar, 1)
    mostrarToast('✅ Usuario eliminado correctamente', 'success')
  } catch (error) {
    console.error('Error al eliminar usuario:', error.message)
    mostrarToast('❌ No se pudo eliminar el usuario', 'danger')
  } finally {
    cerrarConfirmacion()
  }
}

const eliminarUsuario = (index) => {
  usuarioSeleccionado.value = usuarios.value[index]
  indiceAEliminar = index
  mostrarConfirmacion.value = true
}

onMounted(async () => {
  try {
    const token = localStorage.getItem('token')

    const res = await fetch(`${API_URL}/api/users`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Error al obtener usuarios')

    usuarios.value = data.map(user => ({
      id: user._id,
      nombre: user.name,
      email: user.email,
      rol: user.role,
      password: '******'
    }))
  } catch (error) {
    console.error('Error al cargar usuarios:', error.message)
  }
})
</script>

<style scoped>
.modal {
  background: rgba(0, 0, 0, 0.5);
}
</style>
