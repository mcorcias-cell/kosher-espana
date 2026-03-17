// src/pages/ProductoDetallePage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { productosService, categoriasService } from '../services/api';
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

const BERAJA_LABELS = {
  hamotzi:      { texto: 'המוציא Hamotzi',      emoji: '🍞', color: '#744210', bg: '#fefcbf' },
  mezonot:      { texto: 'מזונות Mezonot',      emoji: '🫓', color: '#744210', bg: '#fffaf0' },
  peri_haguefen:{ texto: 'פרי הגפן Peri Haguefen', emoji: '🍇', color: '#553c9a', bg: '#faf5ff' },
  haetz:        { texto: 'העץ Haetz',            emoji: '🌳', color: '#276749', bg: '#f0fff4' },
  haadama:      { texto: 'האדמה Haadama',        emoji: '🌱', color: '#276749', bg: '#e6fffa' },
  sheakol:      { texto: 'שהכל Sheakol',         emoji: '🌟', color: '#2b6cb0', bg: '#ebf8ff' },
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

const ScrollCarousel = ({ titulo, productos, verTodosUrl, navigate }) => {
  if (!productos || productos.length === 0) return null;
  return (
    <div style={{ marginTop: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#2d3748', margin: 0 }}>{titulo}</h3>
        <button
          onClick={() => navigate(verTodosUrl)}
          style={{ background: 'none', border: 'none', color: '#2b6cb0', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, padding: 0 }}>
          Ver todos →
        </button>
      </div>
      <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem', scrollbarWidth: 'thin' }}>
        {productos.map(p => (
          <div
            key={p.id}
            onClick={() => navigate(`/producto/${p.id}`)}
            style={{ flexShrink: 0, width: '140px', background: 'white', borderRadius: '10px', border: '1px solid #e2e8f0', cursor: 'pointer', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', transition: 'box-shadow 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)'}
          >
            <div style={{ width: '100%', height: '100px', background: '#f7fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              {p.imagen_url
                ? <img src={p.imagen_url} alt={p.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span style={{ fontSize: '2rem' }}>📦</span>
              }
            </div>
            <div style={{ padding: '8px' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#2d3748', lineHeight: 1.3, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{p.nombre}</div>
              <div style={{ fontSize: '0.72rem', color: '#718096', marginTop: '3px' }}>{p.marca}</div>
              {p.tipo_kosher && (
                <div style={{ fontSize: '0.68rem', marginTop: '4px', color: '#2b6cb0', fontWeight: 600 }}>
                  {p.tipo_kosher === 'pareve' ? '🔵' : p.tipo_kosher === 'lacteo' ? '🟡' : p.tipo_kosher === 'carnico' ? '🔴' : '🐟'} {p.tipo_kosher}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


const ProductoDetallePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { usuario } = useAuth();
  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [navIds, setNavIds] = useState([]);
  const [sugerenciasMarca, setSugerenciasMarca] = useState([]);
  const [sugerenciasCategoria, setSugerenciasCategoria] = useState([]);
  const [modalBorrar, setModalBorrar] = useState(false);
  const [motivoBorrar, setMotivoBorrar] = useState('');
  const [notificarEmail, setNotificarEmail] = useState(true);
  const [borrando, setBorrando] = useState(false);
  const [editandoBeraja, setEditandoBeraja] = useState(false);
  const [editandoCategorias, setEditandoCategorias] = useState(false);
  const [todasCategorias, setTodasCategorias] = useState([]);
  const [catsSeleccionadas, setCatsSeleccionadas] = useState([]);


  useEffect(() => {
    setCargando(true);
    setSugerenciasMarca([]);
    setSugerenciasCategoria([]);

    // Cargar IDs de navegación desde sessionStorage
    try {
      const stored = sessionStorage.getItem('kosher_nav_ids');
      if (stored) setNavIds(JSON.parse(stored));
    } catch { setNavIds([]); }

    productosService.obtener(id)
      .then(res => {
        setProducto(res.data);
        const p = res.data;

        // Sugerencias misma marca
        productosService.buscar({ marca: p.marca, limit: 9 })
          .then(r => setSugerenciasMarca(r.data.productos.filter(x => x.id !== id).slice(0, 8)))
          .catch(() => {});

        // Sugerencias misma categoría (primera categoría del producto)
        if (p.categorias && p.categorias.length > 0) {
          productosService.buscar({ categoria_id: p.categorias[0].id, limit: 9 })
            .then(r => setSugerenciasCategoria(r.data.productos.filter(x => x.id !== id).slice(0, 8)))
            .catch(() => {});
        }
      })
      .catch(() => navigate('/'))
      .finally(() => setCargando(false));
  }, [id, navigate]);


  const handleBorrarProducto = async () => {
    if (!motivoBorrar || motivoBorrar.trim().length < 5) {
      return toast.error('El motivo es obligatorio (mínimo 5 caracteres)');
    }
    setBorrando(true);
    try {
      await productosService.borrar(id, { motivo: motivoBorrar, notificar_email: notificarEmail });
      toast.success('Producto eliminado');
      navigate('/');
    } catch {
      toast.error('Error al eliminar el producto');
    } finally {
      setBorrando(false);
    }
  };

  const handleGuardarBeraja = async (beraja) => {
    try {
      await productosService.actualizarBeraja(id, beraja);
      toast.success('Beraja actualizada');
      setEditandoBeraja(false);
      const res = await productosService.obtener(id);
      setProducto(res.data);
    } catch {
      toast.error('Error al actualizar la beraja');
    }
  };

  const abrirEditarCategorias = async () => {
    if (todasCategorias.length === 0) {
      const res = await categoriasService.listar().catch(() => ({ data: [] }));
      setTodasCategorias(res.data);
    }
    setCatsSeleccionadas((producto.categorias || []).map(c => c.id));
    setEditandoCategorias(true);
  };

  const handleGuardarCategorias = async () => {
    try {
      await categoriasService.asignarAProducto(id, catsSeleccionadas);
      toast.success('Categorías actualizadas');
      setEditandoCategorias(false);
      const res = await productosService.obtener(id);
      setProducto(res.data);
    } catch {
      toast.error('Error al actualizar categorías');
    }
  };

  if (cargando) return <div style={{ textAlign: 'center', padding: '4rem', color: '#718096' }}>Cargando producto...</div>;
  if (!producto) return null;

  const seccion = { padding: isMobile ? '1rem' : '1.5rem', borderTop: '1px solid #e2e8f0' };
  const subtitulo = { fontSize: '1rem', fontWeight: 600, color: '#2d3748', marginBottom: '0.75rem' };
  const campo = { display: 'flex', gap: '0.75rem', marginBottom: '8px', fontSize: '0.9rem', flexWrap: 'wrap' };
  const inputStyle = { width: '100%', padding: '9px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', marginBottom: '8px', fontSize: '0.9rem', boxSizing: 'border-box' };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: isMobile ? '0.75rem' : '2rem 1rem' }}>
      {/* Navegación anterior / siguiente */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#2b6cb0', cursor: 'pointer', fontSize: '0.9rem', padding: 0 }}>
          ← Volver
        </button>
        {navIds.length > 1 && (() => {
          const idx = navIds.indexOf(id);
          const prevId = idx > 0 ? navIds[idx - 1] : null;
          const nextId = idx < navIds.length - 1 ? navIds[idx + 1] : null;
          return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                onClick={() => navigate(`/producto/${prevId}`)}
                disabled={!prevId}
                style={{ padding: '6px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', background: prevId ? 'white' : '#f7fafc', color: prevId ? '#2b6cb0' : '#a0aec0', cursor: prevId ? 'pointer' : 'not-allowed', fontSize: '0.85rem', fontWeight: 600 }}>
                ‹ Anterior
              </button>
              <span style={{ fontSize: '0.75rem', color: '#a0aec0' }}>
                {idx + 1} / {navIds.length}
              </span>
              <button
                onClick={() => navigate(`/producto/${nextId}`)}
                disabled={!nextId}
                style={{ padding: '6px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', background: nextId ? 'white' : '#f7fafc', color: nextId ? '#2b6cb0' : '#a0aec0', cursor: nextId ? 'pointer' : 'not-allowed', fontSize: '0.85rem', fontWeight: 600 }}>
                Siguiente ›
              </button>
            </div>
          );
        })()}
      </div>

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

            {/* Tipo kosher */}
            {producto.tipo_kosher && KOSHER_LABELS[producto.tipo_kosher] && !isMobile && (() => {
              const k = KOSHER_LABELS[producto.tipo_kosher];
              return (
                <div style={{ marginBottom: '0.5rem' }}>
                  <span style={{ padding: '5px 14px', borderRadius: '20px', fontWeight: 700, fontSize: '0.875rem', color: k.color, background: k.bg, border: `1px solid ${k.color}` }}>
                    {k.emoji} {k.texto}
                  </span>
                </div>
              );
            })()}

            {/* Categorías — siempre visibles, editables por validador/admin */}
            <div style={{ marginBottom: '1rem' }}>
              {!editandoCategorias ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
                  {producto.categorias && producto.categorias.length > 0
                    ? producto.categorias.map((c, i) => (
                        <span key={i} style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', background: '#f0fff4', color: '#276749', border: '1px solid #c6f6d5' }}>
                          {c.icono} {c.nombre}
                        </span>
                      ))
                    : <span style={{ fontSize: '0.8rem', color: '#a0aec0' }}>Sin categoría asignada</span>
                  }
                  {usuario && ['validador','administrador','intermedio'].includes(usuario.rol) && (
                    <button onClick={abrirEditarCategorias}
                      style={{ padding: '3px 10px', background: '#f7fafc', border: '1px dashed #cbd5e0', borderRadius: '20px', cursor: 'pointer', fontSize: '0.75rem', color: '#718096' }}>
                      ✏️ Editar
                    </button>
                  )}
                </div>
              ) : (
                <div style={{ background: '#f7fafc', borderRadius: '10px', padding: '0.875rem', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#2d3748', marginBottom: '8px' }}>Selecciona las categorías:</div>
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '4px', maxHeight: '240px', overflowY: 'auto', marginBottom: '10px' }}>
                    {todasCategorias.map(c => {
                      const sel = catsSeleccionadas.includes(c.id);
                      return (
                        <label key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 8px', borderRadius: '6px', cursor: 'pointer', background: sel ? '#f0fff4' : 'white', border: `1px solid ${sel ? '#c6f6d5' : '#e2e8f0'}`, fontSize: '0.82rem' }}>
                          <input type="checkbox" checked={sel} onChange={() => setCatsSeleccionadas(cs => sel ? cs.filter(x => x !== c.id) : [...cs, c.id])} style={{ cursor: 'pointer' }} />
                          {c.icono} {c.nombre}
                        </label>
                      );
                    })}
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button onClick={handleGuardarCategorias} style={{ padding: '6px 14px', background: '#2b6cb0', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem' }}>Guardar</button>
                    <button onClick={() => setEditandoCategorias(false)} style={{ padding: '6px 12px', background: '#edf2f7', color: '#4a5568', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.82rem' }}>Cancelar</button>
                  </div>
                </div>
              )}
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

            {/* Beraja */}
            <div style={{ marginBottom: '1rem' }}>
              {producto.beraja && BERAJA_LABELS[producto.beraja] && !editandoBeraja && (() => {
                const b = BERAJA_LABELS[producto.beraja];
                return (
                  <span
                    onClick={() => usuario && ['validador','administrador','intermedio'].includes(usuario.rol) && setEditandoBeraja(true)}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '5px 14px', borderRadius: '20px', fontWeight: 700, fontSize: '0.875rem', color: b.color, background: b.bg, border: `1px solid ${b.color}`, cursor: usuario && ['validador','administrador','intermedio'].includes(usuario.rol) ? 'pointer' : 'default' }}>
                    {b.emoji} {b.texto}
                    {usuario && ['validador','administrador','intermedio'].includes(usuario.rol) && <span style={{ fontSize: '0.7rem', opacity: 0.6 }}>✏️</span>}
                  </span>
                );
              })()}
              {!producto.beraja && usuario && ['validador','administrador','intermedio'].includes(usuario.rol) && !editandoBeraja && (
                <button onClick={() => setEditandoBeraja(true)} style={{ padding: '4px 12px', background: '#f7fafc', border: '1px dashed #cbd5e0', borderRadius: '20px', cursor: 'pointer', fontSize: '0.8rem', color: '#718096' }}>
                  + Asignar beraja
                </button>
              )}
              {editandoBeraja && (
                <div style={{ background: '#f7fafc', borderRadius: '10px', padding: '0.875rem', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#2d3748', marginBottom: '8px' }}>Selecciona la beraja:</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                    {Object.entries(BERAJA_LABELS).map(([val, b]) => (
                      <button key={val} onClick={() => handleGuardarBeraja(val)}
                        style={{ padding: '6px 12px', borderRadius: '20px', border: `1px solid ${b.color}`, background: producto.beraja === val ? b.bg : 'white', color: b.color, cursor: 'pointer', fontSize: '0.8rem', fontWeight: producto.beraja === val ? 700 : 400 }}>
                        {b.emoji} {b.texto}
                      </button>
                    ))}
                    {producto.beraja && (
                      <button onClick={() => handleGuardarBeraja(null)} style={{ padding: '6px 12px', borderRadius: '20px', border: '1px solid #e2e8f0', background: 'white', color: '#718096', cursor: 'pointer', fontSize: '0.8rem' }}>
                        ✕ Quitar beraja
                      </button>
                    )}
                  </div>
                  <button onClick={() => setEditandoBeraja(false)} style={{ fontSize: '0.78rem', color: '#718096', background: 'none', border: 'none', cursor: 'pointer' }}>Cancelar</button>
                </div>
              )}
            </div>

            {/* Campos */}
            <div style={{ fontSize: '0.88rem' }}>
              {producto.gramaje && <div style={campo}><span style={{ color: '#718096', minWidth: '100px' }}>Gramaje:</span><span style={{ color: '#2d3748', fontWeight: 500 }}>{producto.gramaje}</span></div>}
              {producto.sabor_variante && <div style={campo}><span style={{ color: '#718096', minWidth: '100px' }}>Variante:</span><span style={{ color: '#2d3748', fontWeight: 500 }}>{producto.sabor_variante}</span></div>}
              {producto.fabricante && <div style={campo}><span style={{ color: '#718096', minWidth: '100px' }}>Fabricante:</span><span style={{ color: '#2d3748', fontWeight: 500 }}>{producto.fabricante}</span></div>}
              {producto.codigo_barras && <div style={campo}><span style={{ color: '#718096', minWidth: '100px' }}>Cód. barras:</span><span style={{ color: '#2d3748', fontWeight: 500 }}>{producto.codigo_barras}</span></div>}
            </div>

            {/* Botón borrar - solo admin */}
            {usuario?.rol === 'administrador' && (
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #fee2e2' }}>
                <button onClick={() => setModalBorrar(true)} style={{ padding: '7px 16px', background: '#fff5f5', color: '#c53030', border: '1px solid #fed7d7', borderRadius: '8px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600 }}>
                  🗑️ Eliminar producto
                </button>
              </div>
            )}
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
        {producto.ubicaciones && producto.ubicaciones.length > 0 && (() => {
          const supersUnicos = [...new Set(producto.ubicaciones.map(u => u.supermercado).filter(Boolean))];
          const logosUnicos = supersUnicos.filter(s => getLogoSuper(s));
          const MAX = 3;
          const logosVisibles = logosUnicos.slice(0, MAX);
          const logosExtra = logosUnicos.length - MAX;

          return (
            <div style={seccion}>
              {/* Header con logos superpuestos */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
                <h2 style={{ ...subtitulo, marginBottom: 0 }}>📍 Dónde encontrarlo</h2>
                {logosVisibles.length > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {logosVisibles.map((s, i) => (
                      <img
                        key={i}
                        src={getLogoSuper(s)}
                        alt={s}
                        title={s}
                        style={{
                          width: '28px',
                          height: '28px',
                          objectFit: 'contain',
                          borderRadius: '6px',
                          border: '2px solid white',
                          background: 'white',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                          marginLeft: i > 0 ? '-8px' : 0,
                          position: 'relative',
                          zIndex: logosVisibles.length - i,
                        }}
                      />
                    ))}
                    {logosExtra > 0 && (
                      <span style={{ fontSize: '0.72rem', color: '#a0aec0', marginLeft: '6px' }}>+{logosExtra}</span>
                    )}
                  </div>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.6rem' }}>
                {producto.ubicaciones.map((u, i) => {
                  const logo = getLogoSuper(u.supermercado);
                  return (
                    <div key={i} style={{ padding: '10px 14px', background: '#f0fff4', borderRadius: '8px', borderLeft: '3px solid #38a169', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                      {logo && (
                        <img
                          src={logo}
                          alt={u.supermercado}
                          style={{ width: '32px', height: '32px', objectFit: 'contain', borderRadius: '4px', background: 'white', border: '1px solid #e2e8f0', flexShrink: 0 }}
                        />
                      )}
                      <div>
                        <div style={{ fontWeight: 600, color: '#276749', fontSize: '0.9rem' }}>{u.supermercado}</div>
                        <div style={{ color: '#4a5568', fontSize: '0.82rem' }}>{u.localidad}</div>
                        {u.notas && <div style={{ color: '#718096', fontSize: '0.78rem', marginTop: '4px' }}>{u.notas}</div>}
                        {u.verificado && <div style={{ color: '#276749', fontSize: '0.73rem', marginTop: '4px' }}>✓ Verificado</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}

        {/* Sugerencias misma marca */}
        {sugerenciasMarca.length > 0 && (
          <div style={{ padding: isMobile ? '1rem' : '1.5rem', borderTop: '1px solid #e2e8f0' }}>
            <ScrollCarousel
              titulo={`🏷️ Más productos de ${producto.marca}`}
              productos={sugerenciasMarca}
              verTodosUrl={`/?marca=${encodeURIComponent(producto.marca)}`}
              navigate={navigate}
            />
          </div>
        )}

        {/* Sugerencias misma categoría */}
        {sugerenciasCategoria.length > 0 && producto.categorias && producto.categorias.length > 0 && (
          <div style={{ padding: isMobile ? '1rem' : '1.5rem', borderTop: '1px solid #e2e8f0' }}>
            <ScrollCarousel
              titulo={`${producto.categorias[0].icono} Más productos de ${producto.categorias[0].nombre}`}
              productos={sugerenciasCategoria}
              verTodosUrl={`/?categoria_id=${producto.categorias[0].id}`}
              navigate={navigate}
            />
          </div>
        )}

        <AportacionesSection productoId={id} />
      </div>

      {/* Modal borrar producto */}
      {modalBorrar && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', maxWidth: '460px', width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#c53030', marginBottom: '0.5rem' }}>🗑️ Eliminar producto</h2>
            <p style={{ color: '#4a5568', fontSize: '0.9rem', marginBottom: '1rem' }}>
              Vas a eliminar <strong>{producto.nombre} — {producto.marca}</strong>. Esta acción no se puede deshacer.
            </p>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', color: '#2d3748', marginBottom: '6px' }}>
                Motivo de eliminación *
              </label>
              <textarea
                value={motivoBorrar}
                onChange={e => setMotivoBorrar(e.target.value)}
                placeholder="Ej: Producto descatalogado, información incorrecta..."
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.9rem', minHeight: '80px', resize: 'vertical', boxSizing: 'border-box', outline: 'none' }}
              />
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', marginBottom: '1.25rem', fontSize: '0.875rem', color: '#2d3748' }}>
              <input
                type="checkbox"
                checked={notificarEmail}
                onChange={e => setNotificarEmail(e.target.checked)}
                style={{ width: '16px', height: '16px', cursor: 'pointer' }}
              />
              ✉️ Enviar email de notificación a quien subió el producto
            </label>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={handleBorrarProducto} disabled={borrando}
                style={{ flex: 1, padding: '10px', background: '#c53030', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}>
                {borrando ? 'Eliminando...' : 'Sí, eliminar'}
              </button>
              <button onClick={() => { setModalBorrar(false); setMotivoBorrar(''); }}
                style={{ flex: 1, padding: '10px', background: '#edf2f7', color: '#4a5568', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductoDetallePage;