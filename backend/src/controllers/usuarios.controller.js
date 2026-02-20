// src/controllers/usuarios.controller.js
const bcrypt = require('bcryptjs');
const pool = require('../config/database');

const listarUsuarios = async (req, res) => {
  const { rol, page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;
  const params = [];
  const condiciones = [];

  if (rol) { params.push(rol); condiciones.push(`rol = $${params.length}`); }

  const where = condiciones.length > 0 ? 'WHERE ' + condiciones.join(' AND ') : '';
  params.push(limit, offset);

  try {
    const result = await pool.query(
      `SELECT id, nombre, apellido, email, rol, comunidad, activo, suscripcion_reporte, created_at
       FROM users ${where} ORDER BY created_at DESC LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );
    const count = await pool.query(`SELECT COUNT(*) FROM users ${where}`, params.slice(0, -2));
    res.json({ usuarios: result.rows, total: parseInt(count.rows[0].count) });
  } catch (err) {
    console.error('Error listando usuarios:', err);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

const actualizarUsuario = async (req, res) => {
  const { id } = req.params;
  const { rol, comunidad, activo } = req.body;

  // No puede cambiarse a sí mismo como admin
  if (id === req.usuario.id && rol && rol !== 'administrador') {
    return res.status(400).json({ error: 'No puedes cambiar tu propio rol de administrador' });
  }

  try {
    const campos = [];
    const valores = [];

    if (rol !== undefined) { valores.push(rol); campos.push(`rol = $${valores.length}`); }
    if (comunidad !== undefined) { valores.push(comunidad); campos.push(`comunidad = $${valores.length}`); }
    if (activo !== undefined) { valores.push(activo); campos.push(`activo = $${valores.length}`); }

    if (campos.length === 0) {
      return res.status(400).json({ error: 'No hay campos para actualizar' });
    }

    valores.push(id);
    const result = await pool.query(
      `UPDATE users SET ${campos.join(', ')}, updated_at = NOW() WHERE id = $${valores.length}
       RETURNING id, nombre, apellido, email, rol, comunidad, activo`,
      valores
    );

    if (!result.rows[0]) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({ usuario: result.rows[0] });
  } catch (err) {
    console.error('Error actualizando usuario:', err);
    res.status(500).json({ error: 'Error al actualizar el usuario' });
  }
};

const actualizarPerfil = async (req, res) => {
  const { nombre, apellido, suscripcion_reporte } = req.body;
  try {
    const result = await pool.query(
      `UPDATE users SET nombre = COALESCE($1, nombre), apellido = COALESCE($2, apellido),
       suscripcion_reporte = COALESCE($3, suscripcion_reporte), updated_at = NOW()
       WHERE id = $4 RETURNING id, nombre, apellido, email, rol, comunidad, suscripcion_reporte`,
      [nombre, apellido, suscripcion_reporte, req.usuario.id]
    );
    res.json({ usuario: result.rows[0] });
  } catch (err) {
    console.error('Error actualizando perfil:', err);
    res.status(500).json({ error: 'Error al actualizar el perfil' });
  }
};

// Estadísticas para el admin
const estadisticas = async (req, res) => {
  try {
    const [productos, usuarios, validaciones] = await Promise.all([
      pool.query(`SELECT estado, COUNT(*) as total FROM productos GROUP BY estado`),
      pool.query(`SELECT rol, COUNT(*) as total FROM users WHERE activo = true GROUP BY rol`),
      pool.query(`SELECT COUNT(*) as total FROM validaciones WHERE created_at >= NOW() - INTERVAL '30 days'`),
    ]);

    res.json({
      productos: productos.rows,
      usuarios: usuarios.rows,
      validaciones_ultimo_mes: parseInt(validaciones.rows[0].total),
    });
  } catch (err) {
    console.error('Error obteniendo estadísticas:', err);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
};

module.exports = { listarUsuarios, actualizarUsuario, actualizarPerfil, estadisticas };
