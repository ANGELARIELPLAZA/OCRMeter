<template>
  <div>
    <Breadcrumb />

    <h5 class="mb-3">QR Generados</h5>

    <div class="card p-3 shadow-sm">
      <p>A continuación se listan los códigos QR generados en el sistema.</p>

      <button class="btn btn-success mb-3" @click="abrirModal">Crear nuevo QR</button>

      <table class="table table-bordered table-striped">
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

    <!-- Modal para nuevo QR -->
    <div class="modal fade" tabindex="-1" :class="{ show: mostrarModal }" style="display: block;" v-if="mostrarModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Crear nuevo QR</h5>
            <button type="button" class="btn-close" @click="cerrarModal"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Nombre / Entidad</label>
              <input type="text" class="form-control" v-model="nuevoQR.nombre" />
            </div>
            <div class="mb-3">
              <label class="form-label">Tipo</label>
              <select class="form-select" v-model="nuevoQR.tipo">
                <option value="" disabled>Seleccionar tipo</option>
                <option>Medidor</option>
                <option>Área</option>
                <option>Usuario</option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="cerrarModal">Cancelar</button>
            <button class="btn btn-primary" @click="crearQR">Generar QR</button>
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

function generarQrData(texto) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(texto)}`
}

const qrCodes = ref([
  { nombre: 'Medidor 001', tipo: 'Medidor', imagen: generarQrData('medidor001') },
  { nombre: 'Área Planta 1', tipo: 'Área', imagen: generarQrData('area_planta1') },
  { nombre: 'Usuario Juan Pérez', tipo: 'Usuario', imagen: generarQrData('usuario_juan') }
])

const mostrarModal = ref(false)

const nuevoQR = ref({
  nombre: '',
  tipo: ''
})

const abrirModal = () => {
  nuevoQR.value = { nombre: '', tipo: '' }
  mostrarModal.value = true
}

const cerrarModal = () => {
  mostrarModal.value = false
}

const crearQR = () => {
  if (!nuevoQR.value.nombre || !nuevoQR.value.tipo) {
    alert('Completa todos los campos.')
    return
  }

  const nuevo = {
    nombre: nuevoQR.value.nombre,
    tipo: nuevoQR.value.tipo,
    imagen: generarQrData(`${nuevoQR.value.tipo.toLowerCase()}_${nuevoQR.value.nombre.replace(/\s/g, '_')}`)
  }

  qrCodes.value.push(nuevo)
  cerrarModal()
}
</script>

<style scoped>
.modal {
  background: rgba(0, 0, 0, 0.5);
}
</style>
