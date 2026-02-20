// src/routes/productos.routes.js
const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { buscarProductos, obtenerProducto, crearProducto, obtenerPendientes, misProductos, retirarProducto } = require('../controllers/productos.controller');
const { verificarToken, requiereRol } = require('../middleware/auth.middleware');
const { upload } = require('../config/cloudinary');

// Búsqueda pública
router.get('/', buscarProductos);

// Pendientes (validadores, intermedios, admins)
router.get('/pendientes', verificarToken, requiereRol('validador', 'intermedio', 'administrador'), obtenerPendientes);

// Mis productos
router.get('/mis-productos', verificarToken, misProductos);

// Detalle de producto
router.get('/:id', (req, res, next) => {
  // El middleware de auth es opcional aquí
  const authHeader = req.headers.authorization;
  if (authHeader) {
    return verificarToken(req, res, next);
  }
  next();
}, obtenerProducto);

// Crear producto (usuarios regulares y admins)
router.post('/', verificarToken, requiereRol('regular', 'administrador'), upload.single('imagen'), [
  body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio'),
  body('marca').trim().notEmpty().withMessage('La marca es obligatoria'),
  body('justificacion').trim().isLength({ min: 20 }).withMessage('La justificación debe tener al menos 20 caracteres'),
], crearProducto);

// Retirar producto
router.delete('/:id', verificarToken, retirarProducto);

module.exports = router;
