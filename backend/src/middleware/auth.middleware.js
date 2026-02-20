// src/middleware/auth.middleware.js
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

const verificarToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const result = await pool.query(
      'SELECT id, nombre, apellido, email, rol, comunidad, activo FROM users WHERE id = $1',
      [decoded.id]
    );
    if (!result.rows[0] || !result.rows[0].activo) {
      return res.status(401).json({ error: 'Usuario no encontrado o inactivo' });
    }
    req.usuario = result.rows[0];
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};

const requiereRol = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.usuario.rol)) {
      return res.status(403).json({ error: 'No tienes permisos para esta acción' });
    }
    next();
  };
};

module.exports = { verificarToken, requiereRol };
