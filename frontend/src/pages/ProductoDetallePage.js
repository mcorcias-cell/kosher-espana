// src/pages/ProductoDetallePage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { productosService, feedbackService } from '../services/api';
import { useAuth } from '../context/AuthContext';

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

const S = {
  page: { maxWidth: '900px', margin: '0 auto', padding: '2rem 1rem' },
  card: { background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' },
  header: { display: 'grid', gridTemplateColumns: '300px 1fr', gap: 0 },
  img: { width: '100%', height: '300px', objectFit: 'cover', background: '#f7fafc' },
  info: { padding: '2rem' },
  titulo: { fontSize: '1.75rem', fontWeight: 700, color: '#1a365d', margin: '0 0 8px' },
  marca: { fontSize: '1.1rem', color: '#718096', margin: '0 0 1.5rem' },
  sello: (color) => ({ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 16px', borderRadius: '20px', border: `2px solid ${color}`, color, fontWeight: 600, fontSize: '0.9rem', marginBottom: '8px' }),
  sección: { padding: '1.5rem', borderTop: '1px solid #e2e8f0' },
  subtitulo: { fontSize: '1.1rem', fontWeight: 600, color: '#2d3748', marginBottom: '1rem' },
  campo: { display: 'flex', gap: '1rem', marginBottom: '8px', fontSize: '0.95rem' },
  etiqueta: { color: '#718096', minWidth: '120px' },
  valor: { color: '#2d3748', fontWeight: 500 },
  btn: { padding: '10px 20px', background: '#2b6cb0', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 },
  inputFeedback: { width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', marginBottom: '8px', fontSize: '0.9rem', boxSizing: 'border-box' },
};

const ProductoDetallePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [feedbackForm, setFeedbackForm] = useState({ supermercado: '', localidad: '', notas: '' });
  const [enviandoFeedback, setEnviandoFeedback] = useState(false);

  useEffect(() => {
    productosService.obtener(id)
      .then(res => setProducto(res.data))
      .catch(() => navigate('/'))
      .finally(() => setCargando(false));
  }, [id, navigate]);

  const enviarFeedback = async (e) => {
    e.preventDefault();
    if (!feedbackForm.supermercado || !feedbackForm.localidad) {
      return toast.error('Supermercado y localidad son obligatorios');
    }
    setEnviandoFeedback(true);
    try {
      await feedbackService.agregar(id, feedbackForm);
      toast.success('¡Gracias por tu aportación!');
      setFeedbackForm({ supermercado: '', localidad: '', notas: '' });
      const res = await productosService.obtener(id);
      setProducto(res.data);
    } catch {
      toast.error('Error al enviar la información');
    } finally {
      setEnviandoFeedback(false);
    }
  };

  if (cargando) return <div style={{ textAlign: 'center', padding: '4rem', color: '#718096' }}>Cargando producto...</div>;
  if (!producto) return null;

  return (
    <div style={S.page}>
      <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#2b6cb0', cursor: 'pointer', marginBottom: '1rem', fontSize: '0.9rem' }}>
        ← Volver
      </button>

      <div style={S.card}>
        {/* Header: imagen + info básica */}
        <div style={{ ...S.header, display: 'grid' }}>
          <div style={{ background: '#f7fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '280px' }}>
            {producto.imagen_url
              ? <img src={producto.imagen_url} alt={producto.nombre} style={{ width: '100%', height: '280px', objectFit: 'cover' }} />
              : <span style={{ fontSize: '5rem' }}>📦</span>
            }
          </div>
          <div style={S.info}>
            <h1 style={S.titulo}>{producto.nombre}</h1>
            <p style={S.marca}>{producto.marca}</p>

            {/* Tipo kosher + Categorías */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '1rem' }}>
              {producto.tipo_kosher && KOSHER_LABELS[producto.tipo_kosher] && (() => {
                const k = KOSHER_LABELS[producto.tipo_kosher];
                return (
                  <span style={{ padding: '5px 14px', borderRadius: '20px', fontWeight: 700, fontSize: '0.9rem', color: k.color, background: k.bg, border: `1px solid ${k.color}` }}>
                    {k.emoji} {k.texto}
                  </span>
                );
              })()}
              {producto.categorias && producto.categorias.map((c, i) => (
                <span key={i} style={{ padding: '5px 14px', borderRadius: '20px', fontSize: '0.85rem', background: '#f0fff4', color: '#276749', border: '1px solid #c6f6d5' }}>
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
                    <div key={i} style={S.sello(tipo?.color || '#718096')}>
                      {tipo?.emoji} {tipo?.texto || v.tipo}
                      {v.es_revalidacion && <span style={{ fontSize: '0.75rem', opacity: 0.8 }}> (Revalidado)</span>}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Campos del producto */}
            {producto.gramaje && <div style={S.campo}><span style={S.etiqueta}>Gramaje:</span><span style={S.valor}>{producto.gramaje}</span></div>}
            {producto.sabor_variante && <div style={S.campo}><span style={S.etiqueta}>Variante:</span><span style={S.valor}>{producto.sabor_variante}</span></div>}
            {producto.fabricante && <div style={S.campo}><span style={S.etiqueta}>Fabricante:</span><span style={S.valor}>{producto.fabricante}</span></div>}
            {producto.codigo_barras && <div style={S.campo}><span style={S.etiqueta}>Cód. barras:</span><span style={S.valor}>{producto.codigo_barras}</span></div>}
          </div>
        </div>

        {/* Validaciones detalladas */}
        {producto.validaciones && producto.validaciones.length > 0 && (
          <div style={S.sección}>
            <h2 style={S.subtitulo}>🏆 Validaciones</h2>
            {producto.validaciones.map((v, i) => (
              <div key={i} style={{ padding: '12px', background: '#f7fafc', borderRadius: '8px', marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '4px' }}>
                  <strong style={{ color: '#1a365d' }}>{v.validador}</strong>
                  <span style={{ color: '#718096', fontSize: '0.85rem' }}>{v.comunidad}</span>
                </div>
                <div style={{ color: '#718096', fontSize: '0.8rem', marginTop: '4px' }}>
                  {new Date(v.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}
                  {v.es_revalidacion && <span style={{ marginLeft: '8px', background: '#e9d8fd', color: '#6b46c1', padding: '1px 8px', borderRadius: '20px', fontSize: '0.75rem' }}>Revalidación</span>}
                </div>
                {v.notas && <p style={{ margin: '8px 0 0', color: '#4a5568', fontSize: '0.85rem' }}>{v.notas}</p>}
              </div>
            ))}
          </div>
        )}

        {/* Dónde encontrarlo */}
        {producto.ubicaciones && producto.ubicaciones.length > 0 && (
          <div style={S.sección}>
            <h2 style={S.subtitulo}>📍 Dónde encontrarlo</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.75rem' }}>
              {producto.ubicaciones.map((u, i) => (
                <div key={i} style={{ padding: '10px 14px', background: '#f0fff4', borderRadius: '8px', borderLeft: '3px solid #38a169' }}>
                  <div style={{ fontWeight: 600, color: '#276749' }}>{u.supermercado}</div>
                  <div style={{ color: '#4a5568', fontSize: '0.85rem' }}>{u.localidad}</div>
                  {u.notas && <div style={{ color: '#718096', fontSize: '0.8rem', marginTop: '4px' }}>{u.notas}</div>}
                  {u.verificado && <div style={{ color: '#276749', fontSize: '0.75rem', marginTop: '4px' }}>✓ Verificado</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Formulario de feedback (solo usuarios autenticados) */}
        {usuario && (
          <div style={S.sección}>
            <h2 style={S.subtitulo}>📍 ¿Lo encontraste en algún supermercado?</h2>
            <form onSubmit={enviarFeedback} style={{ maxWidth: '500px' }}>
              <input
                style={S.inputFeedback}
                placeholder="Nombre del supermercado *"
                value={feedbackForm.supermercado}
                onChange={e => setFeedbackForm(f => ({ ...f, supermercado: e.target.value }))}
              />
              <input
                style={S.inputFeedback}
                placeholder="Localidad / ciudad *"
                value={feedbackForm.localidad}
                onChange={e => setFeedbackForm(f => ({ ...f, localidad: e.target.value }))}
              />
              <input
                style={S.inputFeedback}
                placeholder="Notas adicionales (opcional)"
                value={feedbackForm.notas}
                onChange={e => setFeedbackForm(f => ({ ...f, notas: e.target.value }))}
              />
              <button type="submit" style={S.btn} disabled={enviandoFeedback}>
                {enviandoFeedback ? 'Enviando...' : 'Reportar ubicación'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductoDetallePage;