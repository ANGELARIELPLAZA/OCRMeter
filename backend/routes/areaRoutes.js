const express = require('express');
const router = express.Router();
const areaController = require('../controllers/areaController');
const auth = require('../middleware/authMiddleware');

// Crear área
router.post('/', auth, areaController.crearArea);

// Obtener todas las áreas
router.get('/', auth, areaController.obtenerAreas);

// Actualizar área
router.put('/:id', auth, areaController.actualizarArea);

// Eliminar área
router.delete('/:id', auth, areaController.eliminarArea);

module.exports = router;
