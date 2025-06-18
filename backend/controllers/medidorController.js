const Medidor = require('../models/Medidor');
const QRCode = require('qrcode');

function generarIDMedidor() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let id = '';
    for (let i = 0; i < 6; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
}

exports.crearMedidor = async (req, res) => {
    const { nombre, utilidad, unidad, marca, modelo } = req.body;

    if (!nombre || !utilidad || !unidad || !marca || !modelo) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const idGenerado = generarIDMedidor();

    try {
        // Generar QR basado en el ID
        const qrBase64 = await QRCode.toDataURL(`MEDIDOR-${idGenerado}`);

        const nuevoMedidor = new Medidor({
            id: idGenerado,
            nombre,
            utilidad,
            unidad,
            marca,
            modelo,
            qr: qrBase64
        });

        await nuevoMedidor.save();

        res.status(201).json({ message: 'Medidor creado correctamente', medidor: nuevoMedidor });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
// Obtener todos o con filtros
exports.obtenerMedidores = async (req, res) => {
    try {
        const filtros = {};

        if (req.query.utilidad) filtros.utilidad = req.query.utilidad;
        if (req.query.marca) filtros.marca = req.query.marca;
        if (req.query.modelo) filtros.modelo = req.query.modelo;

        const medidores = await Medidor.find(filtros);
        res.status(200).json(medidores);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Obtener por ID único generado
exports.obtenerMedidorPorId = async (req, res) => {
    try {
        const medidor = await Medidor.findOne({ id: req.params.id });
        if (!medidor) return res.status(404).json({ message: 'Medidor no encontrado' });
        res.status(200).json(medidor);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};