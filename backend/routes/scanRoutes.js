
const express = require('express');
const router = express.Router();
const scanController = require('../controllers/scanController');
const auth = require('../middleware/authMiddleware');

router.post('/', auth, scanController.createScan);
router.get('/', auth, scanController.getScans);

module.exports = router;
