const Medidor = require('../models/Medidor');

// Crear
exports.crearMedidor = async (req, res) => {
  try {
    const { id, nombre, tipo, marca, modelo } = req.body;

    if (!id || !nombre || !marca || !modelo) {
      return res.status(400).json({ message: 'Faltan campos obligatorios.' });
    }

    // Verificar si ya existe ese ID
    const existente = await Medidor.findOne({ id });
    if (existente) {
      return res.status(400).json({ message: 'Ya existe un medidor con ese ID.' });
    }

    const nuevo = new Medidor({ id, nombre, tipo, marca, modelo });
    await nuevo.save();
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear medidor', error });
  }
};

// Listar todos
exports.obtenerMedidores = async (req, res) => {
  try {
    const medidores = await Medidor.find().sort({ createdAt: -1 });
    res.json(medidores);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener medidores', error });
  }
};

// Actualizar
exports.actualizarMedidor = async (req, res) => {
  try {
    const { id } = req.params;
    const actualizado = await Medidor.findOneAndUpdate({ id }, req.body, { new: true });

    if (!actualizado) return res.status(404).json({ message: 'Medidor no encontrado.' });

    res.json(actualizado);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar', error });
  }
};

// Eliminar
exports.eliminarMedidor = async (req, res) => {
  try {
    const { id } = req.params;
    const eliminado = await Medidor.findOneAndDelete({ id });

    if (!eliminado) return res.status(404).json({ message: 'Medidor no encontrado.' });

    res.json({ message: 'Medidor eliminado correctamente.' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar', error });
  }
};
