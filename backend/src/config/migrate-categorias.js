// src/config/migrate-categorias.js
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const schema = `
-- Tabla de categorías
CREATE TABLE IF NOT EXISTS categorias (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre VARCHAR(100) UNIQUE NOT NULL,
  descripcion TEXT,
  icono VARCHAR(10) DEFAULT '📦',
  orden INTEGER DEFAULT 0,
  activa BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de relación producto-categoría (muchos a muchos)
CREATE TABLE IF NOT EXISTS producto_categorias (
  producto_id UUID REFERENCES productos(id) ON DELETE CASCADE,
  categoria_id UUID REFERENCES categorias(id) ON DELETE CASCADE,
  PRIMARY KEY (producto_id, categoria_id)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_producto_categorias_producto ON producto_categorias(producto_id);
CREATE INDEX IF NOT EXISTS idx_producto_categorias_categoria ON producto_categorias(categoria_id);
`;

const categorias_iniciales = [
  { nombre: 'Pan y Galletas saladas', icono: '🍞', orden: 1 },
  { nombre: 'Cereales', icono: '🌾', orden: 2 },
  { nombre: 'Mantequillas, Quesos, Natas y Yogures', icono: '🧀', orden: 3 },
  { nombre: 'Bebidas', icono: '🥤', orden: 4 },
  { nombre: 'Aceites y Condimentos', icono: '🫒', orden: 5 },
  { nombre: 'Conservas y Legumbres', icono: '🥫', orden: 6 },
  { nombre: 'Dulces y Chocolates', icono: '🍫', orden: 7 },
  { nombre: 'Snacks', icono: '🍿', orden: 8 },
  { nombre: 'Pasta, Arroz y Harinas', icono: '🍝', orden: 9 },
  { nombre: 'Carnes y Embutidos', icono: '🥩', orden: 10 },
  { nombre: 'Pescados y Mariscos', icono: '🐟', orden: 11 },
  { nombre: 'Frutas y Verduras', icono: '🥦', orden: 12 },
  { nombre: 'Congelados', icono: '❄️', orden: 13 },
  { nombre: 'Productos de Limpieza', icono: '🧹', orden: 14 },
  { nombre: 'Otros', icono: '📦', orden: 15 },
];

async function migrate() {
  const client = await pool.connect();
  try {
    console.log('🔄 Creando tablas de categorías...');
    await client.query(schema);
    console.log('✅ Tablas creadas');

    console.log('🔄 Insertando categorías iniciales...');
    for (const cat of categorias_iniciales) {
      await client.query(
        `INSERT INTO categorias (nombre, icono, orden) VALUES ($1, $2, $3)
         ON CONFLICT (nombre) DO NOTHING`,
        [cat.nombre, cat.icono, cat.orden]
      );
    }
    console.log('✅ Categorías iniciales creadas');
    console.log('\n📋 Categorías disponibles:');
    categorias_iniciales.forEach(c => console.log(`   ${c.icono} ${c.nombre}`));

  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  } finally {
    client.release();
    pool.end();
  }
}

migrate();
