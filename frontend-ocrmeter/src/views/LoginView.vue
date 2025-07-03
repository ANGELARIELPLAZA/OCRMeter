<template>
  <div class="d-flex justify-content-center align-items-center vh-100 bg-light">
    <div class="card p-4 shadow" style="width: 100%; max-width: 400px;">
      <h4 class="mb-4 text-center">Iniciar Sesión</h4>
      <div v-if="errorMsg" class="alert alert-danger" role="alert">
        {{ errorMsg }}
      </div>
      <form @submit.prevent="login">
        <div class="mb-3">
          <label>Email</label>
          <input v-model="email" type="email" class="form-control" required />
        </div>
        <div class="mb-3">
          <label>Contraseña</label>
          <input v-model="password" type="password" class="form-control" required />
        </div>
        <button class="btn btn-primary w-100">Ingresar</button>
      </form>
    </div>

  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import authService from '@/services/authService'

const router = useRouter()
const email = ref('')
const password = ref('')
const errorMsg = ref('')

async function login() {
  try {
    const res = await authService.login(email.value, password.value)
  //  console.log('Usuario autenticado:', res.user)
    router.push('/dashboard') // Redirige al dashboard
  } catch (error) {
    errorMsg.value = error.message || 'Error al iniciar sesión'
  }
}
</script>
