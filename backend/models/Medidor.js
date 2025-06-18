const mongoose = require('mongoose');

const medidorSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true }, // ID generado
    nombre: { type: String, required: true },
    utilidad: {
        type: String,
        enum: ['agua', 'electricidad', 'gas', 'aire comprimido'],
        required: true
    },
    unidad: { type: String, required: true },
    marca: { type: String, required: true },
    modelo: { type: String, required: true },
    qr: { type: String, required: true },// aquí guardamos el QR en base64 o URL,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Medidor', medidorSchema);
