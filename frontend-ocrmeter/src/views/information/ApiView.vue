<template>
  <div>
    <Breadcrumb />

    <h5 class="mb-3">Documentación de la API del Sistema</h5>

    <div class="card p-3 shadow-sm">
      <p>Esta vista muestra los endpoints disponibles para interactuar con los datos del sistema.</p>

      <!-- Usuarios -->
      <h6 class="mt-3"><i class="bi bi-person-fill"></i> Usuarios</h6>
      <ul class="list-group mb-3">
        <li class="list-group-item">
          <div class="d-flex justify-content-between">
            <div><strong>GET</strong> /api/usuarios</div>
            <span class="badge bg-primary">Listado</span>
          </div>
          Devuelve todos los usuarios registrados.
        </li>
        <li class="list-group-item">
          <div class="d-flex justify-content-between">
            <div><strong>POST</strong> /api/usuarios</div>
            <span class="badge bg-success">Crear</span>
          </div>
          Crea un nuevo usuario.
        </li>
        <li class="list-group-item">
          <div class="d-flex justify-content-between">
            <div><strong>PUT</strong> /api/usuarios/:id</div>
            <span class="badge bg-warning text-dark">Actualizar</span>
          </div>
          Actualiza un usuario por ID.
        </li>
        <li class="list-group-item">
          <div class="d-flex justify-content-between">
            <div><strong>DELETE</strong> /api/usuarios/:id</div>
            <span class="badge bg-danger">Eliminar</span>
          </div>
          Elimina un usuario.
        </li>
      </ul>

      <!-- Medidores -->
      <h6><i class="bi bi-lightning-fill"></i> Medidores</h6>
      <ul class="list-group mb-3">
        <li class="list-group-item">
          <div class="d-flex justify-content-between">
            <div><strong>GET</strong> /api/medidores</div>
            <span class="badge bg-primary">Listado</span>
          </div>
          Devuelve todos los medidores registrados.
        </li>
        <li class="list-group-item">
          <div class="d-flex justify-content-between">
            <div><strong>POST</strong> /api/medidores</div>
            <span class="badge bg-success">Crear</span>
          </div>
          Registra un nuevo medidor.
        </li>
      </ul>

      <!-- QR -->
      <h6><i class="bi bi-qr-code-scan"></i> Códigos QR</h6>
      <ul class="list-group mb-3">
        <li class="list-group-item">
          <div class="d-flex justify-content-between">
            <div><strong>GET</strong> /api/qr</div>
            <span class="badge bg-primary">Listado</span>
          </div>
          Devuelve los códigos QR generados.
        </li>
        <li class="list-group-item">
          <div class="d-flex justify-content-between">
            <div><strong>POST</strong> /api/qr</div>
            <span class="badge bg-success">Generar</span>
          </div>
          Genera un nuevo código QR.
        </li>
      </ul>

      <!-- Reportes -->
      <h6><i class="bi bi-graph-up-arrow"></i> Reportes</h6>
      <ul class="list-group mb-3">
        <li class="list-group-item">
          <div class="d-flex justify-content-between">
            <div><strong>GET</strong> /api/reporte/consumo</div>
            <span class="badge bg-primary">Consumo</span>
          </div>
          Devuelve el reporte de consumo por medidor.
        </li>
        <li class="list-group-item">
          <div class="d-flex justify-content-between">
            <div><strong>GET</strong> /api/reporte/oee</div>
            <span class="badge bg-primary">OEE</span>
          </div>
          Devuelve datos de eficiencia (OEE).
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import Breadcrumb from '@/components/Breadcrumb.vue'
</script>
