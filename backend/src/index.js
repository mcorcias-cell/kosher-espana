// src/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth.routes');
const productosRoutes = require('./routes/productos.routes');
const validacionesRoutes = require('./routes/validaciones.routes');
const usuariosRoutes = require('./routes/usuarios.routes');
const feedbackRoutes = require('./routes/feedback.routes');
const reportesRoutes = require('./routes/reportes.routes');
const { iniciarCronJobs } = require('./services/cron.service');

const app = express();

// Seguridad
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

// Rate limiting global
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,
  message: { error: 'Demasiadas solicitudes. Intenta de nuevo en 15 minutos.' },
});
app.use('/api/', limiter);

// Rate limiting estricto para auth
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Demasiados intentos de autenticación. Espera 15 minutos.' },
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/validaciones', validacionesRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/reportes', reportesRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  if (err.message === 'Solo se permiten imágenes') {
    return res.status(400).json({ error: err.message });
  }
  res.status(500).json({ error: 'Error interno del servidor' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  iniciarCronJobs();
});

module.exports = app;
