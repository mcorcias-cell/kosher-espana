// src/components/products/TarjetaProducto.js
import React from 'react';

const TIPO_LABELS = {
  ingredientes_verificables: { texto: 'Ingredientes verificables', color: '#d69e2e', bg: '#fefcbf' },
  certificacion_externa: { texto: 'Cert. organización externa', color: '#2b6cb0', bg: '#ebf8ff' },
  certificacion_completa: { texto: 'Certificación completa', color: '#276749', bg: '#f0fff4' },
};

const KOSHER_LABELS = {
  pareve:  { texto: 'Páreve',  color: '#2b6cb0', bg: '#ebf8ff', emoji: '🔵' },
  lacteo:  { texto: 'Lácteo',  color: '#b7791f', bg: '#fefcbf', emoji: '🟡' },
  carnico: { texto: 'Cárnico', color: '#c53030', bg: '#fff5f5', emoji: '🔴' },
  pescado: { texto: 'Pescado', color: '#2c7a7b', bg: '#e6fffa', emoji: '🐟' },
};

const SUPER_LOGOS = {
  mercadona:      '/supermercados/mercadona.png',
  carrefour:      '/supermercados/carrefour.png',
  lidl:           '/supermercados/lidl.png',
  alcampo:        '/supermercados/alcampo.png',
  elcorteingles:  '/supermercados/elcorteingles.png',
  dia:            '/supermercados/dia.png',
};

const getLogoSuper = (nombre) => {
  if (!nombre) return null;
  const clean = nombre.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
  return SUPER_LOGOS[clean] || null;
};

const LogosSupermercados = ({ supermercados }) => {
  if (!supermercados || supermercados.length === 0) return null;

  const conLogo = supermercados.filter(s => getLogoSuper(s));
  if (conLogo.length === 0) return null;

  const MAX = 3;
  const visibles = conLogo.slice(0, MAX);
  const extra = conLogo.length - MAX;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {visibles.map((s, i) => (
          <img
            key={i}
            src={getLogoSuper(s)}
            alt={s}
            title={s}
            style={{
              width: '22px',
              height: '22px',
              objectFit: 'contain',
              borderRadius: '4px',
              border: '1px solid #e2e8f0',
              background: 'white',
              marginLeft: i > 0 ? '-6px' : 0,
              position: 'relative',
              zIndex: visibles.length - i,
            }}
          />
        ))}
      </div>
      {extra > 0 && (
        <span style={{ fontSize: '0.68rem', color: '#a0aec0', marginLeft: '4px' }}>+{extra}</span>
      )}
    </div>
  );
};

const TarjetaProducto = ({ producto, onClick }) => {
  const ultimaValidacion = producto.validaciones?.[0];
  const tipoInfo = ultimaValidacion ? TIPO_LABELS[ultimaValidacion.tipo] : null;
  const kosherInfo = producto.tipo_kosher ? KOSHER_LABELS[producto.tipo_kosher] : null;

  return (
    <div
      onClick={onClick}
      style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', cursor: 'pointer', transition: 'transform 0.15s, box-shadow 0.15s', border: '1px solid #e2e8f0' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.12)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'; }}
    >
      {/* Imagen */}
      <div style={{ position: 'relative', height: '160px', background: '#f7fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {producto.imagen_url ? (
          <img src={producto.imagen_url} alt={producto.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <span style={{ fontSize: '3rem', color: '#cbd5e0' }}>📦</span>
        )}
        {/* Badge tipo kosher sobre la imagen */}
        {kosherInfo && (
          <span style={{ position: 'absolute', top: '8px', right: '8px', padding: '3px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700, color: kosherInfo.color, background: kosherInfo.bg, boxShadow: '0 1px 4px rgba(0,0,0,0.15)' }}>
            {kosherInfo.emoji} {kosherInfo.texto}
          </span>
        )}
      </div>

      {/* Contenido */}
      <div style={{ padding: '1rem' }}>
        <h3 style={{ margin: '0 0 4px', fontSize: '1rem', fontWeight: 600, color: '#1a365d' }}>{producto.nombre}</h3>
        <p style={{ margin: '0 0 8px', color: '#718096', fontSize: '0.85rem' }}>{producto.marca}</p>

        {producto.sabor_variante && (
          <p style={{ margin: '0 0 8px', color: '#a0aec0', fontSize: '0.8rem' }}>{producto.sabor_variante}</p>
        )}

        {tipoInfo && (
          <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, color: tipoInfo.color, background: tipoInfo.bg }}>
            ✓ {tipoInfo.texto}
          </span>
        )}

        {producto.categorias && producto.categorias.length > 0 && (
          <div style={{ marginTop: '6px', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {producto.categorias.slice(0, 2).map((c, i) => (
              <span key={i} style={{ fontSize: '0.72rem', background: '#f0fff4', color: '#276749', padding: '2px 8px', borderRadius: '10px' }}>
                {c.icono} {c.nombre}
              </span>
            ))}
          </div>
        )}

        {ultimaValidacion && (
          <p style={{ margin: '8px 0 0', fontSize: '0.75rem', color: '#a0aec0' }}>
            Validado por {ultimaValidacion.validador} · {ultimaValidacion.comunidad}
          </p>
        )}

        <LogosSupermercados supermercados={producto.supermercados} />
      </div>
    </div>
  );
};

export default TarjetaProducto;
