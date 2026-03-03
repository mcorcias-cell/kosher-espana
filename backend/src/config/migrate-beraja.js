// src/config/migrate-beraja.js
require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

const schema = `
ALTER TABLE productos
  ADD COLUMN IF NOT EXISTS beraja VARCHAR(20)
  CHECK (beraja IN ('hamotzi', 'mezonot', 'peri_haguefen', 'haetz', 'haadama', 'sheakol'));
`;

async function migrate() {
  const client = await pool.connect();
  try {
    console.log('🔄 Añadiendo campo beraja...');
    await client.query(schema);
    console.log('✅ Migración completada');
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
