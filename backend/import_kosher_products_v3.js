// actualizar_kosher_parte1.js — Sección: Alpro → Barritas
// Ejecutar con: node actualizar_kosher_parte1.js
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const actualizaciones = [

  // ── MANTEQUILLAS, QUESOS, NATAS Y YOGURES (ALPRO) ───────
  { nombre: 'Preparado de soja de coco', marca: 'ALPRO', sabor_variante: 'Coco', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['En la mayoría de supermercados', 'Amazon'] },
  { nombre: 'Preparado de soja y avena', marca: 'ALPRO', sabor_variante: 'Avena', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['En la mayoría de supermercados', 'Amazon'] },
  { nombre: 'Preparado de soja fermentado con mango y banana', marca: 'ALPRO', sabor_variante: 'Mango y banana', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['En la mayoría de supermercados', 'Amazon'] },
  { nombre: 'Preparado de soja fermentado con frutos rojos', marca: 'ALPRO', sabor_variante: 'Frutos rojos', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['En la mayoría de supermercados', 'Amazon'] },
  { nombre: 'Preparado de soja fermentado de fresa-platano y melocotón-pera', marca: 'ALPRO', sabor_variante: 'Fresa-plátano, Melocotón-pera', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['En la mayoría de supermercados', 'Amazon'] },
  { nombre: 'Postre de soja sabor chocolate - chocolate negro', marca: 'ALPRO', sabor_variante: 'Chocolate negro', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['En la mayoría de supermercados', 'Amazon'] },
  { nombre: 'Postre de soja sabor vainilla', marca: 'ALPRO', sabor_variante: 'Vainilla', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['En la mayoría de supermercados', 'Amazon'] },

  // ── LECHE PÁREVE (ISOLA BIO y otras) ────────────────────
  { nombre: 'Leche de almendra', marca: 'ALMENDROLA', sabor_variante: null, fabricante: null, tipo_validacion: 'certificacion_externa', notas_validacion: 'Páreve sólo con sello', supermercados: ['Carrefour', 'Corte Inglés', 'Alcampo'] },
  { nombre: 'Leches vegetales', marca: 'YOSOY', sabor_variante: null, fabricante: null, tipo_validacion: 'certificacion_externa', notas_validacion: 'Páreve sólo con sello', supermercados: ['Carrefour', 'Corte Inglés', 'Alcampo'] },
  { nombre: 'Leches vegetales', marca: 'MONSOY', sabor_variante: null, fabricante: null, tipo_validacion: 'certificacion_externa', notas_validacion: 'Páreve sólo con sello', supermercados: ['Amazon', 'Naturitas'] },
  { nombre: 'Leches vegetales', marca: 'NATRUE', sabor_variante: null, fabricante: null, tipo_validacion: 'certificacion_externa', notas_validacion: 'Páreve sólo con sello', supermercados: ['Amazon', 'Naturitas'] },
  { nombre: 'Bebida de agua de coco', marca: 'ISOLA BIO', sabor_variante: 'Coco', fabricante: 'Isola Bio', tipo_validacion: 'certificacion_externa', notas_validacion: 'Páreve sólo con sello', supermercados: ['Amazon', 'Naturitas', 'Corte Inglés'] },
  { nombre: 'Bebida de soja', marca: 'ISOLA BIO', sabor_variante: 'Soja', fabricante: 'Isola Bio', tipo_validacion: 'certificacion_externa', notas_validacion: 'Páreve sólo con sello', supermercados: ['Amazon', 'Naturitas', 'Corte Inglés'] },
  { nombre: 'Bebida de avena', marca: 'ISOLA BIO', sabor_variante: 'Avena', fabricante: 'Isola Bio', tipo_validacion: 'certificacion_externa', notas_validacion: 'Páreve sólo con sello', supermercados: ['Amazon', 'Naturitas', 'Corte Inglés'] },
  { nombre: 'Bebida de espelta', marca: 'ISOLA BIO', sabor_variante: 'Espelta', fabricante: 'Isola Bio', tipo_validacion: 'certificacion_externa', notas_validacion: 'Páreve sólo con sello', supermercados: ['Naturitas'] },
  { nombre: 'Bebida de mijo', marca: 'ISOLA BIO', sabor_variante: 'Mijo', fabricante: 'Isola Bio', tipo_validacion: 'certificacion_externa', notas_validacion: 'Páreve sólo con sello', supermercados: ['Naturitas'] },
  { nombre: 'Bebida de trigo sarraceno', marca: 'ISOLA BIO', sabor_variante: 'Trigo sarraceno', fabricante: 'Isola Bio', tipo_validacion: 'certificacion_externa', notas_validacion: 'Páreve sólo con sello', supermercados: ['Naturitas'] },
  { nombre: 'Bebida de cebada', marca: 'ISOLA BIO', sabor_variante: 'Cebada', fabricante: 'Isola Bio', tipo_validacion: 'certificacion_externa', notas_validacion: 'Páreve sólo con sello', supermercados: ['Naturitas'] },
  { nombre: 'Bebida de arroz y avellana', marca: 'ISOLA BIO', sabor_variante: 'Arroz y avellana', fabricante: 'Isola Bio', tipo_validacion: 'certificacion_externa', notas_validacion: 'Páreve sólo con sello', supermercados: ['Naturitas'] },
  { nombre: 'Bebida de arroz y coco', marca: 'ISOLA BIO', sabor_variante: 'Arroz y coco', fabricante: 'Isola Bio', tipo_validacion: 'certificacion_externa', notas_validacion: 'Páreve sólo con sello', supermercados: ['Amazon', 'Naturitas', 'Corte Inglés'] },
  { nombre: 'Bebida de avena sin gluten', marca: 'ISOLA BIO', sabor_variante: 'Avena sin gluten', fabricante: 'Isola Bio', tipo_validacion: 'certificacion_externa', notas_validacion: 'Páreve sólo con sello', supermercados: ['Amazon', 'Naturitas', 'Corte Inglés'] },
  { nombre: 'Bebida de arroz integral', marca: 'ISOLA BIO', sabor_variante: 'Arroz integral', fabricante: 'Isola Bio', tipo_validacion: 'certificacion_externa', notas_validacion: 'Páreve sólo con sello', supermercados: ['Amazon', 'Naturitas', 'Corte Inglés'] },
  { nombre: 'Bebida de arroz con cacao', marca: 'ISOLA BIO', sabor_variante: 'Arroz con cacao', fabricante: 'Isola Bio', tipo_validacion: 'certificacion_externa', notas_validacion: 'Páreve sólo con sello', supermercados: ['Amazon', 'Naturitas', 'Corte Inglés'] },
  { nombre: 'Bebida de arroz', marca: 'ISOLA BIO', sabor_variante: 'Arroz', fabricante: 'Isola Bio', tipo_validacion: 'certificacion_externa', notas_validacion: 'Páreve sólo con sello', supermercados: ['Amazon', 'Naturitas', 'Corte Inglés'] },
  { nombre: 'Bebida de almendras', marca: 'ISOLA BIO', sabor_variante: 'Almendras', fabricante: 'Isola Bio', tipo_validacion: 'certificacion_externa', notas_validacion: 'Páreve sólo con sello', supermercados: ['Amazon', 'Naturitas', 'Corte Inglés'] },

  // ── CAFÉ, TÉS Y CHOCOLATES EN POLVO ────────────────────
  { nombre: 'Café soluble natural, descafeinado y todos los productos de la marca', marca: 'NESCAFÉ', sabor_variante: 'Natural, Descafeinado', fabricante: 'Nestlé', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['Alcampo', 'Día', 'Corte Inglés', 'Carrefour'] },
  { nombre: 'Café soluble natural y descafeinado', marca: 'AUCHÁN', sabor_variante: 'Natural, Descafeinado', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['Alcampo'] },
  { nombre: 'Café de Colombia', marca: 'AUCHÁN', sabor_variante: 'Colombia', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['Alcampo'] },
  { nombre: 'Café espresso', marca: 'AUCHÁN', sabor_variante: 'Espresso', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['Alcampo'] },
  { nombre: 'Café natural y descafeinado', marca: 'CARREFOUR', sabor_variante: 'Natural, Descafeinado', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['Carrefour'] },
  { nombre: 'Café selección liofilizado', marca: 'CARREFOUR', sabor_variante: 'Liofilizado', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['Carrefour'] },
  { nombre: 'Café de Colombia', marca: 'CARREFOUR', sabor_variante: 'Colombia', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['Carrefour'] },
  { nombre: 'Dolce Gusto lácteas (Chococcino, Cortado, Café Au Lait, Nesquick, etc.)', marca: 'NESCAFÉ', sabor_variante: 'Chococcino, Cortado, Café Au Lait, Flat white', fabricante: 'Nestlé', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Lácteo incluso sin sello', supermercados: ['Alcampo', 'Día', 'Corte Inglés', 'Carrefour'] },
  { nombre: 'Dolce Gusto parve (Barista, Espresso intenso, Lungo, Ristretto, etc.)', marca: 'NESCAFÉ', sabor_variante: 'Barista, Espresso intenso, Lungo, Ristretto', fabricante: 'Nestlé', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['Alcampo', 'Día', 'Corte Inglés', 'Carrefour'] },
  { nombre: 'Cápsulas de café natural, descafeinado y de sabores', marca: 'VIAGGIO', sabor_variante: 'Natural, Descafeinado, Varios sabores', fabricante: null, tipo_validacion: 'certificacion_externa', notas_validacion: 'Páreve sólo con sello', supermercados: ['Corte Inglés', 'Primaprix', 'Amazon'] },
  { nombre: 'Cápsulas de café natural, descafeinado y de sabores', marca: "DANIEL'S BLEND", sabor_variante: 'Natural, Descafeinado, Sabores', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['Amazon', 'Alcampo'] },
  { nombre: 'Cápsulas de café', marca: 'CAFFE MOTTA', sabor_variante: null, fabricante: null, tipo_validacion: 'certificacion_externa', notas_validacion: 'Páreve sólo con sello', supermercados: ['Primark'] },
  { nombre: 'Cápsulas de café de diferentes sabores', marca: 'NESPRESSO', sabor_variante: 'Diferentes sabores', fabricante: 'Nestlé', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['Carrefour', 'Alcampo', 'Día', 'Corte Inglés', 'Amazon'] },
  { nombre: 'Nesquik cacao en polvo', marca: 'NESTLÉ', sabor_variante: 'Cacao', fabricante: 'Nestlé', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['Alcampo', 'Día', 'Corte Inglés', 'Carrefour'] },
  { nombre: 'Preparado soluble al cacao', marca: 'DULCINEA', sabor_variante: null, fabricante: null, tipo_validacion: 'certificacion_externa', notas_validacion: 'Lácteo sólo con sello (no Jalav Israel)', supermercados: ['Alcampo', 'Carrefour', 'Corte Inglés'] },
  { nombre: 'Cacao puro', marca: 'COLACAO', sabor_variante: 'Puro 0% azúcar', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['Alcampo', 'Carrefour', 'Corte Inglés', 'Amazon'] },
  { nombre: 'ColaCao Turbo', marca: 'COLACAO', sabor_variante: 'Turbo', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['Alcampo', 'Carrefour', 'Corte Inglés'] },
  { nombre: 'Cacao a la taza listo para tomar original y noir', marca: 'PALADÍN', sabor_variante: 'Original, Noir', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['Alcampo', 'Día', 'Corte Inglés', 'Carrefour'] },
  { nombre: 'Cacao a la taza listo para tomar blanco', marca: 'PALADÍN', sabor_variante: 'Blanco', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Lácteo incluso sin sello', supermercados: ['Alcampo', 'Día', 'Corte Inglés'] },
  { nombre: 'Cacao orgánico en polvo instantáneo', marca: 'PACCARI', sabor_variante: 'Orgánico', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['Corte Inglés', 'Amazon'] },
  { nombre: 'Chocolate en polvo a la taza vainilla', marca: 'SIMON COLL', sabor_variante: 'Vainilla', fabricante: 'Simon Coll', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['Carrefour', 'Alcampo', 'Corte Inglés'] },
  { nombre: 'Chocolate en polvo a la taza extra', marca: 'SIMON COLL', sabor_variante: 'Extra', fabricante: 'Simon Coll', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Lácteo incluso sin sello', supermercados: ['Alcampo', 'Día', 'Corte Inglés', 'Carrefour'] },
  { nombre: 'Cacao negro intenso 70%', marca: 'VALOR', sabor_variante: '70% negro intenso', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['Alcampo', 'Día', 'Corte Inglés', 'Carrefour'] },
  { nombre: 'Cacao natural puro 100%', marca: 'VALOR', sabor_variante: '100% natural', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['Alcampo', 'Día', 'Corte Inglés', 'Carrefour'] },
  { nombre: 'Tés e infusiones de todos los sabores', marca: 'ARTEMÍS', sabor_variante: 'Todos los sabores', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['Alcampo', 'Amazon', 'Corte Inglés', 'Carrefour'] },
  { nombre: 'Tés e infusiones de todos los sabores', marca: 'CARREFOUR BIO', sabor_variante: 'Todos los sabores', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['Carrefour'] },

  // ── AZÚCARES Y EDULCORANTES ─────────────────────────────
  { nombre: 'Edulcorante de stevia en polvo', marca: 'HEALTH GARDEN', sabor_variante: 'Stevia', fabricante: null, tipo_validacion: 'certificacion_externa', notas_validacion: 'Páreve sólo con sello', supermercados: ['Amazon'] },
  { nombre: 'Stevia granulada', marca: 'DULCILIGHT', sabor_variante: 'Granulada', fabricante: null, tipo_validacion: 'certificacion_externa', notas_validacion: 'Páreve sólo con sello', supermercados: ['Amazon'] },
  { nombre: 'Edulcorante bajo en calorías', marca: 'SPLENDA', sabor_variante: null, fabricante: null, tipo_validacion: 'certificacion_externa', notas_validacion: 'Páreve sólo con sello', supermercados: ['Amazon'] },
  { nombre: 'Azúcar blanco, moreno, glaseado y panela', marca: 'AZUCARERA', sabor_variante: 'Blanco, Moreno, Glaseado, Panela', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['Corte Inglés', 'Día', 'Carrefour', 'Alcampo'] },
  { nombre: 'Azúcar blanco y moreno', marca: 'ACOR', sabor_variante: 'Blanco, Moreno', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['Corte Inglés', 'Día', 'Carrefour', 'Alcampo', 'Mercadona'] },

  // ── BARRITAS ────────────────────────────────────────────
  { nombre: 'Barritas veganas y sin gluten de diferentes sabores', marca: 'NAKD', sabor_variante: 'Varios sabores', fabricante: null, tipo_validacion: 'certificacion_externa', notas_validacion: 'Páreve sólo con sello', supermercados: ['En la mayoría de supermercados', 'Amazon'] },
  { nombre: 'Barritas de avena (Crunchy Canadian Maple, Oats & Dark Choc, Oats & Honey)', marca: 'NATURE VALLEY', sabor_variante: 'Canadian Maple Syrup, Oats & Dark Chocolate, Oats & Honey', fabricante: 'General Mills', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['En la mayoría de supermercados', 'Amazon'] },
  { nombre: 'Barritas de avena Sweet & Salty Nut Dark Chocolate & Nuts', marca: 'NATURE VALLEY', sabor_variante: 'Sweet & Salty Nut Dark Chocolate & Nuts', fabricante: 'General Mills', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Lácteo incluso sin sello', supermercados: ['En la mayoría de supermercados', 'Amazon'] },
  { nombre: 'Barrita Protein Peanut & Chocolate', marca: 'NATURE VALLEY', sabor_variante: 'Protein Peanut & Chocolate', fabricante: 'General Mills', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Lácteo incluso sin sello', supermercados: ['En la mayoría de supermercados', 'Amazon'] },
  { nombre: 'Barritas de cereales con trocitos de chocolate', marca: "KELLOG'S", sabor_variante: 'Chocolate', fabricante: "Kellogg's", tipo_validacion: 'certificacion_externa', notas_validacion: 'Lácteo sólo con sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Barritas (Almond & Coconut, Dark Choc nuts & sea salt, Blueberry Vanilla Cashew)', marca: 'BE-KIND', sabor_variante: 'Almond & Coconut, Dark Choc & Sea Salt, Blueberry Vanilla Cashew', fabricante: null, tipo_validacion: 'certificacion_externa', notas_validacion: 'Páreve sólo con sello', supermercados: ['En la mayoría de supermercados', 'Amazon'] },
  { nombre: 'Barritas Milk chocolate Almond, Peanut butter dark chocolate', marca: 'BE-KIND', sabor_variante: 'Milk Chocolate Almond, Peanut Butter Dark Chocolate', fabricante: null, tipo_validacion: 'certificacion_externa', notas_validacion: 'Lácteo sólo con sello', supermercados: ['En la mayoría de supermercados', 'Amazon'] },
  { nombre: 'Barritas de sésamo', marca: 'GRANOVITA', sabor_variante: 'Sésamo', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['Corte Inglés', 'Herbolarios'] },
  { nombre: 'Barrita ecológica de almendra', marca: 'BIOCOMERCIO', sabor_variante: 'Almendra', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['Amazon'] },
  { nombre: 'Barritas', marca: 'LARABAR', sabor_variante: null, fabricante: null, tipo_validacion: 'certificacion_externa', notas_validacion: 'Lácteo sólo con sello', supermercados: ['Amazon'] },
  { nombre: 'Barritas', marca: 'CLIF BAR', sabor_variante: null, fabricante: null, tipo_validacion: 'certificacion_externa', notas_validacion: 'Lácteo sólo con sello', supermercados: ['Amazon'] },
  { nombre: 'Barritas de almendras', marca: 'TASTE OF NATURE', sabor_variante: 'Almendras', fabricante: null, tipo_validacion: 'certificacion_externa', notas_validacion: 'Páreve sólo con sello', supermercados: ['Amazon'] },
  { nombre: 'Barritas (Nueces de Brasil, Cacahuete, Almendras, Blueberry)', marca: 'TASTE OF NATURE', sabor_variante: 'Nueces de Brasil, Cacahuete, Almendras, Blueberry', fabricante: null, tipo_validacion: 'certificacion_externa', notas_validacion: 'Páreve sólo con sello', supermercados: ['Amazon'] },
  { nombre: 'Barritas Chocolate peanut, dark chocolate sea salt', marca: 'TASTE OF NATURE', sabor_variante: 'Chocolate peanut, Dark chocolate sea salt', fabricante: null, tipo_validacion: 'certificacion_externa', notas_validacion: 'Lácteo sólo con sello', supermercados: ['Amazon'] },

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
    console.log(`\n🎉 Parte 1 completada:`);
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