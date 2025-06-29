const Scan = require('../models/Scan');

exports.createScan = async (req, res) => {
  const {
    usuarioResponsable,
    idMedidor,
    valorMedido,
    unidadMedicion,
    comentario,
    evidencia
  } = req.body;

  if (!usuarioResponsable || !idMedidor || !valorMedido || !unidadMedicion) {
    return res.status(400).json({ message: 'Faltan campos obligatorios' });
  }

  try {
    const nuevoScan = new Scan({
      usuarioResponsable,
      idMedidor,
      valorMedido,
      unidadMedicion,
      comentario,
      evidencia
    });

    await nuevoScan.save();
    res.status(201).json({ message: 'Escaneo registrado correctamente', scan: nuevoScan });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getScans = async (req, res) => {
  const { idMedidor, usuarioResponsable, fechaInicio, fechaFin } = req.query;
  const filtro = {};

  if (idMedidor) filtro.idMedidor = idMedidor;
  if (usuarioResponsable) filtro.usuarioResponsable = usuarioResponsable;

  if (fechaInicio || fechaFin) {
    filtro.fechaHora = {};
    if (fechaInicio) filtro.fechaHora.$gte = new Date(fechaInicio);
    if (fechaFin) filtro.fechaHora.$lte = new Date(fechaFin);
  }

  try {
    const scans = await Scan.find(filtro).sort({ fechaHora: -1 }); // últimos primero
    res.status(200).json(scans);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};