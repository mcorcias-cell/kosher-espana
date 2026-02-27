// src/pages/ProductoDetallePage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { productosService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useIsMobile } from '../hooks/useMediaQuery';
import AportacionesSection from '../components/feedback/AportacionesSection';

const TIPO_LABELS = {
  ingredientes_verificables: { texto: 'Ingredientes verificables', emoji: '🔍', color: '#d69e2e' },
  certificacion_externa: { texto: 'Certificación por organización externa', emoji: '📜', color: '#2b6cb0' },
  certificacion_completa: { texto: 'Certificación completa de la comunidad', emoji: '⭐', color: '#276749' },
};

const KOSHER_LABELS = {
  pareve:  { texto: 'Páreve',  color: '#2b6cb0', bg: '#ebf8ff', emoji: '🔵' },
  lacteo:  { texto: 'Lácteo',  color: '#b7791f', bg: '#fefcbf', emoji: '🟡' },
  carnico: { texto: 'Cárnico', color: '#c53030', bg: '#fff5f5', emoji: '🔴' },
  pescado: { texto: 'Pescado', color: '#2c7a7b', bg: '#e6fffa', emoji: '🐟' },
};

const ProductoDetallePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const isMobile = useIsMobile();
  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);


  useEffect(() => {
    productosService.obtener(id)
      .then(res => setProducto(res.data))
      .catch(() => navigate('/'))
      .finally(() => setCargando(false));
  }, [id, navigate]);


  if (cargando) return <div style={{ textAlign: 'center', padding: '4rem', color: '#718096' }}>Cargando producto...</div>;
  if (!producto) return null;

  const seccion = { padding: isMobile ? '1rem' : '1.5rem', borderTop: '1px solid #e2e8f0' };
  const subtitulo = { fontSize: '1rem', fontWeight: 600, color: '#2d3748', marginBottom: '0.75rem' };
  const campo = { display: 'flex', gap: '0.75rem', marginBottom: '8px', fontSize: '0.9rem', flexWrap: 'wrap' };
  const inputStyle = { width: '100%', padding: '9px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', marginBottom: '8px', fontSize: '0.9rem', boxSizing: 'border-box' };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: isMobile ? '0.75rem' : '2rem 1rem' }}>
      <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#2b6cb0', cursor: 'pointer', marginBottom: '0.75rem', fontSize: '0.9rem', padding: 0 }}>
        ← Volver
      </button>

      <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        {/* Header: imagen + info */}
        <div style={{ display: isMobile ? 'block' : 'grid', gridTemplateColumns: '280px 1fr' }}>
          {/* Imagen */}
          <div style={{ background: '#f7fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: isMobile ? '220px' : '280px', position: 'relative' }}>
            {producto.imagen_url
              ? <img src={producto.imagen_url} alt={producto.nombre} style={{ width: '100%', height: isMobile ? '220px' : '280px', objectFit: 'cover' }} />
              : <span style={{ fontSize: '5rem' }}>📦</span>
            }
            {/* Badge tipo kosher sobre imagen en móvil */}
            {isMobile && producto.tipo_kosher && KOSHER_LABELS[producto.tipo_kosher] && (() => {
              const k = KOSHER_LABELS[producto.tipo_kosher];
              return (
                <span style={{ position: 'absolute', top: '10px', right: '10px', padding: '4px 12px', borderRadius: '20px', fontWeight: 700, fontSize: '0.8rem', color: k.color, background: k.bg, border: `1px solid ${k.color}` }}>
                  {k.emoji} {k.texto}
                </span>
              );
            })()}
          </div>

          {/* Info */}
          <div style={{ padding: isMobile ? '1rem' : '1.75rem' }}>
            <h1 style={{ fontSize: isMobile ? '1.3rem' : '1.6rem', fontWeight: 700, color: '#1a365d', margin: '0 0 6px' }}>{producto.nombre}</h1>
            <p style={{ fontSize: '1rem', color: '#718096', margin: '0 0 1rem' }}>{producto.marca}</p>

            {/* Tipo kosher + Categorías */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '1rem' }}>
              {!isMobile && producto.tipo_kosher && KOSHER_LABELS[producto.tipo_kosher] && (() => {
                const k = KOSHER_LABELS[producto.tipo_kosher];
                return (
                  <span style={{ padding: '5px 14px', borderRadius: '20px', fontWeight: 700, fontSize: '0.875rem', color: k.color, background: k.bg, border: `1px solid ${k.color}` }}>
                    {k.emoji} {k.texto}
                  </span>
                );
              })()}
              {producto.categorias && producto.categorias.map((c, i) => (
                <span key={i} style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', background: '#f0fff4', color: '#276749', border: '1px solid #c6f6d5' }}>
                  {c.icono} {c.nombre}
                </span>
              ))}
            </div>

            {/* Sellos de validación */}
            {producto.validaciones && producto.validaciones.length > 0 && (
              <div style={{ marginBottom: '1rem' }}>
                {producto.validaciones.map((v, i) => {
                  const tipo = TIPO_LABELS[v.tipo];
                  return (
                    <div key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '5px 14px', borderRadius: '20px', border: `2px solid ${tipo?.color || '#718096'}`, color: tipo?.color || '#718096', fontWeight: 600, fontSize: '0.82rem', marginBottom: '6px', marginRight: '6px' }}>
                      {tipo?.emoji} {tipo?.texto || v.tipo}
                      {v.es_revalidacion && <span style={{ fontSize: '0.72rem', opacity: 0.8 }}>(Revalidado)</span>}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Campos */}
            <div style={{ fontSize: '0.88rem' }}>
              {producto.gramaje && <div style={campo}><span style={{ color: '#718096', minWidth: '100px' }}>Gramaje:</span><span style={{ color: '#2d3748', fontWeight: 500 }}>{producto.gramaje}</span></div>}
              {producto.sabor_variante && <div style={campo}><span style={{ color: '#718096', minWidth: '100px' }}>Variante:</span><span style={{ color: '#2d3748', fontWeight: 500 }}>{producto.sabor_variante}</span></div>}
              {producto.fabricante && <div style={campo}><span style={{ color: '#718096', minWidth: '100px' }}>Fabricante:</span><span style={{ color: '#2d3748', fontWeight: 500 }}>{producto.fabricante}</span></div>}
              {producto.codigo_barras && <div style={campo}><span style={{ color: '#718096', minWidth: '100px' }}>Cód. barras:</span><span style={{ color: '#2d3748', fontWeight: 500 }}>{producto.codigo_barras}</span></div>}
            </div>
          </div>
        </div>

        {/* Validaciones detalladas */}
        {producto.validaciones && producto.validaciones.length > 0 && (
          <div style={seccion}>
            <h2 style={subtitulo}>🏆 Validaciones</h2>
            {producto.validaciones.map((v, i) => (
              <div key={i} style={{ padding: '10px 14px', background: '#f7fafc', borderRadius: '8px', marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '4px' }}>
                  <strong style={{ color: '#1a365d', fontSize: '0.9rem' }}>{v.validador}</strong>
                  <span style={{ color: '#718096', fontSize: '0.82rem' }}>{v.comunidad}</span>
                </div>
                <div style={{ color: '#718096', fontSize: '0.78rem', marginTop: '4px' }}>
                  {new Date(v.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}
                  {v.es_revalidacion && <span style={{ marginLeft: '8px', background: '#e9d8fd', color: '#6b46c1', padding: '1px 8px', borderRadius: '20px', fontSize: '0.72rem' }}>Revalidación</span>}
                </div>
                {v.notas && <p style={{ margin: '6px 0 0', color: '#4a5568', fontSize: '0.82rem' }}>{v.notas}</p>}
              </div>
            ))}
          </div>
        )}

        {/* Dónde encontrarlo */}
        {producto.ubicaciones && producto.ubicaciones.length > 0 && (
          <div style={seccion}>
            <h2 style={subtitulo}>📍 Dónde encontrarlo</h2>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.6rem' }}>
              {producto.ubicaciones.map((u, i) => (
                <div key={i} style={{ padding: '10px 14px', background: '#f0fff4', borderRadius: '8px', borderLeft: '3px solid #38a169' }}>
                  <div style={{ fontWeight: 600, color: '#276749', fontSize: '0.9rem' }}>{u.supermercado}</div>
                  <div style={{ color: '#4a5568', fontSize: '0.82rem' }}>{u.localidad}</div>
                  {u.notas && <div style={{ color: '#718096', fontSize: '0.78rem', marginTop: '4px' }}>{u.notas}</div>}
                  {u.verificado && <div style={{ color: '#276749', fontSize: '0.73rem', marginTop: '4px' }}>✓ Verificado</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        <AportacionesSection productoId={id} />
      </div>
    </div>
  );
};

export default ProductoDetallePage;
