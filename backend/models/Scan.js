const mongoose = require('mongoose');

const scanSchema = new mongoose.Schema({
  id: String,
  usuario: String,
  fecha: String,
  area: String,
  tipo: String,
  lectura: Number,
  unidad: String,
  comentario: String,
  imagen: String, // base64 o ruta
  estatus: {
    type: String,
    default: 'Por validar'
  }
}, { timestamps: true });

module.exports = mongoose.model('Scan', scanSchema);
