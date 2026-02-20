// src/controllers/feedback.controller.js
const pool = require('../config/database');

const agregarFeedback = async (req, res) => {
  const { producto_id } = req.params;
  const { supermercado, localidad, notas } = req.body;

  if (!supermercado || !localidad) {
    return res.status(400).json({ error: 'Supermercado y localidad son obligatorios' });
  }

  try {
    const prod = await pool.query("SELECT id FROM productos WHERE id = $1 AND estado = 'validado'", [producto_id]);
    if (!prod.rows[0]) return res.status(404).json({ error: 'Producto no encontrado o no validado' });

    const result = await pool.query(
      `INSERT INTO feedback_productos (producto_id, usuario_id, supermercado, localidad, notas)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [producto_id, req.usuario.id, supermercado, localidad, notas]
    );

    res.status(201).json({ feedback: result.rows[0] });
  } catch (err) {
    console.error('Error agregando feedback:', err);
    res.status(500).json({ error: 'Error al agregar feedback' });
  }
};

const agregarInfoIntermedia = async (req, res) => {
  const { producto_id } = req.params;
  const { informacion } = req.body;

  if (!informacion) return res.status(400).json({ error: 'La información es obligatoria' });

  try {
    const prod = await pool.query("SELECT id FROM productos WHERE id = $1 AND estado = 'pendiente'", [producto_id]);
    if (!prod.rows[0]) return res.status(404).json({ error: 'Producto no encontrado o no está pendiente' });

    const result = await pool.query(
      `INSERT INTO info_intermedia (producto_id, usuario_id, informacion) VALUES ($1, $2, $3) RETURNING *`,
      [producto_id, req.usuario.id, informacion]
    );

    res.status(201).json({ info: result.rows[0] });
  } catch (err) {
    console.error('Error agregando info intermedia:', err);
    res.status(500).json({ error: 'Error al agregar información' });
  }
};

const verificarFeedback = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('UPDATE feedback_productos SET verificado = true WHERE id = $1', [id]);
    res.json({ mensaje: 'Feedback verificado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al verificar feedback' });
  }
};

module.exports = { agregarFeedback, agregarInfoIntermedia, verificarFeedback };
