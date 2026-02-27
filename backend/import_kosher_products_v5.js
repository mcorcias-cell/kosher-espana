// actualizar_kosher_parte4.js — Sección: Especias → Bebidas alcohólicas
// Ejecutar con: node actualizar_kosher_parte4.js
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const actualizaciones = [

  // ── MASAS Y ESPECIAS ────────────────────────────────────
  { nombre: 'Todas las especias de la marca', marca: 'ARTEMIS', sabor_variante: null, fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['Alcampo', 'Amazon', 'Corte Inglés', 'Carrefour'] },
  { nombre: 'Todas las especias de la marca', marca: 'CARREFOUR BIO', sabor_variante: null, fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['Carrefour'] },
  { nombre: 'Azafrán', marca: 'SAFRINA', sabor_variante: null, fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Pimentón', marca: 'LA LIDIA', sabor_variante: null, fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Todas las especias de la marca', marca: 'DANI', sabor_variante: null, fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Masa de churros marca blanca (sólo producidos por Eurofrits)', marca: 'EUROFRITS', sabor_variante: null, fabricante: 'Eurofrits', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello (solo producidos por Eurofrits)', supermercados: [] },
  { nombre: 'Masa brick 170g', marca: 'JR', sabor_variante: null, fabricante: null, tipo_validacion: 'certificacion_externa', notas_validacion: 'Páreve sólo con sello', supermercados: [] },
  { nombre: 'Pasta filo especial para hojaldres y tartas', marca: 'JR', sabor_variante: null, fabricante: null, tipo_validacion: 'certificacion_externa', notas_validacion: 'Páreve sólo con sello', supermercados: [] },

  // ── LEVADURAS Y ESENCIAS ────────────────────────────────
  { nombre: 'Levadura fresca', marca: 'LEVANOVA LESAFFRE', sabor_variante: null, fabricante: 'Lesaffre', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Preparado de masa madre', marca: 'LEVANOVA LESAFFRE', sabor_variante: null, fabricante: 'Lesaffre', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Levadura seca', marca: 'LEVANOVA LESAFFRE', sabor_variante: null, fabricante: 'Lesaffre', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: "L'hirondelle 1895", marca: 'LESAFFRE', sabor_variante: null, fabricante: 'Lesaffre', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: [] },
  { nombre: 'Polvo de hornear', marca: 'ROYAL', sabor_variante: null, fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Levadura fresca 500g', marca: 'HÉRCULES', sabor_variante: null, fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Escencia de vainilla', marca: 'MARDEL', sabor_variante: 'Vainilla', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Polvo de hornear', marca: 'NIELSEN MASSEY', sabor_variante: null, fabricante: null, tipo_validacion: 'certificacion_externa', notas_validacion: 'Páreve sólo con sello', supermercados: [] },

  // ── HELADOS ─────────────────────────────────────────────
  { nombre: 'Helado de diferentes sabores', marca: "BEN & JERRY'S", sabor_variante: 'Diferentes sabores', fabricante: 'Unilever', tipo_validacion: 'certificacion_externa', notas_validacion: 'Lácteo sólo con sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Oat (helado de avena)', marca: "BEN & JERRY'S", sabor_variante: 'Avena', fabricante: 'Unilever', tipo_validacion: 'certificacion_externa', notas_validacion: 'Páreve sólo con sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Coca cola, limón, naranja', marca: 'CALIPPO', sabor_variante: 'Coca cola, Limón, Naranja', fabricante: 'Unilever', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Tarta helada Toblerone, Milka y Daim', marca: 'ALMONDY', sabor_variante: 'Toblerone, Milka, Daim', fabricante: null, tipo_validacion: 'certificacion_externa', notas_validacion: 'Lácteo sólo con sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Helado (plant-based gelato)', marca: 'VALSOIA', sabor_variante: null, fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Helado de diferentes sabores', marca: 'HAAGEN DAZS', sabor_variante: 'Diferentes sabores', fabricante: null, tipo_validacion: 'certificacion_externa', notas_validacion: 'Lácteo sólo con sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Helado vegano de Blueberry cookie', marca: 'MAGNUM', sabor_variante: 'Blueberry cookie', fabricante: 'Unilever', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Helado vegano Classic stick', marca: 'MAGNUM', sabor_variante: 'Classic', fabricante: 'Unilever', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Helado vegano Almond', marca: 'MAGNUM', sabor_variante: 'Almond', fabricante: 'Unilever', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['En la mayoría de supermercados'] },

  // ── FRUTOS SECOS ────────────────────────────────────────
  { nombre: 'Cocktail de frutos secos', marca: 'BORGES', sabor_variante: 'Cocktail', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Cacahuetes tostados con miel y sal', marca: 'BORGES', sabor_variante: 'Miel y sal', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Almendras crudas, naturales y sus derivados', marca: 'BORGES', sabor_variante: 'Crudas, Naturales', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Cacahuetes', marca: 'BORGES', sabor_variante: null, fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Pistachos', marca: 'BORGES', sabor_variante: null, fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Almendras Marcona tostadas', marca: 'BORGES', sabor_variante: 'Marcona tostadas', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Anacardos', marca: 'BORGES', sabor_variante: null, fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Avellanas', marca: 'BORGES', sabor_variante: null, fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Natura mix', marca: 'BORGES', sabor_variante: null, fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Nueces', marca: 'BORGES', sabor_variante: null, fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Frutos secos (almendra, pistacho, anacardo, cacahuete, avellana, nuez)', marca: 'SALYSOL', sabor_variante: 'Almendra, Pistacho, Anacardo, Cacahuete, Avellana, Nuez', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello (gominolas necesitan sello)', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Fruta deshidratada (ciruelas, orejones, pasas, arándanos)', marca: 'PRUNITA-AGROSERC', sabor_variante: 'Ciruelas, Orejones, Pasas, Arándanos', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: [] },
  { nombre: 'Frutos secos (almendra, pistacho, anacardo, cacahuete, avellana, nuez)', marca: 'PRUNITA-AGROSERC', sabor_variante: 'Almendra, Pistacho, Anacardo, Cacahuete, Avellana, Nuez', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: [] },
  { nombre: 'Frutos secos garrapiñados (almendra, avellana, cacahuete, pipa, nuez)', marca: 'PRUNITA-AGROSERC', sabor_variante: 'Garrapiñados', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: [] },
  { nombre: 'Frutos secos chocolateados (almendra, anacardo, arándano, avellana, etc.)', marca: 'PRUNITA-AGROSERC', sabor_variante: 'Chocolateados', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: [] },

  // ── CARAMELOS ───────────────────────────────────────────
  { nombre: 'Bonbon Equinacea, santasapina y Salvia', marca: 'A. VOGEL', sabor_variante: 'Equinacea, Santasapina, Salvia', fabricante: null, tipo_validacion: 'certificacion_externa', notas_validacion: 'Páreve sólo con sello', supermercados: [] },
  { nombre: 'Piruletas de corazón', marca: 'FIESTA', sabor_variante: null, fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Caramelos duros de menta', marca: 'SMINT', sabor_variante: 'Menta', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Caramelos de limón y menta', marca: 'RICOLA', sabor_variante: 'Limón, Menta', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Caramelos de hierba de miel y originales', marca: 'RICOLA', sabor_variante: 'Hierba de miel, Original', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Caramelo duro de eucalipto', marca: 'PICTOLÍN', sabor_variante: 'Eucalipto', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'De miel y regalíz, de eucalipto', marca: 'RESPIRAL', sabor_variante: 'Miel y regaliz, Eucalipto', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'De fresa y cola', marca: 'PETA ZETAS', sabor_variante: 'Fresa, Cola', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['En la mayoría de supermercados'] },

  // ── CHOCOLATES ──────────────────────────────────────────
  { nombre: 'Dark, chocolate con leche y white', marca: 'KIT KAT', sabor_variante: 'Dark, Con leche, White', fabricante: 'Nestlé', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Lácteo incluso sin sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Bolitas de chocolate con leche', marca: 'MALTESERS', sabor_variante: null, fabricante: 'Mars', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Lácteo incluso sin sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Mars Bar', marca: 'MARS', sabor_variante: null, fabricante: 'Mars', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Lácteo incluso sin sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Barritas de chocolate con cacahuete y caramelo', marca: 'SNICKERS', sabor_variante: null, fabricante: 'Mars', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Lácteo incluso sin sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Barrita de chocolate con leche con galleta crujiente y caramelo', marca: 'TWIX', sabor_variante: 'Con leche', fabricante: 'Mars', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Lácteo incluso sin sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Barrita de chocolate blanco con galleta crujiente y caramelo', marca: 'TWIX', sabor_variante: 'Blanco', fabricante: 'Mars', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Lácteo incluso sin sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Chocolate de coco', marca: 'BOUNTY BAR', sabor_variante: 'Coco', fabricante: 'Mars', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Lácteo incluso sin sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Chocolate con leche y almendras', marca: 'TOBLERONE', sabor_variante: 'Con leche y almendras', fabricante: 'Mondelez', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Lácteo incluso sin sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Chocolate thin mints (sólo los producidos en Inglaterra)', marca: 'AFTER EIGHT', sabor_variante: 'Thin mints', fabricante: 'Nestlé', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Lácteo incluso sin sello (sólo los producidos en Inglaterra)', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Trufas de chocolate', marca: 'DULCINEA', sabor_variante: null, fabricante: null, tipo_validacion: 'certificacion_externa', notas_validacion: 'Lácteo sólo con sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Barra de chocolate (Milk chocolate, kisses, con almendras, blanco)', marca: "HERSHEY'S", sabor_variante: 'Milk chocolate, Kisses, Con almendras, Blanco', fabricante: null, tipo_validacion: 'certificacion_externa', notas_validacion: 'Lácteo sólo con sello', supermercados: [] },
  { nombre: 'Chocolate 70%, blanco, bitter 50% y con leche', marca: 'SIMON COLL', sabor_variante: '70%, Blanco, Bitter 50%, Con leche', fabricante: 'Simon Coll', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Lácteo incluso sin sello', supermercados: ['Carrefour', 'Corte Inglés'] },
  { nombre: 'Chocolate botella 300g', marca: 'SIMON COLL', sabor_variante: null, fabricante: 'Simon Coll', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Lácteo incluso sin sello', supermercados: ['Carrefour', 'Corte Inglés'] },
  { nombre: 'Sombrilla 35g corazones', marca: 'SIMON COLL', sabor_variante: 'Corazones', fabricante: 'Simon Coll', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Lácteo incluso sin sello', supermercados: ['Carrefour', 'Corte Inglés'] },
  { nombre: 'Botella corazones 300g', marca: 'SIMON COLL', sabor_variante: 'Corazones', fabricante: 'Simon Coll', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Lácteo incluso sin sello', supermercados: ['Carrefour', 'Corte Inglés'] },
  { nombre: 'Choco-sticks 20g', marca: 'SIMON COLL', sabor_variante: null, fabricante: 'Simon Coll', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Lácteo incluso sin sello', supermercados: ['Carrefour', 'Corte Inglés'] },
  { nombre: 'Milk chocolate Umbrella 35g', marca: 'SIMON COLL', sabor_variante: null, fabricante: 'Simon Coll', tipo_validacion: 'certificacion_externa', notas_validacion: 'Lácteo sólo con sello', supermercados: ['Carrefour', 'Corte Inglés'] },
  { nombre: 'Chocolate para repostería, más de 160 productos', marca: 'CALLEBAUT', sabor_variante: null, fabricante: null, tipo_validacion: 'certificacion_externa', notas_validacion: 'Páreve/lácteo según el caso, sólo con sello', supermercados: [] },
  { nombre: 'Chocolate botella 40g', marca: 'SIMON COLL', sabor_variante: null, fabricante: 'Simon Coll', tipo_validacion: 'certificacion_externa', notas_validacion: 'Lácteo sólo con sello', supermercados: ['Carrefour', 'Corte Inglés'] },
  { nombre: 'Chocolate 70% cocoa napolitains 12u', marca: 'SIMON COLL', sabor_variante: '70% cocoa', fabricante: 'Simon Coll', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Lácteo incluso sin sello', supermercados: ['Carrefour', 'Corte Inglés'] },
  { nombre: 'Chocolate extra fine rich milk 18gr', marca: 'SIMON COLL', sabor_variante: 'Extra fine rich milk', fabricante: 'Simon Coll', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Lácteo incluso sin sello', supermercados: ['Carrefour', 'Corte Inglés'] },
  { nombre: 'Sardinas de chocolate 24g', marca: 'SIMON COLL', sabor_variante: null, fabricante: 'Simon Coll', tipo_validacion: 'certificacion_externa', notas_validacion: 'Lácteo sólo con sello', supermercados: ['Carrefour', 'Corte Inglés'] },
  { nombre: 'Chocolatina unicorn 2 x 18g', marca: 'SIMON COLL', sabor_variante: 'Unicorn', fabricante: 'Simon Coll', tipo_validacion: 'certificacion_externa', notas_validacion: 'Lácteo sólo con sello', supermercados: ['Carrefour', 'Corte Inglés'] },
  { nombre: 'Chocolatina dinos 2 x 18g', marca: 'SIMON COLL', sabor_variante: 'Dinos', fabricante: 'Simon Coll', tipo_validacion: 'certificacion_externa', notas_validacion: 'Lácteo sólo con sello', supermercados: ['Carrefour', 'Corte Inglés'] },
  { nombre: 'Chocolatina corazones 3 x 18g', marca: 'SIMON COLL', sabor_variante: 'Corazones', fabricante: 'Simon Coll', tipo_validacion: 'certificacion_externa', notas_validacion: 'Lácteo sólo con sello', supermercados: ['Carrefour', 'Corte Inglés'] },
  { nombre: 'Sombrilla unicorn 15g', marca: 'SIMON COLL', sabor_variante: 'Unicorn', fabricante: 'Simon Coll', tipo_validacion: 'certificacion_externa', notas_validacion: 'Lácteo sólo con sello', supermercados: ['Carrefour', 'Corte Inglés'] },
  { nombre: 'Milk chocolate napolitains 12U', marca: 'SIMON COLL', sabor_variante: null, fabricante: 'Simon Coll', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Lácteo incluso sin sello', supermercados: ['Carrefour', 'Corte Inglés'] },

  // ── PATATAS FRITAS Y APERITIVOS ─────────────────────────
  { nombre: 'Patatas fritas al punto de sal', marca: "LAY'S", sabor_variante: 'Al punto de sal', fabricante: 'PepsiCo', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Patatas caseras', marca: 'FRIT RAVICH', sabor_variante: null, fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Palomitas', marca: 'POPZ', sabor_variante: null, fabricante: null, tipo_validacion: 'certificacion_externa', notas_validacion: 'Páreve sólo con sello en el producto', supermercados: [] },
  { nombre: 'Snacks vegetales', marca: 'TERRA', sabor_variante: null, fabricante: null, tipo_validacion: 'certificacion_externa', notas_validacion: 'Páreve sólo con sello en el producto', supermercados: [] },

  // ── ALIMENTACIÓN INFANTIL ───────────────────────────────
  { nombre: 'Leche para lactantes 1, 2 y 3', marca: 'NIDINA', sabor_variante: '1, 2 y 3', fabricante: 'Nestlé', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Lácteo incluso sin sello', supermercados: ['Farmacias', 'Carrefour', 'Corte Inglés'] },
  { nombre: 'Leche para lactantes Total comfort', marca: 'SIMILAC', sabor_variante: 'Total comfort', fabricante: 'Abbott', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Lácteo incluso sin sello', supermercados: ['Farmacias'] },
  { nombre: 'Leche para lactantes pro grow&gain', marca: 'GAIN/PEDIASURE', sabor_variante: 'Pro grow&gain', fabricante: 'Abbott', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Lácteo incluso sin sello', supermercados: ['Farmacias'] },
  { nombre: 'Leche para lactantes 1, 2 y 3', marca: 'SIMILAC', sabor_variante: '1, 2 y 3', fabricante: 'Abbott', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Lácteo incluso sin sello', supermercados: ['Farmacias'] },
  { nombre: 'Leche para lactantes pro, sin lactosa', marca: 'SIMILAC', sabor_variante: 'Pro, Sin lactosa', fabricante: 'Abbott', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Lácteo incluso sin sello', supermercados: ['Farmacias'] },
  { nombre: 'Leche para lactantes neosure', marca: 'SIMILAC', sabor_variante: 'Neosure', fabricante: 'Abbott', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Lácteo incluso sin sello', supermercados: ['Farmacias'] },
  { nombre: 'Batido plus', marca: 'ENSURE/PEDIASURE', sabor_variante: 'Plus', fabricante: 'Abbott', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Lácteo incluso sin sello', supermercados: ['Farmacias'] },
  { nombre: 'Batido original', marca: 'GLUCERNA SIMILAC', sabor_variante: 'Original', fabricante: 'Abbott', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Lácteo incluso sin sello', supermercados: ['Farmacias'] },
  { nombre: 'Leche para lactantes Advance HA', marca: 'SIMILAC', sabor_variante: 'Advance HA', fabricante: 'Abbott', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Lácteo incluso sin sello', supermercados: ['Farmacias'] },

  // ── ACEITES ─────────────────────────────────────────────
  { nombre: 'Aceite de oliva extra virgen', marca: 'ÁBACO', sabor_variante: 'Extra virgen', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Aceite de oliva extra virgen', marca: 'ABRIL', sabor_variante: 'Extra virgen', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Aceite de oliva extra virgen', marca: 'ALBERT', sabor_variante: 'Extra virgen', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Aceite de oliva extra virgen', marca: 'BORGES', sabor_variante: 'Extra virgen', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Aceite de oliva extra virgen', marca: 'CAMPOSUR', sabor_variante: 'Extra virgen', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Aceite de oliva extra virgen', marca: 'CANOLIVA', sabor_variante: 'Extra virgen', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Aceite de oliva extra virgen', marca: 'CAPICUA', sabor_variante: 'Extra virgen', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Aceite de oliva extra virgen', marca: 'CARBONELL', sabor_variante: 'Extra virgen', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Aceite de oliva extra virgen', marca: 'DCOOP', sabor_variante: 'Extra virgen', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Aceite de oliva extra virgen', marca: 'FRANCISCO GOMEZ', sabor_variante: 'Extra virgen', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Aceite de oliva extra virgen', marca: 'GRANOVITA', sabor_variante: 'Extra virgen', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Aceite de oliva extra virgen', marca: 'LA ESPAÑOLA', sabor_variante: 'Extra virgen', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Aceite de oliva extra virgen', marca: 'MANZANO', sabor_variante: 'Extra virgen', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Aceite de oliva extra virgen', marca: 'OLISIERRA', sabor_variante: 'Extra virgen', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Aceite de oliva extra virgen', marca: 'URZANTE', sabor_variante: 'Extra virgen', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Aceite de oliva extra virgen', marca: 'DINTEL (ACEITES TOLEDO)', sabor_variante: 'Extra virgen', fabricante: 'Aceites Toledo', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Aceite de oliva virgen', marca: 'ÁBACO', sabor_variante: 'Virgen', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Aceite de oliva virgen', marca: 'ABRIL', sabor_variante: 'Virgen', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Aceite de oliva virgen', marca: 'ALBERT', sabor_variante: 'Virgen', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Aceite de oliva virgen', marca: 'BORGES', sabor_variante: 'Virgen', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Aceite de oliva virgen', marca: 'CAPICUA', sabor_variante: 'Virgen', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Aceite de oliva virgen', marca: 'CARBONELL', sabor_variante: 'Virgen', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Aceite de oliva virgen', marca: 'LA ESPAÑOLA', sabor_variante: 'Virgen', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Aceite de oliva virgen', marca: 'URZANTE', sabor_variante: 'Virgen', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Aceite de oliva', marca: 'ÁBACO', sabor_variante: null, fabricante: null, tipo_validacion: 'certificacion_externa', notas_validacion: 'Páreve sólo con sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Aceite de oliva', marca: 'CAPICUA', sabor_variante: null, fabricante: null, tipo_validacion: 'certificacion_externa', notas_validacion: 'Páreve sólo con sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Aceite de oliva', marca: 'CARBONELL', sabor_variante: null, fabricante: null, tipo_validacion: 'certificacion_externa', notas_validacion: 'Páreve sólo con sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Aceite de oliva', marca: 'DINTEL (ACEITES TOLEDO)', sabor_variante: null, fabricante: 'Aceites Toledo', tipo_validacion: 'certificacion_externa', notas_validacion: 'Páreve sólo con sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Aceite de oliva', marca: 'LA ESPAÑOLA', sabor_variante: null, fabricante: null, tipo_validacion: 'certificacion_externa', notas_validacion: 'Páreve sólo con sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Aceite de oliva', marca: 'URZANTE', sabor_variante: null, fabricante: null, tipo_validacion: 'certificacion_externa', notas_validacion: 'Páreve sólo con sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Aceite de girasol', marca: 'ABRIL SOL', sabor_variante: 'Girasol', fabricante: null, tipo_validacion: 'certificacion_externa', notas_validacion: 'Páreve sólo con sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Aceite de girasol', marca: 'ALBERT', sabor_variante: 'Girasol', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Aceite de girasol', marca: 'ÁBACO', sabor_variante: 'Girasol', fabricante: null, tipo_validacion: 'certificacion_externa', notas_validacion: 'Páreve sólo con sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Aceite de girasol', marca: 'CAPICUA', sabor_variante: 'Girasol', fabricante: null, tipo_validacion: 'certificacion_externa', notas_validacion: 'Páreve sólo con sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Aceite de girasol', marca: 'DON SOL (A. TOLEDO)', sabor_variante: 'Girasol', fabricante: 'Aceites Toledo', tipo_validacion: 'certificacion_externa', notas_validacion: 'Páreve sólo con sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Aceite de girasol', marca: 'MANZANO', sabor_variante: 'Girasol', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Aceite de aguacate', marca: 'ALBERT', sabor_variante: 'Aguacate', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['En la mayoría de supermercados'] },

  // ── BEBIDAS Y REFRESCOS ─────────────────────────────────
  { nombre: 'Coca-Cola Original', marca: 'COCA COLA', sabor_variante: 'Original', fabricante: 'The Coca-Cola Company', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Coca-Cola Light', marca: 'COCA COLA', sabor_variante: 'Light', fabricante: 'The Coca-Cola Company', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Coca-Cola Zero', marca: 'COCA COLA', sabor_variante: 'Zero', fabricante: 'The Coca-Cola Company', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Coca-Cola Zero azúcar Zero cafeína', marca: 'COCA COLA', sabor_variante: 'Zero azúcar Zero cafeína', fabricante: 'The Coca-Cola Company', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Sprite Light refresco con gas lima-limón', marca: 'SPRITE', sabor_variante: 'Light lima-limón', fabricante: 'The Coca-Cola Company', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Fanta Naranja', marca: 'FANTA', sabor_variante: 'Naranja', fabricante: 'The Coca-Cola Company', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Lipton Zero bebida de té al limón', marca: 'LIPTON', sabor_variante: 'Té limón Zero', fabricante: 'Unilever', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Lipton Zero bebida de té con sabor a melocotón', marca: 'LIPTON', sabor_variante: 'Té melocotón Zero', fabricante: 'Unilever', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Nestea bebida de té al limón', marca: 'NESTEA', sabor_variante: 'Té limón', fabricante: 'Nestlé', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Nestea bebida de melocotón', marca: 'NESTEA', sabor_variante: 'Melocotón', fabricante: 'Nestlé', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Pepsi refresco de cola', marca: 'PEPSI', sabor_variante: 'Original', fabricante: 'PepsiCo', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Pepsi refresco de cola Zero sin azúcar', marca: 'PEPSI', sabor_variante: 'Zero sin azúcar', fabricante: 'PepsiCo', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: '7UP refresco de lima limón', marca: '7UP', sabor_variante: 'Lima limón', fabricante: 'PepsiCo', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'La Casera gaseosa botella', marca: 'LA CASERA', sabor_variante: null, fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Schweppes tónica clásica', marca: 'SCHWEPPES', sabor_variante: 'Tónica clásica', fabricante: 'The Coca-Cola Company', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Schweppes Ginger Ale', marca: 'SCHWEPPES', sabor_variante: 'Ginger Ale', fabricante: 'The Coca-Cola Company', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Schweppes Ginger Ale Canada Dry', marca: 'SCHWEPPES', sabor_variante: 'Ginger Ale Canada Dry', fabricante: 'The Coca-Cola Company', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['En la mayoría de supermercados'] },

  // ── ZUMOS ───────────────────────────────────────────────
  { nombre: 'Limonada clásica', marca: 'MINUTE MAID', sabor_variante: 'Limonada', fabricante: 'The Coca-Cola Company', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Zumo de naranja', marca: 'MINUTE MAID', sabor_variante: 'Naranja', fabricante: 'The Coca-Cola Company', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Zumos (todos menos los que contienen uva)', marca: 'GRANINI', sabor_variante: 'Todos menos uva', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve (todos menos los que contienen uva)', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Zumo de naranja', marca: 'DON SIMÓN', sabor_variante: 'Naranja', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Pure premium Zumo de naranja', marca: 'TROPICANA', sabor_variante: 'Naranja', fabricante: 'PepsiCo', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Pure premium Zumo de piña', marca: 'TROPICANA', sabor_variante: 'Piña', fabricante: 'PepsiCo', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Pure Premium Zumo de naranja y mango', marca: 'TROPICANA', sabor_variante: 'Naranja y mango', fabricante: 'PepsiCo', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['En la mayoría de supermercados'] },

  // ── BEBIDAS ALCOHÓLICAS ─────────────────────────────────
  { nombre: 'Anís', marca: 'LAS CADENAS', sabor_variante: null, fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: [] },
  { nombre: 'Anís', marca: 'CHINCHÓN DULCE', sabor_variante: null, fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: [] },
  { nombre: 'Cervezas - todas las marcas naturales sin aditivos', marca: 'AMSTEL', sabor_variante: null, fabricante: 'Heineken', tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Cervezas - todas las marcas naturales sin aditivos', marca: 'HEINEKEN', sabor_variante: null, fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Cervezas - todas las marcas naturales sin aditivos', marca: 'SAN MIGUEL', sabor_variante: null, fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: ['En la mayoría de supermercados'] },
  { nombre: 'Licor (sólo el elaborado en Francia)', marca: 'COINTREAU', sabor_variante: null, fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello (solo elaborado en Francia)', supermercados: [] },
  { nombre: 'Licor (sólo el embotellado en Reino Unido)', marca: 'DRAMBUIE', sabor_variante: null, fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello (solo embotellado en UK)', supermercados: [] },
  { nombre: 'Limoncello', marca: 'PALLINI', sabor_variante: null, fabricante: null, tipo_validacion: 'certificacion_externa', notas_validacion: 'Páreve sólo con sello en el producto', supermercados: [] },
  { nombre: 'Ginebra New Legend', marca: 'BEEFEATER', sabor_variante: 'New Legend', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: [] },
  { nombre: 'Ginebra', marca: 'BEEFEATER', sabor_variante: null, fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: [] },
  { nombre: 'Ginebra Pink strawberry', marca: 'BEEFEATER', sabor_variante: 'Pink strawberry', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: [] },
  { nombre: 'Ginebra London dry 24', marca: 'BEEFEATER', sabor_variante: 'London dry 24', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: [] },
  { nombre: 'Ginebra Plymouth Dry', marca: 'PLYMOUTH', sabor_variante: 'Plymouth Dry', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: [] },
  { nombre: 'Ginebra extra seca', marca: 'SEAGRAMS', sabor_variante: 'Extra seca', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: [] },
  { nombre: 'Ginebra', marca: 'BOMBAY', sabor_variante: null, fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: [] },
  { nombre: 'Ginebra', marca: 'MERMAID', sabor_variante: null, fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: [] },
  { nombre: 'Ginebra', marca: 'MASTERS', sabor_variante: null, fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: [] },
  { nombre: 'Ron blanco scotch', marca: 'BACARDÍ', sabor_variante: 'Blanco', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: [] },
  { nombre: 'Ron añejo', marca: 'CAÑA DEL CARIBE', sabor_variante: 'Añejo', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: [] },
  { nombre: 'Whisky', marca: 'CROWN ROYAL', sabor_variante: null, fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: [] },
  { nombre: 'Whisky fine old', marca: 'WHITE HORSE', sabor_variante: 'Fine old', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: [] },
  { nombre: 'Whisky extra fine', marca: 'PLYMOUTH', sabor_variante: 'Extra fine', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: [] },
  { nombre: 'Whisky', marca: 'JOHNNY WALKER', sabor_variante: null, fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: [] },
  { nombre: 'Whisky', marca: "BALLANTINE'S", sabor_variante: null, fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: [] },
  { nombre: 'Whisky', marca: 'J&B', sabor_variante: null, fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: [] },
  { nombre: 'Whisky etiqueta blanca', marca: "DEWAR'S", sabor_variante: 'Etiqueta blanca', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: [] },
  { nombre: 'Whisky', marca: 'CUTTY SARK', sabor_variante: null, fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: [] },
  { nombre: 'Whisky Chivas Regal y Royal Salute', marca: 'CHIVAS REGAL', sabor_variante: 'Chivas Regal, Royal Salute', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: [] },
  { nombre: 'Whisky', marca: "JACK DANIEL'S", sabor_variante: null, fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: [] },
  { nombre: 'Whisky', marca: 'FOUR ROSES', sabor_variante: null, fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: [] },
  { nombre: 'Whisky 12 años', marca: 'THE IRISH MAN', sabor_variante: '12 años', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: [] },
  { nombre: 'Whisky small batch', marca: 'TEELING', sabor_variante: 'Small batch', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: [] },
  { nombre: 'Whisky Barry Crockett Legacy', marca: 'MIDLETON', sabor_variante: 'Barry Crockett Legacy', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: [] },
  { nombre: 'Whisky 12 años', marca: 'KNAPPOGUE CASTLE', sabor_variante: '12 años', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: [] },
  { nombre: 'Whisky', marca: 'JIM BEAM', sabor_variante: null, fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: [] },
  { nombre: 'Vodka', marca: 'AIREM', sabor_variante: null, fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: [] },
  { nombre: 'Vodka (Allure, Epicure y Noble)', marca: 'BELUGA', sabor_variante: 'Allure, Epicure, Noble', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: [] },
  { nombre: 'Vodka', marca: 'ABSOLUT', sabor_variante: null, fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: [] },
  { nombre: 'Vodka Prince Igor 37.5% y premium 40%', marca: 'IGOR', sabor_variante: '37.5%, Premium 40%', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: [] },
  { nombre: 'Vodka pineapple, orange y lime', marca: 'MG SPIRIT', sabor_variante: 'Pineapple, Orange, Lime', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: [] },
  { nombre: 'Tequila 1800 Silver, Reposado y Añejo', marca: '1800', sabor_variante: 'Silver, Reposado, Añejo', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: [] },
  { nombre: 'Tequila XO Café', marca: 'PATRÓN', sabor_variante: 'XO Café', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: [] },
  { nombre: 'Tequila Plata y oro', marca: 'JOSÉ CUERVO', sabor_variante: 'Plata, Oro', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: [] },
  { nombre: 'Tequila blanco', marca: 'SAUZA', sabor_variante: 'Blanco', fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: [] },
  { nombre: 'Mojito', marca: 'MG SPIRIT', sabor_variante: null, fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: [] },
  { nombre: 'Mojito', marca: 'ZUMOSFERA', sabor_variante: null, fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: [] },
  { nombre: 'Sidra', marca: 'LADRÓN DE MANZANAS', sabor_variante: null, fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: [] },
  { nombre: 'Aguardiente', marca: 'CALVADOS', sabor_variante: null, fabricante: null, tipo_validacion: 'ingredientes_verificables', notas_validacion: 'Páreve incluso sin sello', supermercados: [] },

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
    console.log(`\n🎉 Parte 4 completada:`);
    console.log(`   ✅ Actualizados: ${actualizados}`);
    console.log(`   ⚠️  No encontrados: ${noEncontrados}`);
    console.log(`\n✨ ¡Todas las partes ejecutadas! Base de datos completamente actualizada.`);

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