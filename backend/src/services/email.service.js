// src/services/email.service.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.resend.com',
  port: 465,
  secure: true,
  auth: {
    user: 'resend',
    pass: process.env.RESEND_API_KEY,
  },
});

const enviarEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    });
  } catch (err) {
    console.error('Error enviando email:', err);
    throw err;
  }
};

const enviarNotificacionValidacion = async (usuario, aprobado) => {
  const html = aprobado
    ? `<h2>¡Tu producto ha sido validado! ✅</h2>
       <p>Hola ${usuario.nombre}, el producto <strong>${usuario.producto}</strong> ha sido validado y ya está visible en la plataforma Kosher España.</p>
       <p>Gracias por tu contribución a la comunidad.</p>`
    : `<h2>Actualización sobre tu producto</h2>
       <p>Hola ${usuario.nombre}, el producto <strong>${usuario.producto}</strong> no ha podido ser validado en este momento.</p>
       <p>Puedes contactar con los validadores para más información.</p>`;

  await enviarEmail({
    to: usuario.email,
    subject: aprobado ? '✅ Tu producto ha sido validado - Kosher España' : 'Actualización sobre tu producto - Kosher España',
    html,
  });
};

const enviarResumenValidador = async (validador, productos_pendientes, productos_revalidar) => {
  const html = `
    <h2>Resumen mensual - Kosher España</h2>
    <p>Hola ${validador.nombre},</p>
    <h3>Productos pendientes de validación: ${productos_pendientes.length}</h3>
    ${productos_pendientes.map(p => `<p>• ${p.nombre} (${p.marca})</p>`).join('')}
    <h3>Productos que necesitan revalidación: ${productos_revalidar.length}</h3>
    ${productos_revalidar.map(p => `<p>• ${p.nombre} (${p.marca}) - Expiró: ${new Date(p.fecha_expiracion).toLocaleDateString('es-ES')}</p>`).join('')}
    <p>Por favor, accede al panel de validador para gestionar estos productos.</p>
  `;

  await enviarEmail({
    to: validador.email,
    subject: '📋 Resumen mensual de validaciones - Kosher España',
    html,
  });
};

const enviarReporteUsuario = async (usuario, nuevos, retirados) => {
  const html = `
    <h2>Reporte de productos - Kosher España</h2>
    <p>Hola ${usuario.nombre},</p>
    <h3>Nuevos productos kosher: ${nuevos.length}</h3>
    ${nuevos.map(p => `<p>• ${p.nombre} - ${p.marca}</p>`).join('')}
    <h3>Productos retirados: ${retirados.length}</h3>
    ${retirados.map(p => `<p>• ${p.nombre} - ${p.marca}</p>`).join('')}
  `;

  await enviarEmail({
    to: usuario.email,
    subject: '📦 Reporte de productos Kosher España',
    html,
  });
};

module.exports = { enviarEmail, enviarNotificacionValidacion, enviarResumenValidador, enviarReporteUsuario };
