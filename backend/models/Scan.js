const mongoose = require('mongoose');

const scanSchema = new mongoose.Schema({
  usuarioResponsable: { type: String, required: true },     // quien hizo el escaneo
  idMedidor: { type: String, required: true },              // ID del medidor escaneado
  valorMedido: { type: Number, required: true },
  unidadMedicion: { type: String, required: true },
  comentario: { type: String },
  evidencia: { type: String },                              // base64 o URL de imagen
  fechaHora: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Scan', scanSchema);
