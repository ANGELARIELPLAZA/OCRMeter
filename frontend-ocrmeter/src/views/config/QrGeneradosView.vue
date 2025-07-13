<template>
  <div>
    <Breadcrumb />
    <h5 class="mb-3">QR Generados</h5>

    <div class="card p-3 shadow-sm">
      <button class="btn btn-success mb-3" @click="abrirModal">Crear nuevo QR</button>
      <button class="btn btn-success mb-3" @click="abrirModal2">Activar nuevo QR</button>

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
                placeholder="Escribe o selecciona un modelo" :class="{ 'is-invalid': errores.modelo }"
                :disabled="!nuevoQR.marca" />
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
    <!-- Modal Activar QR -->
    <div class="modal fade" tabindex="-1" :class="{ show: mostrarModalActivar }" style="display: block;"
      v-if="mostrarModalActivar">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Activar QR existente</h5>
            <button type="button" class="btn-close" @click="mostrarModalActivar = false"></button>
          </div>
          <div class="modal-body">
            <!-- Selector de modo de ingreso -->
            <div class="mb-3">
              <label class="form-label">Modo de ingreso</label>
              <select class="form-select" v-model="modoEntrada">
                <option value="manual">Manual</option>
                <option value="escaner">Escáner QR</option>
              </select>
            </div>

            <!-- Escáner QR -->
            <div v-if="modoEntrada === 'escaner'" class="mb-3 text-center">
              <div id="lectorQRModal" style="width: 100%; max-width: 300px;" class="border rounded mx-auto"></div>
              <p class="text-muted small mt-2">
                <i class="bi bi-info-circle"></i> Al detectar el código, se buscará automáticamente.
              </p>
              <div v-if="ultimoQRDetectado" class="mt-3 text-center text-primary small">
                <i class="bi bi-qr-code-scan me-1"></i>
                <strong>Escaneado:</strong> {{ ultimoQRDetectado }}
              </div>

              <button class="btn btn-outline-secondary btn-sm mt-2" @click="detenerEscaneoQRModal">
                <i class="bi bi-x-circle me-1"></i> Detener escáner
              </button>
            </div>

            <!-- Entrada manual -->
            <div v-else>
              <div class="mb-3">
                <label class="form-label">ID QR</label>
                <input type="text" class="form-control" v-model="nuevoQR.id" />
              </div>
              <div class="mb-3">
                <label class="form-label">Compañía</label>
                <input type="text" class="form-control" v-model="nuevoQR.company" />
              </div>
              <button class="btn btn-outline-primary mb-3" @click="buscarQR">Buscar QR</button>
            </div>

            <!-- Formulario de actualización -->
            <div v-if="qrEncontrado">
              <div class="mb-3">
                <label class="form-label">Nombre / Entidad</label>
                <input type="text" class="form-control" v-model="nuevoQR.nombre" />
              </div>
              <div class="mb-3">
                <label class="form-label">Marca</label>
                <input type="text" class="form-control" v-model="nuevoQR.marca" list="lista-marca" />
              </div>
              <div class="mb-3">
                <label class="form-label">Modelo</label>
                <input type="text" class="form-control" v-model="nuevoQR.modelo" list="lista-modelos" />
              </div>
              <div class="mb-3">
                <label class="form-label">Área</label>
                <select class="form-select" v-model="nuevoQR.area">
                  <option value="" disabled>Seleccionar área</option>
                  <option v-for="area in areas" :key="area.id">{{ area.nombre }}</option>
                </select>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary" @click="mostrarModalActivar = false">Cancelar</button>
            <button class="btn btn-primary" @click="activarQR" :disabled="!qrEncontrado">Actualizar QR</button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade show" v-if="mostrarModalActivar"></div>

    <div class="modal-backdrop fade show" v-if="mostrarModal"></div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import Breadcrumb from '@/components/Breadcrumb.vue'
import jsPDF from 'jspdf'
import { Html5Qrcode } from 'html5-qrcode'
import QRCode from 'qrcode'

const API_URL = import.meta.env.VITE_API_URL

const qrCodes = ref([])
const qrCodesSeleccionados = ref([])
const mostrarModal = ref(false)
const mostrarModalActivar = ref(false)
const modoEntrada = ref('manual')
const nuevoQR = ref({ id: '', company: '', nombre: '', tipo: 'Agua', marca: '', modelo: '', area: '' })
const qrEncontrado = ref(null)
const marcas = ref([])
const modelos = ref([])
const areas = ref([])
const medidores = ref([])
const errores = ref({ id: false, nombre: false, marca: false, modelo: false, area: false })
const qrScanner = ref(null)
const ultimoQRDetectado = ref('')

// ✅ Generador base64 QR
async function generarQrBase64(texto) {
  try {
    return await QRCode.toDataURL(texto)
  } catch (err) {
    console.error('❌ Error al generar QR base64:', err)
    return ''
  }
}

// ✅ Escaneo detectado
const onQrDetectado = async (decodedText) => {
  ultimoQRDetectado.value = decodedText
  nuevoQR.value.id = decodedText.split('_')[0]
  await detenerEscaneoQRModal()
  await buscarQR()
}

// ✅ Iniciar escaneo
const iniciarEscaneoQRModal = async () => {
  if (qrScanner.value) return
  qrScanner.value = new Html5Qrcode('lectorQRModal')
  try {
    await qrScanner.value.start(
      { facingMode: 'environment' },
      { fps: 10, qrbox: 250 },
      onQrDetectado,
      (err) => {
        if (err.name !== 'NotFoundException') {
          console.warn('Escaneo QR error:', err)
        }
      }
    )
  } catch (err) {
    console.error('No se pudo iniciar el escáner:', err)
  }
}

// ✅ Detener escaneo
const detenerEscaneoQRModal = async () => {
  try {
    if (qrScanner.value && qrScanner.value._isScanning) {
      await qrScanner.value.stop()
      await qrScanner.value.clear()
    }
  } catch (err) {
    console.warn('Error al detener escáner:', err)
  } finally {
    qrScanner.value = null
  }
}

onBeforeUnmount(detenerEscaneoQRModal)

watch(modoEntrada, async (modo) => {
  if (modo === 'escaner') {
    await nextTick()
    iniciarEscaneoQRModal()
  } else {
    detenerEscaneoQRModal()
  }
})

// ✅ Crear QR nuevo
const crearQR = async () => {
  const { company = 1, id, nombre, tipo, marca, modelo, area } = nuevoQR.value
  errores.value = { company: !company, id: !id, nombre: false, marca: false, modelo: false, area: false }

  if (!id || !company) {
    alert('El campo ID y compañía son obligatorios.')
    return
  }

  const textoQR = id
  const imagenBase64 = await generarQrBase64(textoQR)

  const nuevo = { company, id, nombre, tipo, marca, modelo, area, imagen: imagenBase64, incompleto: true }

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

// ✅ Buscar QR existente
const buscarQR = async () => {
  try {
    const token = localStorage.getItem('token')
    const res = await fetch(`${API_URL}/api/qrs/buscar?id=${nuevoQR.value.id}&company=${nuevoQR.value.company}`, {
      headers: { Authorization: `Bearer ${token}` }
    })

    if (res.status === 404) {
      alert('QR no encontrado')
      return
    }

    const data = await res.json()
    qrEncontrado.value = data
    Object.assign(nuevoQR.value, data)
  } catch (err) {
    console.error('Error al buscar QR:', err.message)
  }
}

// ✅ Activar QR (actualizar)
const activarQR = async () => {
  if (!qrEncontrado.value || !qrEncontrado.value._id) {
    alert('Primero busca y selecciona un QR válido.')
    return
  }

  const { id, company, nombre, tipo, marca, modelo, area } = nuevoQR.value
  const textoQR = id
  const imagenBase64 = await generarQrBase64(textoQR)

  try {
    const token = localStorage.getItem('token')
    const res = await fetch(`${API_URL}/api/qrs/${qrEncontrado.value._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        id, company, nombre, tipo, marca, modelo, area,
        imagen: imagenBase64,
        incompleto: false
      })
    })

    const updated = await res.json()
    const idx = qrCodes.value.findIndex(q => q._id === updated._id)
    if (idx !== -1) qrCodes.value[idx] = updated
    else qrCodes.value.push(updated)

    mostrarModalActivar.value = false
  } catch (err) {
    console.error('Error al activar QR:', err.message)
  }
}

// ✅ Otros métodos de utilidad
const generarId = () => {
  const random = Math.floor(100000 + Math.random() * 900000)
  nuevoQR.value.id = `QR-${random}`
}

const abrirModal = () => {
  nuevoQR.value = { id: '', nombre: '', tipo: 'Agua', marca: '', modelo: '', area: '' }
  mostrarModal.value = true
}

const cerrarModal = () => {
  mostrarModal.value = false
}

const abrirModal2 = async () => {
  nuevoQR.value = { id: '', company: '', nombre: '', tipo: 'Agua', marca: '', modelo: '', area: '' }
  qrEncontrado.value = null
  mostrarModalActivar.value = true
  modoEntrada.value = 'manual'
}

// 🔄 Obtener datos
const obtenerQRCodes = async () => {
  try {
    const token = localStorage.getItem('token')
    const res = await fetch(`${API_URL}/api/qrs`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    qrCodes.value = await res.json()
  } catch (err) {
    console.error('Error al obtener QR Codes:', err)
  }
}

const obtenerAreas = async () => {
  try {
    const token = localStorage.getItem('token')
    const res = await fetch(`${API_URL}/api/areas`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = await res.json()
    areas.value = data.filter(a => a && a._id && a.nombre).map(a => ({ id: a._id, nombre: a.nombre }))
  } catch (err) {
    console.error('Error al obtener áreas:', err)
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
    console.error('Error al obtener medidores:', err)
  }
}

watch(() => nuevoQR.value.marca, (marcaSeleccionada) => {
  const filtrados = medidores.value.filter(m => m.marca === marcaSeleccionada)
  modelos.value = [...new Set(filtrados.map(m => m.modelo))]
  nuevoQR.value.modelo = ''
})

const editarQR = (qr) => {
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
  qrCodesSeleccionados.value = event.target.checked ? [...qrCodes.value] : []
}

const descargarPDF = async () => {
  const pdf = new jsPDF()
  let x = 10, y = 10

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
        if (x > 180) { x = 10; y += 70 }
        resolve()
      }
    })
  }

  pdf.save('qr_seleccionados.pdf')
}

onMounted(() => {
  obtenerQRCodes()
  obtenerAreas()
  obtenerMedidores()
})
</script>

<style scoped>
#lectorQRModal {
  width: 100%;
  max-width: 300px;
  height: 280px;
}

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
