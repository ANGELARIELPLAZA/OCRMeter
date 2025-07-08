const Incidencia = require('../models/Incidencia')

// Crear una nueva incidencia
exports.crearIncidencia = async (req, res) => {
  try {
    const { medicionId, comentario, usuario, asignadoA } = req.body

    if (!medicionId || !comentario || !usuario || !asignadoA) {
      return res.status(400).json({ message: 'Faltan datos requeridos' })
    }

    const nueva = new Incidencia({
      medicionId,
      comentario,
      usuario,   // quien reporta
      asignadoA  // a quién se asigna
    })

    await nueva.save()

    res.status(201).json({ message: 'Incidencia creada', incidencia: nueva })
  } catch (err) {
    console.error('❌ Error al crear incidencia:', err)
    res.status(500).json({ message: 'Error al crear incidencia' })
  }
}

// Obtener incidencias por ID de medición (opcional)
exports.obtenerPorMedicion = async (req, res) => {
  try {
    const { medicionId } = req.params

    const incidencias = await Incidencia.find({ medicionId }).sort({ fecha: -1 })

    res.status(200).json(incidencias)
  } catch (error) {
    console.error('❌ Error al obtener incidencias:', error)
    res.status(500).json({ message: 'Error interno del servidor', error: error.message })
  }
}
