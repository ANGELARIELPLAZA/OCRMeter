<template>
  <div>
    <Breadcrumb />

    <h5 class="mb-3">Gestión de Áreas</h5>

    <div class="card p-3 shadow-sm">
      <p>Administra las áreas operativas o administrativas asociadas a los medidores y usuarios.</p>

      <!-- Tabla de áreas responsiva -->
      <div class="table-responsive mt-3">
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
                  <button class="btn btn-sm btn-primary">Editar</button>
                  <button class="btn btn-sm btn-danger">Eliminar</button>
                </div>
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

const areas = ref([
  { nombre: 'Planta 1', responsable: 'Ing. Pérez', ubicacion: 'Edificio A - Piso 1' },
  { nombre: 'Laboratorio', responsable: 'Dra. Ramírez', ubicacion: 'Edificio C - Nivel 2' },
  { nombre: 'Oficinas', responsable: 'Lic. González', ubicacion: 'Edificio B - Planta Baja' }
])
</script>
