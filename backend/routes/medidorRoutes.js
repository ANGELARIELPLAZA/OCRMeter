const express = require('express');
const router = express.Router();
const medidorController = require('../controllers/medidorController');
const auth = require('../middleware/authMiddleware');

router.post('/', auth, medidorController.crearMedidor);
router.get('/', auth, medidorController.obtenerMedidores);
router.put('/:id', auth, medidorController.actualizarMedidor);
router.delete('/:id', auth, medidorController.eliminarMedidor);

module.exports = router;
