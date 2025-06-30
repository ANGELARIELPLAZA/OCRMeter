<template>
    <div>
        <Breadcrumb />

        <h5 class="mb-3">Gestión de Usuarios</h5>

        <div class="card p-3 shadow-sm">
            <p>Aquí puedes ver, crear, editar o eliminar usuarios del sistema.</p>

            <!-- Tabla de ejemplo -->
            <!-- Tabla responsive -->
<div class="table-responsive mt-3">
  <table class="table table-bordered table-striped">
    <thead class="table-light">
      <tr>
        <th>#</th>
        <th>Nombre</th>
        <th>Correo</th>
        <th>Rol</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(user, index) in usuarios" :key="index">
        <td>{{ index + 1 }}</td>
        <td>{{ user.nombre }}</td>
        <td>{{ user.email }}</td>
        <td>{{ user.rol }}</td>
        <td>
          <button class="btn btn-sm btn-primary me-1">Editar</button>
          <button class="btn btn-sm btn-danger">Eliminar</button>
        </td>
      </tr>
    </tbody>
  </table>
</div>

        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import Breadcrumb from '@/components/Breadcrumb.vue'

const usuarios = ref([
    { nombre: 'Juan Pérez', email: 'juan@example.com', rol: 'Admin' },
    { nombre: 'Ana López', email: 'ana@example.com', rol: 'Usuario' },
    { nombre: 'Carlos Ruiz', email: 'carlos@example.com', rol: 'Supervisor' }
])
</script>
