const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');

// Obtener todos los usuarios
router.get('/', auth, userController.getAllUsers);

router.get('/count', auth, userController.getUserCount);  // primero

// Obtener un usuario por ID
router.get('/:id', auth, userController.getUserById);

// 🔧 Actualizar un usuario por ID
router.put('/:id', auth, userController.updateUser);

// 🗑 Eliminar un usuario por ID
router.delete('/:id', auth, userController.deleteUser);


module.exports = router;
