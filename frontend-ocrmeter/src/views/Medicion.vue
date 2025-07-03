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
          <option v-for="(info, id) in registros" :key="id" :value="id">
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
        <n-calendar v-model:value="calendarFechaSeleccionada"
          :is-date-disabled="(date) => !fechasProgramadasMap[formatearFecha(date)]" :panel="false" />
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
import { NCard, NTimeline, NTimelineItem } from 'naive-ui'

// Historial debe ir arriba para que Vue lo registre correctamente
const historial = ref({
  ID123456: [
    { fecha: '2024-06-01 10:30', valor: 100, unidad: 'm³', dentroRango: true },
    { fecha: '2024-06-05 10:35', valor: 220, unidad: 'm³', dentroRango: false }
  ],
  ID987654: [
    { fecha: '2024-06-10 11:00', valor: 130, unidad: 'litros', dentroRango: true }
  ]
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

const registros = {
  ID123456: { area: 'Planta 1_General_Agua', tipo: 'Agua' },
  ID987654: { area: 'Planta 2_General_Agua', tipo: 'Agua' },
  ID555111: { area: 'Planta 3_General_Agua', tipo: 'Agua' }
}

const now = computed(() => new Date().toLocaleString())

let qrScanner = null

onMounted(() => iniciarEscaneo())

const iniciarEscaneo = () => {
  qrScanner = new Html5Qrcode('reader')
  qrScanner.start(
    { facingMode: 'environment' },
    { fps: 10, qrbox: 250 },
    (decodedText) => {
      procesarQR(decodedText)
      qrScanner.stop().catch(console.error)
    },
    (err) => console.warn('Error escaneando:', err)
  )
}
const limpiarFormulario = () => {
  unidad.value = ''
  comentario.value = ''
  lectura.value = ''
  previewImage.value = null
  imageFile.value = null
}

const procesarQR = (id) => {
  limpiarFormulario() // 👈 limpia los campos anteriores
  scannedId.value = id
  const datos = registros[id] || { area: 'No registrada', tipo: 'No registrado' }
  area.value = datos.area
  tipoMedicion.value = datos.tipo
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

    // Forzar que el mismo input pueda ser seleccionado de nuevo
    e.target.value = null
  }
}

const lecturaFueraDeRango = computed(() => {
  const valor = parseFloat(lectura.value)
  return !isNaN(valor) && (valor < 90 || valor > 200)
})

const submitForm = () => {

  const data = {
    id: scannedId.value,
    usuario: usuario.value,
    fecha: now.value,
    area: area.value,
    tipo: tipoMedicion.value,
    lectura: lectura.value,
    unidad: unidad.value,
    comentario: comentario.value,
    imagen: imageFile.value ? '[imagen cargada]' : 'Sin imagen'
  }


  console.log('📦 Datos enviados:', data)
  alert('✅ Medición registrada con éxito')


  if (!historial.value[scannedId.value]) {
    historial.value[scannedId.value] = []
  }

  historial.value[scannedId.value].unshift({
    fecha: now.value,
    valor: parseFloat(lectura.value),
    unidad: unidad.value,
    dentroRango: parseFloat(lectura.value) >= 90 && parseFloat(lectura.value) <= 200
  })


  comentario.value = ''
  lectura.value = ''
  previewImage.value = null
  imageFile.value = null
  reiniciarEscaneo()
}
</script>
