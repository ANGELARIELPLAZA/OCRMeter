const mongoose = require('mongoose');

const areaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  descripcion: {
    type: String,
    default: ''
  },
  responsable: {
    type: String, // o podrías usar `mongoose.Schema.Types.ObjectId` si se relaciona con un usuario
    default: ''
  },
  extensionTelefono: {
    type: String,
    default: ''
  },
  ubicacion: {
    type: String,
    default: ''
  },
  activa: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Area', areaSchema);
