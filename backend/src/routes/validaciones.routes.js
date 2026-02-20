// src/routes/validaciones.routes.js
const express = require('express');
const router = express.Router();
const { validarProducto, revalidarProducto, productosParaRevalidar, misValidaciones } = require('../controllers/validaciones.controller');
const { verificarToken, requiereRol } = require('../middleware/auth.middleware');

router.post('/producto/:id', verificarToken, requiereRol('validador', 'administrador'), validarProducto);
router.post('/producto/:id/revalidar', verificarToken, requiereRol('validador', 'administrador'), revalidarProducto);
router.get('/para-revalidar', verificarToken, requiereRol('validador', 'administrador'), productosParaRevalidar);
router.get('/mis-validaciones', verificarToken, requiereRol('validador', 'administrador'), misValidaciones);

module.exports = router;
