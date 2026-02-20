// src/routes/reportes.routes.js
const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { verificarToken } = require('../middleware/auth.middleware');

// Suscribirse a reportes
router.put('/suscripcion', verificarToken, async (req, res) => {
  const { tipo } = req.body; // 'ninguno', 'semanal', 'mensual'
  if (!['ninguno', 'semanal', 'mensual'].includes(tipo)) {
    return res.status(400).json({ error: 'Tipo inválido' });
  }
  try {
    await pool.query('UPDATE users SET suscripcion_reporte = $1 WHERE id = $2', [tipo, req.usuario.id]);
    res.json({ mensaje: `Suscripción actualizada a: ${tipo}` });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar suscripción' });
  }
});

module.exports = router;
