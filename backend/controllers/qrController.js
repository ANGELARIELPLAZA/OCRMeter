const Qr = require('../models/Qr');

// GET todos los QR
exports.obtenerTodos = async (req, res) => {
  try {
    const qrs = await Qr.find();
    res.json(qrs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST crear nuevo QR
exports.crear = async (req, res) => {
  try {
    const nuevoQr = new Qr(req.body);
    const qrGuardado = await nuevoQr.save();
    res.status(201).json(qrGuardado);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// PUT actualizar QR por ID de Mongo
exports.actualizar = async (req, res) => {
  try {
    const qrActualizado = await Qr.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(qrActualizado);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// PUT deshabilitar (cambia `activo: false`)
exports.deshabilitar = async (req, res) => {
  try {
    const qr = await Qr.findByIdAndUpdate(req.params.id, { activo: false }, { new: true });
    res.json(qr);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


exports.contar = async (req, res) => {
  try {
    // ✅ Correcto
    const total = await Qr.countDocuments();
    res.json({ total });
  } catch (err) {
    console.error('❌ Error al contar QRs:', err.message);
    res.status(500).json({ message: 'Error al contar los QRs' });
  }
};
// GET buscar por ID (campo personalizado)
exports.buscarPorId = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: 'Falta el parámetro id.' });
  }

  try {
    const qr = await Qr.findOne({ id });
    if (!qr) {
      return res.status(404).json({ message: 'QR no encontrado' });
    }
    res.json(qr);
  } catch (err) {
    console.error('❌ Error al buscar QR:', err.message);
    res.status(500).json({ message: 'Error al buscar el QR' });
  }
};
