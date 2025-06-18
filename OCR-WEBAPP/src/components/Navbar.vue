<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <a class="navbar-brand">Mi App</a>

      <!-- Botón hamburguesa para colapsar en móvil -->
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Enlaces de navegación colapsables -->
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/home">Inicio</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/dashboard">Dashboard</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/qrgenerator">Alta de Medidor</router-link>
          </li>
           <li class="nav-item">
            <router-link class="nav-link" to="/Medicion">Medicion</router-link>
          </li>
           <li class="nav-item">
            <router-link class="nav-link" to="/Reporte">Reporte</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/login">Salir</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
