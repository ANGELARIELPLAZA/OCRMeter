<template>
  <div class="container d-flex align-items-center justify-content-center vh-100">
    <div class="card shadow p-4" style="width: 100%; max-width: 400px;">
      <h3 class="text-center mb-4">Iniciar Sesión</h3>

      <form @submit.prevent="handleLogin">
        <div class="mb-3">
          <label for="email" class="form-label">Correo electrónico</label>
          <input type="email" v-model="email" class="form-control" id="email" required />
        </div>

        <div class="mb-3">
          <label for="password" class="form-label">Contraseña</label>
          <input type="password" v-model="password" class="form-control" id="password" required />
        </div>

        <button type="submit" class="btn btn-primary w-100">Ingresar</button>
      </form>

      <div v-if="error" class="alert alert-danger mt-3">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LoginView",
  data() {
    return {
      email: '',
      password: '',
      error: ''
    };
  },
  methods: {
    async handleLogin() {
      this.error = '';

      // Aquí puedes reemplazar con llamada a tu API
      if (this.email === 'admin@example.com' && this.password === '123456') {
        // Simular login exitoso
        localStorage.setItem('token', 'faketoken123');
        this.$router.push('/dashboard'); // Ruta protegida
      } else {
        this.error = 'Correo o contraseña incorrectos';
      }
    }
  }
}
</script>
