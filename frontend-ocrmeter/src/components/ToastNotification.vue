<!-- src/components/ToastNotification.vue -->
<template>
  <div class="toast-container position-fixed bottom-0 end-0 p-3" style="z-index: 1055">
    <div
      class="toast align-items-center text-white border-0"
      :class="`bg-${toastData.tipo}`"
      id="globalToast"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      ref="toastEl"
    >
      <div class="d-flex">
        <div class="toast-body">{{ toastData.mensaje }}</div>
        <button
          type="button"
          class="btn-close btn-close-white me-2 m-auto"
          data-bs-dismiss="toast"
          aria-label="Cerrar"
        ></button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Toast } from 'bootstrap'

const toastEl = ref(null)
const toastData = reactive({
  mensaje: '',
  tipo: 'success' // success | danger | warning | info
})

let toastInstance = null

onMounted(() => {
  if (toastEl.value) {
    toastInstance = new Toast(toastEl.value, { delay: 3000 })
  }
})

// Función que puedes exponer a otros componentes vía `ref`
function showToast(mensaje, tipo = 'success') {
  toastData.mensaje = mensaje
  toastData.tipo = tipo

  if (toastInstance) {
    toastInstance.show()
  }
}

defineExpose({ showToast })
</script>

<style scoped>
.toast {
  min-width: 250px;
}
</style>
