// src/services/cron.service.js
const cron = require('node-cron');
const pool = require('../config/database');
const { enviarResumenValidador, enviarReporteUsuario } = require('./email.service');

const iniciarCronJobs = () => {
  // Resumen mensual para validadores (primer día de cada mes a las 9:00)
  cron.schedule('0 9 1 * *', async () => {
    console.log('⏰ Ejecutando resumen mensual para validadores...');
    try {
      const validadores = await pool.query(
        "SELECT id, nombre, email FROM users WHERE rol = 'validador' AND activo = true"
      );

      for (const validador of validadores.rows) {
        const [pendientes, revalidar] = await Promise.all([
          pool.query("SELECT nombre, marca FROM productos WHERE estado = 'pendiente'"),
          pool.query(
            `SELECT DISTINCT p.nombre, p.marca, v.fecha_expiracion
             FROM productos p
             JOIN validaciones v ON v.producto_id = p.id
             WHERE v.validador_id = $1
               AND p.estado = 'validado'
               AND v.fecha_expiracion < NOW()
               AND v.id = (SELECT id FROM validaciones WHERE producto_id = p.id ORDER BY created_at DESC LIMIT 1)`,
            [validador.id]
          ),
        ]);

        try {
          await enviarResumenValidador(validador, pendientes.rows, revalidar.rows);
        } catch (e) {
          console.error(`Error enviando resumen a ${validador.email}:`, e.message);
        }
      }
    } catch (err) {
      console.error('Error en cron de validadores:', err);
    }
  }, { timezone: 'Europe/Madrid' });

  // Reporte semanal para usuarios suscritos (lunes a las 8:00)
  cron.schedule('0 8 * * 1', async () => {
    console.log('⏰ Ejecutando reporte semanal de usuarios...');
    try {
      const [usuarios, nuevos, retirados] = await Promise.all([
        pool.query("SELECT id, nombre, email FROM users WHERE suscripcion_reporte = 'semanal' AND activo = true"),
        pool.query("SELECT nombre, marca FROM productos WHERE estado = 'validado' AND visible = true AND created_at >= NOW() - INTERVAL '7 days'"),
        pool.query("SELECT nombre, marca FROM productos WHERE estado = 'retirado' AND updated_at >= NOW() - INTERVAL '7 days'"),
      ]);

      for (const usuario of usuarios.rows) {
        try {
          await enviarReporteUsuario(usuario, nuevos.rows, retirados.rows);
        } catch (e) {
          console.error(`Error enviando reporte a ${usuario.email}:`, e.message);
        }
      }
    } catch (err) {
      console.error('Error en cron semanal:', err);
    }
  }, { timezone: 'Europe/Madrid' });

  // Reporte mensual para usuarios suscritos (primer día de cada mes a las 8:30)
  cron.schedule('30 8 1 * *', async () => {
    console.log('⏰ Ejecutando reporte mensual de usuarios...');
    try {
      const [usuarios, nuevos, retirados] = await Promise.all([
        pool.query("SELECT id, nombre, email FROM users WHERE suscripcion_reporte = 'mensual' AND activo = true"),
        pool.query("SELECT nombre, marca FROM productos WHERE estado = 'validado' AND visible = true AND created_at >= NOW() - INTERVAL '30 days'"),
        pool.query("SELECT nombre, marca FROM productos WHERE estado = 'retirado' AND updated_at >= NOW() - INTERVAL '30 days'"),
      ]);

      for (const usuario of usuarios.rows) {
        try {
          await enviarReporteUsuario(usuario, nuevos.rows, retirados.rows);
        } catch (e) {
          console.error(`Error enviando reporte mensual a ${usuario.email}:`, e.message);
        }
      }
    } catch (err) {
      console.error('Error en cron mensual:', err);
    }
  }, { timezone: 'Europe/Madrid' });

  console.log('✅ Cron jobs iniciados');
};

module.exports = { iniciarCronJobs };
