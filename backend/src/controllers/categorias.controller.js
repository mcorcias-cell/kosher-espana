// src/controllers/categorias.controller.js
const pool = require('../config/database');

// Listar todas las categorías activas
const listarCategorias = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT c.*, COUNT(pc.producto_id) AS total_productos
       FROM categorias c
       LEFT JOIN producto_categorias pc ON pc.categoria_id = c.id
       LEFT JOIN productos p ON p.id = pc.producto_id AND p.estado = 'validado' AND p.visible = true
       WHERE c.activa = true
       GROUP BY c.id
       ORDER BY c.orden ASC, c.nombre ASC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error listando categorías:', err);
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
};

// Listar todas (incluyendo inactivas, para admin)
const listarCategoriasAdmin = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT c.*, COUNT(pc.producto_id) AS total_productos
       FROM categorias c
       LEFT JOIN producto_categorias pc ON pc.categoria_id = c.id
       GROUP BY c.id
       ORDER BY c.orden ASC, c.nombre ASC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error listando categorías admin:', err);
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
};

// Crear categoría (solo admin)
const crearCategoria = async (req, res) => {
  const { nombre, descripcion, icono, orden } = req.body;
  if (!nombre) return res.status(400).json({ error: 'El nombre es obligatorio' });

  try {
    const result = await pool.query(
      `INSERT INTO categorias (nombre, descripcion, icono, orden)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [nombre, descripcion, icono || '📦', orden || 0]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(400).json({ error: 'Ya existe una categoría con ese nombre' });
    console.error('Error creando categoría:', err);
    res.status(500).json({ error: 'Error al crear la categoría' });
  }
};

// Actualizar categoría (solo admin)
const actualizarCategoria = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, icono, orden, activa } = req.body;

  try {
    const result = await pool.query(
      `UPDATE categorias SET
        nombre = COALESCE($1, nombre),
        descripcion = COALESCE($2, descripcion),
        icono = COALESCE($3, icono),
        orden = COALESCE($4, orden),
        activa = COALESCE($5, activa)
       WHERE id = $6 RETURNING *`,
      [nombre, descripcion, icono, orden, activa, id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Categoría no encontrada' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error actualizando categoría:', err);
    res.status(500).json({ error: 'Error al actualizar la categoría' });
  }
};

// Eliminar categoría (solo admin)
const eliminarCategoria = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM categorias WHERE id = $1', [id]);
    res.json({ mensaje: 'Categoría eliminada' });
  } catch (err) {
    console.error('Error eliminando categoría:', err);
    res.status(500).json({ error: 'Error al eliminar la categoría' });
  }
};

// Asignar categorías a un producto
const asignarCategorias = async (req, res) => {
  const { id } = req.params; // producto_id
  const { categoria_ids } = req.body; // array de UUIDs

  if (!Array.isArray(categoria_ids)) {
    return res.status(400).json({ error: 'categoria_ids debe ser un array' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    // Borrar las categorías actuales del producto
    await client.query('DELETE FROM producto_categorias WHERE producto_id = $1', [id]);
    // Insertar las nuevas
    for (const catId of categoria_ids) {
      await client.query(
        'INSERT INTO producto_categorias (producto_id, categoria_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
        [id, catId]
      );
    }
    await client.query('COMMIT');
    res.json({ mensaje: 'Categorías actualizadas correctamente' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error asignando categorías:', err);
    res.status(500).json({ error: 'Error al asignar categorías' });
  } finally {
    client.release();
  }
};

module.exports = { listarCategorias, listarCategoriasAdmin, crearCategoria, actualizarCategoria, eliminarCategoria, asignarCategorias };
