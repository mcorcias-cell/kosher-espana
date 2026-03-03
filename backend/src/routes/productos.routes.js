// src/routes/productos.routes.js
const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { buscarProductos, obtenerProducto, crearProducto, obtenerPendientes, misProductos, retirarProducto, borrarProducto, actualizarBeraja, edicionMasiva, listarProductosAdmin, actualizarProductoAdmin } = require('../controllers/productos.controller');
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

// Retirar producto (dueño si pendiente)
router.delete('/:id/retirar', verificarToken, retirarProducto);

// Borrar producto (solo admin)
router.delete('/:id', verificarToken, requiereRol('administrador'), borrarProducto);

// Actualizar beraja (validador/admin)
router.patch('/:id/beraja', verificarToken, requiereRol('validador', 'administrador'), actualizarBeraja);

// Edición masiva (solo admin)
router.post('/admin/edicion-masiva', verificarToken, requiereRol('administrador'), edicionMasiva);

// Listar todos los productos para admin
router.get('/admin/listar', verificarToken, requiereRol('administrador'), listarProductosAdmin);

// Actualizar producto completo (admin)
router.put('/admin/:id', verificarToken, requiereRol('administrador'), actualizarProductoAdmin);

module.exports = router;