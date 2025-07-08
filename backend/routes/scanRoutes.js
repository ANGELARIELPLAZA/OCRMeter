const express = require('express');
const router = express.Router();
const scanController = require('../controllers/scanController');

router.post('/', scanController.guardarMedicion);
router.get('/:id/historial', scanController.obtenerHistorialPorId)

// Endpoint para consultar el historial (timeline / reporte)
router.get('/reporte', scanController.reporteFiltrado)

router.patch('/update/:id', scanController.estatus);


module.exports = router;
