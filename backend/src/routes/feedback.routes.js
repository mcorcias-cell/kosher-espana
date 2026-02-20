// src/routes/feedback.routes.js
const express = require('express');
const router = express.Router();
const { agregarFeedback, agregarInfoIntermedia, verificarFeedback } = require('../controllers/feedback.controller');
const { verificarToken, requiereRol } = require('../middleware/auth.middleware');

router.post('/producto/:producto_id', verificarToken, agregarFeedback);
router.post('/producto/:producto_id/info-intermedia', verificarToken, requiereRol('intermedio', 'administrador'), agregarInfoIntermedia);
router.put('/:id/verificar', verificarToken, requiereRol('administrador'), verificarFeedback);

module.exports = router;
