const express = require('express');
const router = express.Router();
const qrController = require('../controllers/qrController');
const auth = require('../middleware/authMiddleware');

router.get('/count', auth, qrController.contar);
router.get('/', auth, qrController.obtenerTodos);
router.post('/', auth, qrController.crear);
router.put('/:id', auth, qrController.actualizar);
router.put('/deshabilitar/:id', auth, qrController.deshabilitar);

module.exports = router;
