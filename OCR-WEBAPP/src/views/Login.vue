<template>
  <div class="container mt-5">
    <div class="card mx-auto" style="max-width: 400px;">
      <div class="card-body">
        <h4 class="card-title mb-4">Login</h4>
        <form @submit.prevent="login">
          <div class="mb-3">
            <label>Email</label>
            <input v-model="email" type="email" class="form-control" required />
          </div>
          <div class="mb-3">
            <label>Contraseña</label>
            <input v-model="password" type="password" class="form-control" required />
          </div>
          <button type="submit" class="btn btn-primary w-100">Entrar</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const router = useRouter()

const login = () => {
  if (email.value === 'admin@admin.com' && password.value === '1234') {
    router.push('/home')
  } else {
    alert('Credenciales incorrectas')
  }
}
</script>
