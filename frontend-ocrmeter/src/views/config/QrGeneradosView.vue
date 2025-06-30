<template>
  <div>
            <Breadcrumb />

    <h5 class="mb-3">QR Generados</h5>

    <div class="card p-3 shadow-sm">
      <p>A continuación se listan los códigos QR generados en el sistema.</p>

      <table class="table table-bordered table-striped mt-3">
        <thead class="table-light">
          <tr>
            <th>#</th>
            <th>Entidad</th>
            <th>Tipo</th>
            <th>QR</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(qr, index) in qrCodes" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ qr.nombre }}</td>
            <td>{{ qr.tipo }}</td>
            <td>
              <img :src="qr.imagen" alt="QR" style="width: 70px;" />
            </td>
            <td>
              <a :href="qr.imagen" download="qr.png" class="btn btn-sm btn-outline-secondary">Descargar</a>
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

// Simulación de QR con data URL
function generarQrData(texto) {
  // Puedes reemplazar esto con una librería real como `qrcode`
  return `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(texto)}`
}

const qrCodes = ref([
  { nombre: 'Medidor 001', tipo: 'Medidor', imagen: generarQrData('medidor001') },
  { nombre: 'Área Planta 1', tipo: 'Área', imagen: generarQrData('area_planta1') },
  { nombre: 'Usuario Juan Pérez', tipo: 'Usuario', imagen: generarQrData('usuario_juan') }
])
</script>
