const Scan = require('../models/Scan');

exports.guardarMedicion = async (req, res) => {
  try {
    const { id, usuario, fecha, area, tipo, lectura, unidad, comentario, imagen } = req.body;

    const nuevaMedicion = new Scan({
      id,
      usuario,
      fecha,
      area,
      tipo,
      lectura,
      unidad,
      comentario,
      imagen,
      estatus: 'Por validar' // siempre por defecto
    });

    await nuevaMedicion.save();

    res.status(201).json({ message: '✅ Medición guardada correctamente', medicion: nuevaMedicion });
  } catch (err) {
    console.error('❌ Error al guardar medición:', err);
    res.status(500).json({ error: 'Error al guardar la medición' });
  }
};


exports.obtenerHistorialPorId = async (req, res) => {
  try {
    const { id } = req.params
    const mediciones = await Scan.find({ id }).sort({ createdAt: -1 }) // más recientes primero
    res.status(200).json(mediciones)
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener historial' })
  }
}


// Obtener escaneos con filtro por fecha y tipo
exports.reporteFiltrado = async (req, res) => {
  try {
    const { fechaInicio, fechaFin, tipo } = req.query

    const filtro = {}

    if (fechaInicio && fechaFin) {
      filtro.fecha = { $gte: fechaInicio, $lte: fechaFin }
    }

    if (tipo) {
      filtro.tipo = tipo
    }

    const resultados = await Scan.find(filtro).sort({ fecha: 1 })
    res.json(resultados)
  } catch (err) {
    console.error('❌ Error en reporte:', err)
    res.status(500).json({ message: 'Error al obtener el reporte' })
  }
}

exports.estatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { estatus } = req.body;

    if (!estatus) {
      return res.status(400).json({ message: 'Estatus es requerido' });
    }

    const actualizado = await Scan.findByIdAndUpdate(
      id,
      { estatus },
      { new: true }
    );

    if (!actualizado) {
      return res.status(404).json({ message: 'Medición no encontrada' });
    }

    res.status(200).json({ message: '✅ Estatus actualizado correctamente', medicion: actualizado });
  } catch (err) {
    console.error('❌ Error al actualizar estatus:', err);
    res.status(500).json({ message: 'Error al actualizar estatus' });
  }
};
