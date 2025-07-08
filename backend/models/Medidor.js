const mongoose = require('mongoose');

const medidorSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  nombre: {
    type: String,
    required: true
  },
  tipo: {
    type: String,
    default: 'Agua'
  },
  marca: {
    type: String,
    required: true
  },
  modelo: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Medidor', medidorSchema);
