<template>
  <div class="container mt-4">
    <h3>Generador de QR</h3>

    <ul class="nav nav-tabs" id="qrTabs" role="tablist">
      <li class="nav-item" role="presentation">
        <button class="nav-link active" id="form-tab" data-bs-toggle="tab" data-bs-target="#form" type="button" role="tab">
          Generar QR
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="list-tab" data-bs-toggle="tab" data-bs-target="#list" type="button" role="tab">
          QR Generados
        </button>
      </li>
    </ul>

    <div class="tab-content mt-3">
      <!-- Formulario -->
      <div class="tab-pane fade show active" id="form" role="tabpanel">
        <form @submit.prevent="generateQr">
          <div class="mb-3">
            <label for="idInput" class="form-label">ID:</label>
            <input v-model="inputId" id="idInput" class="form-control" required />
          </div>
          <button type="submit" class="btn btn-success">Generar QR</button>
        </form>

        <div v-if="qrDataUrl" class="mt-4 text-center">
          <h5>QR Generado</h5>
          <img :src="qrDataUrl" alt="QR Code" />
          <br />
          <a :href="qrDataUrl" download="qr-code.png" class="btn btn-primary mt-2">Descargar</a>
        </div>
      </div>

      <!-- Lista de QR -->
      <div class="tab-pane fade" id="list" role="tabpanel">
        <div v-if="generatedQrs.length">
          <ul class="list-group">
            <li v-for="(item, index) in generatedQrs" :key="index" class="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong>ID:</strong> {{ item.id }}
              </div>
              <a :href="item.qr" download="qr-code.png" class="btn btn-outline-primary btn-sm">Descargar</a>
            </li>
          </ul>
        </div>
        <div v-else>
          <p>No hay QR generados aún.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import QRCode from 'qrcode'

const inputId = ref('')
const qrDataUrl = ref('')
const generatedQrs = ref([])

const generateQr = async () => {
  try {
    const dataUrl = await QRCode.toDataURL(inputId.value)
    qrDataUrl.value = dataUrl
    generatedQrs.value.push({ id: inputId.value, qr: dataUrl })
    inputId.value = ''
  } catch (err) {
    alert('Error al generar QR')
  }
}
</script>
