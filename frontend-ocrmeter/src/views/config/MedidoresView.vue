<template>
    <div>
        <Breadcrumb />

        <h5 class="mb-3">Gestión de Medidores</h5>

        <div class="card p-3 shadow-sm">
            <p>Aquí puedes registrar, editar o eliminar medidores instalados en la planta o edificio.</p>

            <!-- Tabla de medidores -->
            <table class="table table-bordered table-striped mt-3">
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

const medidores = ref([
    { nombre: 'Medidor 001', tipo: 'Eléctrico', ubicacion: 'Edificio A - Planta Baja' },
    { nombre: 'Medidor 002', tipo: 'Agua', ubicacion: 'Edificio B - Nivel 2' },
    { nombre: 'Medidor 003', tipo: 'Gas', ubicacion: 'Exterior - Tanque Central' }
])
</script>
