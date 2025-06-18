
const mongoose = require('mongoose');

const scanSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    photoUrl: String,
    comentario: String,
    escaneadoPor: String
});

module.exports = mongoose.model('Scan', scanSchema);
