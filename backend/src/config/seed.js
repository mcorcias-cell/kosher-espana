// src/config/seed.js - Crea el usuario administrador inicial
require('dotenv').config();
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function seed() {
  const client = await pool.connect();
  try {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      console.error('❌ Define ADMIN_EMAIL y ADMIN_PASSWORD en el .env');
      process.exit(1);
    }

    const existe = await client.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existe.rows.length > 0) {
      console.log('⚠️  El admin ya existe:', email);
      return;
    }

    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(password, salt);

    await client.query(
      `INSERT INTO users (nombre, apellido, email, password_hash, rol, activo)
       VALUES ('Admin', 'Sistema', $1, $2, 'administrador', true)`,
      [email, hash]
    );

    console.log('✅ Usuario administrador creado:', email);
  } catch (err) {
    console.error('❌ Error en seed:', err);
  } finally {
    client.release();
    pool.end();
  }
}

seed();
