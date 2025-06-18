
const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
    const users = await User.find().select('-password');
    res.json(users);
};

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
