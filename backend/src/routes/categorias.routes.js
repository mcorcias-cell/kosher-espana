// src/routes/categorias.routes.js
const express = require('express');
const router = express.Router();
const { listarCategorias, listarCategoriasAdmin, crearCategoria, actualizarCategoria, eliminarCategoria, asignarCategorias } = require('../controllers/categorias.controller');
const { verificarToken, requiereRol } = require('../middleware/auth.middleware');

// Públicas
router.get('/', listarCategorias);

// Admin
router.get('/admin', verificarToken, requiereRol('administrador'), listarCategoriasAdmin);
router.post('/', verificarToken, requiereRol('administrador'), crearCategoria);
router.put('/:id', verificarToken, requiereRol('administrador'), actualizarCategoria);
router.delete('/:id', verificarToken, requiereRol('administrador'), eliminarCategoria);

// Asignar categorías a producto (validadores y admins)
router.put('/producto/:id', verificarToken, requiereRol('validador', 'administrador'), asignarCategorias);

module.exports = router;
