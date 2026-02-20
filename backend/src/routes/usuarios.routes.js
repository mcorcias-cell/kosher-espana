// src/routes/usuarios.routes.js
const express = require('express');
const router = express.Router();
const { listarUsuarios, actualizarUsuario, actualizarPerfil, estadisticas } = require('../controllers/usuarios.controller');
const { verificarToken, requiereRol } = require('../middleware/auth.middleware');

router.get('/', verificarToken, requiereRol('administrador'), listarUsuarios);
router.put('/perfil', verificarToken, actualizarPerfil);
router.put('/:id', verificarToken, requiereRol('administrador'), actualizarUsuario);
router.get('/admin/estadisticas', verificarToken, requiereRol('administrador'), estadisticas);

module.exports = router;
