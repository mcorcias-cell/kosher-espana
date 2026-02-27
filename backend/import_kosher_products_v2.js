/**
 * Script de importación de productos kosher
 * Fuente: Lista de productos casher - Febrero 2026
 * Comunidad Judía de Madrid (CJM)
 */

require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// ─────────────────────────────────────────────
// DATOS EXTRAÍDOS DE LOS PDFs (páginas 15–64)
// ─────────────────────────────────────────────
const productos = [

  // ══════════════════════════════════════════
  // MANTEQUILLAS, QUESOS, NATAS Y YOGURES
  // ══════════════════════════════════════════
  { nombre: 'Preparado de soja de coco', marca: 'ALPRO', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.15 - Páreve incluso sin sello', categorias: ['Mantequillas, Quesos, Natas y Yogures'] },
  { nombre: 'Preparado de soja y avena', marca: 'ALPRO', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.15 - Páreve incluso sin sello', categorias: ['Mantequillas, Quesos, Natas y Yogures'] },
  { nombre: 'Preparado de soja fermentado con mango y banana', marca: 'ALPRO', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.15 - Páreve incluso sin sello', categorias: ['Mantequillas, Quesos, Natas y Yogures'] },
  { nombre: 'Preparado de soja fermentado con frutos rojos', marca: 'ALPRO', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.15 - Páreve incluso sin sello', categorias: ['Mantequillas, Quesos, Natas y Yogures'] },
  { nombre: 'Preparado de soja fermentado de fresa-platano y melocotón-pera', marca: 'ALPRO', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.15 - Páreve incluso sin sello', categorias: ['Mantequillas, Quesos, Natas y Yogures'] },
  { nombre: 'Postre de soja sabor chocolate - chocolate negro', marca: 'ALPRO', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.15 - Páreve incluso sin sello', categorias: ['Mantequillas, Quesos, Natas y Yogures'] },
  { nombre: 'Postre de soja sabor vainilla', marca: 'ALPRO', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.15 - Páreve incluso sin sello', categorias: ['Mantequillas, Quesos, Natas y Yogures'] },

  // ══════════════════════════════════════════
  // LECHE PÁREVE
  // ══════════════════════════════════════════
  { nombre: 'Leche de almendra', marca: 'ALMENDROLA', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.16 - Páreve sólo con sello', categorias: ['Leche Páreve'] },
  { nombre: 'Leches vegetales', marca: 'YOSOY', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.16 - Páreve sólo con sello', categorias: ['Leche Páreve'] },
  { nombre: 'Leches vegetales', marca: 'MONSOY', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.16 - Páreve sólo con sello', categorias: ['Leche Páreve'] },
  { nombre: 'Leches vegetales', marca: 'NATRUE', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.16 - Páreve sólo con sello', categorias: ['Leche Páreve'] },
  { nombre: 'Bebida de agua de coco', marca: 'ISOLA BIO', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.16 - Páreve sólo con sello', categorias: ['Leche Páreve'] },
  { nombre: 'Bebida de soja', marca: 'ISOLA BIO', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.16 - Páreve sólo con sello', categorias: ['Leche Páreve'] },
  { nombre: 'Bebida de avena', marca: 'ISOLA BIO', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.16 - Páreve sólo con sello', categorias: ['Leche Páreve'] },
  { nombre: 'Bebida de espelta', marca: 'ISOLA BIO', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.16 - Páreve sólo con sello', categorias: ['Leche Páreve'] },
  { nombre: 'Bebida de mijo', marca: 'ISOLA BIO', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.16 - Páreve sólo con sello', categorias: ['Leche Páreve'] },
  { nombre: 'Bebida de trigo sarraceno', marca: 'ISOLA BIO', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.17 - Páreve sólo con sello', categorias: ['Leche Páreve'] },
  { nombre: 'Bebida de cebada', marca: 'ISOLA BIO', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.17 - Páreve sólo con sello', categorias: ['Leche Páreve'] },
  { nombre: 'Bebida de arroz y avellana', marca: 'ISOLA BIO', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.17 - Páreve sólo con sello', categorias: ['Leche Páreve'] },
  { nombre: 'Bebida de arroz y coco', marca: 'ISOLA BIO', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.17 - Páreve sólo con sello', categorias: ['Leche Páreve'] },
  { nombre: 'Bebida de avena sin gluten', marca: 'ISOLA BIO', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.17 - Páreve sólo con sello', categorias: ['Leche Páreve'] },
  { nombre: 'Bebida de arroz integral', marca: 'ISOLA BIO', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.17 - Páreve sólo con sello', categorias: ['Leche Páreve'] },
  { nombre: 'Bebida de arroz con cacao', marca: 'ISOLA BIO', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.17 - Páreve sólo con sello', categorias: ['Leche Páreve'] },
  { nombre: 'Bebida de arroz', marca: 'ISOLA BIO', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.17 - Páreve sólo con sello', categorias: ['Leche Páreve'] },
  { nombre: 'Bebida de almendras', marca: 'ISOLA BIO', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.17 - Páreve sólo con sello', categorias: ['Leche Páreve'] },

  // ══════════════════════════════════════════
  // CAFÉ, TÉS Y CHOCOLATES EN POLVO
  // ══════════════════════════════════════════
  { nombre: 'Café soluble natural, descafeinado y todos los productos de la marca', marca: 'NESCAFÉ', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.18 - Páreve incluso sin sello', categorias: ['Café, Tés y Chocolates en polvo'] },
  { nombre: 'Café soluble natural y descafeinado', marca: 'AUCHÁN', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.18 - Páreve incluso sin sello', categorias: ['Café, Tés y Chocolates en polvo'] },
  { nombre: 'Café de Colombia', marca: 'AUCHÁN', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.18 - Páreve incluso sin sello', categorias: ['Café, Tés y Chocolates en polvo'] },
  { nombre: 'Café espresso', marca: 'AUCHÁN', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.18 - Páreve incluso sin sello', categorias: ['Café, Tés y Chocolates en polvo'] },
  { nombre: 'Café natural y descafeinado', marca: 'CARREFOUR', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.18 - Páreve incluso sin sello', categorias: ['Café, Tés y Chocolates en polvo'] },
  { nombre: 'Café selección liofilizado', marca: 'CARREFOUR', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.18 - Páreve incluso sin sello', categorias: ['Café, Tés y Chocolates en polvo'] },
  { nombre: 'Café de Colombia', marca: 'CARREFOUR', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.18 - Páreve incluso sin sello', categorias: ['Café, Tés y Chocolates en polvo'] },
  { nombre: 'Dolce Gusto lácteas (Chococcino, Cortado, Café Au Lait, Nesquick, etc.)', marca: 'NESCAFÉ', tipo_kosher: 'lacteo', justificacion: 'Lista CJM Febrero 2026 p.18 - Lácteo incluso sin sello', categorias: ['Café, Tés y Chocolates en polvo'] },
  { nombre: 'Dolce Gusto parve (Barista, Espresso intenso, Lungo, Ristretto, etc.)', marca: 'NESCAFÉ', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.18 - Páreve incluso sin sello', categorias: ['Café, Tés y Chocolates en polvo'] },
  { nombre: 'Cápsulas de café natural, descafeinado y de sabores', marca: 'VIAGGIO', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.19 - Páreve sólo con sello', categorias: ['Café, Tés y Chocolates en polvo'] },
  { nombre: 'Cápsulas de café natural, descafeinado y de sabores', marca: "DANIEL'S BLEND", tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.19 - Páreve incluso sin sello', categorias: ['Café, Tés y Chocolates en polvo'] },
  { nombre: 'Cápsulas de café', marca: 'CAFFE MOTTA', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.19 - Páreve sólo con sello', categorias: ['Café, Tés y Chocolates en polvo'] },
  { nombre: 'Cápsulas de café de diferentes sabores', marca: 'NESPRESSO', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.19 - Páreve incluso sin sello', categorias: ['Café, Tés y Chocolates en polvo'] },
  { nombre: 'Nesquik cacao en polvo', marca: 'NESTLÉ', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.19 - Páreve incluso sin sello', categorias: ['Café, Tés y Chocolates en polvo'] },
  { nombre: 'Preparado soluble al cacao', marca: 'DULCINEA', tipo_kosher: 'lacteo', justificacion: 'Lista CJM Febrero 2026 p.19 - Lácteo sólo con sello (no Jalav Israel)', categorias: ['Café, Tés y Chocolates en polvo'] },
  { nombre: 'Cacao puro', marca: 'COLACAO', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.19 - Páreve incluso sin sello', categorias: ['Café, Tés y Chocolates en polvo'] },
  { nombre: 'ColaCao Turbo', marca: 'COLACAO', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.19 - Páreve incluso sin sello', categorias: ['Café, Tés y Chocolates en polvo'] },
  { nombre: 'Cacao a la taza listo para tomar original y noir', marca: 'PALADÍN', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.20 - Páreve incluso sin sello', categorias: ['Café, Tés y Chocolates en polvo'] },
  { nombre: 'Cacao a la taza listo para tomar blanco', marca: 'PALADÍN', tipo_kosher: 'lacteo', justificacion: 'Lista CJM Febrero 2026 p.20 - Lácteo incluso sin sello', categorias: ['Café, Tés y Chocolates en polvo'] },
  { nombre: 'Cacao orgánico en polvo instantáneo', marca: 'PACCARI', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.20 - Páreve incluso sin sello', categorias: ['Café, Tés y Chocolates en polvo'] },
  { nombre: 'Chocolate en polvo a la taza vainilla', marca: 'SIMON COLL', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.20 - Páreve incluso sin sello', categorias: ['Café, Tés y Chocolates en polvo'] },
  { nombre: 'Chocolate en polvo a la taza extra', marca: 'SIMON COLL', tipo_kosher: 'lacteo', justificacion: 'Lista CJM Febrero 2026 p.20 - Lácteo incluso sin sello', categorias: ['Café, Tés y Chocolates en polvo'] },
  { nombre: 'Cacao negro intenso 70%', marca: 'VALOR', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.20 - Páreve incluso sin sello', categorias: ['Café, Tés y Chocolates en polvo'] },
  { nombre: 'Cacao natural puro 100%', marca: 'VALOR', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.20 - Páreve incluso sin sello', categorias: ['Café, Tés y Chocolates en polvo'] },
  { nombre: 'Tés e infusiones de todos los sabores', marca: 'ARTEMÍS', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.20 - Páreve incluso sin sello', categorias: ['Café, Tés y Chocolates en polvo'] },
  { nombre: 'Tés e infusiones de todos los sabores', marca: 'CARREFOUR BIO', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.20 - Páreve incluso sin sello', categorias: ['Café, Tés y Chocolates en polvo'] },

  // ══════════════════════════════════════════
  // AZÚCARES Y EDULCORANTES
  // ══════════════════════════════════════════
  { nombre: 'Edulcorante de stevia en polvo', marca: 'HEALTH GARDEN', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.21 - Páreve sólo con sello', categorias: ['Azúcares y Edulcorantes'] },
  { nombre: 'Stevia granulada', marca: 'DULCILIGHT', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.21 - Páreve sólo con sello', categorias: ['Azúcares y Edulcorantes'] },
  { nombre: 'Edulcorante bajo en calorías', marca: 'SPLENDA', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.21 - Páreve sólo con sello', categorias: ['Azúcares y Edulcorantes'] },
  { nombre: 'Azúcar blanco, moreno, glaseado y panela', marca: 'AZUCARERA', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.21 - Páreve incluso sin sello', categorias: ['Azúcares y Edulcorantes'] },
  { nombre: 'Azúcar blanco y moreno', marca: 'ACOR', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.21 - Páreve incluso sin sello', categorias: ['Azúcares y Edulcorantes'] },

  // ══════════════════════════════════════════
  // BARRITAS
  // ══════════════════════════════════════════
  { nombre: 'Barritas veganas y sin gluten de diferentes sabores', marca: 'NAKD', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.22 - Páreve sólo con sello', categorias: ['Barritas'] },
  { nombre: 'Barritas de avena (Crunchy Canadian Maple, Oats & Dark Choc, Oats & Honey)', marca: 'NATURE VALLEY', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.22 - Páreve incluso sin sello', categorias: ['Barritas'] },
  { nombre: 'Barritas de avena Sweet & Salty Nut Dark Chocolate & Nuts', marca: 'NATURE VALLEY', tipo_kosher: 'lacteo', justificacion: 'Lista CJM Febrero 2026 p.22 - Lácteo incluso sin sello', categorias: ['Barritas'] },
  { nombre: 'Barrita Protein Peanut & Chocolate', marca: 'NATURE VALLEY', tipo_kosher: 'lacteo', justificacion: 'Lista CJM Febrero 2026 p.22 - Lácteo incluso sin sello', categorias: ['Barritas'] },
  { nombre: 'Barritas de cereales con trocitos de chocolate', marca: "KELLOG'S", tipo_kosher: 'lacteo', justificacion: 'Lista CJM Febrero 2026 p.22 - Lácteo sólo con sello', categorias: ['Barritas'] },
  { nombre: 'Barritas (Almond & Coconut, Dark Choc nuts & sea salt, Blueberry Vanilla Cashew)', marca: 'BE-KIND', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.22 - Páreve sólo con sello', categorias: ['Barritas'] },
  { nombre: 'Barritas Milk chocolate Almond, Peanut butter dark chocolate', marca: 'BE-KIND', tipo_kosher: 'lacteo', justificacion: 'Lista CJM Febrero 2026 p.22 - Lácteo sólo con sello', categorias: ['Barritas'] },
  { nombre: 'Barritas de sésamo', marca: 'GRANOVITA', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.22 - Páreve incluso sin sello', categorias: ['Barritas'] },
  { nombre: 'Barrita ecológica de almendra', marca: 'BIOCOMERCIO', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.22 - Páreve incluso sin sello', categorias: ['Barritas'] },
  { nombre: 'Barritas', marca: 'LARABAR', tipo_kosher: 'lacteo', justificacion: 'Lista CJM Febrero 2026 p.23 - Lácteo sólo con sello', categorias: ['Barritas'] },
  { nombre: 'Barritas', marca: 'CLIF BAR', tipo_kosher: 'lacteo', justificacion: 'Lista CJM Febrero 2026 p.23 - Lácteo sólo con sello', categorias: ['Barritas'] },
  { nombre: 'Barritas de almendras', marca: 'TASTE OF NATURE', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.23 - Páreve sólo con sello', categorias: ['Barritas'] },
  { nombre: 'Barritas (Nueces de Brasil, Cacahuete, Almendras, Blueberry)', marca: 'TASTE OF NATURE', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.23 - Páreve sólo con sello', categorias: ['Barritas'] },
  { nombre: 'Barritas Chocolate peanut, dark chocolate sea salt', marca: 'TASTE OF NATURE', tipo_kosher: 'lacteo', justificacion: 'Lista CJM Febrero 2026 p.23 - Lácteo sólo con sello', categorias: ['Barritas'] },

  // ══════════════════════════════════════════
  // CREMAS PARA UNTAR Y MERMELADAS
  // ══════════════════════════════════════════
  { nombre: 'Dulce de leche - todos los productos de la marca', marca: 'MÁRDEL', tipo_kosher: 'lacteo', justificacion: 'Lista CJM Febrero 2026 p.24 - Lácteo incluso sin sello', categorias: ['Cremas para untar y Mermeladas'] },
  { nombre: 'Dulce de leche en diferentes formatos', marca: 'HAVANNA', tipo_kosher: 'lacteo', justificacion: 'Lista CJM Febrero 2026 p.24 - Lácteo incluso sin sello', categorias: ['Cremas para untar y Mermeladas'] },
  { nombre: 'Crema de cacahuetes crunchy y normal', marca: 'GRANOVITA', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.24 - Páreve incluso sin sello', categorias: ['Cremas para untar y Mermeladas'] },
  { nombre: 'Cremas de frutos secos - todos los de la marca', marca: 'GRANOVITA', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.24 - Páreve incluso sin sello', categorias: ['Cremas para untar y Mermeladas'] },
  { nombre: 'Crema de cacahuetes sin gluten y vegano', marca: 'CAPITÁN MANÍ', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.24 - Páreve sólo con sello', categorias: ['Cremas para untar y Mermeladas'] },
  { nombre: 'Crema de cacahuetes', marca: 'SKIPPY', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.24 - Páreve incluso sin sello', categorias: ['Cremas para untar y Mermeladas'] },
  { nombre: 'Tahini Bio', marca: 'GRANOVITA', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.24 - Páreve incluso sin sello', categorias: ['Cremas para untar y Mermeladas'] },
  { nombre: 'Tahini', marca: 'AUCHÁN', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.24 - Páreve incluso sin sello (sólo elaborado por Granovita)', categorias: ['Cremas para untar y Mermeladas'] },
  { nombre: 'Crema de cacao con avellanas original', marca: 'NOCILLA', tipo_kosher: 'lacteo', justificacion: 'Lista CJM Febrero 2026 p.24 - Lácteo incluso sin sello', categorias: ['Cremas para untar y Mermeladas'] },
  { nombre: 'Crema de cacao con avellanas 0% sin azúcares y blanco', marca: 'NOCILLA', tipo_kosher: 'lacteo', justificacion: 'Lista CJM Febrero 2026 p.25 - Lácteo incluso sin sello', categorias: ['Cremas para untar y Mermeladas'] },
  { nombre: 'Crema de cacao negro', marca: 'NOCILLA', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.25 - Páreve incluso sin sello', categorias: ['Cremas para untar y Mermeladas'] },
  { nombre: 'Crema de cacao fluida original y avellanas', marca: 'NOCILLA', tipo_kosher: 'lacteo', justificacion: 'Lista CJM Febrero 2026 p.25 - Lácteo incluso sin sello', categorias: ['Cremas para untar y Mermeladas'] },
  { nombre: 'Crema de cacao chocomix y 0%', marca: 'NOCILLA', tipo_kosher: 'lacteo', justificacion: 'Lista CJM Febrero 2026 p.25 - Lácteo incluso sin sello', categorias: ['Cremas para untar y Mermeladas'] },
  { nombre: 'Crema de cacao', marca: 'DULCINEA', tipo_kosher: 'lacteo', justificacion: 'Lista CJM Febrero 2026 p.25 - Lácteo sólo con sello', categorias: ['Cremas para untar y Mermeladas'] },
  { nombre: 'Crema de cacao dark', marca: 'NOCICIOLATA', tipo_kosher: 'lacteo', justificacion: 'Lista CJM Febrero 2026 p.25 - Lácteo sólo con sello', categorias: ['Cremas para untar y Mermeladas'] },
  { nombre: 'Original, Bianca y Crunchy crema de avellanas, leche o cacao', marca: 'NOCICIOLATA', tipo_kosher: 'lacteo', justificacion: 'Lista CJM Febrero 2026 p.25 - Lácteo sólo con sello', categorias: ['Cremas para untar y Mermeladas'] },
  { nombre: 'Mermelada de diferentes tamaños y sabores', marca: 'HERO', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.25 - Páreve incluso sin sello', categorias: ['Cremas para untar y Mermeladas'] },
  { nombre: 'Todos los formatos de la marca', marca: 'NUTELLA', tipo_kosher: 'lacteo', justificacion: 'Lista CJM Febrero 2026 p.25 - Lácteo incluso sin sello', categorias: ['Cremas para untar y Mermeladas'] },

  // ══════════════════════════════════════════
  // BOLLERÍA
  // ══════════════════════════════════════════
  { nombre: 'Bollitos individuales de diferentes sabores', marca: 'MR BROWNIE', tipo_kosher: 'lacteo', justificacion: 'Lista CJM Febrero 2026 p.26 - Lácteo sólo con sello', categorias: ['Bollería'] },
  { nombre: 'Alfajores de diferentes sabores', marca: 'MARDEL', tipo_kosher: 'lacteo', justificacion: 'Lista CJM Febrero 2026 p.26 - Lácteo incluso sin sello', categorias: ['Bollería'] },
  { nombre: 'Alfajores de diferentes sabores', marca: 'HAVANNA', tipo_kosher: 'lacteo', justificacion: 'Lista CJM Febrero 2026 p.26 - Lácteo sólo con sello', categorias: ['Bollería'] },
  { nombre: 'Alfajores veganos y sin gluten', marca: 'HAVANNA', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.26 - Páreve sólo con sello', categorias: ['Bollería'] },
  { nombre: 'Galletas de diferentes sabores', marca: 'JULES DESTROOPER', tipo_kosher: 'lacteo', justificacion: 'Lista CJM Febrero 2026 p.26 - Lácteo sólo con sello', categorias: ['Bollería'] },
  { nombre: 'Bollitos de chocolate sabor Baileys', marca: 'BAILEYS', tipo_kosher: 'lacteo', justificacion: 'Lista CJM Febrero 2026 p.26 - Lácteo sólo con sello', categorias: ['Bollería'] },
  { nombre: 'Rollo de bizcocho con diferentes rellenos recubierto de chocolate', marca: 'BALCONI', tipo_kosher: 'lacteo', justificacion: 'Lista CJM Febrero 2026 p.26 - Lácteo sólo con sello', categorias: ['Bollería'] },
  { nombre: 'Rollitos individuales recubiertos de chocolate con diferentes rellenos', marca: 'BALCONI', tipo_kosher: 'lacteo', justificacion: 'Lista CJM Febrero 2026 p.26 - Lácteo sólo con sello', categorias: ['Bollería'] },
  { nombre: 'Bollitos individuales de mermelada de melocotón, chocolate, crema', marca: 'BALCONI', tipo_kosher: 'lacteo', justificacion: 'Lista CJM Febrero 2026 p.26 - Lácteo sólo con sello', categorias: ['Bollería'] },
  { nombre: 'Wafers con diferentes rellenos: nata, chocolate, avellana', marca: 'BALCONI', tipo_kosher: 'lacteo', justificacion: 'Lista CJM Febrero 2026 p.27 - Lácteo sólo con sello', categorias: ['Bollería'] },
  { nombre: 'Galletas (sólo las producidas en Bélgica)', marca: 'BISCOFF', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.27 - Páreve incluso sin sello (solo producto hecho en Bélgica)', categorias: ['Bollería'] },
  { nombre: 'Galletas veganas en todas sus variedades', marca: 'GULLÓN', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.27 - Páreve incluso sin sello', categorias: ['Bollería'] },
  { nombre: 'Galleta integral de avena sin gluten sabor naranja', marca: 'GULLÓN', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.27 - Páreve incluso sin sello', categorias: ['Bollería'] },
  { nombre: 'Galleta integral sin azúcar añadido', marca: 'GULLÓN', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.27 - Páreve incluso sin sello', categorias: ['Bollería'] },
  { nombre: 'Galleta de avena sin azúcar añadido', marca: 'GULLÓN', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.27 - Páreve incluso sin sello', categorias: ['Bollería'] },
  { nombre: 'Galletas sin azúcar con edulcorante', marca: 'GULLÓN', tipo_kosher: 'lacteo', justificacion: 'Lista CJM Febrero 2026 p.27 - Lácteo incluso sin sello', categorias: ['Bollería'] },
  { nombre: 'Galletas con sabor a cacao rellenas de crema sin gluten', marca: 'GULLÓN', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.27 - Páreve incluso sin sello', categorias: ['Bollería'] },
  { nombre: 'Galletas de trigo integral con avena sabor naranja', marca: 'GULLÓN', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.27 - Páreve incluso sin sello', categorias: ['Bollería'] },
  { nombre: 'Galletas mini cereales sabor vainilla o chocolate', marca: 'GULLÓN', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.28 - Páreve incluso sin sello', categorias: ['Bollería'] },
  { nombre: 'Galletas de avena recubiertas de chocolate negro sin azúcar', marca: 'GULLÓN', tipo_kosher: 'lacteo', justificacion: 'Lista CJM Febrero 2026 p.28 - Lácteo incluso sin sello', categorias: ['Bollería'] },
  { nombre: 'Waffle relleno de crema de chocolate sin azúcar', marca: 'GULLÓN', tipo_kosher: 'lacteo', justificacion: 'Lista CJM Febrero 2026 p.28 - Lácteo incluso sin sello', categorias: ['Bollería'] },
  { nombre: 'Waffle relleno de crema de vainilla sin azúcar', marca: 'GULLÓN', tipo_kosher: 'lacteo', justificacion: 'Lista CJM Febrero 2026 p.28 - Lácteo incluso sin sello', categorias: ['Bollería'] },
  { nombre: 'Galletas de chocolate negro sin azúcar', marca: 'GULLÓN', tipo_kosher: 'lacteo', justificacion: 'Lista CJM Febrero 2026 p.28 - Lácteo incluso sin sello', categorias: ['Bollería'] },
  { nombre: 'Sandwich de galleta relleno sabor chocolate sin azúcar', marca: 'GULLÓN', tipo_kosher: 'lacteo', justificacion: 'Lista CJM Febrero 2026 p.28 - Lácteo incluso sin sello', categorias: ['Bollería'] },
  { nombre: 'Sandwich de galleta relleno sabor yogur sin azúcar', marca: 'GULLÓN', tipo_kosher: 'lacteo', justificacion: 'Lista CJM Febrero 2026 p.28 - Lácteo incluso sin sello', categorias: ['Bollería'] },
  { nombre: 'Selección de galletas sin azúcar', marca: 'GULLÓN', tipo_kosher: 'lacteo', justificacion: 'Lista CJM Febrero 2026 p.28 - Lácteo incluso sin sello', categorias: ['Bollería'] },
  { nombre: 'Galletas con trocitos de chocolate negro', marca: 'GULLÓN', tipo_kosher: 'lacteo', justificacion: 'Lista CJM Febrero 2026 p.28 - Lácteo incluso sin sello', categorias: ['Bollería'] },
  { nombre: 'Waffle relleno sabor chocolate', marca: 'GULLÓN', tipo_kosher: 'lacteo', justificacion: 'Lista CJM Febrero 2026 p.29 - Lácteo incluso sin sello', categorias: ['Bollería'] },
  { nombre: 'Waffle relleno de chocolate y crema sabor nata', marca: 'GULLÓN', tipo_kosher: 'lacteo', justificacion: 'Lista CJM Febrero 2026 p.29 - Lácteo incluso sin sello', categorias: ['Bollería'] },
  { nombre: 'Waffle relleno de chocolate y crema sabor avellana', marca: 'GULLÓN', tipo_kosher: 'lacteo', justificacion: 'Lista CJM Febrero 2026 p.29 - Lácteo incluso sin sello', categorias: ['Bollería'] },
  { nombre: 'Galletas con avena y trocitos de chocolate', marca: 'GULLÓN', tipo_kosher: 'lacteo', justificacion: 'Lista CJM Febrero 2026 p.29 - Lácteo incluso sin sello', categorias: ['Bollería'] },
  { nombre: 'Sandwich de galleta con relleno de crema sabor vainilla', marca: 'GULLÓN', tipo_kosher: 'lacteo', justificacion: 'Lista CJM Febrero 2026 p.29 - Lácteo incluso sin sello', categorias: ['Bollería'] },
  { nombre: 'Galletas Bio con chocolate con leche', marca: 'GULLÓN', tipo_kosher: 'lacteo', justificacion: 'Lista CJM Febrero 2026 p.29 - Lácteo incluso sin sello', categorias: ['Bollería'] },
  { nombre: 'Galletas con sabor a canela', marca: 'GULLÓN', tipo_kosher: 'lacteo', justificacion: 'Lista CJM Febrero 2026 p.29 - Lácteo incluso sin sello', categorias: ['Bollería'] },
  { nombre: 'Galletas con cereales cubierta de chocolate sin azúcar', marca: 'GULLÓN', tipo_kosher: 'lacteo', justificacion: 'Lista CJM Febrero 2026 p.29 - Lácteo incluso sin sello', categorias: ['Bollería'] },
  { nombre: 'Galletas con trocitos de chocolate sin azúcar', marca: 'GULLÓN', tipo_kosher: 'lacteo', justificacion: 'Lista CJM Febrero 2026 p.29 - Lácteo incluso sin sello', categorias: ['Bollería'] },
  { nombre: 'Sandwich de galleta con relleno de crema sabor chocolate', marca: 'GULLÓN', tipo_kosher: 'lacteo', justificacion: 'Lista CJM Febrero 2026 p.30 - Lácteo incluso sin sello', categorias: ['Bollería'] },
  { nombre: 'Galletas sabor chocolate con relleno de crema de chocolate', marca: 'GULLÓN', tipo_kosher: 'lacteo', justificacion: 'Lista CJM Febrero 2026 p.30 - Lácteo incluso sin sello', categorias: ['Bollería'] },
  { nombre: 'Galletas rellenas de crema de yogur sin azúcares añadidos', marca: 'GULLÓN', tipo_kosher: 'lacteo', justificacion: 'Lista CJM Febrero 2026 p.30 - Lácteo incluso sin sello', categorias: ['Bollería'] },
  { nombre: 'Galletas de avena cubiertas de chocolate con leche', marca: 'GULLÓN', tipo_kosher: 'lacteo', justificacion: 'Lista CJM Febrero 2026 p.30 - Lácteo incluso sin sello', categorias: ['Bollería'] },
  { nombre: 'Galletas recubiertas de chocolate con leche sin azúcar', marca: 'GULLÓN', tipo_kosher: 'lacteo', justificacion: 'Lista CJM Febrero 2026 p.30 - Lácteo incluso sin sello', categorias: ['Bollería'] },
  { nombre: 'Sandwiches de galleta de diferentes sabores', marca: 'OREO', tipo_kosher: 'lacteo', justificacion: 'Lista CJM Febrero 2026 p.30 - Lácteo incluso sin sello', categorias: ['Bollería'] },
  { nombre: 'Cereales', marca: 'ENVIRO KIDZ', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.30 - Páreve sólo con sello', categorias: ['Cereales'] },
  { nombre: 'Muesli', marca: 'GRANOVITA', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.30 - Páreve incluso sin sello', categorias: ['Cereales'] },
  { nombre: 'Galletas con trocitos de chocolate sin azúcar', marca: 'ORGRAN', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.30 - Páreve sólo con sello', categorias: ['Bollería'] },

  // ══════════════════════════════════════════
  // ARROZ Y PASTA
  // ══════════════════════════════════════════
  { nombre: 'Vasos de arroz', marca: 'BRILLANTE', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.31 - Páreve incluso sin sello', categorias: ['Arroz y Pasta'] },
  { nombre: 'Quinoa en vasos y vasos de cous cous', marca: 'BRILLANTE', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.31 - Páreve incluso sin sello', categorias: ['Arroz y Pasta'] },
  { nombre: 'Vasos de arroz', marca: 'NOMEN', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.31 - Páreve incluso sin sello', categorias: ['Arroz y Pasta'] },
  { nombre: 'Arroz blanco de grano largo', marca: 'BRILLANTE', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.31 - Páreve incluso sin sello', categorias: ['Arroz y Pasta'] },
  { nombre: 'Arroz blanco para paella', marca: 'FALLERA', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.31 - Páreve incluso sin sello', categorias: ['Arroz y Pasta'] },
  { nombre: 'Arroz grano largo', marca: 'LA CIGALA', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.31 - Páreve incluso sin sello', categorias: ['Arroz y Pasta'] },
  { nombre: 'Pasta de trigo en todos los formatos de la marca', marca: 'GAROFALO', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.31 - Páreve incluso sin sello', categorias: ['Arroz y Pasta'] },
  { nombre: 'Pasta de trigo en todos los formatos de la marca', marca: 'BARILLA', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.31 - Páreve incluso sin sello', categorias: ['Arroz y Pasta'] },
  { nombre: 'Pasta de trigo en todos los formatos de la marca', marca: 'LA MOLISANA', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.31 - Páreve incluso sin sello', categorias: ['Arroz y Pasta'] },

  // ══════════════════════════════════════════
  // CONSERVAS
  // ══════════════════════════════════════════
  { nombre: 'Melocotón en almíbar', marca: 'MENSAJERO', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.32 - Páreve incluso sin sello', categorias: ['Conservas'] },
  { nombre: 'Albaricoque en almíbar', marca: 'MENSAJERO', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.32 - Páreve incluso sin sello', categorias: ['Conservas'] },
  { nombre: 'Mitades de melocotón en almíbar sin azúcar añadido', marca: 'MENSAJERO', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.32 - Páreve incluso sin sello', categorias: ['Conservas'] },
  { nombre: 'Pera en almíbar', marca: 'MENSAJERO', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.32 - Páreve incluso sin sello', categorias: ['Conservas'] },
  { nombre: 'Salsa de tomate frito', marca: 'MENSAJERO', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.32 - Páreve incluso sin sello', categorias: ['Conservas'] },
  { nombre: 'Salsa de tomate triturado', marca: 'MENSAJERO', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.32 - Páreve incluso sin sello', categorias: ['Conservas'] },
  { nombre: 'Tomate entero pelado', marca: 'MENSAJERO', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.32 - Páreve incluso sin sello', categorias: ['Conservas'] },
  { nombre: 'Tomate frito', marca: 'ORLANDO', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.32 - Páreve incluso sin sello', categorias: ['Conservas'] },
  { nombre: 'Tomate frito', marca: 'MARTINETE', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.32 - Páreve incluso sin sello', categorias: ['Conservas'] },
  { nombre: 'Tomate concentrado', marca: 'MARTINETE', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.33 - Páreve incluso sin sello', categorias: ['Conservas'] },
  { nombre: 'Tomate triturado', marca: 'MARTINETE', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.33 - Páreve incluso sin sello', categorias: ['Conservas'] },
  { nombre: 'Tomate entero', marca: 'MARTINETE', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.33 - Páreve incluso sin sello', categorias: ['Conservas'] },
  { nombre: 'Tomate triturado', marca: 'CELORRIO', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.33 - Páreve incluso sin sello', categorias: ['Conservas'] },
  { nombre: 'Tomate entero', marca: 'CELORRIO', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.33 - Páreve incluso sin sello', categorias: ['Conservas'] },
  { nombre: 'Tomate entero', marca: 'CIDACOS', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.33 - Páreve incluso sin sello', categorias: ['Conservas'] },
  { nombre: 'Tomate triturado', marca: 'CIDACOS', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.33 - Páreve incluso sin sello', categorias: ['Conservas'] },
  { nombre: 'Salsa de pizza clásica', marca: 'MUTTI', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.33 - Páreve incluso sin sello', categorias: ['Conservas'] },

  // ══════════════════════════════════════════
  // SALSAS
  // ══════════════════════════════════════════
  { nombre: 'Original salsa para carne (sólo producido en Países Bajos)', marca: 'HP', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.34 - Páreve incluso sin sello (solo producido en Países Bajos)', categorias: ['Salsas'] },
  { nombre: 'Mostaza', marca: "GULDEN'S", tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.34 - Páreve sólo con sello', categorias: ['Salsas'] },
  { nombre: 'Mostaza', marca: "FRENCH'S", tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.34 - Páreve sólo con sello', categorias: ['Salsas'] },
  { nombre: 'Ketchup', marca: 'HEINZ', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.34 - Páreve sólo con sello', categorias: ['Salsas'] },
  { nombre: 'Salsa Barbacoa', marca: 'SWEET BABY RAYS', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.34 - Páreve sólo con sello', categorias: ['Salsas'] },
  { nombre: 'Salsa de soja (sólo fabricada en Holanda o Singapur)', marca: 'KIKOMAN', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.34 - Páreve incluso sin sello (solo fabricada en Holanda o Singapur)', categorias: ['Salsas'] },
  { nombre: 'Mayonesa', marca: 'HEINZ', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.34 - Páreve sólo con sello', categorias: ['Salsas'] },
  { nombre: 'Salsa para ensalada', marca: "KEN'S", tipo_kosher: 'lacteo', justificacion: 'Lista CJM Febrero 2026 p.34 - Lácteo sólo con sello', categorias: ['Salsas'] },

  // ══════════════════════════════════════════
  // ENCURTIDOS
  // ══════════════════════════════════════════
  { nombre: 'Todos los de la marca excepto ajo al pesto', marca: 'AMANIDA', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.35 - Páreve incluso sin sello', categorias: ['Encurtidos'] },
  { nombre: 'Aceitunas', marca: 'AMANIDA', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.35 - Páreve incluso sin sello', categorias: ['Encurtidos'] },
  { nombre: 'Altramuces', marca: 'SALADITOS', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.35 - Páreve incluso sin sello', categorias: ['Encurtidos'] },
  { nombre: 'Aceitunas Manzanilla con o sin hueso, negras, enteras y cortadas', marca: 'FRAGATA', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.35 - Páreve incluso sin sello', categorias: ['Encurtidos'] },
  { nombre: 'Aceitunas verdes con y sin hueso', marca: 'KARINA', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.35 - Páreve incluso sin sello', categorias: ['Encurtidos'] },
  { nombre: 'Aceitunas gordal con y sin hueso', marca: 'KARINA', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.35 - Páreve incluso sin sello', categorias: ['Encurtidos'] },
  { nombre: 'Aceitunas verdes rellenas con almendra', marca: 'KARINA', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.35 - Páreve incluso sin sello', categorias: ['Encurtidos'] },
  { nombre: 'Aceitunas verdes rellenas con anchoas', marca: 'KARINA', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.35 - Páreve incluso sin sello', categorias: ['Encurtidos'] },
  { nombre: 'Aceitunas negras', marca: 'KARINA', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.35 - Páreve incluso sin sello', categorias: ['Encurtidos'] },
  { nombre: 'Cebollitas', marca: 'KARINA', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.36 - Páreve incluso sin sello', categorias: ['Encurtidos'] },
  { nombre: 'Pepinillos', marca: 'KARINA', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.36 - Páreve incluso sin sello', categorias: ['Encurtidos'] },
  { nombre: 'Guindillas', marca: 'KARINA', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.36 - Páreve incluso sin sello', categorias: ['Encurtidos'] },
  { nombre: 'Alcaparras y alcaparrones', marca: 'KARINA', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.36 - Páreve incluso sin sello', categorias: ['Encurtidos'] },
  { nombre: 'Banderillas', marca: 'KARINA', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.36 - Páreve incluso sin sello', categorias: ['Encurtidos'] },
  { nombre: 'Cocktail', marca: 'KARINA', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.36 - Páreve incluso sin sello', categorias: ['Encurtidos'] },
  { nombre: 'Aceitunas verdes cortadas', marca: 'KARINA', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.36 - Páreve incluso sin sello', categorias: ['Encurtidos'] },
  { nombre: 'Chuchrut Bio', marca: 'MACHANDEL', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.36 - Páreve sólo con sello', categorias: ['Encurtidos'] },
  { nombre: 'Cebollitas', marca: 'MACHANDEL', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.36 - Páreve sólo con sello', categorias: ['Encurtidos'] },
  { nombre: 'Col lombarda', marca: 'MACHANDEL', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.37 - Páreve sólo con sello', categorias: ['Encurtidos'] },
  { nombre: 'Pepinillos', marca: 'MACHANDEL', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.37 - Páreve sólo con sello', categorias: ['Encurtidos'] },
  { nombre: 'Crema de verduras (7 verduras, calabaza, calabacín)', marca: 'CAMPO RICO', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.37 - Páreve sólo con sello', categorias: ['Conservas'] },
  { nombre: 'Pimientos asados, escalivada', marca: 'CAMPO RICO', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.37 - Páreve sólo con sello', categorias: ['Encurtidos'] },
  { nombre: 'Zanahorias aliñadas', marca: 'CAMPO RICO', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.37 - Páreve sólo con sello', categorias: ['Encurtidos'] },
  { nombre: 'Patatas a lo pobre', marca: 'CAMPO RICO', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.37 - Páreve sólo con sello', categorias: ['Encurtidos'] },
  { nombre: 'Ensaladas frías (zanahoria al curry, remolacha, papas aliñas, pimientos)', marca: 'CAMPO RICO', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.37 - Páreve sólo con sello', categorias: ['Encurtidos'] },
  { nombre: 'Guacamole suave y picante, Salsa chunky, mango jalapeño, mexicana, Hummus', marca: 'AVOMIX', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.37 - Páreve sólo con sello', categorias: ['Encurtidos'] },
  { nombre: 'Hummus', marca: 'AVOMIX', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.37 - Páreve incluso sin sello', categorias: ['Encurtidos'] },

  // ══════════════════════════════════════════
  // AHUMADOS
  // ══════════════════════════════════════════
  { nombre: 'Anchoas', marca: 'CONSORCIO', tipo_kosher: 'pescado', justificacion: 'Lista CJM Febrero 2026 p.38 - Páreve incluso sin sello', categorias: ['Ahumados'] },
  { nombre: 'Anchoas', marca: 'ORTÍZ', tipo_kosher: 'pescado', justificacion: 'Lista CJM Febrero 2026 p.38 - Páreve incluso sin sello', categorias: ['Ahumados'] },
  { nombre: 'Atún en diferentes formatos (todos los productos de la marca)', marca: 'ORTÍZ', tipo_kosher: 'pescado', justificacion: 'Lista CJM Febrero 2026 p.38 - Páreve incluso sin sello (Bishul Israel con sello)', categorias: ['Ahumados'] },
  { nombre: 'Anchoas', marca: 'VANELLI', tipo_kosher: 'pescado', justificacion: 'Lista CJM Febrero 2026 p.38 - Páreve sólo con sello', categorias: ['Ahumados'] },
  { nombre: 'Anchoas en aceite de girasol y oliva', marca: 'BELMONTE', tipo_kosher: 'pescado', justificacion: 'Lista CJM Febrero 2026 p.38 - Páreve sólo con sello', categorias: ['Ahumados'] },
  { nombre: 'Salmón ahumado y marinado', marca: 'HACENDADO', tipo_kosher: 'pescado', justificacion: 'Lista CJM Febrero 2026 p.38 - Páreve incluso sin sello (sólo producido por UBAGO)', categorias: ['Ahumados'] },
  { nombre: 'Salmón ahumado noruego', marca: 'UBAGO', tipo_kosher: 'pescado', justificacion: 'Lista CJM Febrero 2026 p.38 - Páreve incluso sin sello (sólo producido por UBAGO)', categorias: ['Ahumados'] },
  { nombre: 'Salmón ahumado en lomos', marca: 'UBAGO', tipo_kosher: 'pescado', justificacion: 'Lista CJM Febrero 2026 p.38 - Páreve incluso sin sello (sólo producido por UBAGO)', categorias: ['Ahumados'] },
  { nombre: 'Lonchas de salmón ahumado noruego', marca: 'UBAGO', tipo_kosher: 'pescado', justificacion: 'Lista CJM Febrero 2026 p.38 - Páreve incluso sin sello (sólo producido por UBAGO)', categorias: ['Ahumados'] },
  { nombre: 'Salmón noruego del Atlántico', marca: 'UBAGO', tipo_kosher: 'pescado', justificacion: 'Lista CJM Febrero 2026 p.39 - Páreve sólo con sello', categorias: ['Ahumados'] },
  { nombre: 'Tartar de salmón', marca: 'UBAGO', tipo_kosher: 'pescado', justificacion: 'Lista CJM Febrero 2026 p.39 - Páreve incluso sin sello (sólo producido por UBAGO)', categorias: ['Ahumados'] },
  { nombre: 'Mojama', marca: 'RICARDO FUENTES', tipo_kosher: 'pescado', justificacion: 'Lista CJM Febrero 2026 p.39 - Páreve incluso sin sello', categorias: ['Ahumados'] },
  { nombre: 'Huevas de mujol', marca: 'RICARDO FUENTES', tipo_kosher: 'pescado', justificacion: 'Lista CJM Febrero 2026 p.39 - Páreve incluso sin sello', categorias: ['Ahumados'] },
  { nombre: 'Atún ahumado', marca: 'RICARDO FUENTES', tipo_kosher: 'pescado', justificacion: 'Lista CJM Febrero 2026 p.39 - Páreve incluso sin sello', categorias: ['Ahumados'] },

  // ══════════════════════════════════════════
  // MASAS Y ESPECIAS
  // ══════════════════════════════════════════
  { nombre: 'Todas las especias de la marca', marca: 'ARTEMIS', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.40 - Páreve incluso sin sello', categorias: ['Masas y Especias'] },
  { nombre: 'Todas las especias de la marca', marca: 'CARREFOUR BIO', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.40 - Páreve incluso sin sello', categorias: ['Masas y Especias'] },
  { nombre: 'Azafrán', marca: 'SAFRINA', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.40 - Páreve incluso sin sello', categorias: ['Masas y Especias'] },
  { nombre: 'Pimentón', marca: 'LA LIDIA', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.40 - Páreve incluso sin sello', categorias: ['Masas y Especias'] },
  { nombre: 'Todas las especias de la marca', marca: 'DANI', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.40 - Páreve incluso sin sello', categorias: ['Masas y Especias'] },
  { nombre: 'Masa de churros marca blanca (sólo producidos por Eurofrits)', marca: 'EUROFRITS', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.40 - Páreve incluso sin sello (solo producidos por Eurofrits)', categorias: ['Masas y Especias'] },
  { nombre: 'Masa brick 170g', marca: 'JR', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.40 - Páreve sólo con sello', categorias: ['Masas y Especias'] },
  { nombre: 'Pasta filo especial para hojaldres y tartas', marca: 'JR', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.40 - Páreve sólo con sello', categorias: ['Masas y Especias'] },

  // ══════════════════════════════════════════
  // LEVADURAS Y ESENCIAS
  // ══════════════════════════════════════════
  { nombre: 'Levadura fresca', marca: 'LEVANOVA LESAFFRE', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.41 - Páreve incluso sin sello', categorias: ['Levadura y Esencias'] },
  { nombre: 'Preparado de masa madre', marca: 'LEVANOVA LESAFFRE', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.41 - Páreve incluso sin sello', categorias: ['Levadura y Esencias'] },
  { nombre: 'Levadura seca', marca: 'LEVANOVA LESAFFRE', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.41 - Páreve incluso sin sello', categorias: ['Levadura y Esencias'] },
  { nombre: "L'hirondelle 1895", marca: 'LESAFFRE', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.41 - Páreve incluso sin sello', categorias: ['Levadura y Esencias'] },
  { nombre: 'Polvo de hornear', marca: 'ROYAL', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.41 - Páreve incluso sin sello', categorias: ['Levadura y Esencias'] },
  { nombre: 'Levadura fresca 500g', marca: 'HÉRCULES', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.41 - Páreve incluso sin sello', categorias: ['Levadura y Esencias'] },
  { nombre: 'Escencia de vainilla', marca: 'MARDEL', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.41 - Páreve incluso sin sello', categorias: ['Levadura y Esencias'] },
  { nombre: 'Polvo de hornear', marca: 'NIELSEN MASSEY', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.41 - Páreve sólo con sello', categorias: ['Levadura y Esencias'] },

  // ══════════════════════════════════════════
  // HELADOS
  // ══════════════════════════════════════════
  { nombre: 'Helado de diferentes sabores', marca: "BEN & JERRY'S", tipo_kosher: 'lacteo', justificacion: 'Lista CJM Febrero 2026 p.42 - Lácteo sólo con sello', categorias: ['Helados'] },
  { nombre: 'Oat (helado de avena)', marca: "BEN & JERRY'S", tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.42 - Páreve sólo con sello', categorias: ['Helados'] },
  { nombre: 'Coca cola, limón, naranja', marca: 'CALIPPO', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.42 - Páreve incluso sin sello', categorias: ['Helados'] },
  { nombre: 'Tarta helada Toblerone, Milka y Daim', marca: 'ALMONDY', tipo_kosher: 'lacteo', justificacion: 'Lista CJM Febrero 2026 p.42 - Lácteo sólo con sello', categorias: ['Helados'] },
  { nombre: 'Helado (plant-based gelato)', marca: 'VALSOIA', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.42 - Páreve incluso sin sello', categorias: ['Helados'] },
  { nombre: 'Helado de diferentes sabores', marca: 'HAAGEN DAZS', tipo_kosher: 'lacteo', justificacion: 'Lista CJM Febrero 2026 p.42 - Lácteo sólo con sello', categorias: ['Helados'] },
  { nombre: 'Helado vegano de Blueberry cookie', marca: 'MAGNUM', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.42 - Páreve incluso sin sello', categorias: ['Helados'] },
  { nombre: 'Helado vegano Classic stick', marca: 'MAGNUM', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.42 - Páreve incluso sin sello', categorias: ['Helados'] },
  { nombre: 'Helado vegano Almond', marca: 'MAGNUM', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.42 - Páreve incluso sin sello', categorias: ['Helados'] },

  // ══════════════════════════════════════════
  // FRUTOS SECOS
  // ══════════════════════════════════════════
  { nombre: 'Cocktail de frutos secos', marca: 'BORGES', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.43 - Páreve incluso sin sello', categorias: ['Frutos secos'] },
  { nombre: 'Cacahuetes tostados con miel y sal', marca: 'BORGES', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.43 - Páreve incluso sin sello', categorias: ['Frutos secos'] },
  { nombre: 'Almendras crudas, naturales y sus derivados', marca: 'BORGES', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.43 - Páreve incluso sin sello', categorias: ['Frutos secos'] },
  { nombre: 'Cacahuetes', marca: 'BORGES', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.43 - Páreve incluso sin sello', categorias: ['Frutos secos'] },
  { nombre: 'Pistachos', marca: 'BORGES', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.43 - Páreve incluso sin sello', categorias: ['Frutos secos'] },
  { nombre: 'Almendras Marcona tostadas', marca: 'BORGES', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.43 - Páreve incluso sin sello', categorias: ['Frutos secos'] },
  { nombre: 'Anacardos', marca: 'BORGES', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.43 - Páreve incluso sin sello', categorias: ['Frutos secos'] },
  { nombre: 'Avellanas', marca: 'BORGES', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.43 - Páreve incluso sin sello', categorias: ['Frutos secos'] },
  { nombre: 'Natura mix', marca: 'BORGES', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.43 - Páreve incluso sin sello', categorias: ['Frutos secos'] },
  { nombre: 'Nueces', marca: 'BORGES', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.44 - Páreve incluso sin sello', categorias: ['Frutos secos'] },
  { nombre: 'Frutos secos (almendra, pistacho, anacardo, cacahuete, avellana, nuez)', marca: 'SALYSOL', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.44 - Páreve incluso sin sello (gominolas necesitan sello)', categorias: ['Frutos secos'] },
  { nombre: 'Fruta deshidratada (ciruelas, orejones, pasas, arándanos)', marca: 'PRUNITA-AGROSERC', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.44 - Páreve incluso sin sello', categorias: ['Frutos secos'] },
  { nombre: 'Frutos secos (almendra, pistacho, anacardo, cacahuete, avellana, nuez)', marca: 'PRUNITA-AGROSERC', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.44 - Páreve incluso sin sello', categorias: ['Frutos secos'] },
  { nombre: 'Frutos secos garrapiñados (almendra, avellana, cacahuete, pipa, nuez)', marca: 'PRUNITA-AGROSERC', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.44 - Páreve incluso sin sello', categorias: ['Frutos secos'] },
  { nombre: 'Frutos secos chocolateados (almendra, anacardo, arándano, avellana, etc.)', marca: 'PRUNITA-AGROSERC', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.44 - Páreve incluso sin sello', categorias: ['Frutos secos'] },

  // ══════════════════════════════════════════
  // CARAMELOS
  // ══════════════════════════════════════════
  { nombre: 'Bonbon Equinacea, santasapina y Salvia', marca: 'A. VOGEL', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.45 - Páreve sólo con sello', categorias: ['Caramelos'] },
  { nombre: 'Piruletas de corazón', marca: 'FIESTA', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.45 - Páreve incluso sin sello', categorias: ['Caramelos'] },
  { nombre: 'Caramelos duros de menta', marca: 'SMINT', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.45 - Páreve incluso sin sello', categorias: ['Caramelos'] },
  { nombre: 'Caramelos de limón y menta', marca: 'RICOLA', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.45 - Páreve incluso sin sello', categorias: ['Caramelos'] },
  { nombre: 'Caramelos de hierba de miel y originales', marca: 'RICOLA', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.45 - Páreve incluso sin sello', categorias: ['Caramelos'] },
  { nombre: 'Caramelo duro de eucalipto', marca: 'PICTOLÍN', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.45 - Páreve incluso sin sello', categorias: ['Caramelos'] },
  { nombre: 'De miel y regalíz, de eucalipto', marca: 'RESPIRAL', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.45 - Páreve incluso sin sello', categorias: ['Caramelos'] },
  { nombre: 'De fresa y cola', marca: 'PETA ZETAS', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.45 - Páreve incluso sin sello', categorias: ['Caramelos'] },

  // ══════════════════════════════════════════
  // CHOCOLATES
  // ══════════════════════════════════════════
  { nombre: 'Dark, chocolate con leche y white', marca: 'KIT KAT', tipo_kosher: 'lacteo', justificacion: 'Lista CJM Febrero 2026 p.46 - Lácteo incluso sin sello', categorias: ['Chocolates'] },
  { nombre: 'Bolitas de chocolate con leche', marca: 'MALTESERS', tipo_kosher: 'lacteo', justificacion: 'Lista CJM Febrero 2026 p.46 - Lácteo incluso sin sello', categorias: ['Chocolates'] },
  { nombre: 'Mars Bar', marca: 'MARS', tipo_kosher: 'lacteo', justificacion: 'Lista CJM Febrero 2026 p.46 - Lácteo incluso sin sello', categorias: ['Chocolates'] },
  { nombre: 'Barritas de chocolate con cacahuete y caramelo', marca: 'SNICKERS', tipo_kosher: 'lacteo', justificacion: 'Lista CJM Febrero 2026 p.46 - Lácteo incluso sin sello', categorias: ['Chocolates'] },
  { nombre: 'Barrita de chocolate con leche con galleta crujiente y caramelo', marca: 'TWIX', tipo_kosher: 'lacteo', justificacion: 'Lista CJM Febrero 2026 p.46 - Lácteo incluso sin sello', categorias: ['Chocolates'] },
  { nombre: 'Barrita de chocolate blanco con galleta crujiente y caramelo', marca: 'TWIX', tipo_kosher: 'lacteo', justificacion: 'Lista CJM Febrero 2026 p.46 - Lácteo incluso sin sello', categorias: ['Chocolates'] },
  { nombre: 'Chocolate de coco', marca: 'BOUNTY BAR', tipo_kosher: 'lacteo', justificacion: 'Lista CJM Febrero 2026 p.46 - Lácteo incluso sin sello', categorias: ['Chocolates'] },
  { nombre: 'Chocolate con leche y almendras', marca: 'TOBLERONE', tipo_kosher: 'lacteo', justificacion: 'Lista CJM Febrero 2026 p.46 - Lácteo incluso sin sello', categorias: ['Chocolates'] },
  { nombre: 'Chocolate thin mints (sólo los producidos en Inglaterra)', marca: 'AFTER EIGHT', tipo_kosher: 'lacteo', justificacion: 'Lista CJM Febrero 2026 p.46 - Lácteo incluso sin sello (solo producidos en Inglaterra)', categorias: ['Chocolates'] },
  { nombre: 'Trufas de chocolate', marca: 'DULCINEA', tipo_kosher: 'lacteo', justificacion: 'Lista CJM Febrero 2026 p.47 - Lácteo sólo con sello', categorias: ['Chocolates'] },
  { nombre: 'Barra de chocolate (Milk chocolate, kisses, con almendras, blanco)', marca: "HERSHEY'S", tipo_kosher: 'lacteo', justificacion: 'Lista CJM Febrero 2026 p.47 - Lácteo sólo con sello', categorias: ['Chocolates'] },
  { nombre: 'Chocolate 70%, blanco, bitter 50% y con leche', marca: 'SIMON COLL', tipo_kosher: 'lacteo', justificacion: 'Lista CJM Febrero 2026 p.47 - Lácteo incluso sin sello', categorias: ['Chocolates'] },
  { nombre: 'Chocolate botella 300g', marca: 'SIMON COLL', tipo_kosher: 'lacteo', justificacion: 'Lista CJM Febrero 2026 p.47 - Lácteo incluso sin sello', categorias: ['Chocolates'] },
  { nombre: 'Sombrilla 35g corazones', marca: 'SIMON COLL', tipo_kosher: 'lacteo', justificacion: 'Lista CJM Febrero 2026 p.47 - Lácteo incluso sin sello', categorias: ['Chocolates'] },
  { nombre: 'Botella corazones 300g', marca: 'SIMON COLL', tipo_kosher: 'lacteo', justificacion: 'Lista CJM Febrero 2026 p.47 - Lácteo incluso sin sello', categorias: ['Chocolates'] },
  { nombre: 'Choco-sticks 20g', marca: 'SIMON COLL', tipo_kosher: 'lacteo', justificacion: 'Lista CJM Febrero 2026 p.47 - Lácteo incluso sin sello', categorias: ['Chocolates'] },
  { nombre: 'Milk chocolate Umbrella 35g', marca: 'SIMON COLL', tipo_kosher: 'lacteo', justificacion: 'Lista CJM Febrero 2026 p.47 - Lácteo sólo con sello', categorias: ['Chocolates'] },
  { nombre: 'Chocolate para repostería, más de 160 productos', marca: 'CALLEBAUT', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.47 - Páreve/lácteo según el caso, sólo con sello', categorias: ['Chocolates'] },
  { nombre: 'Chocolate botella 40g', marca: 'SIMON COLL', tipo_kosher: 'lacteo', justificacion: 'Lista CJM Febrero 2026 p.48 - Lácteo sólo con sello', categorias: ['Chocolates'] },
  { nombre: 'Chocolate 70% cocoa napolitains 12u', marca: 'SIMON COLL', tipo_kosher: 'lacteo', justificacion: 'Lista CJM Febrero 2026 p.48 - Lácteo incluso sin sello', categorias: ['Chocolates'] },
  { nombre: 'Chocolate extra fine rich milk 18gr', marca: 'SIMON COLL', tipo_kosher: 'lacteo', justificacion: 'Lista CJM Febrero 2026 p.48 - Lácteo incluso sin sello', categorias: ['Chocolates'] },
  { nombre: 'Sardinas de chocolate 24g', marca: 'SIMON COLL', tipo_kosher: 'lacteo', justificacion: 'Lista CJM Febrero 2026 p.48 - Lácteo sólo con sello', categorias: ['Chocolates'] },
  { nombre: 'Chocolatina unicorn 2 x 18g', marca: 'SIMON COLL', tipo_kosher: 'lacteo', justificacion: 'Lista CJM Febrero 2026 p.48 - Lácteo sólo con sello', categorias: ['Chocolates'] },
  { nombre: 'Chocolatina dinos 2 x 18g', marca: 'SIMON COLL', tipo_kosher: 'lacteo', justificacion: 'Lista CJM Febrero 2026 p.48 - Lácteo sólo con sello', categorias: ['Chocolates'] },
  { nombre: 'Chocolatina corazones 3 x 18g', marca: 'SIMON COLL', tipo_kosher: 'lacteo', justificacion: 'Lista CJM Febrero 2026 p.48 - Lácteo sólo con sello', categorias: ['Chocolates'] },
  { nombre: 'Sombrilla unicorn 15g', marca: 'SIMON COLL', tipo_kosher: 'lacteo', justificacion: 'Lista CJM Febrero 2026 p.48 - Lácteo sólo con sello', categorias: ['Chocolates'] },
  { nombre: 'Milk chocolate napolitains 12U', marca: 'SIMON COLL', tipo_kosher: 'lacteo', justificacion: 'Lista CJM Febrero 2026 p.48 - Lácteo incluso sin sello', categorias: ['Chocolates'] },

  // ══════════════════════════════════════════
  // PATATAS FRITAS Y APERITIVOS
  // ══════════════════════════════════════════
  { nombre: 'Patatas fritas al punto de sal', marca: "LAY'S", tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.49 - Páreve incluso sin sello', categorias: ['Patatas fritas y aperitivos'] },
  { nombre: 'Patatas caseras', marca: 'FRIT RAVICH', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.49 - Páreve incluso sin sello', categorias: ['Patatas fritas y aperitivos'] },
  { nombre: 'Palomitas', marca: 'POPZ', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.49 - Páreve sólo con sello en el producto', categorias: ['Patatas fritas y aperitivos'] },
  { nombre: 'Snacks vegetales', marca: 'TERRA', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.49 - Páreve sólo con sello en el producto', categorias: ['Patatas fritas y aperitivos'] },

  // ══════════════════════════════════════════
  // ALIMENTACIÓN INFANTIL
  // ══════════════════════════════════════════
  { nombre: 'Leche para lactantes 1, 2 y 3', marca: 'NIDINA', tipo_kosher: 'lacteo', justificacion: 'Lista CJM Febrero 2026 p.50 - Lácteo incluso sin sello', categorias: ['Alimentación infantil'] },
  { nombre: 'Leche para lactantes Total comfort', marca: 'SIMILAC', tipo_kosher: 'lacteo', justificacion: 'Lista CJM Febrero 2026 p.50 - Lácteo incluso sin sello', categorias: ['Alimentación infantil'] },
  { nombre: 'Leche para lactantes pro grow&gain', marca: 'GAIN/PEDIASURE', tipo_kosher: 'lacteo', justificacion: 'Lista CJM Febrero 2026 p.50 - Lácteo incluso sin sello', categorias: ['Alimentación infantil'] },
  { nombre: 'Leche para lactantes 1, 2 y 3', marca: 'SIMILAC', tipo_kosher: 'lacteo', justificacion: 'Lista CJM Febrero 2026 p.50 - Lácteo incluso sin sello', categorias: ['Alimentación infantil'] },
  { nombre: 'Leche para lactantes pro, sin lactosa', marca: 'SIMILAC', tipo_kosher: 'lacteo', justificacion: 'Lista CJM Febrero 2026 p.50 - Lácteo incluso sin sello', categorias: ['Alimentación infantil'] },
  { nombre: 'Leche para lactantes neosure', marca: 'SIMILAC', tipo_kosher: 'lacteo', justificacion: 'Lista CJM Febrero 2026 p.50 - Lácteo incluso sin sello', categorias: ['Alimentación infantil'] },
  { nombre: 'Batido plus', marca: 'ENSURE/PEDIASURE', tipo_kosher: 'lacteo', justificacion: 'Lista CJM Febrero 2026 p.50 - Lácteo incluso sin sello', categorias: ['Alimentación infantil'] },
  { nombre: 'Batido original', marca: 'GLUCERNA SIMILAC', tipo_kosher: 'lacteo', justificacion: 'Lista CJM Febrero 2026 p.50 - Lácteo incluso sin sello', categorias: ['Alimentación infantil'] },
  { nombre: 'Leche para lactantes Advance HA', marca: 'SIMILAC', tipo_kosher: 'lacteo', justificacion: 'Lista CJM Febrero 2026 p.50 - Lácteo incluso sin sello', categorias: ['Alimentación infantil'] },

  // ══════════════════════════════════════════
  // ACEITES - DE OLIVA EXTRA VIRGEN
  // ══════════════════════════════════════════
  { nombre: 'Aceite de oliva extra virgen', marca: 'ÁBACO', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.51 - Páreve incluso sin sello', categorias: ['Aceites'] },
  { nombre: 'Aceite de oliva extra virgen', marca: 'ABRIL', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.51 - Páreve incluso sin sello', categorias: ['Aceites'] },
  { nombre: 'Aceite de oliva extra virgen', marca: 'ALBERT', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.51 - Páreve incluso sin sello', categorias: ['Aceites'] },
  { nombre: 'Aceite de oliva extra virgen', marca: 'BORGES', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.51 - Páreve incluso sin sello', categorias: ['Aceites'] },
  { nombre: 'Aceite de oliva extra virgen', marca: 'CAMPOSUR', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.51 - Páreve incluso sin sello', categorias: ['Aceites'] },
  { nombre: 'Aceite de oliva extra virgen', marca: 'CANOLIVA', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.51 - Páreve incluso sin sello', categorias: ['Aceites'] },
  { nombre: 'Aceite de oliva extra virgen', marca: 'CAPICUA', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.51 - Páreve incluso sin sello', categorias: ['Aceites'] },
  { nombre: 'Aceite de oliva extra virgen', marca: 'CARBONELL', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.51 - Páreve incluso sin sello', categorias: ['Aceites'] },
  { nombre: 'Aceite de oliva extra virgen', marca: 'DCOOP', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.51 - Páreve incluso sin sello', categorias: ['Aceites'] },
  { nombre: 'Aceite de oliva extra virgen', marca: 'FRANCISCO GOMEZ', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.52 - Páreve incluso sin sello', categorias: ['Aceites'] },
  { nombre: 'Aceite de oliva extra virgen', marca: 'GRANOVITA', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.52 - Páreve incluso sin sello', categorias: ['Aceites'] },
  { nombre: 'Aceite de oliva extra virgen', marca: 'LA ESPAÑOLA', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.52 - Páreve incluso sin sello', categorias: ['Aceites'] },
  { nombre: 'Aceite de oliva extra virgen', marca: 'MANZANO', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.52 - Páreve incluso sin sello', categorias: ['Aceites'] },
  { nombre: 'Aceite de oliva extra virgen', marca: 'OLISIERRA', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.52 - Páreve incluso sin sello', categorias: ['Aceites'] },
  { nombre: 'Aceite de oliva extra virgen', marca: 'URZANTE', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.52 - Páreve incluso sin sello', categorias: ['Aceites'] },
  { nombre: 'Aceite de oliva extra virgen', marca: 'DINTEL (ACEITES TOLEDO)', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.52 - Páreve incluso sin sello', categorias: ['Aceites'] },
  // DE OLIVA VIRGEN
  { nombre: 'Aceite de oliva virgen', marca: 'ÁBACO', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.53 - Páreve incluso sin sello', categorias: ['Aceites'] },
  { nombre: 'Aceite de oliva virgen', marca: 'ABRIL', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.53 - Páreve incluso sin sello', categorias: ['Aceites'] },
  { nombre: 'Aceite de oliva virgen', marca: 'ALBERT', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.53 - Páreve incluso sin sello', categorias: ['Aceites'] },
  { nombre: 'Aceite de oliva virgen', marca: 'BORGES', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.53 - Páreve incluso sin sello', categorias: ['Aceites'] },
  { nombre: 'Aceite de oliva virgen', marca: 'CAPICUA', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.53 - Páreve incluso sin sello', categorias: ['Aceites'] },
  { nombre: 'Aceite de oliva virgen', marca: 'CARBONELL', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.53 - Páreve incluso sin sello', categorias: ['Aceites'] },
  { nombre: 'Aceite de oliva virgen', marca: 'LA ESPAÑOLA', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.53 - Páreve incluso sin sello', categorias: ['Aceites'] },
  { nombre: 'Aceite de oliva virgen', marca: 'URZANTE', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.53 - Páreve incluso sin sello', categorias: ['Aceites'] },
  // DE OLIVA (sólo con sello)
  { nombre: 'Aceite de oliva', marca: 'ÁBACO', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.54 - Páreve sólo con sello', categorias: ['Aceites'] },
  { nombre: 'Aceite de oliva', marca: 'CAPICUA', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.54 - Páreve sólo con sello', categorias: ['Aceites'] },
  { nombre: 'Aceite de oliva', marca: 'CARBONELL', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.54 - Páreve sólo con sello', categorias: ['Aceites'] },
  { nombre: 'Aceite de oliva', marca: 'DINTEL (ACEITES TOLEDO)', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.54 - Páreve sólo con sello', categorias: ['Aceites'] },
  { nombre: 'Aceite de oliva', marca: 'LA ESPAÑOLA', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.54 - Páreve sólo con sello', categorias: ['Aceites'] },
  { nombre: 'Aceite de oliva', marca: 'URZANTE', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.54 - Páreve sólo con sello', categorias: ['Aceites'] },
  // DE GIRASOL
  { nombre: 'Aceite de girasol', marca: 'ABRIL SOL', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.55 - Páreve sólo con sello', categorias: ['Aceites'] },
  { nombre: 'Aceite de girasol', marca: 'ALBERT', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.55 - Páreve incluso sin sello', categorias: ['Aceites'] },
  { nombre: 'Aceite de girasol', marca: 'ÁBACO', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.55 - Páreve sólo con sello', categorias: ['Aceites'] },
  { nombre: 'Aceite de girasol', marca: 'CAPICUA', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.55 - Páreve sólo con sello', categorias: ['Aceites'] },
  { nombre: 'Aceite de girasol', marca: 'DON SOL (A. TOLEDO)', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.55 - Páreve sólo con sello', categorias: ['Aceites'] },
  { nombre: 'Aceite de girasol', marca: 'MANZANO', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.55 - Páreve incluso sin sello', categorias: ['Aceites'] },
  { nombre: 'Aceite de aguacate', marca: 'ALBERT', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.55 - Páreve incluso sin sello', categorias: ['Aceites'] },

  // ══════════════════════════════════════════
  // BEBIDAS Y REFRESCOS
  // ══════════════════════════════════════════
  { nombre: 'Coca-Cola Original', marca: 'COCA COLA', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.56 - Páreve incluso sin sello', categorias: ['Bebidas y Refrescos'] },
  { nombre: 'Coca-Cola Light', marca: 'COCA COLA', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.56 - Páreve incluso sin sello', categorias: ['Bebidas y Refrescos'] },
  { nombre: 'Coca-Cola Zero', marca: 'COCA COLA', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.56 - Páreve incluso sin sello', categorias: ['Bebidas y Refrescos'] },
  { nombre: 'Coca-Cola Zero azúcar Zero cafeína', marca: 'COCA COLA', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.56 - Páreve incluso sin sello', categorias: ['Bebidas y Refrescos'] },
  { nombre: 'Sprite Light refresco con gas lima-limón', marca: 'SPRITE', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.56 - Páreve incluso sin sello', categorias: ['Bebidas y Refrescos'] },
  { nombre: 'Fanta Naranja', marca: 'FANTA', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.56 - Páreve incluso sin sello', categorias: ['Bebidas y Refrescos'] },
  { nombre: 'Lipton Zero bebida de té al limón', marca: 'LIPTON', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.56 - Páreve incluso sin sello', categorias: ['Bebidas y Refrescos'] },
  { nombre: 'Lipton Zero bebida de té con sabor a melocotón', marca: 'LIPTON', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.56 - Páreve incluso sin sello', categorias: ['Bebidas y Refrescos'] },
  { nombre: 'Nestea bebida de té al limón', marca: 'NESTEA', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.56 - Páreve incluso sin sello', categorias: ['Bebidas y Refrescos'] },
  { nombre: 'Nestea bebida de melocotón', marca: 'NESTEA', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.57 - Páreve incluso sin sello', categorias: ['Bebidas y Refrescos'] },
  { nombre: 'Pepsi refresco de cola', marca: 'PEPSI', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.57 - Páreve incluso sin sello', categorias: ['Bebidas y Refrescos'] },
  { nombre: 'Pepsi refresco de cola Zero sin azúcar', marca: 'PEPSI', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.57 - Páreve incluso sin sello', categorias: ['Bebidas y Refrescos'] },
  { nombre: '7UP refresco de lima limón', marca: '7UP', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.57 - Páreve incluso sin sello', categorias: ['Bebidas y Refrescos'] },
  { nombre: 'La Casera gaseosa botella', marca: 'LA CASERA', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.57 - Páreve incluso sin sello', categorias: ['Bebidas y Refrescos'] },
  { nombre: 'Schweppes tónica clásica', marca: 'SCHWEPPES', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.57 - Páreve incluso sin sello', categorias: ['Bebidas y Refrescos'] },
  { nombre: 'Schweppes Ginger Ale', marca: 'SCHWEPPES', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.57 - Páreve incluso sin sello', categorias: ['Bebidas y Refrescos'] },
  { nombre: 'Schweppes Ginger Ale Canada Dry', marca: 'SCHWEPPES', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.57 - Páreve incluso sin sello', categorias: ['Bebidas y Refrescos'] },

  // ══════════════════════════════════════════
  // ZUMOS
  // ══════════════════════════════════════════
  { nombre: 'Limonada clásica', marca: 'MINUTE MAID', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.58 - Páreve incluso sin sello', categorias: ['Zumos'] },
  { nombre: 'Zumo de naranja', marca: 'MINUTE MAID', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.58 - Páreve incluso sin sello', categorias: ['Zumos'] },
  { nombre: 'Zumos (todos menos los que contienen uva)', marca: 'GRANINI', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.58 - Páreve (todos menos los que contienen uva)', categorias: ['Zumos'] },
  { nombre: 'Zumo de naranja', marca: 'DON SIMÓN', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.58 - Páreve incluso sin sello', categorias: ['Zumos'] },
  { nombre: 'Pure premium Zumo de naranja', marca: 'TROPICANA', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.58 - Páreve incluso sin sello', categorias: ['Zumos'] },
  { nombre: 'Pure premium Zumo de piña', marca: 'TROPICANA', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.58 - Páreve incluso sin sello', categorias: ['Zumos'] },
  { nombre: 'Pure Premium Zumo de naranja y mango', marca: 'TROPICANA', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.58 - Páreve incluso sin sello', categorias: ['Zumos'] },

  // ══════════════════════════════════════════
  // BEBIDAS ALCOHÓLICAS
  // ══════════════════════════════════════════
  { nombre: 'Anís', marca: 'LAS CADENAS', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.59 - Páreve incluso sin sello', categorias: ['Bebidas alcohólicas'] },
  { nombre: 'Anís', marca: 'CHINCHÓN DULCE', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.59 - Páreve incluso sin sello', categorias: ['Bebidas alcohólicas'] },
  { nombre: 'Cervezas - todas las marcas naturales sin aditivos', marca: 'AMSTEL', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.59 - Páreve incluso sin sello', categorias: ['Bebidas alcohólicas'] },
  { nombre: 'Cervezas - todas las marcas naturales sin aditivos', marca: 'HEINEKEN', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.59 - Páreve incluso sin sello', categorias: ['Bebidas alcohólicas'] },
  { nombre: 'Cervezas - todas las marcas naturales sin aditivos', marca: 'SAN MIGUEL', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.59 - Páreve incluso sin sello', categorias: ['Bebidas alcohólicas'] },
  { nombre: 'Licor (sólo el elaborado en Francia)', marca: 'COINTREAU', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.59 - Páreve incluso sin sello (solo elaborado en Francia)', categorias: ['Bebidas alcohólicas'] },
  { nombre: 'Licor (sólo el embotellado en Reino Unido)', marca: 'DRAMBUIE', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.59 - Páreve incluso sin sello (solo embotellado en UK)', categorias: ['Bebidas alcohólicas'] },
  { nombre: 'Limoncello', marca: 'PALLINI', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.59 - Páreve sólo con sello en el producto', categorias: ['Bebidas alcohólicas'] },
  { nombre: 'Ginebra New Legend', marca: 'BEEFEATER', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.59 - Páreve incluso sin sello', categorias: ['Bebidas alcohólicas'] },
  { nombre: 'Ginebra', marca: 'BEEFEATER', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.60 - Páreve incluso sin sello', categorias: ['Bebidas alcohólicas'] },
  { nombre: 'Ginebra Pink strawberry', marca: 'BEEFEATER', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.60 - Páreve incluso sin sello', categorias: ['Bebidas alcohólicas'] },
  { nombre: 'Ginebra London dry 24', marca: 'BEEFEATER', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.60 - Páreve incluso sin sello', categorias: ['Bebidas alcohólicas'] },
  { nombre: 'Ginebra Plymouth Dry', marca: 'PLYMOUTH', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.60 - Páreve incluso sin sello', categorias: ['Bebidas alcohólicas'] },
  { nombre: 'Ginebra extra seca', marca: 'SEAGRAMS', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.60 - Páreve incluso sin sello', categorias: ['Bebidas alcohólicas'] },
  { nombre: 'Ginebra', marca: 'BOMBAY', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.60 - Páreve incluso sin sello', categorias: ['Bebidas alcohólicas'] },
  { nombre: 'Ginebra', marca: 'MERMAID', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.60 - Páreve incluso sin sello', categorias: ['Bebidas alcohólicas'] },
  { nombre: 'Ginebra', marca: 'MASTERS', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.60 - Páreve incluso sin sello', categorias: ['Bebidas alcohólicas'] },
  { nombre: 'Ron blanco scotch', marca: 'BACARDÍ', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.60 - Páreve incluso sin sello', categorias: ['Bebidas alcohólicas'] },
  { nombre: 'Ron añejo', marca: 'CAÑA DEL CARIBE', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.61 - Páreve incluso sin sello', categorias: ['Bebidas alcohólicas'] },
  { nombre: 'Whisky', marca: 'CROWN ROYAL', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.61 - Páreve incluso sin sello', categorias: ['Bebidas alcohólicas'] },
  { nombre: 'Whisky fine old', marca: 'WHITE HORSE', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.61 - Páreve incluso sin sello', categorias: ['Bebidas alcohólicas'] },
  { nombre: 'Whisky extra fine', marca: 'PLYMOUTH', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.61 - Páreve incluso sin sello', categorias: ['Bebidas alcohólicas'] },
  { nombre: 'Whisky', marca: 'JOHNNY WALKER', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.61 - Páreve incluso sin sello', categorias: ['Bebidas alcohólicas'] },
  { nombre: 'Whisky', marca: "BALLANTINE'S", tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.61 - Páreve incluso sin sello', categorias: ['Bebidas alcohólicas'] },
  { nombre: 'Whisky', marca: 'J&B', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.61 - Páreve incluso sin sello', categorias: ['Bebidas alcohólicas'] },
  { nombre: 'Whisky etiqueta blanca', marca: "DEWAR'S", tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.61 - Páreve incluso sin sello', categorias: ['Bebidas alcohólicas'] },
  { nombre: 'Whisky', marca: 'CUTTY SARK', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.61 - Páreve incluso sin sello', categorias: ['Bebidas alcohólicas'] },
  { nombre: 'Whisky Chivas Regal y Royal Salute', marca: 'CHIVAS REGAL', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.62 - Páreve incluso sin sello', categorias: ['Bebidas alcohólicas'] },
  { nombre: 'Whisky', marca: "JACK DANIEL'S", tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.62 - Páreve incluso sin sello', categorias: ['Bebidas alcohólicas'] },
  { nombre: 'Whisky', marca: 'FOUR ROSES', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.62 - Páreve incluso sin sello', categorias: ['Bebidas alcohólicas'] },
  { nombre: 'Whisky 12 años', marca: 'THE IRISH MAN', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.62 - Páreve incluso sin sello', categorias: ['Bebidas alcohólicas'] },
  { nombre: 'Whisky small batch', marca: 'TEELING', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.62 - Páreve incluso sin sello', categorias: ['Bebidas alcohólicas'] },
  { nombre: 'Whisky Barry Crockett Legacy', marca: 'MIDLETON', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.62 - Páreve incluso sin sello', categorias: ['Bebidas alcohólicas'] },
  { nombre: 'Whisky 12 años', marca: 'KNAPPOGUE CASTLE', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.62 - Páreve incluso sin sello', categorias: ['Bebidas alcohólicas'] },
  { nombre: 'Whisky', marca: 'JIM BEAM', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.62 - Páreve incluso sin sello', categorias: ['Bebidas alcohólicas'] },
  { nombre: 'Vodka', marca: 'AIREM', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.62 - Páreve incluso sin sello', categorias: ['Bebidas alcohólicas'] },
  { nombre: 'Vodka (Allure, Epicure y Noble)', marca: 'BELUGA', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.63 - Páreve incluso sin sello', categorias: ['Bebidas alcohólicas'] },
  { nombre: 'Vodka', marca: 'BELVEDERE', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.63 - Páreve incluso sin sello', categorias: ['Bebidas alcohólicas'] },
  { nombre: 'Vodka', marca: 'SMIRNOFF', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.63 - Páreve incluso sin sello', categorias: ['Bebidas alcohólicas'] },
  { nombre: 'Vodka', marca: 'STOLI', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.63 - Páreve incluso sin sello', categorias: ['Bebidas alcohólicas'] },
  { nombre: 'Vodka', marca: '3 RANGERS', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.63 - Páreve incluso sin sello', categorias: ['Bebidas alcohólicas'] },
  { nombre: 'Vodka', marca: 'FINLANDIA', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.63 - Páreve incluso sin sello', categorias: ['Bebidas alcohólicas'] },
  { nombre: 'Vodka', marca: 'ABSOLUT', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.63 - Páreve incluso sin sello', categorias: ['Bebidas alcohólicas'] },
  { nombre: 'Vodka Prince Igor 37.5% y premium 40%', marca: 'IGOR', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.63 - Páreve incluso sin sello', categorias: ['Bebidas alcohólicas'] },
  { nombre: 'Vodka pineapple, orange y lime', marca: 'MG SPIRIT', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.63 - Páreve incluso sin sello', categorias: ['Bebidas alcohólicas'] },
  { nombre: 'Tequila 1800 Silver, Reposado y Añejo', marca: '1800', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.64 - Páreve incluso sin sello', categorias: ['Bebidas alcohólicas'] },
  { nombre: 'Tequila XO Café', marca: 'PATRÓN', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.64 - Páreve incluso sin sello', categorias: ['Bebidas alcohólicas'] },
  { nombre: 'Tequila Plata y oro', marca: 'JOSÉ CUERVO', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.64 - Páreve incluso sin sello', categorias: ['Bebidas alcohólicas'] },
  { nombre: 'Tequila blanco', marca: 'SAUZA', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.64 - Páreve incluso sin sello', categorias: ['Bebidas alcohólicas'] },
  { nombre: 'Mojito', marca: 'MG SPIRIT', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.64 - Páreve incluso sin sello', categorias: ['Bebidas alcohólicas'] },
  { nombre: 'Mojito', marca: 'ZUMOSFERA', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.64 - Páreve incluso sin sello', categorias: ['Bebidas alcohólicas'] },
  { nombre: 'Sidra', marca: 'LADRÓN DE MANZANAS', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.64 - Páreve incluso sin sello', categorias: ['Bebidas alcohólicas'] },
  { nombre: 'Aguardiente', marca: 'CALVADOS', tipo_kosher: 'pareve', justificacion: 'Lista CJM Febrero 2026 p.64 - Páreve incluso sin sello', categorias: ['Bebidas alcohólicas'] },
];

// ─────────────────────────────────────────────
// FUNCIÓN PRINCIPAL DE IMPORTACIÓN
// ─────────────────────────────────────────────
async function importarProductos() {
  const client = await pool.connect();
  let insertados = 0;
  let omitidos = 0;

  try {
    await client.query('BEGIN');

    for (const p of productos) {
      // Verificar si ya existe el producto (evita duplicados sin necesitar UNIQUE constraint)
      const existe = await client.query(
        `SELECT id FROM productos WHERE LOWER(nombre) = LOWER($1) AND LOWER(marca) = LOWER($2)`,
        [p.nombre, p.marca]
      );
      if (existe.rows.length > 0) {
        omitidos++;
        continue;
      }

      // Insertar producto (estado 'validado' + visible=true para que aparezca en búsquedas)
      const res = await client.query(`
        INSERT INTO productos (nombre, marca, tipo_kosher, justificacion, estado, visible)
        VALUES ($1, $2, $3, $4, 'validado', true)
        RETURNING id
      `, [p.nombre, p.marca, p.tipo_kosher, p.justificacion]);

      if (res.rowCount === 0) {
        omitidos++;
        continue;
      }

      const productoId = res.rows[0].id;
      insertados++;

      // Asignar categorías
      for (const catNombre of p.categorias) {
        const catRes = await client.query(
          'SELECT id FROM categorias WHERE LOWER(nombre) = LOWER($1)',
          [catNombre]
        );
        if (catRes.rows.length > 0) {
          const yaAsignada = await client.query(
            'SELECT 1 FROM producto_categorias WHERE producto_id = $1 AND categoria_id = $2',
            [productoId, catRes.rows[0].id]
          );
          if (yaAsignada.rows.length === 0) {
            await client.query(
              'INSERT INTO producto_categorias (producto_id, categoria_id) VALUES ($1, $2)',
              [productoId, catRes.rows[0].id]
            );
          }
        } else {
          console.warn(`⚠️  Categoría no encontrada: "${catNombre}" para producto "${p.nombre}"`);
        }
      }
    }

    await client.query('COMMIT');
    console.log(`✅ Importación completada:`);
    console.log(`   • Productos insertados: ${insertados}`);
    console.log(`   • Productos omitidos (ya existían): ${omitidos}`);
    console.log(`   • Total procesados: ${productos.length}`);

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Error durante la importación, se ha revertido la transacción:', err);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

importarProductos().catch(console.error);