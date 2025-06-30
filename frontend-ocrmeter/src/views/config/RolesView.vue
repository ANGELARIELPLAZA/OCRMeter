<template>
  <div>
            <Breadcrumb />

    <h5 class="mb-3">Gestión de Roles</h5>

    <div class="card p-3 shadow-sm">
      <p>Aquí puedes administrar los roles del sistema (crear, editar, eliminar).</p>

      <!-- Tabla de roles -->
      <table class="table table-bordered table-striped mt-3">
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
              <button class="btn btn-sm btn-primary me-1">Editar</button>
              <button class="btn btn-sm btn-danger">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
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
</script>
