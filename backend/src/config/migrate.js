// src/config/migrate.js
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const schema = `
-- Extensiones
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  rol VARCHAR(20) NOT NULL DEFAULT 'regular' CHECK (rol IN ('regular', 'intermedio', 'validador', 'administrador')),
  comunidad VARCHAR(100),
  activo BOOLEAN DEFAULT true,
  email_verificado BOOLEAN DEFAULT false,
  suscripcion_reporte VARCHAR(10) DEFAULT 'ninguno' CHECK (suscripcion_reporte IN ('ninguno', 'semanal', 'mensual')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de productos
CREATE TABLE IF NOT EXISTS productos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre VARCHAR(255) NOT NULL,
  marca VARCHAR(255) NOT NULL,
  gramaje VARCHAR(50),
  sabor_variante VARCHAR(100),
  fabricante VARCHAR(255),
  codigo_barras VARCHAR(50),
  justificacion TEXT NOT NULL,
  estado VARCHAR(20) NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'validado', 'rechazado', 'retirado')),
  imagen_url VARCHAR(500),
  imagen_public_id VARCHAR(255),
  subido_por UUID REFERENCES users(id),
  visible BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de validaciones
CREATE TABLE IF NOT EXISTS validaciones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  producto_id UUID REFERENCES productos(id) ON DELETE CASCADE,
  validador_id UUID REFERENCES users(id),
  tipo_validacion VARCHAR(50) NOT NULL CHECK (tipo_validacion IN ('ingredientes_verificables', 'certificacion_externa', 'certificacion_completa')),
  notas TEXT,
  es_revalidacion BOOLEAN DEFAULT false,
  fecha_expiracion TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de información intermedia
CREATE TABLE IF NOT EXISTS info_intermedia (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  producto_id UUID REFERENCES productos(id) ON DELETE CASCADE,
  usuario_id UUID REFERENCES users(id),
  informacion TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de feedback de usuarios (ubicaciones)
CREATE TABLE IF NOT EXISTS feedback_productos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  producto_id UUID REFERENCES productos(id) ON DELETE CASCADE,
  usuario_id UUID REFERENCES users(id),
  supermercado VARCHAR(255) NOT NULL,
  localidad VARCHAR(255) NOT NULL,
  notas TEXT,
  verificado BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de suscripciones a reportes
CREATE TABLE IF NOT EXISTS suscripciones_reportes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id UUID REFERENCES users(id) ON DELETE CASCADE,
  tipo VARCHAR(10) NOT NULL CHECK (tipo IN ('semanal', 'mensual')),
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Índices para búsqueda rápida
CREATE INDEX IF NOT EXISTS idx_productos_nombre ON productos(nombre);
CREATE INDEX IF NOT EXISTS idx_productos_marca ON productos(marca);
CREATE INDEX IF NOT EXISTS idx_productos_codigo_barras ON productos(codigo_barras);
CREATE INDEX IF NOT EXISTS idx_productos_estado ON productos(estado);
CREATE INDEX IF NOT EXISTS idx_validaciones_producto ON validaciones(producto_id);
CREATE INDEX IF NOT EXISTS idx_validaciones_validador ON validaciones(validador_id);
CREATE INDEX IF NOT EXISTS idx_validaciones_fecha ON validaciones(created_at);
`;

async function migrate() {
  const client = await pool.connect();
  try {
    console.log('🔄 Ejecutando migraciones...');
    await client.query(schema);
    console.log('✅ Migraciones completadas con éxito');
  } catch (err) {
    console.error('❌ Error en migración:', err);
    process.exit(1);
  } finally {
    client.release();
    pool.end();
  }
}

migrate();
