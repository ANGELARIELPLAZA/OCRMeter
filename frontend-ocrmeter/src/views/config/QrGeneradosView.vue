<template>
  <div>
    <Breadcrumb />
    <h5 class="mb-3">QR Generados</h5>

    <div class="card p-3 shadow-sm">
      <button class="btn btn-success mb-3" @click="abrirModal">Crear nuevo QR</button>
      <button class="btn btn-outline-primary mb-3" :disabled="qrCodesSeleccionados.length === 0"
        @click="descargarPDF">Descargar seleccionados en PDF</button>

      <table class="table table-bordered table-striped">
        <thead class="table-light">
          <tr>
            <th><input type="checkbox" @change="toggleSeleccionarTodos($event)" /></th>
            <th>#</th>
            <th>ID</th>
            <th>Entidad</th>
            <th>Tipo</th>
            <th>Marca</th>
            <th>Modelo</th>
            <th>Área</th>
            <th>QR</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(qr, index) in qrCodes" :key="qr._id">
            <td><input type="checkbox" v-model="qrCodesSeleccionados" :value="qr" /></td>
            <td>{{ index + 1 }}</td>
            <td>{{ qr.id }}</td>
            <td>{{ qr.nombre }}</td>
            <td>{{ qr.tipo }}</td>
            <td>{{ qr.marca }}</td>
            <td>{{ qr.modelo }}</td>
            <td>{{ qr.area }}</td>
            <td class="text-center">
              <img :src="qr.imagen" alt="QR" style="width: 70px;" />
              <div class="mt-1 small text-muted">{{ qr.id }}</div>
            </td>
            <td>
              <button class="btn btn-sm btn-outline-warning me-1" @click="editarQR(qr)">Modificar</button>
              <button class="btn btn-sm btn-outline-danger" @click="deshabilitarQR(qr._id)">Deshabilitar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div class="modal fade" tabindex="-1" :class="{ show: mostrarModal }" style="display: block;" v-if="mostrarModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Crear nuevo QR</h5>
            <button type="button" class="btn-close" @click="cerrarModal"></button>
          </div>
          <div class="modal-body">
         <div class="mb-3">
  <label class="form-label">ID (personalizado o autogenerado)</label>
  <div class="input-group">
    <input type="text" class="form-control" v-model="nuevoQR.id" placeholder="Ej: QR-000123"
      :class="{ 'is-invalid': errores.id }" />
    <button class="btn btn-outline-secondary" type="button" @click="generarId">Generar</button>
  </div>
</div>
<div class="mb-3">
  <label class="form-label">Nombre / Entidad</label>
  <input type="text" class="form-control" v-model="nuevoQR.nombre"
    :class="{ 'is-invalid': errores.nombre }" />
</div>
<div class="mb-3">
  <label class="form-label">Marca</label>
  <input type="text" class="form-control" v-model="nuevoQR.marca" list="lista-marca"
    placeholder="Escribe o selecciona una marca" :class="{ 'is-invalid': errores.marca }" />
  <datalist id="lista-marca">
    <option v-for="marca in marcas" :key="marca" :value="marca" />
  </datalist>
</div>
<div class="mb-3">
  <label class="form-label">Modelo</label>
  <input type="text" class="form-control" v-model="nuevoQR.modelo" list="lista-modelos"
    placeholder="Escribe o selecciona un modelo" :class="{ 'is-invalid': errores.modelo }" :disabled="!nuevoQR.marca" />
  <datalist id="lista-modelos">
    <option v-for="modelo in modelos" :key="modelo" :value="modelo" />
  </datalist>
</div>
<div class="mb-3">
  <label class="form-label">Área</label>
  <select class="form-select" v-model="nuevoQR.area" :class="{ 'is-invalid': errores.area }">
    <option value="" disabled>Seleccionar área</option>
    <option v-for="area in areas" :key="area.id">{{ area.nombre }}</option>
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
import { ref, watch, onMounted } from 'vue'
import Breadcrumb from '@/components/Breadcrumb.vue'
import jsPDF from 'jspdf'

const API_URL = import.meta.env.VITE_API_URL
const qrCodes = ref([])
const qrCodesSeleccionados = ref([])
const mostrarModal = ref(false)
const nuevoQR = ref({ id: '', nombre: '', tipo: 'Agua', marca: '', modelo: '', area: '' })
const areas = ref([])
const medidores = ref([])

const marcas = ref([])
const modelos = ref([])
const errores = ref({
  id: false,
  nombre: false,
  marca: false,
  modelo: false,
  area: false
})

onMounted(() => {
  obtenerAreas()
  obtenerMedidores()
  obtenerQRCodes()
})

const obtenerQRCodes = async () => {
  try {
    const token = localStorage.getItem('token')
    const res = await fetch(`${API_URL}/api/qrs`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = await res.json()
    qrCodes.value = data
  } catch (err) {
    console.error('Error al obtener QR Codes:', err)
  }
}

function generarQrData(texto) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(texto)}`
}

const generarId = () => {
  const random = Math.floor(100000 + Math.random() * 900000)
  nuevoQR.value.id = `QR-${random}`
}

const obtenerAreas = async () => {
  try {
    const token = localStorage.getItem('token')
    const res = await fetch(`${API_URL}/api/areas`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = await res.json()

    // ✅ Filtrar elementos nulos o mal formados
    areas.value = data
      .filter(a => a && a._id && a.nombre)
      .map(a => ({ id: a._id, nombre: a.nombre }))
  } catch (err) {
    console.error('Error al obtener áreas:', err.message)
  }
}

const obtenerMedidores = async () => {
  try {
    const token = localStorage.getItem('token')
    const res = await fetch(`${API_URL}/api/medidores`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = await res.json()
    medidores.value = data
    marcas.value = [...new Set(data.map(m => m.marca))]
  } catch (err) {
    console.error('Error al obtener medidores:', err.message)
  }
}

watch(() => nuevoQR.value.marca, (marcaSeleccionada) => {
  const filtrados = medidores.value.filter(m => m.marca === marcaSeleccionada)
  modelos.value = [...new Set(filtrados.map(m => m.modelo))]
  nuevoQR.value.modelo = ''
})

const abrirModal = () => {
  nuevoQR.value = { id: '', nombre: '', tipo: 'Agua', marca: '', modelo: '', area: '' }
  mostrarModal.value = true
}

const cerrarModal = () => {
  mostrarModal.value = false
}

const crearQR = async () => {
  const { id, nombre, tipo, marca, modelo, area } = nuevoQR.value

  errores.value = {
    id: !id,
    nombre: !nombre,
    marca: !marca,
    modelo: !modelo,
    area: !area
  }

  const tieneErrores = Object.values(errores.value).some(e => e)
  if (tieneErrores) {
    alert('Por favor, completa todos los campos obligatorios.')
    return
  }

  const textoQR = `${id}_${tipo}_${marca}_${modelo}_${nombre}_${area}`.replace(/\s/g, '_')
  const nuevo = {
    id,
    nombre,
    tipo,
    marca,
    modelo,
    area,
    imagen: generarQrData(textoQR)
  }

  try {
    const token = localStorage.getItem('token')
    const res = await fetch(`${API_URL}/api/qrs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(nuevo)
    })
    const data = await res.json()
    qrCodes.value.push(data)
    cerrarModal()
  } catch (err) {
    console.error('Error al crear QR:', err.message)
  }
}

const editarQR = (qr) => {
  // Puedes implementar un modal de edición o similar aquí
  alert(`Modificar QR: ${qr.id}`)
}

const deshabilitarQR = async (id) => {
  try {
    const token = localStorage.getItem('token')
    await fetch(`${API_URL}/api/qrs/deshabilitar/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` }
    })
    const index = qrCodes.value.findIndex(q => q._id === id)
    if (index !== -1) qrCodes.value.splice(index, 1)
  } catch (err) {
    console.error('Error al deshabilitar QR:', err)
  }
}

const toggleSeleccionarTodos = (event) => {
  if (event.target.checked) {
    qrCodesSeleccionados.value = [...qrCodes.value]
  } else {
    qrCodesSeleccionados.value = []
  }
}

const descargarPDF = async () => {
  const pdf = new jsPDF()
  let x = 10
  let y = 10

  for (let i = 0; i < qrCodesSeleccionados.value.length; i++) {
    const qr = qrCodesSeleccionados.value[i]
    const img = new Image()
    img.crossOrigin = 'Anonymous'
    img.src = qr.imagen

    await new Promise(resolve => {
      img.onload = () => {
        pdf.addImage(img, 'PNG', x, y, 50, 50)
        pdf.text(`ID: ${qr.id}`, x, y + 55)
        x += 60
        if (x > 180) {
          x = 10
          y += 70
        }
        resolve()
      }
    })
  }

  pdf.save('qr_seleccionados.pdf')
}
</script>

<style scoped>
.modal {
  background: rgba(0, 0, 0, 0.5);
}

.small {
  font-size: 0.75rem;
}

.text-muted {
  color: #6c757d;
}

.is-invalid {
  border: 1px solid red;
}
</style>
