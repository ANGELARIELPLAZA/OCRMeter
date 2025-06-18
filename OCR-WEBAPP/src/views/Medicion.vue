<template>
  <div class="container mt-4">
    <h3>Medición con QR</h3>

    <!-- 📷 Escáner QR -->
    <div id="reader" style="width: 100%; max-width: 400px;" class="border"></div>
    <div class="mt-2">
      <strong>ID Detectado:</strong> {{ scannedId || 'Esperando escaneo...' }}
    </div>

    <div v-if="scannedId" class="mt-4">
      <form @submit.prevent="submitForm">
        <!-- Usuario -->
        <div class="mb-3">
          <label class="form-label">Usuario</label>
          <input class="form-control" :value="usuario" readonly />
        </div>

        <!-- Fecha -->
        <div class="mb-3">
          <label class="form-label">Fecha y hora</label>
          <input class="form-control" :value="now" readonly />
        </div>

        <!-- Evidencia -->
        <div class="mb-3">
          <label class="form-label">Foto de evidencia</label>
          <input type="file" accept="image/*" @change="handleFileChange" class="form-control" capture="environment" />
        </div>

        <!-- Preview + Lectura -->
        <div v-if="previewImage" class="mb-3">
          <img :src="previewImage" class="img-fluid mt-2 mb-2" />

          <!-- Lectura aparece solo si hay preview -->
          <label class="form-label">Lectura</label>
          <input v-model="lectura" type="number" class="form-control" min="0" required />
        </div>

        <!-- Comentario -->
        <div v-if="previewImage" class="mb-3">
          <label class="form-label">Comentario</label>
          <textarea v-model="comentario" class="form-control" rows="3" required></textarea>
        </div>

        <button v-if="previewImage" type="submit" class="btn btn-primary">Enviar Medición</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { Html5Qrcode } from 'html5-qrcode'

const scannedId = ref('')
const usuario = ref('Angel')
const comentario = ref('')
const lectura = ref('')
const previewImage = ref(null)
const imageFile = ref(null)

const now = computed(() => new Date().toLocaleString())

onMounted(() => {
  const qrCodeScanner = new Html5Qrcode("reader")
  const config = { fps: 10, qrbox: 250 }

  qrCodeScanner.start(
    { facingMode: "environment" },
    config,
    (decodedText) => {
      console.log("QR leído:", decodedText)
      scannedId.value = decodedText
      qrCodeScanner.stop()
    },
    (err) => {
      console.warn("Error de escaneo:", err)
    }
  )
})

const handleFileChange = (e) => {
  const file = e.target.files[0]
  if (file) {
    imageFile.value = file
    previewImage.value = URL.createObjectURL(file)
  }
}

const submitForm = () => {
  const data = {
    id: scannedId.value,
    usuario: usuario.value,
    fecha: now.value,
    lectura: lectura.value,
    comentario: comentario.value,
    imagen: imageFile.value ? '[imagen cargada]' : 'Sin imagen'
  }

  console.log('📦 Datos enviados:', data)
  alert('✅ Medición registrada con éxito')

  // Reset
  comentario.value = ''
  lectura.value = ''
  previewImage.value = null
}
</script>
