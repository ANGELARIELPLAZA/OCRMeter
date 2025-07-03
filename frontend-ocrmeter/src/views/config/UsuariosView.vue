<template>
  <div>
    <h5 class="mb-3">Gestión de Usuarios</h5>

    <div class="card p-3 shadow-sm">
      <button class="btn btn-success mb-3" @click="abrirFormulario()">Crear Usuario</button>

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
                    <option>usuario</option>
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
</template>

<script setup>
import { ref, onMounted } from 'vue'

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
      ? `http://localhost:4000/api/users/${usuarios.value[indiceEditando.value].id}`
      : 'http://localhost:4000/api/auth/register'

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
    if (!res.ok) throw new Error(data.message)

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
  } catch (err) {
    console.error('Error al guardar:', err.message)
    alert('Error al guardar usuario')
  }
}

const eliminarUsuario = async (index) => {
  const confirmDelete = confirm('¿Estás seguro de eliminar este usuario?')
  if (!confirmDelete) return

  try {
    const token = localStorage.getItem('token')
    const id = usuarios.value[index].id

    const res = await fetch(`http://localhost:4000/api/users/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })

    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.message || 'Error al eliminar usuario')
    }

    usuarios.value.splice(index, 1)
  } catch (error) {
    console.error('Error al eliminar usuario:', error.message)
    alert('No se pudo eliminar el usuario')
  }
}

onMounted(async () => {
  try {
    const token = localStorage.getItem('token')

    const res = await fetch('http://localhost:4000/api/users', {
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
