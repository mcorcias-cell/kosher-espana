// asignar-tipo-kosher.js
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function asignar() {
  const client = await pool.connect();
  let actualizados = 0;

  try {
    const result = await client.query('SELECT id, nombre, marca, justificacion FROM productos');
    console.log(`📦 Procesando ${result.rows.length} productos...`);

    for (const p of result.rows) {
      const texto = (p.justificacion || '').toLowerCase();
      let tipo = null;

      if (texto.includes('lácteo') || texto.includes('lacteo')) tipo = 'lacteo';
      else if (texto.includes('cárnico') || texto.includes('carnico')) tipo = 'carnico';
      else if (texto.includes('pescado')) tipo = 'pescado';
      else if (texto.includes('páreve') || texto.includes('pareve')) tipo = 'pareve';

      if (tipo) {
        await client.query('UPDATE productos SET tipo_kosher = $1 WHERE id = $2', [tipo, p.id]);
        actualizados++;
        console.log(`✅ ${p.nombre} (${p.marca}) → ${tipo}`);
      } else {
        console.log(`⚠️  Sin tipo: ${p.nombre} (${p.marca})`);
      }
    }

    console.log(`\n🎉 Completado: ${actualizados}/${result.rows.length} productos actualizados`);
  } finally {
    client.release();
    pool.end();
  }
}

asignar();