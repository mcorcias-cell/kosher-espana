// src/routes/feedback.routes.js
const express = require('express');
const router = express.Router();
const { verificarToken, verificarRol } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');
const {
  listarFeedback, crearFeedback, borrarFeedback,
  responderFeedback, solicitarRetirada, desestrimarRetirada,
  aprobarFoto, rechazarFoto, listarFotosPendientes, listarSolicitudesRetirada,
} = require('../controllers/feedback.controller');

const esValidadorOAdmin = verificarRol(['validador', 'administrador', 'intermedio']);
const esAdmin = verificarRol(['administrador']);

// Públicas
router.get('/producto/:productoId', listarFeedback);

// Usuario autenticado
router.post('/producto/:productoId', verificarToken, upload.single('foto'), crearFeedback);
router.delete('/:feedbackId', verificarToken, borrarFeedback);

// Validador y admin
router.post('/:feedbackId/responder', verificarToken, esValidadorOAdmin, responderFeedback);
router.patch('/:feedbackId/solicitar-retirada', verificarToken, esValidadorOAdmin, solicitarRetirada);
router.get('/admin/fotos-pendientes', verificarToken, esValidadorOAdmin, listarFotosPendientes);
router.patch('/:feedbackId/aprobar-foto', verificarToken, esValidadorOAdmin, aprobarFoto);
router.patch('/:feedbackId/rechazar-foto', verificarToken, esValidadorOAdmin, rechazarFoto);

// Solo admin
router.get('/admin/solicitudes-retirada', verificarToken, esAdmin, listarSolicitudesRetirada);
router.patch('/:feedbackId/desestimar-retirada', verificarToken, esAdmin, desestrimarRetirada);

module.exports = router;