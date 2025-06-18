const express = require('express');
const router = express.Router();
const medidorController = require('../controllers/medidorController');

router.post('/crear', medidorController.crearMedidor);
router.get('/', medidorController.obtenerMedidores); // todos o con filtros
router.get('/:id', medidorController.obtenerMedidorPorId); // uno por ID único

module.exports = router;

