// src/config/migrate-tipo-kosher.js
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function migrate() {
  const client = await pool.connect();
  try {
    console.log('🔄 Añadiendo campo tipo_kosher a productos...');
    await client.query(`
      ALTER TABLE productos 
      ADD COLUMN IF NOT EXISTS tipo_kosher VARCHAR(20) 
      CHECK (tipo_kosher IN ('pareve', 'lacteo', 'carnico', 'pescado'))
    `);
    console.log('✅ Campo tipo_kosher añadido');
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  } finally {
    client.release();
    pool.end();
  }
}

migrate();