
const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: 'Acceso denegado' });

    try {
        const verified = jwt.verify(token, config.secret);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Token inválido' });
    }
};
