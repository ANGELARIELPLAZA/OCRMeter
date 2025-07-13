const express = require('express')
const router = express.Router()
const incidenciaController = require('../controllers/incidenciaController')
const auth = require('../middleware/authMiddleware')

// POST: crear nueva incidencia
router.post('/', auth, incidenciaController.crearIncidencia)

// GET: obtener incidencias asignadas a un usuario (ruta específica primero)
router.get('/asignado/:asignadoA', auth, incidenciaController.obtenerPorAsignado)

// GET: obtener todas las incidencias de una medición (ruta genérica al final)
router.get('/:medicionId', auth, incidenciaController.obtenerPorMedicion)

module.exports = router
