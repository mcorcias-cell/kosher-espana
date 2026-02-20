// src/routes/auth.routes.js
const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { register, login, perfil, cambiarPassword } = require('../controllers/auth.controller');
const { verificarToken } = require('../middleware/auth.middleware');

router.post('/register', [
  body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio'),
  body('apellido').trim().notEmpty().withMessage('El apellido es obligatorio'),
  body('email').isEmail().normalizeEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres'),
], register);

router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
], login);

router.get('/perfil', verificarToken, perfil);
router.put('/perfil/password', verificarToken, cambiarPassword);

module.exports = router;
