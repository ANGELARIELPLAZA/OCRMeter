const Area = require('../models/Area')

// Crear nueva área
exports.crearArea = async (req, res) => {
  try {
    const { nombre, responsable, ubicacion, descripcion, extensionTelefono, activa } = req.body

    const nuevaArea = new Area({
      nombre,
      responsable,
      ubicacion,
      descripcion,
      extensionTelefono,
      activa
    })

    await nuevaArea.save()
    res.status(201).json(nuevaArea)
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'El área ya existe' })
    }
    console.error(err)
    res.status(500).json({ message: 'Error al crear área' })
  }
}

// Obtener todas las áreas
exports.obtenerAreas = async (req, res) => {
  try {
    const areas = await Area.find().sort({ nombre: 1 })
    res.json(areas)
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener áreas' })
  }
}

// Actualizar área
exports.actualizarArea = async (req, res) => {
  try {
    const { id } = req.params
    const datos = req.body

    const areaActualizada = await Area.findByIdAndUpdate(id, datos, { new: true })

    if (!areaActualizada) {
      return res.status(404).json({ message: 'Área no encontrada' })
    }

    res.json(areaActualizada)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Error al actualizar área' })
  }
}

// Eliminar área
exports.eliminarArea = async (req, res) => {
  try {
    const { id } = req.params
    const area = await Area.findByIdAndDelete(id)

    if (!area) {
      return res.status(404).json({ message: 'Área no encontrada' })
    }

    res.json({ message: 'Área eliminada correctamente' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Error al eliminar área' })
  }
}
