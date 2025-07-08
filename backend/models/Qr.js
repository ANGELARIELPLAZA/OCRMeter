const mongoose = require('mongoose');

const qrSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  nombre: { type: String, required: true },
  tipo: { type: String, default: 'Agua' },
  marca: { type: String, required: true },
  modelo: { type: String, required: true },
  area: { type: String, required: true },
  imagen: { type: String }, // puede ser útil guardar el link
  activo: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Qr', qrSchema);
