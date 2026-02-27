// actualizar-categorias-oficiales.js
// Ejecutar con: node actualizar-categorias-oficiales.js
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Categorías oficiales según el índice de la Lista Kosher de Madrid
const CATEGORIAS_OFICIALES = [
  { nombre: 'Pan y Galletas saladas',          icono: '🍞', orden: 1 },
  { nombre: 'Cereales',                         icono: '🌾', orden: 2 },
  { nombre: 'Mantequillas, Quesos, Natas y Yogures', icono: '🧀', orden: 3 },
  { nombre: 'Leche Páreve',                     icono: '🥛', orden: 4 },
  { nombre: 'Café, Tés y Chocolates en polvo',  icono: '☕', orden: 5 },
  { nombre: 'Azúcares y Edulcorantes',          icono: '🍬', orden: 6 },
  { nombre: 'Barritas',                         icono: '🍫', orden: 7 },
  { nombre: 'Cremas para untar y Mermeladas',   icono: '🫙', orden: 8 },
  { nombre: 'Bollería',                         icono: '🥐', orden: 9 },
  { nombre: 'Arroz y Pasta',                    icono: '🍝', orden: 10 },
  { nombre: 'Conservas',                        icono: '🥫', orden: 11 },
  { nombre: 'Salsas',                           icono: '🫙', orden: 12 },
  { nombre: 'Encurtidos',                       icono: '🥒', orden: 13 },
  { nombre: 'Ahumados',                         icono: '🐟', orden: 14 },
  { nombre: 'Masas y Especias',                 icono: '🌿', orden: 15 },
  { nombre: 'Levadura y Esencias',              icono: '🧪', orden: 16 },
  { nombre: 'Helados',                          icono: '🍦', orden: 17 },
  { nombre: 'Frutos secos',                     icono: '🥜', orden: 18 },
  { nombre: 'Caramelos',                        icono: '🍭', orden: 19 },
  { nombre: 'Chocolates',                       icono: '🍫', orden: 20 },
  { nombre: 'Patatas fritas y aperitivos',      icono: '🍿', orden: 21 },
  { nombre: 'Alimentación infantil',            icono: '👶', orden: 22 },
  { nombre: 'Aceites',                          icono: '🫒', orden: 23 },
  { nombre: 'Bebidas y Refrescos',              icono: '🥤', orden: 24 },
  { nombre: 'Zumos',                            icono: '🍊', orden: 25 },
  { nombre: 'Bebidas alcohólicas',              icono: '🍷', orden: 26 },
];

// Renombres: categorías antiguas que se renombran (para preservar las relaciones con productos)
const RENOMBRES = [
  { viejo: 'Pasta, Arroz y Harinas',   nuevo: 'Arroz y Pasta' },
  { viejo: 'Conservas y Legumbres',    nuevo: 'Conservas' },
  { viejo: 'Dulces y Chocolates',      nuevo: 'Chocolates' },
  { viejo: 'Snacks',                   nuevo: 'Patatas fritas y aperitivos' },
  { viejo: 'Aceites y Condimentos',    nuevo: 'Aceites' },
  { viejo: 'Bebidas',                  nuevo: 'Bebidas y Refrescos' },
  { viejo: 'Frutos Secos',             nuevo: 'Frutos secos' },
];

// Categorías antiguas a eliminar (no existen en la lista oficial)
const ELIMINAR = [
  'Carnes y Embutidos',
  'Pescados y Mariscos',
  'Frutas y Verduras',
  'Congelados',
  'Productos de Limpieza',
  'Otros',
];

async function actualizar() {
  const client = await pool.connect();
  try {
    console.log('🔄 Actualizando categorías al estándar oficial...\n');

    // 1. Renombrar categorías existentes
    console.log('📝 Renombrando categorías...');
    for (const r of RENOMBRES) {
      const res = await client.query(
        'UPDATE categorias SET nombre = $1 WHERE nombre = $2 RETURNING id',
        [r.nuevo, r.viejo]
      );
      if (res.rows.length > 0) {
        console.log(`   ✅ "${r.viejo}" → "${r.nuevo}"`);
      }
    }

    // 2. Eliminar categorías que no están en la lista oficial
    console.log('\n🗑️  Eliminando categorías no oficiales...');
    for (const nombre of ELIMINAR) {
      // Primero mover los productos de esa categoría a null (eliminar relación)
      const catRes = await client.query('SELECT id FROM categorias WHERE nombre = $1', [nombre]);
      if (catRes.rows.length > 0) {
        const catId = catRes.rows[0].id;
        const deleted = await client.query('DELETE FROM producto_categorias WHERE categoria_id = $1', [catId]);
        await client.query('DELETE FROM categorias WHERE id = $1', [catId]);
        console.log(`   🗑️  "${nombre}" eliminada (${deleted.rowCount} relaciones borradas)`);
      }
    }

    // 3. Insertar categorías nuevas que no existen aún
    console.log('\n➕ Añadiendo categorías nuevas...');
    for (const cat of CATEGORIAS_OFICIALES) {
      const res = await client.query(
        `INSERT INTO categorias (nombre, icono, orden)
         VALUES ($1, $2, $3)
         ON CONFLICT (nombre) DO UPDATE SET icono = $2, orden = $3
         RETURNING id, nombre, xmax`,
        [cat.nombre, cat.icono, cat.orden]
      );
      const esNueva = res.rows[0].xmax === '0';
      if (esNueva) {
        console.log(`   ➕ "${cat.nombre}" creada`);
      }
    }

    // 4. Verificar resultado final
    const final = await client.query('SELECT nombre, icono, orden FROM categorias ORDER BY orden');
    console.log(`\n✅ Categorías finales (${final.rows.length}):`);
    final.rows.forEach(c => console.log(`   ${c.icono} ${c.nombre}`));

  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    client.release();
    pool.end();
  }
}

actualizar();