// src/config/migrate-feedback.js
require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

const schema = `
-- Extender feedback_productos con nuevos campos
ALTER TABLE feedback_productos
  ADD COLUMN IF NOT EXISTS precio DECIMAL(8,2),
  ADD COLUMN IF NOT EXISTS observaciones TEXT,
  ADD COLUMN IF NOT EXISTS foto_url VARCHAR(500),
  ADD COLUMN IF NOT EXISTS foto_public_id VARCHAR(255),
  ADD COLUMN IF NOT EXISTS foto_aprobada BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS solicitud_retirada BOOLEAN DEFAULT false;

-- Tabla de respuestas a aportaciones
CREATE TABLE IF NOT EXISTS respuestas_feedback (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  feedback_id     UUID NOT NULL REFERENCES feedback_productos(id) ON DELETE CASCADE,
  respondido_por  UUID NOT NULL REFERENCES users(id),
  respuesta       TEXT NOT NULL,
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_respuestas_feedback_id ON respuestas_feedback(feedback_id);
`;

async function migrate() {
  const client = await pool.connect();
  try {
    console.log('🔄 Ejecutando migración de feedback...');
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
