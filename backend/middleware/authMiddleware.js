const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Acceso denegado' });
  }

  const token = authHeader.split(' ')[1]; // Extrae solo el token después de "Bearer "

  try {
    const verified = jwt.verify(token, config.secret);
    req.user = verified; // Puedes acceder a req.user en los controladores
    next();
  } catch (err) {
    res.status(403).json({ message: 'Token inválido' });
  }
};

