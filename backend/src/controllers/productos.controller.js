// src/controllers/productos.controller.js
const { validationResult } = require('express-validator');
const pool = require('../config/database');
const { cloudinary } = require('../config/cloudinary');

// Buscar productos (solo validados y visibles)
const buscarProductos = async (req, res) => {
  const { nombre, marca, fabricante, codigo_barras, sabor_variante, page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;
  const params = [];
  const condiciones = ["p.estado = 'validado'", "p.visible = true"];

  if (nombre) { params.push(`%${nombre}%`); condiciones.push(`p.nombre ILIKE $${params.length}`); }
  if (marca) { params.push(`%${marca}%`); condiciones.push(`p.marca ILIKE $${params.length}`); }
  if (fabricante) { params.push(`%${fabricante}%`); condiciones.push(`p.fabricante ILIKE $${params.length}`); }
  if (codigo_barras) { params.push(codigo_barras); condiciones.push(`p.codigo_barras = $${params.length}`); }
  if (sabor_variante) { params.push(`%${sabor_variante}%`); condiciones.push(`p.sabor_variante ILIKE $${params.length}`); }

  const where = condiciones.join(' AND ');

  try {
    params.push(limit, offset);
    const query = `
      SELECT p.*,
        u.nombre AS subido_por_nombre,
        json_agg(
          json_build_object(
            'id', v.id,
            'tipo', v.tipo_validacion,
            'validador', uv.nombre || ' ' || uv.apellido,
            'comunidad', uv.comunidad,
            'fecha', v.created_at,
            'es_revalidacion', v.es_revalidacion
          )
        ) FILTER (WHERE v.id IS NOT NULL) AS validaciones
      FROM productos p
      LEFT JOIN users u ON p.subido_por = u.id
      LEFT JOIN validaciones v ON v.producto_id = p.id
      LEFT JOIN users uv ON v.validador_id = uv.id
      WHERE ${where}
      GROUP BY p.id, u.nombre
      ORDER BY p.updated_at DESC
      LIMIT $${params.length - 1} OFFSET $${params.length}
    `;

    const countQuery = `SELECT COUNT(*) FROM productos p WHERE ${where}`;
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
        ) FILTER (WHERE ii.id IS NOT NULL) AS info_intermedia
      FROM productos p
      LEFT JOIN users u ON p.subido_por = u.id
      LEFT JOIN validaciones v ON v.producto_id = p.id
      LEFT JOIN users uv ON v.validador_id = uv.id
      LEFT JOIN feedback_productos f ON f.producto_id = p.id
      LEFT JOIN info_intermedia ii ON ii.producto_id = p.id
      LEFT JOIN users ui ON ii.usuario_id = ui.id
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

  const { nombre, marca, gramaje, sabor_variante, fabricante, codigo_barras, justificacion } = req.body;

  try {
    const imagen_url = req.file?.path || null;
    const imagen_public_id = req.file?.filename || null;

    const result = await pool.query(
      `INSERT INTO productos (nombre, marca, gramaje, sabor_variante, fabricante, codigo_barras, justificacion, imagen_url, imagen_public_id, subido_por, estado, visible)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'pendiente', false)
       RETURNING *`,
      [nombre, marca, gramaje, sabor_variante, fabricante, codigo_barras, justificacion, imagen_url, imagen_public_id, req.usuario.id]
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
