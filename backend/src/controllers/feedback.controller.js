// src/controllers/feedback.controller.js
const { pool } = require('../config/database');
const cloudinary = require('../config/cloudinary');

// ─── Listar aportaciones de un producto ───────────────────────────────────────
const listarFeedback = async (req, res) => {
  const { productoId } = req.params;
  try {
    const result = await pool.query(`
      SELECT
        f.id, f.supermercado, f.localidad, f.precio, f.observaciones,
        f.foto_url, f.foto_aprobada, f.solicitud_retirada,
        f.verificado, f.created_at,
        u.nombre AS usuario_nombre, u.id AS usuario_id,
        COALESCE(
          json_agg(
            json_build_object(
              'id', r.id,
              'respuesta', r.respuesta,
              'created_at', r.created_at
            ) ORDER BY r.created_at ASC
          ) FILTER (WHERE r.id IS NOT NULL), '[]'
        ) AS respuestas
      FROM feedback_productos f
      JOIN users u ON f.usuario_id = u.id
      LEFT JOIN respuestas_feedback r ON r.feedback_id = f.id
      WHERE f.producto_id = $1
      GROUP BY f.id, u.nombre, u.id
      ORDER BY f.created_at DESC
    `, [productoId]);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener aportaciones' });
  }
};

// ─── Crear aportación ─────────────────────────────────────────────────────────
const crearFeedback = async (req, res) => {
  const { productoId } = req.params;
  const { supermercado, localidad, precio, observaciones } = req.body;
  const usuarioId = req.usuario.id;

  if (!supermercado || !localidad) {
    return res.status(400).json({ error: 'Supermercado y localidad son obligatorios' });
  }

  try {
    let foto_url = null;
    let foto_public_id = null;

    if (req.file) {
      foto_url = req.file.path;
      foto_public_id = req.file.filename;
    }

    const result = await pool.query(`
      INSERT INTO feedback_productos
        (producto_id, usuario_id, supermercado, localidad, precio, observaciones, foto_url, foto_public_id, foto_aprobada, verificado)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, false, false)
      RETURNING id
    `, [productoId, usuarioId, supermercado, localidad, precio || null, observaciones || null, foto_url, foto_public_id]);

    res.status(201).json({ id: result.rows[0].id, message: 'Aportación creada correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear la aportación' });
  }
};

// ─── Borrar aportación ────────────────────────────────────────────────────────
const borrarFeedback = async (req, res) => {
  const { feedbackId } = req.params;
  const usuarioId = req.usuario.id;
  const rol = req.usuario.rol;

  try {
    const check = await pool.query('SELECT * FROM feedback_productos WHERE id = $1', [feedbackId]);
    if (check.rows.length === 0) return res.status(404).json({ error: 'Aportación no encontrada' });

    const feedback = check.rows[0];

    if (feedback.usuario_id !== usuarioId && rol !== 'administrador') {
      return res.status(403).json({ error: 'No tienes permiso para borrar esta aportación' });
    }

    if (feedback.foto_public_id) {
      await cloudinary.uploader.destroy(feedback.foto_public_id).catch(() => {});
    }

    await pool.query('DELETE FROM feedback_productos WHERE id = $1', [feedbackId]);
    res.json({ message: 'Aportación eliminada' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar la aportación' });
  }
};

// ─── Responder (validador/admin) ──────────────────────────────────────────────
const responderFeedback = async (req, res) => {
  const { feedbackId } = req.params;
  const { respuesta } = req.body;
  const usuarioId = req.usuario.id;

  if (!respuesta || respuesta.trim().length === 0) {
    return res.status(400).json({ error: 'La respuesta no puede estar vacía' });
  }

  try {
    const check = await pool.query('SELECT id FROM feedback_productos WHERE id = $1', [feedbackId]);
    if (check.rows.length === 0) return res.status(404).json({ error: 'Aportación no encontrada' });

    await pool.query(
      'INSERT INTO respuestas_feedback (feedback_id, respondido_por, respuesta) VALUES ($1, $2, $3)',
      [feedbackId, usuarioId, respuesta.trim()]
    );

    res.status(201).json({ message: 'Respuesta añadida' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al responder' });
  }
};

// ─── Solicitar retirada (validador) ──────────────────────────────────────────
const solicitarRetirada = async (req, res) => {
  const { feedbackId } = req.params;
  try {
    const result = await pool.query(
      'UPDATE feedback_productos SET solicitud_retirada = true WHERE id = $1 RETURNING id',
      [feedbackId]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Aportación no encontrada' });
    res.json({ message: 'Solicitud de retirada enviada' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al solicitar retirada' });
  }
};

// ─── Desestimar retirada (admin) ──────────────────────────────────────────────
const desestrimarRetirada = async (req, res) => {
  const { feedbackId } = req.params;
  try {
    await pool.query(
      'UPDATE feedback_productos SET solicitud_retirada = false WHERE id = $1',
      [feedbackId]
    );
    res.json({ message: 'Solicitud desestimada' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al desestimar' });
  }
};

// ─── Aprobar foto ─────────────────────────────────────────────────────────────
const aprobarFoto = async (req, res) => {
  const { feedbackId } = req.params;
  try {
    const result = await pool.query(
      'UPDATE feedback_productos SET foto_aprobada = true WHERE id = $1 RETURNING id',
      [feedbackId]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'No encontrada' });
    res.json({ message: 'Foto aprobada' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al aprobar foto' });
  }
};

// ─── Rechazar foto ────────────────────────────────────────────────────────────
const rechazarFoto = async (req, res) => {
  const { feedbackId } = req.params;
  try {
    const feedback = await pool.query('SELECT foto_public_id FROM feedback_productos WHERE id = $1', [feedbackId]);
    if (feedback.rows.length === 0) return res.status(404).json({ error: 'No encontrada' });

    if (feedback.rows[0].foto_public_id) {
      await cloudinary.uploader.destroy(feedback.rows[0].foto_public_id).catch(() => {});
    }

    await pool.query(
      'UPDATE feedback_productos SET foto_url = null, foto_public_id = null, foto_aprobada = false WHERE id = $1',
      [feedbackId]
    );
    res.json({ message: 'Foto rechazada' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al rechazar foto' });
  }
};

// ─── Listar fotos pendientes (validador/admin) ────────────────────────────────
const listarFotosPendientes = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT f.id, f.foto_url, f.supermercado, f.localidad, f.created_at,
             p.nombre AS producto_nombre, p.marca AS producto_marca, p.id AS producto_id,
             u.nombre AS usuario_nombre
      FROM feedback_productos f
      JOIN productos p ON f.producto_id = p.id
      JOIN users u ON f.usuario_id = u.id
      WHERE f.foto_url IS NOT NULL AND f.foto_aprobada = false
      ORDER BY f.created_at ASC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener fotos pendientes' });
  }
};

// ─── Listar solicitudes de retirada (admin) ───────────────────────────────────
const listarSolicitudesRetirada = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT f.id, f.supermercado, f.localidad, f.precio, f.observaciones,
             f.foto_url, f.foto_aprobada, f.created_at,
             p.nombre AS producto_nombre, p.marca AS producto_marca, p.id AS producto_id,
             u.nombre AS usuario_nombre
      FROM feedback_productos f
      JOIN productos p ON f.producto_id = p.id
      JOIN users u ON f.usuario_id = u.id
      WHERE f.solicitud_retirada = true
      ORDER BY f.created_at ASC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener solicitudes' });
  }
};

module.exports = {
  listarFeedback, crearFeedback, borrarFeedback,
  responderFeedback, solicitarRetirada, desestrimarRetirada,
  aprobarFoto, rechazarFoto, listarFotosPendientes, listarSolicitudesRetirada,
};
