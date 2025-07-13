const mongoose = require('mongoose');

const qrSchema = new mongoose.Schema({
  company: { type: Number, required: true, unique: true },
  id: { type: String, required: true, unique: true },
  nombre: { type: String },
  tipo: { type: String, default: 'Agua' },
  marca: { type: String },
  modelo: { type: String },
  area: { type: String },
  imagen: { type: String }, // puede ser útil guardar el link
  activo: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Qr', qrSchema);
