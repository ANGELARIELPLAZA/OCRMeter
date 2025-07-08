const mongoose = require('mongoose')

const incidenciaSchema = new mongoose.Schema({
  medicionId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Medicion' },
  comentario: { type: String, required: true },
  usuario: { type: String, required: true },
  asignadoA: { type: String, required: true },       // A quién se le asigna la incidencia
  fecha: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Incidencia', incidenciaSchema)
