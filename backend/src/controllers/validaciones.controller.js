// src/controllers/validaciones.controller.js
const pool = require('../config/database');
const { enviarNotificacionValidacion } = require('../services/email.service');

const validarProducto = async (req, res) => {
  const { id } = req.params;
  const { tipo_validacion, notas, aprobar } = req.body;

  if (!['ingredientes_verificables', 'certificacion_externa', 'certificacion_completa'].includes(tipo_validacion) && aprobar) {
    return res.status(400).json({ error: 'Tipo de validación inválido' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const prod = await client.query('SELECT * FROM productos WHERE id = $1', [id]);
    if (!prod.rows[0]) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    if (prod.rows[0].estado !== 'pendiente') {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Este producto ya fue procesado' });
    }

    if (aprobar) {
      // Fecha de expiración: 2 meses desde hoy
      const fecha_expiracion = new Date();
      fecha_expiracion.setMonth(fecha_expiracion.getMonth() + 2);

      await client.query(
        `INSERT INTO validaciones (producto_id, validador_id, tipo_validacion, notas, es_revalidacion, fecha_expiracion)
         VALUES ($1, $2, $3, $4, false, $5)`,
        [id, req.usuario.id, tipo_validacion, notas, fecha_expiracion]
      );

      await client.query(
        "UPDATE productos SET estado = 'validado', visible = true, updated_at = NOW() WHERE id = $1",
        [id]
      );
    } else {
      // Rechazar
      await client.query(
        "UPDATE productos SET estado = 'rechazado', visible = false, updated_at = NOW() WHERE id = $1",
        [id]
      );
    }

    await client.query('COMMIT');

    // Notificar al usuario que lo subió
    try {
      const usuario = await pool.query(
        'SELECT u.email, u.nombre, p.nombre AS producto FROM users u JOIN productos p ON p.subido_por = u.id WHERE p.id = $1',
        [id]
      );
      if (usuario.rows[0]) {
        await enviarNotificacionValidacion(usuario.rows[0], aprobar);
      }
    } catch (emailErr) {
      console.error('Error enviando email (no crítico):', emailErr);
    }

    res.json({
      mensaje: aprobar ? '✅ Producto validado y publicado correctamente' : '❌ Producto rechazado',
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error en validación:', err);
    res.status(500).json({ error: 'Error al procesar la validación' });
  } finally {
    client.release();
  }
};

const revalidarProducto = async (req, res) => {
  const { id } = req.params;
  const { tipo_validacion, notas } = req.body;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const prod = await client.query('SELECT * FROM productos WHERE id = $1', [id]);
    if (!prod.rows[0] || prod.rows[0].estado !== 'validado') {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Producto no válido para revalidación' });
    }

    const fecha_expiracion = new Date();
    fecha_expiracion.setMonth(fecha_expiracion.getMonth() + 2);

    await client.query(
      `INSERT INTO validaciones (producto_id, validador_id, tipo_validacion, notas, es_revalidacion, fecha_expiracion)
       VALUES ($1, $2, $3, $4, true, $5)`,
      [id, req.usuario.id, tipo_validacion, notas, fecha_expiracion]
    );

    await client.query('UPDATE productos SET updated_at = NOW() WHERE id = $1', [id]);
    await client.query('COMMIT');

    res.json({ mensaje: '✅ Producto revalidado correctamente' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error en revalidación:', err);
    res.status(500).json({ error: 'Error al revalidar el producto' });
  } finally {
    client.release();
  }
};

// Productos que necesitan revalidación (para el panel del validador)
const productosParaRevalidar = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT DISTINCT p.*, v.fecha_expiracion, v.tipo_validacion,
        EXTRACT(DAY FROM v.fecha_expiracion - NOW()) AS dias_restantes
      FROM productos p
      JOIN validaciones v ON v.producto_id = p.id
      WHERE p.estado = 'validado'
        AND v.id = (SELECT id FROM validaciones WHERE producto_id = p.id ORDER BY created_at DESC LIMIT 1)
        AND v.validador_id = $1
        AND v.fecha_expiracion <= NOW() + INTERVAL '15 days'
      ORDER BY v.fecha_expiracion ASC`,
      [req.usuario.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error obteniendo productos para revalidar:', err);
    res.status(500).json({ error: 'Error al obtener productos para revalidar' });
  }
};

// Mis validaciones (historial del validador)
const misValidaciones = async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;
  try {
    const result = await pool.query(
      `SELECT v.*, p.nombre AS producto_nombre, p.marca AS producto_marca, p.imagen_url
      FROM validaciones v
      JOIN productos p ON v.producto_id = p.id
      WHERE v.validador_id = $1
      ORDER BY v.created_at DESC
      LIMIT $2 OFFSET $3`,
      [req.usuario.id, limit, offset]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error obteniendo mis validaciones:', err);
    res.status(500).json({ error: 'Error al obtener tus validaciones' });
  }
};

module.exports = { validarProducto, revalidarProducto, productosParaRevalidar, misValidaciones };
