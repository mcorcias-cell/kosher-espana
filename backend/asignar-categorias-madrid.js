// asignar-categorias-madrid.js
// Ejecutar con: node asignar-categorias-madrid.js
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Mapeo: marca/nombre del producto → categoría
const ASIGNACIONES = [
  // Pan y Galletas saladas
  { marcas: ['Monviso', 'Gullón', "Carr's", 'Finn Crisp', 'Kookie Cat', 'Ines Rosales', 'Warburtons', 'Hacendado'], categoria: 'Pan y Galletas saladas' },
  // Cereales
  { marcas: ['Weetabix', 'Oatibix', 'Marvel', "Kellog's", 'Golden Grahams (Nestlé)'], categoria: 'Cereales' },
  // Lácteos
  { marcas: ['Reny Picot', 'Puleva', 'Kerrygold', 'Asturiana', 'President', 'Arias', 'Philadelphia', 'Ken', 'Isola Bio', 'Danone', 'Pastoret', 'Alpro'], categoria: 'Mantequillas, Quesos, Natas y Yogures' },
];

async function asignar() {
  const client = await pool.connect();
  let asignados = 0;
  let errores = 0;

  try {
    // Obtener todas las categorías
    const catResult = await client.query('SELECT id, nombre FROM categorias');
    const categoriaMap = {};
    catResult.rows.forEach(c => { categoriaMap[c.nombre] = c.id; });
    console.log(`✅ Categorías cargadas: ${catResult.rows.length}`);

    // Obtener todos los productos importados
    const prodResult = await client.query('SELECT id, nombre, marca FROM productos');
    console.log(`📦 Productos encontrados: ${prodResult.rows.length}`);

    for (const producto of prodResult.rows) {
      // Buscar qué categoría corresponde según la marca
      let categoriaId = null;
      for (const asig of ASIGNACIONES) {
        if (asig.marcas.some(m => m.toLowerCase() === producto.marca?.toLowerCase())) {
          categoriaId = categoriaMap[asig.categoria];
          break;
        }
      }

      if (!categoriaId) {
        console.log(`⚠️  Sin categoría: ${producto.nombre} (${producto.marca})`);
        continue;
      }

      try {
        await client.query(
          `INSERT INTO producto_categorias (producto_id, categoria_id)
           VALUES ($1, $2) ON CONFLICT DO NOTHING`,
          [producto.id, categoriaId]
        );
        asignados++;
        console.log(`✅ ${producto.nombre} (${producto.marca}) → ${Object.keys(categoriaMap).find(k => categoriaMap[k] === categoriaId)}`);
      } catch (err) {
        errores++;
        console.error(`❌ Error en ${producto.nombre}: ${err.message}`);
      }
    }

    console.log(`\n🎉 Asignación completada:`);
    console.log(`   ✅ Asignados: ${asignados}`);
    console.log(`   ⚠️  Sin categoría: ${prodResult.rows.length - asignados - errores}`);
    console.log(`   ❌ Errores: ${errores}`);

  } finally {
    client.release();
    pool.end();
  }
}

asignar();