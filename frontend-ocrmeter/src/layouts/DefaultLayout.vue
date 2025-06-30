<template>
  <div class="d-flex min-vh-100">
    <aside class="bg-dark text-white p-3" style="width: 220px;">
      <h5>Menú</h5>
      <router-link to="/dashboard" class="d-block text-white mb-2">Dashboard</router-link>
      <router-link to="/config" class="d-block text-white">Configuración</router-link>
    </aside>

    <div class="flex-grow-1 d-flex flex-column">
      <header class="bg-light border-bottom p-3">
        <h4>Cabecera</h4>
      </header>

      <main class="flex-grow-1 p-4">
        <slot />
      </main>

      <footer class="bg-light text-center p-2 border-top">
        <small>&copy; 2025 Tu Empresa</small>
      </footer>
    </div>
  </div>
</template>
