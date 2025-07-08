<template>
  <div class="container mt-4">
    <h3 class="mb-4 text-primary">
      <i class="bi bi-qr-code-scan me-2"></i> Medición con Código QR
    </h3>

    <!-- Escáner QR y entrada manual -->
    <div class="card p-3 shadow-sm mb-3">
      <div id="reader" style="width: 100%; max-width: 400px;" class="border rounded mx-auto"></div>
      <div class="mt-3">
        <span class="text-muted">
          <i class="bi bi-info-circle"></i>
          <strong class="ms-1">ID Detectado:</strong>
          {{ scannedId || 'Esperando escaneo o ingreso manual...' }}
        </span>
      </div>

      <!-- Entrada manual si no escanea -->
      <div class="mt-3">
        <label class="form-label">Ingresar ID manualmente</label>
        <input v-model="manualId" list="sugerenciasIds" class="form-control" placeholder="Ej. ID123456" />
        <datalist id="sugerenciasIds">
          <option v-for="(info, id) in registrosCatalogo" :key="id" :value="id">
            {{ `${id} - ${info.area}` }}
          </option>
        </datalist>

        <button class="btn btn-sm btn-outline-primary mt-2" @click="usarManualId">
          <i class="bi bi-check2-circle"></i> Usar ID ingresado
        </button>
      </div>

      <div class="text-end mt-2" v-if="scannedId">
        <button class="btn btn-sm btn-outline-secondary" @click="reiniciarEscaneo">
          <i class="bi bi-arrow-clockwise"></i> Escanear otro
        </button>
      </div>
    </div>

    <!-- Formulario de medicion -->
    <div v-if="scannedId" class="card p-4 shadow-sm">
      <h5 class="mb-3"><i class="bi bi-pencil-square me-2"></i> Registro de Medición</h5>
      <form @submit.prevent="submitForm">

        <!-- Foto evidencia -->
        <div class="mb-3">
          <label class="form-label"><i class="bi bi-camera me-2"></i>Foto de Evidencia</label>
          <input type="file" accept="image/*" class="form-control" @change="handleFileChange" capture="environment" />
        </div>

        <!-- Preview + lectura -->
        <div v-if="previewImage" class="mb-3 text-center">
          <img :src="previewImage" class="img-fluid rounded border" style="max-height: 300px;" />
        </div>


        <!-- Lectura y Unidad en una sola fila -->
        <div v-if="previewImage" class="mb-3 row">
          <div class="col-md-6">
            <label class="form-label">
              <i class="bi bi-speedometer2 me-2"></i>Lectura
              <span v-if="lecturaFueraDeRango" class="badge bg-warning text-dark ms-2">Por validar</span>
            </label>
            <input v-model="lectura" type="number" class="form-control" placeholder="Ingrese la lectura del medidor"
              min="0" required />
          </div>

          <div class="col-md-6">
            <label class="form-label">
              <i class="bi bi-rulers me-2"></i>Unidad de Medida
            </label>
            <select v-model="unidad" class="form-select" required>
              <option value="" disabled>Seleccione una unidad</option>
              <option v-for="(item, index) in unidadesDisponibles" :key="index" :value="item">
                {{ item }}
              </option>
            </select>
          </div>
        </div>

        <!-- Comentario -->
        <div v-if="previewImage" class="mb-3">
          <label class="form-label"><i class="bi bi-chat-left-dots me-2"></i>Comentario</label>
          <textarea v-model="comentario" class="form-control" rows="3" required></textarea>
        </div>
        <!-- Área -->
        <div class="mb-3">
          <label class="form-label"><i class="bi bi-diagram-3 me-2"></i>Área</label>
          <input class="form-control" :value="area" readonly />
        </div>

        <details class="mb-3">
          <summary class="form-label text-primary" style="cursor: pointer;">
            <i class="bi bi-info-circle me-2"></i>Detalles de la Medición
          </summary>
          <div class="mt-3">

            <!-- Tipo de medición -->
            <div class="mb-2">
              <label class="form-label"><i class="bi bi-sliders2-vertical me-2"></i>Tipo de Medición</label>
              <input class="form-control" :value="tipoMedicion" readonly />
            </div>

            <!-- Usuario -->
            <div class="mb-2">
              <label class="form-label"><i class="bi bi-person-circle me-2"></i>Usuario</label>
              <input class="form-control" :value="usuario" readonly />
            </div>

            <!-- Fecha -->
            <div class="mb-2">
              <label class="form-label"><i class="bi bi-calendar-event me-2"></i>Fecha y Hora</label>
              <input class="form-control" :value="now" readonly />
            </div>

          </div>
        </details>

        <button v-if="previewImage" type="submit" class="btn btn-success w-100 mt-3">
          <i class="bi bi-send-check me-2"></i>Enviar Medición
        </button>
      </form>
    </div>
  </div>
  <n-card title="Historial del Medidor" class="mt-4">
    <div class="row">
      <!-- Timeline histórico -->
      <div class="col-md-6">
        <n-timeline v-if="scannedId && historial[scannedId]">
          <n-timeline-item v-for="(item, index) in historial[scannedId]" :key="index"
            :title="`Lectura: ${item.valor} ${item.unidad || ''}`" :content="`Fecha: ${item.fecha}`"
            :type="item.dentroRango ? 'success' : 'error'" />
        </n-timeline>

      </div>

      <!-- Calendario de próximas recolecciones -->
      <div class="col-md-6">
        <div style="width: 90%; height: 90%; overflow: auto;">
          <n-calendar v-if="scannedId" v-model:value="calendarFechaSeleccionada"
            :is-date-disabled="(date) => !fechasProgramadasMap[formatearFecha(date)]" :panel="false" />
        </div>

        <div class="mt-2 text-muted small">
          <i class="bi bi-calendar-check"></i> Fechas resaltadas: días con recolección programada.
        </div>
      </div>
    </div>
  </n-card>

</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Html5Qrcode } from 'html5-qrcode'
import { NCard, NTimeline, NTimelineItem, NCalendar } from 'naive-ui'
import auth from '@/services/authService' // ⬅️ ajusta la ruta si está en otro lugar

const registrosCatalogo = ref({})
const imagenBase64 = ref('')

const cargarCatalogoQR = async () => {
  try {
    const token = localStorage.getItem('token')
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/qrs`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message)

    // Convertir a objeto: { [id]: { area, tipo } }
    registrosCatalogo.value = Object.fromEntries(
      data.map(qr => [qr.id, { area: qr.area, tipo: qr.tipo || 'Agua' }])
    )
  } catch (err) {
    console.error('❌ Error al cargar catálogo QR:', err.message)
  }
}


// Historial debe ir arriba para que Vue lo registre correctamente
const historial = ref({})
const calendarFechaSeleccionada = ref(null)

const fechasProgramadas = ref({})
const formatearFecha = (date) => {
  return new Date(date).toISOString().split('T')[0] // YYYY-MM-DD
}
const fechasProgramadasMap = computed(() => {
  const id = scannedId.value
  const fechas = fechasProgramadas.value[id] || []
  const map = {}
  fechas.forEach(fecha => map[fecha] = true)
  return map
})


const unidad = ref('')
const unidadesDisponibles = ['litros', 'm³', 'psi']

const scannedId = ref('')
const manualId = ref('')
const usuario = ref('Angel')
const comentario = ref('')
const lectura = ref('')
const previewImage = ref(null)
const imageFile = ref(null)
const area = ref('')
const tipoMedicion = ref('')


const now = computed(() => new Date().toLocaleString())

let qrScanner = null

onMounted(() => {
  iniciarEscaneo()
  cargarCatalogoQR()
  const user = auth.getUsuario()
  if (user) {
    usuario.value = user.name // 👈 usa "name" como lo devuelve tu backend
  }
})

const iniciarEscaneo = () => {
  qrScanner = new Html5Qrcode('reader')
  qrScanner.start(
    { facingMode: 'environment' },
    { fps: 10, qrbox: 250 },
    (decodedText) => {
      procesarQR(decodedText)
      qrScanner.stop().catch(console.error)
    },
    (err) => {
      if (err.name !== 'NotFoundException') {
        console.warn('Otro error escaneando:', err)
      }
    }
  )
}
const limpiarFormulario = () => {
  unidad.value = ''
  comentario.value = ''
  lectura.value = ''
  previewImage.value = null
  imageFile.value = null
}
const cargarHistorialDesdeAPI = async (id) => {
  try {
    const token = localStorage.getItem('token')
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/scan/${id}/historial`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message)

    historial.value[id] = data.map(item => ({
      fecha: item.fecha,
      valor: item.lectura,
      unidad: item.unidad,
      dentroRango: item.lectura >= 90 && item.lectura <= 200
    }))
  } catch (err) {
    console.error('❌ Error al obtener historial:', err.message)
  }
}


const procesarQR = (id) => {
  limpiarFormulario()
  scannedId.value = id
  const datos = registrosCatalogo.value[id] || { area: 'No registrada', tipo: 'Agua' }
  area.value = datos.area
  tipoMedicion.value = datos.tipo,
    cargarHistorialDesdeAPI(id) // 👈 aquí

}

const usarManualId = () => {
  if (manualId.value) {
    limpiarFormulario() // 👈 también limpia si el ID cambia manualmente
    procesarQR(manualId.value)
  }
}


const reiniciarEscaneo = () => {
  scannedId.value = ''
  area.value = ''
  tipoMedicion.value = ''
  iniciarEscaneo()
}

const handleFileChange = (e) => {
  const file = e.target.files[0]
  if (file) {
    imageFile.value = file
    previewImage.value = URL.createObjectURL(file)

    // Convertir a base64
    const reader = new FileReader()
    reader.onload = () => {
      imagenBase64.value = reader.result
    }
    reader.readAsDataURL(file)

    e.target.value = null // limpiar input
  }
}


const lecturaFueraDeRango = computed(() => {
  const valor = parseFloat(lectura.value)
  return !isNaN(valor) && (valor < 90 || valor > 200)
})

const submitForm = async () => {
  const token = localStorage.getItem('token')

  const formData = {
    id: scannedId.value,
    usuario: usuario.value,
    fecha: now.value,
    area: area.value,
    tipo: tipoMedicion.value,
    lectura: lectura.value,
    unidad: unidad.value,
    comentario: comentario.value,
    imagen: imagenBase64.value || 'Sin imagen'
  }

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/scan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(formData)
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Error al guardar medición');

    alert('✅ Medición registrada y guardada en backend');
    console.log('📦 Respuesta backend:', data);
  } catch (err) {
    console.error('❌ Error al enviar medición:', err.message);
    alert('Error al guardar medición');
  }

  // limpiar UI
  comentario.value = ''
  lectura.value = ''
  previewImage.value = null
  imageFile.value = null
  reiniciarEscaneo()
}


</script>
