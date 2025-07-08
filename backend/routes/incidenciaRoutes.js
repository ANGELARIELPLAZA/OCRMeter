const express = require('express')
const router = express.Router()
const incidenciaController = require('../controllers/incidenciaController')

// POST: crear nueva incidencia
router.post('/', incidenciaController.crearIncidencia)

// GET: obtener todas las incidencias de una medición
router.get('/:medicionId', incidenciaController.obtenerPorMedicion)

module.exports = router
