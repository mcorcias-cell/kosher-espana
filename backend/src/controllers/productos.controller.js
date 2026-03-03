// src/controllers/productos.controller.js
const { validationResult } = require('express-validator');
const pool = require('../config/database');
const { cloudinary } = require('../config/cloudinary');

// Buscar productos (solo validados y visibles)
const buscarProductos = async (req, res) => {
  const { nombre, marca, fabricante, codigo_barras, sabor_variante, categoria_id, page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;
  const params = [];
  const condiciones = ["p.estado = 'validado'", "p.visible = true"];

  if (nombre) { params.push(`%${nombre}%`); condiciones.push(`p.nombre ILIKE $${params.length}`); }
  if (marca) { params.push(`%${marca}%`); condiciones.push(`p.marca ILIKE $${params.length}`); }
  if (fabricante) { params.push(`%${fabricante}%`); condiciones.push(`p.fabricante ILIKE $${params.length}`); }
  if (codigo_barras) { params.push(codigo_barras); condiciones.push(`p.codigo_barras = $${params.length}`); }
  if (sabor_variante) { params.push(`%${sabor_variante}%`); condiciones.push(`p.sabor_variante ILIKE $${params.length}`); }
  if (categoria_id) { params.push(categoria_id); condiciones.push(`EXISTS (SELECT 1 FROM producto_categorias pc WHERE pc.producto_id = p.id AND pc.categoria_id = $${params.length})`); }
  if (req.query.tipo_kosher) { params.push(req.query.tipo_kosher); condiciones.push(`p.tipo_kosher = $${params.length}`); }

  const where = condiciones.join(' AND ');

  try {
    params.push(limit, offset);
    const query = `
      SELECT p.*,
        u.nombre AS subido_por_nombre,
        json_agg(DISTINCT jsonb_build_object('id', c.id, 'nombre', c.nombre, 'icono', c.icono)) FILTER (WHERE c.id IS NOT NULL) AS categorias,
        json_agg(
          json_build_object(
            'id', v.id, 'tipo', v.tipo_validacion,
            'validador', uv.nombre || ' ' || uv.apellido,
            'comunidad', uv.comunidad, 'fecha', v.created_at,
            'es_revalidacion', v.es_revalidacion
          )
        ) FILTER (WHERE v.id IS NOT NULL) AS validaciones
      FROM productos p
      LEFT JOIN users u ON p.subido_por = u.id
      LEFT JOIN producto_categorias pc ON pc.producto_id = p.id
      LEFT JOIN categorias c ON c.id = pc.categoria_id
      LEFT JOIN validaciones v ON v.producto_id = p.id
      LEFT JOIN users uv ON v.validador_id = uv.id
      WHERE ${where}
      GROUP BY p.id, u.nombre
      ORDER BY p.updated_at DESC
      LIMIT $${params.length - 1} OFFSET $${params.length}
    `;

    const countQuery = `SELECT COUNT(DISTINCT p.id) FROM productos p LEFT JOIN producto_categorias pc ON pc.producto_id = p.id WHERE ${where}`;
    const [result, countResult] = await Promise.all([
      pool.query(query, params),
      pool.query(countQuery, params.slice(0, -2)),
    ]);

    res.json({
      productos: result.rows,
      total: parseInt(countResult.rows[0].count),
      pagina: parseInt(page),
      total_paginas: Math.ceil(parseInt(countResult.rows[0].count) / limit),
    });
  } catch (err) {
    console.error('Error buscando productos:', err);
    res.status(500).json({ error: 'Error al buscar productos' });
  }
};

// Obtener un producto por ID
const obtenerProducto = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `SELECT p.*,
        u.nombre AS subido_por_nombre,
        json_agg(
          DISTINCT jsonb_build_object(
            'id', v.id, 'tipo', v.tipo_validacion,
            'validador', uv.nombre || ' ' || uv.apellido,
            'comunidad', uv.comunidad, 'fecha', v.created_at,
            'es_revalidacion', v.es_revalidacion, 'notas', v.notas
          )
        ) FILTER (WHERE v.id IS NOT NULL) AS validaciones,
        json_agg(
          DISTINCT jsonb_build_object(
            'id', f.id, 'supermercado', f.supermercado,
            'localidad', f.localidad, 'notas', f.notas,
            'verificado', f.verificado, 'fecha', f.created_at
          )
        ) FILTER (WHERE f.id IS NOT NULL) AS ubicaciones,
        json_agg(
          DISTINCT jsonb_build_object(
            'id', ii.id, 'informacion', ii.informacion,
            'usuario', ui.nombre, 'fecha', ii.created_at
          )
        ) FILTER (WHERE ii.id IS NOT NULL) AS info_intermedia,
        json_agg(
          DISTINCT jsonb_build_object(
            'id', c.id, 'nombre', c.nombre, 'icono', c.icono
          )
        ) FILTER (WHERE c.id IS NOT NULL) AS categorias
      FROM productos p
      LEFT JOIN users u ON p.subido_por = u.id
      LEFT JOIN validaciones v ON v.producto_id = p.id
      LEFT JOIN users uv ON v.validador_id = uv.id
      LEFT JOIN feedback_productos f ON f.producto_id = p.id
      LEFT JOIN info_intermedia ii ON ii.producto_id = p.id
      LEFT JOIN users ui ON ii.usuario_id = ui.id
      LEFT JOIN producto_categorias pc ON pc.producto_id = p.id
      LEFT JOIN categorias c ON c.id = pc.categoria_id
      WHERE p.id = $1
      GROUP BY p.id, u.nombre`,
      [id]
    );

    if (!result.rows[0]) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    // Si no está validado, solo lo ven admins, validadores, intermedios o el que lo subió
    const producto = result.rows[0];
    if (!producto.visible && req.usuario) {
      const rolesPermitidos = ['administrador', 'validador', 'intermedio'];
      if (!rolesPermitidos.includes(req.usuario.rol) && producto.subido_por !== req.usuario.id) {
        return res.status(403).json({ error: 'No tienes acceso a este producto' });
      }
    } else if (!producto.visible) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(producto);
  } catch (err) {
    console.error('Error obteniendo producto:', err);
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
};

// Subir nuevo producto
const crearProducto = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    if (req.file) await cloudinary.uploader.destroy(req.file.filename);
    return res.status(400).json({ errores: errors.array() });
  }

  const { nombre, marca, gramaje, sabor_variante, fabricante, codigo_barras, justificacion, tipo_kosher } = req.body;

  try {
    const imagen_url = req.file?.path || null;
    const imagen_public_id = req.file?.filename || null;

    const result = await pool.query(
      `INSERT INTO productos (nombre, marca, gramaje, sabor_variante, fabricante, codigo_barras, justificacion, tipo_kosher, imagen_url, imagen_public_id, subido_por, estado, visible)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'pendiente', false)
       RETURNING *`,
      [nombre, marca, gramaje, sabor_variante, fabricante, codigo_barras, justificacion, tipo_kosher || null, imagen_url, imagen_public_id, req.usuario.id]
    );

    res.status(201).json({
      mensaje: 'Producto enviado para validación. Estará visible una vez que un validador lo apruebe.',
      producto: result.rows[0],
    });
  } catch (err) {
    if (req.file) await cloudinary.uploader.destroy(req.file.filename);
    console.error('Error creando producto:', err);
    res.status(500).json({ error: 'Error al crear el producto' });
  }
};

// Obtener productos pendientes (para validadores/intermedios/admins)
const obtenerPendientes = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, u.nombre AS subido_por_nombre, u.email AS subido_por_email,
        json_agg(
          DISTINCT jsonb_build_object('informacion', ii.informacion, 'usuario', ui.nombre, 'fecha', ii.created_at)
        ) FILTER (WHERE ii.id IS NOT NULL) AS info_intermedia
      FROM productos p
      LEFT JOIN users u ON p.subido_por = u.id
      LEFT JOIN info_intermedia ii ON ii.producto_id = p.id
      LEFT JOIN users ui ON ii.usuario_id = ui.id
      WHERE p.estado = 'pendiente'
      GROUP BY p.id, u.nombre, u.email
      ORDER BY p.created_at ASC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error obteniendo pendientes:', err);
    res.status(500).json({ error: 'Error al obtener productos pendientes' });
  }
};

// Mis productos (usuario regular)
const misProductos = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*,
        json_agg(
          jsonb_build_object('tipo', v.tipo_validacion, 'fecha', v.created_at)
        ) FILTER (WHERE v.id IS NOT NULL) AS validaciones
      FROM productos p
      LEFT JOIN validaciones v ON v.producto_id = p.id
      WHERE p.subido_por = $1
      GROUP BY p.id
      ORDER BY p.created_at DESC`,
      [req.usuario.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error obteniendo mis productos:', err);
    res.status(500).json({ error: 'Error al obtener tus productos' });
  }
};

// Retirar/eliminar producto (admin o quien lo subió si está pendiente)
const retirarProducto = async (req, res) => {
  const { id } = req.params;
  try {
    const prod = await pool.query('SELECT * FROM productos WHERE id = $1', [id]);
    if (!prod.rows[0]) return res.status(404).json({ error: 'Producto no encontrado' });

    const p = prod.rows[0];
    const esAdmin = req.usuario.rol === 'administrador';
    const esDueño = p.subido_por === req.usuario.id && p.estado === 'pendiente';

    if (!esAdmin && !esDueño) {
      return res.status(403).json({ error: 'No tienes permiso para retirar este producto' });
    }

    await pool.query("UPDATE productos SET estado = 'retirado', visible = false WHERE id = $1", [id]);
    res.json({ mensaje: 'Producto retirado correctamente' });
  } catch (err) {
    console.error('Error retirando producto:', err);
    res.status(500).json({ error: 'Error al retirar el producto' });
  }
};

module.exports = { buscarProductos, obtenerProducto, crearProducto, obtenerPendientes, misProductos, retirarProducto };

// ─── Borrar producto (admin) con motivo y email opcional ──────────────────────
const borrarProducto = async (req, res) => {
  const { id } = req.params;
  const { motivo, notificar_email } = req.body;

  if (!motivo || motivo.trim().length < 5) {
    return res.status(400).json({ error: 'El motivo de eliminación es obligatorio (mínimo 5 caracteres)' });
  }

  try {
    const prod = await pool.query(
      `SELECT p.*, u.email AS subido_por_email, u.nombre AS subido_por_nombre
       FROM productos p LEFT JOIN users u ON p.subido_por = u.id
       WHERE p.id = $1`, [id]
    );
    if (!prod.rows[0]) return res.status(404).json({ error: 'Producto no encontrado' });

    const producto = prod.rows[0];

    // Borrar imagen de Cloudinary si existe
    if (producto.imagen_public_id) {
      await cloudinary.uploader.destroy(producto.imagen_public_id).catch(() => {});
    }

    // Borrar producto (cascada borrará validaciones, feedback, categorias)
    await pool.query('DELETE FROM productos WHERE id = $1', [id]);

    // Email opcional
    if (notificar_email && producto.subido_por_email) {
      try {
        const nodemailer = require('nodemailer');
        const transporter = nodemailer.createTransport({
          host: 'smtp.resend.com',
          port: 465,
          secure: true,
          auth: { user: 'resend', pass: process.env.RESEND_API_KEY },
        });
        await transporter.sendMail({
          from: process.env.EMAIL_FROM,
          to: producto.subido_por_email,
          subject: `Tu producto "${producto.nombre}" ha sido eliminado de Kosher España`,
          html: `
            <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
              <h2>✡️ Kosher España</h2>
              <p>Hola <strong>${producto.subido_por_nombre}</strong>,</p>
              <p>Te informamos que el producto <strong>${producto.nombre} (${producto.marca})</strong> ha sido eliminado de la plataforma por el equipo de administración.</p>
              <div style="background: #f7fafc; border-left: 4px solid #2b6cb0; padding: 12px 16px; border-radius: 4px; margin: 16px 0;">
                <strong>Motivo:</strong><br/>${motivo}
              </div>
              <p>Si tienes alguna pregunta puedes contactarnos respondiendo a este email.</p>
              <p>El equipo de Kosher España</p>
            </div>
          `,
        });
      } catch (emailErr) {
        console.error('Error enviando email de notificación:', emailErr.message);
        // No fallar la operación por un error de email
      }
    }

    res.json({ mensaje: 'Producto eliminado correctamente' });
  } catch (err) {
    console.error('Error borrando producto:', err);
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
};

// ─── Actualizar beraja (validador/admin) ──────────────────────────────────────
const actualizarBeraja = async (req, res) => {
  const { id } = req.params;
  const { beraja } = req.body;
  const BERAJOT_VALIDAS = ['hamotzi', 'mezonot', 'peri_haguefen', 'haetz', 'haadama', 'sheakol'];

  if (beraja && !BERAJOT_VALIDAS.includes(beraja)) {
    return res.status(400).json({ error: 'Beraja no válida' });
  }

  try {
    const result = await pool.query(
      'UPDATE productos SET beraja = $1, updated_at = NOW() WHERE id = $2 RETURNING id',
      [beraja || null, id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json({ mensaje: 'Beraja actualizada correctamente' });
  } catch (err) {
    console.error('Error actualizando beraja:', err);
    res.status(500).json({ error: 'Error al actualizar la beraja' });
  }
};

// ─── Edición masiva (admin) ───────────────────────────────────────────────────
const edicionMasiva = async (req, res) => {
  const { producto_ids, campo, valor, categoria_ids, modo_categoria } = req.body;
  // modo_categoria: 'agregar' | 'reemplazar'

  if (!producto_ids || producto_ids.length === 0) {
    return res.status(400).json({ error: 'Selecciona al menos un producto' });
  }

  const CAMPOS_PERMITIDOS = ['tipo_kosher', 'beraja'];
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    let actualizados = 0;

    if (campo === 'categoria') {
      // Edición masiva de categorías
      for (const pid of producto_ids) {
        if (modo_categoria === 'reemplazar') {
          await client.query('DELETE FROM producto_categorias WHERE producto_id = $1', [pid]);
        }
        for (const cid of (categoria_ids || [])) {
          const existe = await client.query(
            'SELECT 1 FROM producto_categorias WHERE producto_id = $1 AND categoria_id = $2',
            [pid, cid]
          );
          if (existe.rows.length === 0) {
            await client.query(
              'INSERT INTO producto_categorias (producto_id, categoria_id) VALUES ($1, $2)',
              [pid, cid]
            );
          }
        }
        actualizados++;
      }
    } else if (CAMPOS_PERMITIDOS.includes(campo)) {
      const placeholders = producto_ids.map((_, i) => `$${i + 2}`).join(',');
      await client.query(
        `UPDATE productos SET ${campo} = $1, updated_at = NOW() WHERE id IN (${placeholders})`,
        [valor || null, ...producto_ids]
      );
      actualizados = producto_ids.length;
    } else {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Campo no permitido para edición masiva' });
    }

    await client.query('COMMIT');
    res.json({ mensaje: `${actualizados} productos actualizados correctamente` });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error en edición masiva:', err);
    res.status(500).json({ error: 'Error en edición masiva' });
  } finally {
    client.release();
  }
};

// ─── Listar todos los productos para admin (con filtros) ──────────────────────
const listarProductosAdmin = async (req, res) => {
  const { nombre, marca, estado, page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;
  const params = [];
  const condiciones = [];

  if (nombre) { params.push(`%${nombre}%`); condiciones.push(`p.nombre ILIKE $${params.length}`); }
  if (marca) { params.push(`%${marca}%`); condiciones.push(`p.marca ILIKE $${params.length}`); }
  if (estado) { params.push(estado); condiciones.push(`p.estado = $${params.length}`); }

  const where = condiciones.length > 0 ? 'WHERE ' + condiciones.join(' AND ') : '';

  try {
    params.push(limit, offset);
    const result = await pool.query(`
      SELECT p.id, p.nombre, p.marca, p.estado, p.tipo_kosher, p.beraja,
             p.imagen_url, p.created_at, u.nombre AS subido_por_nombre,
             json_agg(DISTINCT jsonb_build_object('nombre', c.nombre, 'icono', c.icono))
               FILTER (WHERE c.id IS NOT NULL) AS categorias
      FROM productos p
      LEFT JOIN users u ON p.subido_por = u.id
      LEFT JOIN producto_categorias pc ON pc.producto_id = p.id
      LEFT JOIN categorias c ON c.id = pc.categoria_id
      ${where}
      GROUP BY p.id, u.nombre
      ORDER BY p.created_at DESC
      LIMIT $${params.length - 1} OFFSET $${params.length}
    `, params);

    const countResult = await pool.query(
      `SELECT COUNT(DISTINCT p.id) FROM productos p ${where}`,
      params.slice(0, -2)
    );

    res.json({
      productos: result.rows,
      total: parseInt(countResult.rows[0].count),
      total_paginas: Math.ceil(parseInt(countResult.rows[0].count) / limit),
    });
  } catch (err) {
    console.error('Error listando productos admin:', err);
    res.status(500).json({ error: 'Error al listar productos' });
  }
};

// ─── Actualizar producto completo (admin) ─────────────────────────────────────
const actualizarProductoAdmin = async (req, res) => {
  const { id } = req.params;
  const { nombre, marca, fabricante, gramaje, sabor_variante, codigo_barras, tipo_kosher, beraja, estado } = req.body;

  if (!nombre || !marca) return res.status(400).json({ error: 'Nombre y marca son obligatorios' });

  const ESTADOS = ['validado', 'pendiente', 'rechazado', 'retirado'];
  if (estado && !ESTADOS.includes(estado)) return res.status(400).json({ error: 'Estado no válido' });

  try {
    const result = await pool.query(
      `UPDATE productos SET
        nombre = $1, marca = $2, fabricante = $3, gramaje = $4,
        sabor_variante = $5, codigo_barras = $6, tipo_kosher = $7,
        beraja = $8, estado = $9,
        visible = CASE WHEN $9 = 'validado' THEN true ELSE visible END,
        updated_at = NOW()
       WHERE id = $10 RETURNING id`,
      [nombre, marca, fabricante || null, gramaje || null, sabor_variante || null,
       codigo_barras || null, tipo_kosher || null, beraja || null, estado || 'pendiente', id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json({ mensaje: 'Producto actualizado correctamente' });
  } catch (err) {
    console.error('Error actualizando producto:', err);
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
};

module.exports = {
  buscarProductos, obtenerProducto, crearProducto,
  obtenerPendientes, misProductos, retirarProducto,
  borrarProducto, actualizarBeraja, edicionMasiva, listarProductosAdmin,
  actualizarProductoAdmin,
};