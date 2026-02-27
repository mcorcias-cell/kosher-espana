// actualizar_kosher_parte2.js — Sección: Cremas para untar → Bollería
// Ejecutar con: node actualizar_kosher_parte2.js
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const actualizaciones = [

  // ── CREMAS PARA UNTAR Y MERMELADAS ──────────────────────
  { nombre: 'Dulce de leche - todos los productos de la marca', marca: 'MÁRDEL', sabor_variante: null, fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Lácteo incluso sin sello', supermercados: ['Alcampo', 'Día', 'Corte Inglés'] },
  { nombre: 'Dulce de leche en diferentes formatos', marca: 'HAVANNA', sabor_variante: null, fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Lácteo incluso sin sello', supermercados: ['Carrefour', 'Corte Inglés', 'Amazon'] },
  { nombre: 'Crema de cacahuetes crunchy y normal', marca: 'GRANOVITA', sabor_variante: 'Crunchy, Normal', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['Alcampo'] },
  { nombre: 'Cremas de frutos secos - todos los de la marca', marca: 'GRANOVITA', sabor_variante: null, fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['Corte Inglés', 'Carrefour', 'Alcampo', 'Amazon'] },
  { nombre: 'Crema de cacahuetes sin gluten y vegano', marca: 'CAPITÁN MANÍ', sabor_variante: null, fabricante: null, tipo_validacion: 'certificacion_externa', notas_validacion: 'Páreve sólo con sello', supermercados: ['En la mayoría de supermercados', 'Amazon'] },
  { nombre: 'Crema de cacahuetes', marca: 'SKIPPY', sabor_variante: null, fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['Carrefour', 'Corte Inglés', 'Amazon'] },
  { nombre: 'Tahini Bio', marca: 'GRANOVITA', sabor_variante: 'Bio', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['En la mayoría de supermercados', 'Amazon'] },
  { nombre: 'Tahini', marca: 'AUCHÁN', sabor_variante: null, fabricante: 'GRANOVITA', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello. Sólo el elaborado por Granovita', supermercados: ['Alcampo'] },
  { nombre: 'Crema de cacao con avellanas original', marca: 'NOCILLA', sabor_variante: 'Original', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Lácteo incluso sin sello', supermercados: ['Alcampo', 'Día', 'Corte Inglés', 'Carrefour'] },
  { nombre: 'Crema de cacao con avellanas 0% sin azúcares y blanco', marca: 'NOCILLA', sabor_variante: '0% sin azúcares, Blanco', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Lácteo incluso sin sello', supermercados: ['Alcampo', 'Día', 'Corte Inglés', 'Carrefour'] },
  { nombre: 'Crema de cacao negro', marca: 'NOCILLA', sabor_variante: 'Negro', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['Alcampo', 'Día', 'Carrefour', 'Corte Inglés'] },
  { nombre: 'Crema de cacao fluida original y avellanas', marca: 'NOCILLA', sabor_variante: 'Fluida original, Avellanas', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Lácteo incluso sin sello', supermercados: ['Alcampo', 'Día', 'Carrefour', 'Corte Inglés'] },
  { nombre: 'Crema de cacao chocomix y 0%', marca: 'NOCILLA', sabor_variante: 'Chocomix, 0%', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Lácteo incluso sin sello', supermercados: ['Alcampo', 'Día', 'Carrefour', 'Corte Inglés'] },
  { nombre: 'Crema de cacao', marca: 'DULCINEA', sabor_variante: null, fabricante: null, tipo_validacion: 'certificacion_externa', notas_validacion: 'Lácteo sólo con sello', supermercados: ['Alcampo', 'Día', 'Carrefour', 'Corte Inglés'] },
  { nombre: 'Crema de cacao dark', marca: 'NOCICIOLATA', sabor_variante: 'Dark', fabricante: null, tipo_validacion: 'certificacion_externa', notas_validacion: 'Lácteo sólo con sello', supermercados: ['Carrefour', 'Corte Inglés', 'Amazon'] },
  { nombre: 'Original, Bianca y Crunchy crema de avellanas, leche o cacao', marca: 'NOCICIOLATA', sabor_variante: 'Original, Bianca, Crunchy', fabricante: null, tipo_validacion: 'certificacion_externa', notas_validacion: 'Lácteo sólo con sello', supermercados: ['Carrefour', 'Corte Inglés', 'Amazon'] },
  { nombre: 'Mermelada de diferentes tamaños y sabores', marca: 'HERO', sabor_variante: 'Diferentes sabores', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['Carrefour', 'Corte Inglés', 'Amazon'] },
  { nombre: 'Todos los formatos de la marca', marca: 'NUTELLA', sabor_variante: null, fabricante: 'Ferrero', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Lácteo incluso sin sello', supermercados: ['Alcampo', 'Día', 'Carrefour', 'Corte Inglés'] },

  // ── BOLLERÍA ────────────────────────────────────────────
  { nombre: 'Bollitos individuales de diferentes sabores', marca: 'MR BROWNIE', sabor_variante: 'Diferentes sabores', fabricante: null, tipo_validacion: 'certificacion_externa', notas_validacion: 'Lácteo sólo con sello', supermercados: ['Primaprix', 'Carrefour', 'Alcampo', 'Amazon'] },
  { nombre: 'Alfajores de diferentes sabores', marca: 'MARDEL', sabor_variante: null, fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Lácteo incluso sin sello', supermercados: ['Carrefour', 'Corte Inglés', 'Amazon'] },
  { nombre: 'Alfajores de diferentes sabores', marca: 'HAVANNA', sabor_variante: null, fabricante: null, tipo_validacion: 'certificacion_externa', notas_validacion: 'Lácteo sólo con sello', supermercados: ['Carrefour', 'Alcampo', 'Corte Inglés', 'Amazon'] },
  { nombre: 'Alfajores veganos y sin gluten', marca: 'HAVANNA', sabor_variante: 'Vegano, Sin gluten', fabricante: null, tipo_validacion: 'certificacion_externa', notas_validacion: 'Páreve sólo con sello', supermercados: ['Amazon'] },
  { nombre: 'Galletas de diferentes sabores', marca: 'JULES DESTROOPER', sabor_variante: 'Diferentes sabores', fabricante: null, tipo_validacion: 'certificacion_externa', notas_validacion: 'Lácteo sólo con sello', supermercados: ['Carrefour', 'Alcampo', 'Corte Inglés', 'Amazon'] },
  { nombre: 'Bollitos de chocolate sabor Baileys', marca: 'BAILEYS', sabor_variante: 'Chocolate sabor Baileys', fabricante: null, tipo_validacion: 'certificacion_externa', notas_validacion: 'Lácteo sólo con sello', supermercados: ['Carrefour', 'Corte Inglés'] },
  { nombre: 'Rollo de bizcocho con diferentes rellenos recubierto de chocolate', marca: 'BALCONI', sabor_variante: 'Diferentes rellenos', fabricante: null, tipo_validacion: 'certificacion_externa', notas_validacion: 'Lácteo sólo con sello', supermercados: ['Alcampo', 'Carrefour', 'Corte Inglés'] },
  { nombre: 'Rollitos individuales recubiertos de chocolate con diferentes rellenos', marca: 'BALCONI', sabor_variante: 'Diferentes rellenos', fabricante: null, tipo_validacion: 'certificacion_externa', notas_validacion: 'Lácteo sólo con sello', supermercados: ['Alcampo', 'Carrefour', 'Corte Inglés'] },
  { nombre: 'Bollitos individuales de mermelada de melocotón, chocolate, crema', marca: 'BALCONI', sabor_variante: 'Mermelada de melocotón, Chocolate, Crema', fabricante: null, tipo_validacion: 'certificacion_externa', notas_validacion: 'Lácteo sólo con sello', supermercados: ['Alcampo', 'Carrefour', 'Corte Inglés'] },
  { nombre: 'Wafers con diferentes rellenos: nata, chocolate, avellana', marca: 'BALCONI', sabor_variante: 'Nata, Chocolate, Avellana', fabricante: null, tipo_validacion: 'certificacion_externa', notas_validacion: 'Lácteo sólo con sello', supermercados: ['Alcampo', 'Carrefour', 'Corte Inglés'] },
  { nombre: 'Galletas (sólo las producidas en Bélgica)', marca: 'BISCOFF', sabor_variante: null, fabricante: 'Lotus Bakeries (Bélgica)', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello (sólo el producto hecho en Bélgica)', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Galletas veganas en todas sus variedades', marca: 'GULLÓN', sabor_variante: 'Veganas', fabricante: 'Gullón', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Galleta integral de avena sin gluten sabor naranja', marca: 'GULLÓN', sabor_variante: 'Avena sin gluten, Naranja', fabricante: 'Gullón', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['Corte Inglés', 'Carrefour', 'Alcampo'] },
  { nombre: 'Galleta integral sin azúcar añadido', marca: 'GULLÓN', sabor_variante: 'Sin azúcar añadido', fabricante: 'Gullón', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['Corte Inglés', 'Carrefour', 'Alcampo'] },
  { nombre: 'Galleta de avena sin azúcar añadido', marca: 'GULLÓN', sabor_variante: 'Avena sin azúcar', fabricante: 'Gullón', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['Corte Inglés', 'Carrefour', 'Alcampo'] },
  { nombre: 'Galletas sin azúcar con edulcorante', marca: 'GULLÓN', sabor_variante: 'Sin azúcar con edulcorante', fabricante: 'Gullón', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Lácteo incluso sin sello', supermercados: ['Corte Inglés', 'Carrefour', 'Alcampo'] },
  { nombre: 'Galletas con sabor a cacao rellenas de crema sin gluten', marca: 'GULLÓN', sabor_variante: 'Cacao, Sin gluten', fabricante: 'Gullón', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['Corte Inglés', 'Carrefour', 'Alcampo'] },
  { nombre: 'Galletas de trigo integral con avena sabor naranja', marca: 'GULLÓN', sabor_variante: 'Trigo integral, Avena, Naranja', fabricante: 'Gullón', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['Corte Inglés', 'Carrefour', 'Alcampo'] },
  { nombre: 'Galletas mini cereales sabor vainilla o chocolate', marca: 'GULLÓN', sabor_variante: 'Vainilla, Chocolate', fabricante: 'Gullón', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Galletas de avena recubiertas de chocolate negro sin azúcar', marca: 'GULLÓN', sabor_variante: 'Avena, Chocolate negro', fabricante: 'Gullón', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Lácteo incluso sin sello', supermercados: ['Corte Inglés', 'Carrefour', 'Alcampo'] },
  { nombre: 'Waffle relleno de crema de chocolate sin azúcar', marca: 'GULLÓN', sabor_variante: 'Chocolate sin azúcar', fabricante: 'Gullón', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Lácteo incluso sin sello', supermercados: ['Corte Inglés', 'Carrefour', 'Alcampo'] },
  { nombre: 'Waffle relleno de crema de vainilla sin azúcar', marca: 'GULLÓN', sabor_variante: 'Vainilla sin azúcar', fabricante: 'Gullón', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Lácteo incluso sin sello', supermercados: ['Corte Inglés', 'Carrefour', 'Alcampo'] },
  { nombre: 'Galletas de chocolate negro sin azúcar', marca: 'GULLÓN', sabor_variante: 'Chocolate negro sin azúcar', fabricante: 'Gullón', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Lácteo incluso sin sello', supermercados: ['Corte Inglés', 'Carrefour', 'Alcampo'] },
  { nombre: 'Sandwich de galleta relleno sabor chocolate sin azúcar', marca: 'GULLÓN', sabor_variante: 'Chocolate sin azúcar', fabricante: 'Gullón', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Lácteo incluso sin sello', supermercados: ['Corte Inglés', 'Carrefour', 'Alcampo'] },
  { nombre: 'Sandwich de galleta relleno sabor yogur sin azúcar', marca: 'GULLÓN', sabor_variante: 'Yogur sin azúcar', fabricante: 'Gullón', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Lácteo incluso sin sello', supermercados: ['Corte Inglés', 'Carrefour', 'Alcampo'] },
  { nombre: 'Selección de galletas sin azúcar', marca: 'GULLÓN', sabor_variante: 'Selección sin azúcar', fabricante: 'Gullón', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Lácteo incluso sin sello', supermercados: ['Corte Inglés', 'Carrefour', 'Alcampo'] },
  { nombre: 'Galletas con trocitos de chocolate negro', marca: 'GULLÓN', sabor_variante: 'Chocolate negro', fabricante: 'Gullón', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Lácteo incluso sin sello', supermercados: ['Corte Inglés', 'Carrefour', 'Alcampo'] },
  { nombre: 'Waffle relleno sabor chocolate', marca: 'GULLÓN', sabor_variante: 'Chocolate', fabricante: 'Gullón', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Lácteo incluso sin sello', supermercados: ['Corte Inglés', 'Carrefour', 'Alcampo'] },
  { nombre: 'Waffle relleno de chocolate y crema sabor nata', marca: 'GULLÓN', sabor_variante: 'Chocolate y nata', fabricante: 'Gullón', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Lácteo incluso sin sello', supermercados: ['Corte Inglés', 'Carrefour', 'Alcampo'] },
  { nombre: 'Waffle relleno de chocolate y crema sabor avellana', marca: 'GULLÓN', sabor_variante: 'Chocolate y avellana', fabricante: 'Gullón', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Lácteo incluso sin sello', supermercados: ['Corte Inglés', 'Carrefour', 'Alcampo'] },
  { nombre: 'Galletas con avena y trocitos de chocolate', marca: 'GULLÓN', sabor_variante: 'Avena y chocolate', fabricante: 'Gullón', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Lácteo incluso sin sello', supermercados: ['Corte Inglés', 'Carrefour', 'Alcampo'] },
  { nombre: 'Sandwich de galleta con relleno de crema sabor vainilla', marca: 'GULLÓN', sabor_variante: 'Vainilla', fabricante: 'Gullón', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Lácteo incluso sin sello', supermercados: ['Corte Inglés', 'Carrefour', 'Alcampo'] },
  { nombre: 'Galletas Bio con chocolate con leche', marca: 'GULLÓN', sabor_variante: 'Bio, Chocolate con leche', fabricante: 'Gullón', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Lácteo incluso sin sello', supermercados: ['Corte Inglés', 'Carrefour', 'Alcampo'] },
  { nombre: 'Galletas con sabor a canela', marca: 'GULLÓN', sabor_variante: 'Canela', fabricante: 'Gullón', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Lácteo incluso sin sello', supermercados: ['Corte Inglés', 'Carrefour', 'Alcampo'] },
  { nombre: 'Galletas con cereales cubierta de chocolate sin azúcar', marca: 'GULLÓN', sabor_variante: 'Cereales, Chocolate sin azúcar', fabricante: 'Gullón', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Lácteo incluso sin sello', supermercados: ['Corte Inglés', 'Carrefour', 'Alcampo'] },
  { nombre: 'Galletas con trocitos de chocolate sin azúcar', marca: 'GULLÓN', sabor_variante: 'Chocolate sin azúcar', fabricante: 'Gullón', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Lácteo incluso sin sello', supermercados: ['Corte Inglés', 'Carrefour', 'Alcampo'] },
  { nombre: 'Sandwich de galleta con relleno de crema sabor chocolate', marca: 'GULLÓN', sabor_variante: 'Chocolate', fabricante: 'Gullón', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Lácteo incluso sin sello', supermercados: ['Corte Inglés', 'Carrefour', 'Alcampo'] },
  { nombre: 'Galletas sabor chocolate con relleno de crema de chocolate', marca: 'GULLÓN', sabor_variante: 'Chocolate', fabricante: 'Gullón', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Lácteo incluso sin sello', supermercados: ['Corte Inglés', 'Carrefour', 'Alcampo'] },
  { nombre: 'Galletas rellenas de crema de yogur sin azúcares añadidos', marca: 'GULLÓN', sabor_variante: 'Yogur sin azúcar', fabricante: 'Gullón', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Lácteo incluso sin sello', supermercados: ['Corte Inglés', 'Carrefour', 'Alcampo'] },
  { nombre: 'Galletas de avena cubiertas de chocolate con leche', marca: 'GULLÓN', sabor_variante: 'Avena, Chocolate con leche', fabricante: 'Gullón', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Lácteo incluso sin sello', supermercados: ['Corte Inglés', 'Carrefour', 'Alcampo'] },
  { nombre: 'Galletas recubiertas de chocolate con leche sin azúcar', marca: 'GULLÓN', sabor_variante: 'Chocolate con leche sin azúcar', fabricante: 'Gullón', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Lácteo incluso sin sello', supermercados: ['Corte Inglés', 'Carrefour', 'Alcampo'] },
  { nombre: 'Sandwiches de galleta de diferentes sabores', marca: 'OREO', sabor_variante: 'Diferentes sabores', fabricante: 'Mondelez', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Lácteo incluso sin sello', supermercados: ['Corte Inglés', 'Carrefour', 'Alcampo'] },
  { nombre: 'Cereales', marca: 'ENVIRO KIDZ', sabor_variante: null, fabricante: null, tipo_validacion: 'certificacion_externa', notas_validacion: 'Páreve sólo con sello', supermercados: ['Corte Inglés', 'Carrefour'] },
  { nombre: 'Muesli', marca: 'GRANOVITA', sabor_variante: null, fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['Herbolarios', 'Corte Inglés'] },
  { nombre: 'Galletas con trocitos de chocolate sin azúcar', marca: 'ORGRAN', sabor_variante: 'Chocolate sin azúcar', fabricante: null, tipo_validacion: 'certificacion_externa', notas_validacion: 'Páreve sólo con sello', supermercados: ['Corte Inglés', 'Carrefour'] },

];

// ── FUNCIÓN DE ACTUALIZACIÓN ─────────────────────────────
async function actualizarProductos() {
  const client = await pool.connect();
  let actualizados = 0;
  let noEncontrados = 0;

  try {
    await client.query('BEGIN');

    for (const p of actualizaciones) {
      const prod = await client.query(
        'SELECT id FROM productos WHERE LOWER(nombre) = LOWER($1) AND LOWER(marca) = LOWER($2)',
        [p.nombre, p.marca]
      );

      if (prod.rows.length === 0) {
        console.warn(`⚠️  No encontrado: "${p.nombre}" - ${p.marca}`);
        noEncontrados++;
        continue;
      }

      const productoId = prod.rows[0].id;

      await client.query(`
        UPDATE productos SET
          sabor_variante = COALESCE($1, sabor_variante),
          fabricante = COALESCE($2, fabricante),
          updated_at = NOW()
        WHERE id = $3
      `, [p.sabor_variante, p.fabricante, productoId]);

      if (p.tipo_validacion) {
        const yaExiste = await client.query(
          'SELECT id FROM validaciones WHERE producto_id = $1 AND tipo_validacion = $2',
          [productoId, p.tipo_validacion]
        );
        if (yaExiste.rows.length === 0) {
          await client.query(`
            INSERT INTO validaciones (producto_id, tipo_validacion, notas)
            VALUES ($1, $2, $3)
          `, [productoId, p.tipo_validacion, p.notas_validacion]);
        }
      }

      for (const super_ of (p.supermercados || [])) {
        const yaExiste = await client.query(
          'SELECT id FROM feedback_productos WHERE producto_id = $1 AND supermercado = $2',
          [productoId, super_]
        );
        if (yaExiste.rows.length === 0) {
          await client.query(`
            INSERT INTO feedback_productos (producto_id, supermercado, localidad, verificado)
            VALUES ($1, $2, 'España', true)
          `, [productoId, super_]);
        }
      }

      actualizados++;
      console.log(`✅ ${actualizados}. ${p.nombre} - ${p.marca}`);
    }

    await client.query('COMMIT');
    console.log(`\n🎉 Parte 2 completada:`);
    console.log(`   ✅ Actualizados: ${actualizados}`);
    console.log(`   ⚠️  No encontrados: ${noEncontrados}`);

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Error:', err.message);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

actualizarProductos().catch(console.error);