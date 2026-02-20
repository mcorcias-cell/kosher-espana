// src/controllers/auth.controller.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const pool = require('../config/database');

const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }

  const { nombre, apellido, email, password } = req.body;

  try {
    const existe = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existe.rows.length > 0) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    const salt = await bcrypt.genSalt(12);
    const password_hash = await bcrypt.hash(password, salt);

    const result = await pool.query(
      `INSERT INTO users (nombre, apellido, email, password_hash, rol)
       VALUES ($1, $2, $3, $4, 'regular')
       RETURNING id, nombre, apellido, email, rol`,
      [nombre, apellido, email, password_hash]
    );

    const usuario = result.rows[0];
    const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });

    res.status(201).json({ usuario, token });
  } catch (err) {
    console.error('Error en register:', err);
    res.status(500).json({ error: 'Error al registrar el usuario' });
  }
};

const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND activo = true',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    const usuario = result.rows[0];
    const passwordValida = await bcrypt.compare(password, usuario.password_hash);
    if (!passwordValida) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });

    const { password_hash, ...usuarioSinPassword } = usuario;
    res.json({ usuario: usuarioSinPassword, token });
  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

const perfil = async (req, res) => {
  res.json({ usuario: req.usuario });
};

const cambiarPassword = async (req, res) => {
  const { password_actual, password_nueva } = req.body;

  try {
    const result = await pool.query('SELECT password_hash FROM users WHERE id = $1', [req.usuario.id]);
    const valida = await bcrypt.compare(password_actual, result.rows[0].password_hash);
    if (!valida) {
      return res.status(400).json({ error: 'La contraseña actual es incorrecta' });
    }

    const salt = await bcrypt.genSalt(12);
    const nuevo_hash = await bcrypt.hash(password_nueva, salt);
    await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [nuevo_hash, req.usuario.id]);

    res.json({ mensaje: 'Contraseña actualizada correctamente' });
  } catch (err) {
    console.error('Error cambiando password:', err);
    res.status(500).json({ error: 'Error al cambiar la contraseña' });
  }
};

module.exports = { register, login, perfil, cambiarPassword };
