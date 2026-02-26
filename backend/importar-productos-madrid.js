// importar-productos-madrid.js
// Ejecutar con: node importar-productos-madrid.js
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// ============================================================
// LISTA COMPLETA - Comunidad Judía de Madrid - Febrero 2026
// ============================================================
const productos = [

  // ── PAN Y GALLETAS SALADAS ──────────────────────────────
  { nombre: 'Pan tostado crusstini y classic croutons', marca: 'Monviso', sabor_variante: 'Classic, Rosemary, Olive and Garlic', categoria: 'Pan y Galletas saladas', supermercados: 'Carrefour', tipo_kosher: 'Páreve sólo con sello', justificacion: 'Certificado por la Comunidad Judía de Madrid (Febrero 2026). Páreve sólo con sello.' },
  { nombre: 'Galletas saladas', marca: 'Gullón', sabor_variante: '', categoria: 'Pan y Galletas saladas', supermercados: 'Carrefour, Alcampo, Corte Inglés, Amazon', tipo_kosher: 'Páreve incluso sin sello', justificacion: 'Certificado por la Comunidad Judía de Madrid (Febrero 2026). Páreve incluso sin sello.' },
  { nombre: 'Crackers de agua', marca: "Carr's", sabor_variante: '', categoria: 'Pan y Galletas saladas', supermercados: 'Carrefour, Alcampo', tipo_kosher: 'Páreve sólo con sello', justificacion: 'Certificado por la Comunidad Judía de Madrid (Febrero 2026). Páreve sólo con sello.' },
  { nombre: 'Tostadas', marca: 'Finn Crisp', sabor_variante: 'Diferentes sabores', categoria: 'Pan y Galletas saladas', supermercados: 'Carrefour, Alcampo, Corte Inglés', tipo_kosher: 'Páreve sólo con sello (Kosher Finland)', justificacion: 'Certificado por la Comunidad Judía de Madrid (Febrero 2026). Páreve sólo con sello (Kosher Finland).' },
  { nombre: 'Tortitas de arroz Vitalday', marca: 'Gullón', sabor_variante: '', categoria: 'Pan y Galletas saladas', supermercados: 'Carrefour, Alcampo, Corte Inglés', tipo_kosher: 'Páreve incluso sin sello', justificacion: 'Certificado por la Comunidad Judía de Madrid (Febrero 2026). Páreve incluso sin sello.' },
  { nombre: 'Tortitas de maíz Vitalday', marca: 'Gullón', sabor_variante: '', categoria: 'Pan y Galletas saladas', supermercados: 'Carrefour, Alcampo, Corte Inglés, Amazon', tipo_kosher: 'Páreve incluso sin sello', justificacion: 'Certificado por la Comunidad Judía de Madrid (Febrero 2026). Páreve incluso sin sello.' },
  { nombre: 'Galletas', marca: 'Kookie Cat', sabor_variante: 'Almond Chocolate, Cacao Nibs, Walnut Chia, Lemon, Chocolate Covered Peanut Butter, Double Choc Walnuts Hemp Cacao, Pineapple Orange, Salted Caramel Almond, Vanilla Choc Chip, Wild Berries', categoria: 'Pan y Galletas saladas', supermercados: 'Corte Inglés y sitios orgánicos', tipo_kosher: 'Páreve incluso sin sello', justificacion: 'Certificado por la Comunidad Judía de Madrid (Febrero 2026). Páreve incluso sin sello.' },
  { nombre: 'Tortas de aceite de oliva Virgen Extra', marca: 'Ines Rosales', sabor_variante: '', categoria: 'Pan y Galletas saladas', supermercados: 'Carrefour, Alcampo, Corte Inglés, Amazon', tipo_kosher: 'Páreve sólo con sello', justificacion: 'Certificado por la Comunidad Judía de Madrid (Febrero 2026). Páreve sólo con sello.' },
  { nombre: 'Pan de sandwich en formato congelado', marca: 'Warburtons', sabor_variante: '', categoria: 'Pan y Galletas saladas', supermercados: 'Carrefour, Corte Inglés', tipo_kosher: 'Páreve incluso sin sello', justificacion: 'Certificado por la Comunidad Judía de Madrid (Febrero 2026). Páreve incluso sin sello.' },
  { nombre: 'Pan tostado de cereales y semillas', marca: 'Hacendado', sabor_variante: '', categoria: 'Pan y Galletas saladas', supermercados: 'Mercadona', tipo_kosher: 'Páreve - sólo producto de Alcalá de Henares, incluso sin sello', justificacion: 'Certificado por la Comunidad Judía de Madrid (Febrero 2026). Páreve, sólo el producto de Alcalá de Henares, incluso sin sello.' },
  { nombre: 'Pan tostado de ajo y perejil y de tomate', marca: 'Hacendado', sabor_variante: 'Ajo y perejil, Tomate', categoria: 'Pan y Galletas saladas', supermercados: 'Mercadona', tipo_kosher: 'Páreve - sólo producto de Alcalá de Henares, incluso sin sello', justificacion: 'Certificado por la Comunidad Judía de Madrid (Febrero 2026). Páreve, sólo el producto de Alcalá de Henares, incluso sin sello.' },
  { nombre: 'Pan de sandwich tradicional', marca: 'Hacendado', sabor_variante: '', categoria: 'Pan y Galletas saladas', supermercados: 'Mercadona', tipo_kosher: 'Páreve - sólo producto de Alcalá de Henares, incluso sin sello', justificacion: 'Certificado por la Comunidad Judía de Madrid (Febrero 2026). Páreve, sólo el producto de Alcalá de Henares, incluso sin sello.' },
  { nombre: 'Panecillo 11 uds', marca: 'Hacendado', sabor_variante: '', categoria: 'Pan y Galletas saladas', supermercados: 'Mercadona', tipo_kosher: 'Páreve - sólo producto de Alcalá de Henares, incluso sin sello', justificacion: 'Certificado por la Comunidad Judía de Madrid (Febrero 2026). Páreve, sólo el producto de Alcalá de Henares, incluso sin sello.' },
  { nombre: 'Crumpets (pasteles de harina)', marca: 'Warburtons', sabor_variante: '', categoria: 'Pan y Galletas saladas', supermercados: 'Mercadona, Carrefour, Corte Inglés', tipo_kosher: 'Páreve incluso sin sello', justificacion: 'Certificado por la Comunidad Judía de Madrid (Febrero 2026). Páreve incluso sin sello.' },

  // ── CEREALES ────────────────────────────────────────────
  { nombre: 'Crispy Minis Chocolate Chip', marca: 'Weetabix', sabor_variante: '', categoria: 'Cereales', supermercados: 'Corte Inglés, Carrefour, Alcampo', tipo_kosher: 'Páreve incluso sin sello', justificacion: 'Certificado por la Comunidad Judía de Madrid (Febrero 2026). Páreve incluso sin sello.' },
  { nombre: 'Crispy Minis Fruit & Nut', marca: 'Weetabix', sabor_variante: '', categoria: 'Cereales', supermercados: 'Corte Inglés, Carrefour, Alcampo', tipo_kosher: 'Páreve incluso sin sello', justificacion: 'Certificado por la Comunidad Judía de Madrid (Febrero 2026). Páreve incluso sin sello.' },
  { nombre: 'Crunchy Bran', marca: 'Weetabix', sabor_variante: '', categoria: 'Cereales', supermercados: 'Corte Inglés, Carrefour, Alcampo', tipo_kosher: 'Páreve incluso sin sello', justificacion: 'Certificado por la Comunidad Judía de Madrid (Febrero 2026). Páreve incluso sin sello.' },
  { nombre: 'Chocolate Stars', marca: 'Marvel', sabor_variante: '', categoria: 'Cereales', supermercados: 'Corte Inglés, Carrefour, Alcampo', tipo_kosher: 'Páreve incluso sin sello', justificacion: 'Certificado por la Comunidad Judía de Madrid (Febrero 2026). Páreve incluso sin sello.' },
  { nombre: 'Oatibix', marca: 'Oatibix', sabor_variante: '', categoria: 'Cereales', supermercados: 'Corte Inglés, Carrefour, Alcampo', tipo_kosher: 'Páreve incluso sin sello', justificacion: 'Certificado por la Comunidad Judía de Madrid (Febrero 2026). Páreve incluso sin sello.' },
  { nombre: 'Oatibix Flakes y nutty crunch', marca: 'Oatibix', sabor_variante: '', categoria: 'Cereales', supermercados: 'Corte Inglés, Carrefour, Alcampo', tipo_kosher: 'Páreve incluso sin sello', justificacion: 'Certificado por la Comunidad Judía de Madrid (Febrero 2026). Páreve incluso sin sello.' },
  { nombre: 'Weetabix Banana', marca: 'Weetabix', sabor_variante: '', categoria: 'Cereales', supermercados: 'Corte Inglés, Amazon', tipo_kosher: 'Páreve incluso sin sello', justificacion: 'Certificado por la Comunidad Judía de Madrid (Febrero 2026). Páreve incluso sin sello.' },
  { nombre: 'Weetabix Chocolate', marca: 'Weetabix', sabor_variante: '', categoria: 'Cereales', supermercados: 'Corte Inglés, Amazon', tipo_kosher: 'Páreve incluso sin sello', justificacion: 'Certificado por la Comunidad Judía de Madrid (Febrero 2026). Páreve incluso sin sello.' },
  { nombre: 'Weetabix Organic', marca: 'Weetabix', sabor_variante: '', categoria: 'Cereales', supermercados: 'Amazon', tipo_kosher: 'Páreve incluso sin sello', justificacion: 'Certificado por la Comunidad Judía de Madrid (Febrero 2026). Páreve incluso sin sello.' },
  { nombre: 'Protein y Chocolate Chip', marca: 'Weetabix', sabor_variante: '', categoria: 'Cereales', supermercados: 'Corte Inglés, Carrefour, Alcampo', tipo_kosher: 'Páreve incluso sin sello', justificacion: 'Certificado por la Comunidad Judía de Madrid (Febrero 2026). Páreve incluso sin sello.' },
  { nombre: 'Protein Crunch Chocolate', marca: 'Weetabix', sabor_variante: '', categoria: 'Cereales', supermercados: 'Corte Inglés, Carrefour, Alcampo', tipo_kosher: 'Páreve incluso sin sello', justificacion: 'Certificado por la Comunidad Judía de Madrid (Febrero 2026). Páreve incluso sin sello.' },
  { nombre: 'Protein Crunch Original', marca: 'Weetabix', sabor_variante: '', categoria: 'Cereales', supermercados: 'Corte Inglés, Carrefour, Alcampo', tipo_kosher: 'Páreve incluso sin sello', justificacion: 'Certificado por la Comunidad Judía de Madrid (Febrero 2026). Páreve incluso sin sello.' },
  { nombre: 'Everyday Favourites Bran Flakes', marca: 'Weetabix', sabor_variante: '', categoria: 'Cereales', supermercados: 'Corte Inglés, Carrefour, Alcampo', tipo_kosher: 'Páreve incluso sin sello', justificacion: 'Certificado por la Comunidad Judía de Madrid (Febrero 2026). Páreve incluso sin sello.' },
  { nombre: 'Everyday Favourites Fruit & Fibre', marca: 'Weetabix', sabor_variante: '', categoria: 'Cereales', supermercados: 'Corte Inglés, Carrefour, Alcampo', tipo_kosher: 'Páreve incluso sin sello', justificacion: 'Certificado por la Comunidad Judía de Madrid (Febrero 2026). Páreve incluso sin sello.' },
  { nombre: 'Everyday Favourites Weetaflakes', marca: 'Weetabix', sabor_variante: '', categoria: 'Cereales', supermercados: 'Amazon', tipo_kosher: 'Páreve incluso sin sello', justificacion: 'Certificado por la Comunidad Judía de Madrid (Febrero 2026). Páreve incluso sin sello.' },
  { nombre: 'Cereales integrales Special K Classic', marca: "Kellog's", sabor_variante: 'Classic, Frutas del bosque', categoria: 'Cereales', supermercados: 'En la mayoría de supermercados', tipo_kosher: 'Páreve sólo con sello', justificacion: 'Certificado por la Comunidad Judía de Madrid (Febrero 2026). Páreve sólo con sello.' },
  { nombre: 'Cereales integrales Special K Chocolate', marca: "Kellog's", sabor_variante: 'Chocolate negro, Chocolate con leche', categoria: 'Cereales', supermercados: 'En la mayoría de supermercados', tipo_kosher: 'Lácteo sólo con sello', justificacion: 'Certificado por la Comunidad Judía de Madrid (Febrero 2026). Lácteo sólo con sello.' },
  { nombre: 'Cereales integrales All Bran', marca: "Kellog's", sabor_variante: 'Natural, Con frutas secas', categoria: 'Cereales', supermercados: 'En la mayoría de supermercados', tipo_kosher: 'Páreve sólo con sello', justificacion: 'Certificado por la Comunidad Judía de Madrid (Febrero 2026). Páreve sólo con sello.' },
  { nombre: 'Cereales integrales rellenos de chocolate', marca: "Kellog's", sabor_variante: '', categoria: 'Cereales', supermercados: 'En la mayoría de supermercados', tipo_kosher: 'Lácteo sólo con sello', justificacion: 'Certificado por la Comunidad Judía de Madrid (Febrero 2026). Lácteo sólo con sello.' },
  { nombre: 'Granola con frutos secos y chocolate Extra', marca: "Kellog's", sabor_variante: '', categoria: 'Cereales', supermercados: 'En la mayoría de supermercados', tipo_kosher: 'Páreve sólo con sello', justificacion: 'Certificado por la Comunidad Judía de Madrid (Febrero 2026). Páreve sólo con sello.' },
  { nombre: 'Granola con miel o frutas secas Extra', marca: "Kellog's", sabor_variante: 'Miel, Frutas secas', categoria: 'Cereales', supermercados: 'En la mayoría de supermercados', tipo_kosher: 'Páreve sólo con sello', justificacion: 'Certificado por la Comunidad Judía de Madrid (Febrero 2026). Páreve sólo con sello.' },
  { nombre: 'Cereales variedad en formato pequeño', marca: "Kellog's", sabor_variante: 'Diferentes sabores', categoria: 'Cereales', supermercados: 'En la mayoría de supermercados', tipo_kosher: 'Páreve sólo con sello', justificacion: 'Certificado por la Comunidad Judía de Madrid (Febrero 2026). Páreve sólo con sello.' },
  { nombre: 'Cereales Golden Grahams', marca: 'Golden Grahams (Nestlé)', sabor_variante: '', categoria: 'Cereales', supermercados: 'Corte Inglés, Carrefour, Alcampo', tipo_kosher: 'Páreve incluso sin sello', justificacion: 'Certificado por la Comunidad Judía de Madrid (Febrero 2026). Páreve incluso sin sello.' },

  // ── MANTEQUILLAS, QUESOS, NATAS Y YOGURES ───────────────
  { nombre: 'Mantequilla natural', marca: 'Reny Picot', sabor_variante: 'Diferentes formatos', categoria: 'Mantequillas, Quesos, Natas y Yogures', supermercados: 'Alcampo, Carrefour, Corte Inglés', tipo_kosher: 'Lácteo incluso sin sello', justificacion: 'Certificado por la Comunidad Judía de Madrid (Febrero 2026). Lácteo incluso sin sello.' },
  { nombre: 'Mantequilla', marca: 'Puleva', sabor_variante: '', categoria: 'Mantequillas, Quesos, Natas y Yogures', supermercados: 'Alcampo, Carrefour, Corte Inglés', tipo_kosher: 'Lácteo incluso sin sello', justificacion: 'Certificado por la Comunidad Judía de Madrid (Febrero 2026). Lácteo incluso sin sello.' },
  { nombre: 'Mantequilla', marca: 'Kerrygold', sabor_variante: '', categoria: 'Mantequillas, Quesos, Natas y Yogures', supermercados: 'Alcampo, Carrefour, Corte Inglés', tipo_kosher: 'Lácteo incluso sin sello', justificacion: 'Certificado por la Comunidad Judía de Madrid (Febrero 2026). Lácteo incluso sin sello.' },
  { nombre: 'Mantequilla', marca: 'Asturiana', sabor_variante: '', categoria: 'Mantequillas, Quesos, Natas y Yogures', supermercados: 'Alcampo, Carrefour, Corte Inglés', tipo_kosher: 'Lácteo incluso sin sello', justificacion: 'Certificado por la Comunidad Judía de Madrid (Febrero 2026). Lácteo incluso sin sello.' },
  { nombre: 'Mantequilla Fácil de Untar', marca: 'President', sabor_variante: '', categoria: 'Mantequillas, Quesos, Natas y Yogures', supermercados: 'Alcampo, Carrefour, Corte Inglés', tipo_kosher: 'Lácteo incluso sin sello', justificacion: 'Certificado por la Comunidad Judía de Madrid (Febrero 2026). Lácteo incluso sin sello.' },
  { nombre: 'Arias', marca: 'Arias', sabor_variante: '', categoria: 'Mantequillas, Quesos, Natas y Yogures', supermercados: 'Alcampo, Carrefour, Corte Inglés', tipo_kosher: 'Lácteo incluso sin sello', justificacion: 'Certificado por la Comunidad Judía de Madrid (Febrero 2026). Lácteo incluso sin sello.' },
  { nombre: 'Queso blanco para untar y light', marca: 'Hacendado', sabor_variante: 'Natural, Light', categoria: 'Mantequillas, Quesos, Natas y Yogures', supermercados: 'Mercadona', tipo_kosher: 'Lácteo incluso sin sello', justificacion: 'Certificado por la Comunidad Judía de Madrid (Febrero 2026). Lácteo incluso sin sello.' },
  { nombre: 'Queso blanco para untar vegetal', marca: 'Philadelphia', sabor_variante: 'Vegetal', categoria: 'Mantequillas, Quesos, Natas y Yogures', supermercados: 'Alcampo, Carrefour, Corte Inglés', tipo_kosher: 'Páreve incluso sin sello', justificacion: 'Certificado por la Comunidad Judía de Madrid (Febrero 2026). Páreve incluso sin sello.' },
  { nombre: 'Queso blanco para untar', marca: 'Philadelphia', sabor_variante: 'Original, Light', categoria: 'Mantequillas, Quesos, Natas y Yogures', supermercados: 'Alcampo, Carrefour, Corte Inglés', tipo_kosher: 'Lácteo incluso sin sello', justificacion: 'Certificado por la Comunidad Judía de Madrid (Febrero 2026). Lácteo incluso sin sello.' },
  { nombre: 'Nata láctea', marca: 'Ken', sabor_variante: '', categoria: 'Mantequillas, Quesos, Natas y Yogures', supermercados: 'Corte Inglés, Centro orgánico Alcobendas', tipo_kosher: 'Lácteo incluso sin sello', justificacion: 'Certificado por la Comunidad Judía de Madrid (Febrero 2026). Lácteo incluso sin sello.' },
  { nombre: 'Nata Gold and Fresh', marca: 'Ken', sabor_variante: '', categoria: 'Mantequillas, Quesos, Natas y Yogures', supermercados: 'Corte Inglés, Centro orgánico Alcobendas', tipo_kosher: 'Páreve incluso sin sello', justificacion: 'Certificado por la Comunidad Judía de Madrid (Febrero 2026). Páreve incluso sin sello.' },
  { nombre: 'Nata montada en spray', marca: 'Ken', sabor_variante: '', categoria: 'Mantequillas, Quesos, Natas y Yogures', supermercados: 'Online', tipo_kosher: 'Lácteo incluso sin sello', justificacion: 'Certificado por la Comunidad Judía de Madrid (Febrero 2026). Lácteo incluso sin sello.' },
  { nombre: 'Nata montada', marca: 'Asturiana', sabor_variante: '', categoria: 'Mantequillas, Quesos, Natas y Yogures', supermercados: 'Día, Ahorramás, Alcampo, Carrefour, Corte Inglés', tipo_kosher: 'Lácteo incluso sin sello - sólo con código ES XXXXXX/GU UE', justificacion: 'Certificado por la Comunidad Judía de Madrid (Febrero 2026). Lácteo incluso sin sello, sólo con el código ES XXXXXX/GU UE.' },
  { nombre: 'Nata de cocina de coco', marca: 'Isola Bio', sabor_variante: '', categoria: 'Mantequillas, Quesos, Natas y Yogures', supermercados: 'Carrefour, Corte Inglés, Centro Orgánico Alcobendas', tipo_kosher: 'Páreve sólo con sello', justificacion: 'Certificado por la Comunidad Judía de Madrid (Febrero 2026). Páreve sólo con sello.' },
  { nombre: 'Nata de cocina de arroz', marca: 'Isola Bio', sabor_variante: '', categoria: 'Mantequillas, Quesos, Natas y Yogures', supermercados: 'Carrefour, Corte Inglés, Centro Orgánico Alcobendas', tipo_kosher: 'Páreve sólo con sello', justificacion: 'Certificado por la Comunidad Judía de Madrid (Febrero 2026). Páreve sólo con sello.' },
  { nombre: 'Yogur natural', marca: 'Danone', sabor_variante: '', categoria: 'Mantequillas, Quesos, Natas y Yogures', supermercados: 'En la mayoría de supermercados y Amazon', tipo_kosher: 'Lácteo incluso sin sello', justificacion: 'Certificado por la Comunidad Judía de Madrid (Febrero 2026). Lácteo incluso sin sello.' },
  { nombre: 'Yogur azucarado', marca: 'Danone', sabor_variante: '', categoria: 'Mantequillas, Quesos, Natas y Yogures', supermercados: 'En la mayoría de supermercados y Amazon', tipo_kosher: 'Lácteo incluso sin sello', justificacion: 'Certificado por la Comunidad Judía de Madrid (Febrero 2026). Lácteo incluso sin sello.' },
  { nombre: 'Yogur sabor limón', marca: 'Danone', sabor_variante: '', categoria: 'Mantequillas, Quesos, Natas y Yogures', supermercados: 'En la mayoría de supermercados y Amazon', tipo_kosher: 'Lácteo incluso sin sello', justificacion: 'Certificado por la Comunidad Judía de Madrid (Febrero 2026). Lácteo incluso sin sello.' },
  { nombre: 'Yogur natural', marca: 'Pastoret', sabor_variante: '', categoria: 'Mantequillas, Quesos, Natas y Yogures', supermercados: 'En la mayoría de supermercados y Amazon', tipo_kosher: 'Lácteo incluso sin sello', justificacion: 'Certificado por la Comunidad Judía de Madrid (Febrero 2026). Lácteo incluso sin sello.' },
  { nombre: 'Yogur natural desnatado', marca: 'Pastoret', sabor_variante: '', categoria: 'Mantequillas, Quesos, Natas y Yogures', supermercados: 'En la mayoría de supermercados y Amazon', tipo_kosher: 'Lácteo incluso sin sello', justificacion: 'Certificado por la Comunidad Judía de Madrid (Febrero 2026). Lácteo incluso sin sello.' },
  { nombre: 'Yogur al estilo griego', marca: 'Pastoret', sabor_variante: '', categoria: 'Mantequillas, Quesos, Natas y Yogures', supermercados: 'En la mayoría de supermercados y Amazon', tipo_kosher: 'Lácteo incluso sin sello', justificacion: 'Certificado por la Comunidad Judía de Madrid (Febrero 2026). Lácteo incluso sin sello.' },
  { nombre: 'Preparado de soja original', marca: 'Alpro', sabor_variante: 'Original', categoria: 'Mantequillas, Quesos, Natas y Yogures', supermercados: 'En la mayoría de supermercados y Amazon', tipo_kosher: 'Páreve incluso sin sello', justificacion: 'Certificado por la Comunidad Judía de Madrid (Febrero 2026). Páreve incluso sin sello.' },
  { nombre: 'Preparado de soja de vainilla', marca: 'Alpro', sabor_variante: 'Vainilla', categoria: 'Mantequillas, Quesos, Natas y Yogures', supermercados: 'En la mayoría de supermercados y Amazon', tipo_kosher: 'Páreve incluso sin sello', justificacion: 'Certificado por la Comunidad Judía de Madrid (Febrero 2026). Páreve incluso sin sello.' },
  { nombre: 'Preparado de soja de fresa', marca: 'Alpro', sabor_variante: 'Fresa', categoria: 'Mantequillas, Quesos, Natas y Yogures', supermercados: 'En la mayoría de supermercados y Amazon', tipo_kosher: 'Páreve incluso sin sello', justificacion: 'Certificado por la Comunidad Judía de Madrid (Febrero 2026). Páreve incluso sin sello.' },
  { nombre: 'Preparado de soja de melocotón, piña y fruta de la pasión', marca: 'Alpro', sabor_variante: 'Melocotón, Piña, Fruta de la pasión', categoria: 'Mantequillas, Quesos, Natas y Yogures', supermercados: 'En la mayoría de supermercados y Amazon', tipo_kosher: 'Páreve incluso sin sello', justificacion: 'Certificado por la Comunidad Judía de Madrid (Febrero 2026). Páreve incluso sin sello.' },
  { nombre: 'Preparado de soja de cereza', marca: 'Alpro', sabor_variante: 'Cereza', categoria: 'Mantequillas, Quesos, Natas y Yogures', supermercados: 'En la mayoría de supermercados y Amazon', tipo_kosher: 'Páreve incluso sin sello', justificacion: 'Certificado por la Comunidad Judía de Madrid (Febrero 2026). Páreve incluso sin sello.' },
  { nombre: 'Preparado de soja de arándanos', marca: 'Alpro', sabor_variante: 'Arándanos', categoria: 'Mantequillas, Quesos, Natas y Yogures', supermercados: 'En la mayoría de supermercados y Amazon', tipo_kosher: 'Páreve incluso sin sello', justificacion: 'Certificado por la Comunidad Judía de Madrid (Febrero 2026). Páreve incluso sin sello.' },

];

// ============================================================
// FUNCIÓN DE IMPORTACIÓN
// ============================================================
async function importar() {
  const client = await pool.connect();
  let importados = 0;
  let errores = 0;

  try {
    // Buscar el ID del admin/validador de Madrid
    const adminResult = await client.query(
      "SELECT id FROM users WHERE rol IN ('administrador', 'validador') LIMIT 1"
    );

    if (adminResult.rows.length === 0) {
      console.error('❌ No se encontró ningún usuario administrador o validador');
      return;
    }

    const adminId = adminResult.rows[0].id;
    console.log(`✅ Usando validador ID: ${adminId}`);
    console.log(`📦 Importando ${productos.length} productos...`);

    for (const p of productos) {
      try {
        // Insertar producto
        const prodResult = await client.query(
          `INSERT INTO productos (nombre, marca, sabor_variante, fabricante, justificacion, estado, visible, subido_por)
           VALUES ($1, $2, $3, $4, $5, 'validado', true, $6)
           ON CONFLICT DO NOTHING
           RETURNING id`,
          [p.nombre, p.marca, p.sabor_variante || null, p.marca, p.justificacion, adminId]
        );

        if (prodResult.rows.length === 0) {
          console.log(`⏭️  Ya existe: ${p.nombre} - ${p.marca}`);
          continue;
        }

        const productoId = prodResult.rows[0].id;

        // Determinar tipo de validación
        const tipoValidacion = p.tipo_kosher.toLowerCase().includes('sin sello')
          ? 'ingredientes_verificables'
          : 'certificacion_completa';

        // Fecha de expiración: 2 meses
        const fechaExpiracion = new Date();
        fechaExpiracion.setMonth(fechaExpiracion.getMonth() + 2);

        // Insertar validación
        await client.query(
          `INSERT INTO validaciones (producto_id, validador_id, tipo_validacion, notas, es_revalidacion, fecha_expiracion)
           VALUES ($1, $2, $3, $4, false, $5)`,
          [
            productoId,
            adminId,
            tipoValidacion,
            `Lista Kosher Madrid - Febrero 2026. ${p.tipo_kosher}. Categoría: ${p.categoria}.`,
            fechaExpiracion
          ]
        );

        // Insertar feedback de supermercados
        if (p.supermercados && p.supermercados !== 'En la mayoría de supermercados') {
          const supers = p.supermercados.split(',').map(s => s.trim()).filter(Boolean);
          for (const super_ of supers.slice(0, 3)) { // máximo 3
            await client.query(
              `INSERT INTO feedback_productos (producto_id, usuario_id, supermercado, localidad, verificado)
               VALUES ($1, $2, $3, 'Madrid', true)`,
              [productoId, adminId, super_]
            );
          }
        }

        importados++;
        console.log(`✅ ${importados}. ${p.nombre} - ${p.marca}`);
      } catch (err) {
        errores++;
        console.error(`❌ Error en ${p.nombre}: ${err.message}`);
      }
    }

    console.log(`\n🎉 Importación completada:`);
    console.log(`   ✅ Importados: ${importados}`);
    console.log(`   ❌ Errores: ${errores}`);
    console.log(`   📦 Total procesados: ${productos.length}`);

  } finally {
    client.release();
    pool.end();
  }
}

importar();