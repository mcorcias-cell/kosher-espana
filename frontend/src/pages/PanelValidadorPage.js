// src/pages/PanelValidadorPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { productosService, validacionesService, feedbackService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useIsMobile } from '../hooks/useMediaQuery';

const TIPOS = [
  { value: 'ingredientes_verificables', label: '🔍 Ingredientes verificables' },
  { value: 'certificacion_externa', label: '📜 Certificación organización externa' },
  { value: 'certificacion_completa', label: '⭐ Certificación completa de la comunidad' },
];

const S = {
  page: { maxWidth: '1100px', margin: '0 auto', padding: '2rem 1rem' },
  titulo: { fontSize: '1.75rem', fontWeight: 700, color: '#1a365d', marginBottom: '2rem' },
  tabs: { display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '2px solid #e2e8f0' },
  tab: (activa) => ({ padding: '10px 20px', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.95rem', color: activa ? '#2b6cb0' : '#718096', borderBottom: activa ? '2px solid #2b6cb0' : '2px solid transparent', marginBottom: '-2px' }),
  card: { background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '1rem', overflow: 'hidden' },
  cardHeader: { padding: '1rem 1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' },
  img: { width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', background: '#f7fafc', flexShrink: 0 },
  cardBody: { flex: 1 },
  nombre: { fontWeight: 700, color: '#1a365d', fontSize: '1.1rem' },
  meta: { color: '#718096', fontSize: '0.85rem', marginTop: '4px' },
  justificacion: { background: '#f7fafc', padding: '10px 12px', borderRadius: '6px', marginTop: '8px', fontSize: '0.85rem', color: '#4a5568' },
  cardFooter: { padding: '1rem 1.5rem', borderTop: '1px solid #f0f0f0', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' },
  select: { padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.9rem' },
  textarea: { padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.85rem', width: '250px' },
  btnAprobar: { padding: '8px 20px', background: '#276749', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' },
  btnRechazar: { padding: '8px 20px', background: '#c53030', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' },
  vacio: { textAlign: 'center', padding: '3rem', color: '#718096' },
  badge: { display: 'inline-block', padding: '2px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600 },
  infoIntermedia: { background: '#fffaf0', borderLeft: '3px solid #d69e2e', padding: '8px 12px', borderRadius: '0 6px 6px 0', marginTop: '8px', fontSize: '0.85rem' },
};

const PanelValidadorPage = () => {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [tabActiva, setTabActiva] = useState('pendientes');
  const [pendientes, setPendientes] = useState([]);
  const [revalidar, setRevalidar] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [validandoId, setValidandoId] = useState(null);
  const [decisiones, setDecisiones] = useState({});
  const [infoIntermedias, setInfoIntermedias] = useState({});
  const [fotosPendientes, setFotosPendientes] = useState([]);
  const [cargandoFotos, setCargandoFotos] = useState(false);

  const esValidador = ['validador', 'administrador'].includes(usuario?.rol);
  const esIntermedio = usuario?.rol === 'intermedio';

  useEffect(() => {
    const cargar = async () => {
      setCargando(true);
      try {
        const [pRes, rRes] = await Promise.all([
          productosService.pendientes(),
          esValidador ? validacionesService.paraRevalidar() : Promise.resolve({ data: [] }),
        ]);
        setPendientes(pRes.data);
        setRevalidar(rRes.data);
      } catch {
        toast.error('Error cargando datos');
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, [esValidador]);

  const getDecision = (id) => decisiones[id] || { tipo: 'certificacion_completa', notas: '' };
  const setDecision = (id, campo, valor) => setDecisiones(d => ({ ...d, [id]: { ...getDecision(id), [campo]: valor } }));

  const procesarValidacion = async (productoId, aprobar) => {
    if (aprobar && !getDecision(productoId).tipo) return toast.error('Selecciona un tipo de validación');
    setValidandoId(productoId);
    try {
      await validacionesService.validar(productoId, {
        tipo_validacion: getDecision(productoId).tipo,
        notas: getDecision(productoId).notas,
        aprobar,
      });
      toast.success(aprobar ? '✅ Producto validado y publicado' : '❌ Producto rechazado');
      setPendientes(p => p.filter(x => x.id !== productoId));
    } catch {
      toast.error('Error al procesar la validación');
    } finally {
      setValidandoId(null);
    }
  };

  const enviarInfoIntermedia = async (productoId) => {
    const info = infoIntermedias[productoId];
    if (!info?.trim()) return toast.error('Escribe información antes de enviar');
    try {
      await feedbackService.agregarInfo(productoId, { informacion: info });
      toast.success('Información añadida correctamente');
      setInfoIntermedias(i => ({ ...i, [productoId]: '' }));
    } catch {
      toast.error('Error al añadir información');
    }
  };

  const revalidarProducto = async (productoId) => {
    const dec = getDecision(productoId);
    setValidandoId(productoId);
    try {
      await validacionesService.revalidar(productoId, { tipo_validacion: dec.tipo, notas: dec.notas });
      toast.success('✅ Producto revalidado');
      setRevalidar(r => r.filter(x => x.id !== productoId));
    } catch {
      toast.error('Error al revalidar');
    } finally {
      setValidandoId(null);
    }
  };

  const cargarFotos = async () => {
    setCargandoFotos(true);
    try {
      const res = await feedbackService.fotosPendientes();
      setFotosPendientes(res.data);
    } catch {
      toast.error('Error cargando fotos');
    } finally {
      setCargandoFotos(false);
    }
  };

  useEffect(() => {
    if (tabActiva === 'fotos') cargarFotos();
  }, [tabActiva]);

  const handleAprobarFoto = async (id) => {
    try {
      await feedbackService.aprobarFoto(id);
      toast.success('✅ Foto aprobada');
      setFotosPendientes(f => f.filter(x => x.id !== id));
    } catch { toast.error('Error'); }
  };

  const handleRechazarFoto = async (id) => {
    try {
      await feedbackService.rechazarFoto(id);
      toast.success('Foto rechazada');
      setFotosPendientes(f => f.filter(x => x.id !== id));
    } catch { toast.error('Error'); }
  };

  const lista = tabActiva === 'pendientes' ? pendientes : revalidar;

  return (
    <div style={S.page}>
      <h1 style={S.titulo}>
        {esIntermedio ? '📋 Panel de información intermedia' : '🔍 Panel de validador'}
      </h1>

      <div style={S.tabs}>
        <button style={S.tab(tabActiva === 'pendientes')} onClick={() => setTabActiva('pendientes')}>
          Pendientes ({pendientes.length})
        </button>
        {esValidador && (
          <button style={S.tab(tabActiva === 'revalidar')} onClick={() => setTabActiva('revalidar')}>
            Para revalidar ({revalidar.length})
          </button>
        )}
        {esValidador && (
          <button style={S.tab(tabActiva === 'fotos')} onClick={() => setTabActiva('fotos')}>
            📷 Fotos pendientes{fotosPendientes.length > 0 ? ` (${fotosPendientes.length})` : ''}
          </button>
        )}
      </div>

      {cargando && <div style={S.vacio}>Cargando...</div>}

      {!cargando && lista.length === 0 && (
        <div style={S.vacio}>
          <div style={{ fontSize: '3rem' }}>✅</div>
          <p>{tabActiva === 'pendientes' ? 'No hay productos pendientes' : 'No hay productos para revalidar'}</p>
        </div>
      )}

      {!cargando && lista.map(p => (
        <div key={p.id} style={S.card}>
          <div style={S.cardHeader}>
            <div style={{ ...S.img, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {p.imagen_url ? <img src={p.imagen_url} alt="" style={S.img} /> : <span style={{ fontSize: '2rem' }}>📦</span>}
            </div>
            <div style={S.cardBody}>
              <div style={S.nombre}>{p.nombre} — {p.marca}</div>
              <div style={S.meta}>
                {p.gramaje && `${p.gramaje} · `}
                {p.sabor_variante && `${p.sabor_variante} · `}
                {p.fabricante && p.fabricante}
              </div>
              <div style={S.meta}>Subido por: {p.subido_por_nombre} · {new Date(p.created_at).toLocaleDateString('es-ES')}</div>
              {p.codigo_barras && <div style={S.meta}>Código de barras: {p.codigo_barras}</div>}

              <div style={S.justificacion}>
                <strong>Justificación del usuario:</strong> {p.justificacion}
              </div>

              {p.info_intermedia && p.info_intermedia.length > 0 && (
                <div style={S.infoIntermedia}>
                  <strong>Información adicional:</strong>
                  {p.info_intermedia.map((ii, i) => (
                    <div key={i} style={{ marginTop: '4px' }}>• {ii.informacion} <span style={{ color: '#a0aec0' }}>({ii.usuario})</span></div>
                  ))}
                </div>
              )}

              {tabActiva === 'revalidar' && p.dias_restantes !== undefined && (
                <div style={{ marginTop: '8px' }}>
                  <span style={{ ...S.badge, background: p.dias_restantes < 0 ? '#fed7d7' : '#fefcbf', color: p.dias_restantes < 0 ? '#c53030' : '#d69e2e' }}>
                    {p.dias_restantes < 0 ? `Expirado hace ${Math.abs(p.dias_restantes)} días` : `Expira en ${p.dias_restantes} días`}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Panel de acción para intermedios */}
          {esIntermedio && (
            <div style={S.cardFooter}>
              <textarea
                style={{ ...S.textarea, width: '100%', maxWidth: '400px' }}
                placeholder="Añadir información relevante para los validadores..."
                value={infoIntermedias[p.id] || ''}
                onChange={e => setInfoIntermedias(i => ({ ...i, [p.id]: e.target.value }))}
              />
              <button style={S.btnAprobar} onClick={() => enviarInfoIntermedia(p.id)}>Enviar información</button>
            </div>
          )}

          {/* Panel de validación */}
          {esValidador && (
            <div style={S.cardFooter}>
              <select style={S.select} value={getDecision(p.id).tipo} onChange={e => setDecision(p.id, 'tipo', e.target.value)}>
                {TIPOS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
              <input
                style={S.textarea}
                placeholder="Notas del validador (opcional)"
                value={getDecision(p.id).notas}
                onChange={e => setDecision(p.id, 'notas', e.target.value)}
              />
              {tabActiva === 'pendientes' ? (
                <>
                  <button style={S.btnAprobar} disabled={validandoId === p.id} onClick={() => procesarValidacion(p.id, true)}>
                    {validandoId === p.id ? '...' : '✅ Validar'}
                  </button>
                  <button style={S.btnRechazar} disabled={validandoId === p.id} onClick={() => procesarValidacion(p.id, false)}>
                    ❌ Rechazar
                  </button>
                </>
              ) : (
                <button style={S.btnAprobar} disabled={validandoId === p.id} onClick={() => revalidarProducto(p.id)}>
                  {validandoId === p.id ? '...' : '🔄 Revalidar'}
                </button>
              )}
            </div>
          )}
        </div>
      ))}

      {/* TAB: Fotos pendientes */}
      {tabActiva === 'fotos' && (
        <div>
          {cargandoFotos ? (
            <div style={S.vacio}>Cargando fotos...</div>
          ) : fotosPendientes.length === 0 ? (
            <div style={S.vacio}>
              <div style={{ fontSize: '3rem' }}>✅</div>
              <p>No hay fotos pendientes de revisión</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
              {fotosPendientes.map(f => (
                <div key={f.id} style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                  <img src={f.foto_url} alt="Foto pendiente" style={{ width: '100%', height: '190px', objectFit: 'cover' }} />
                  <div style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '4px' }}>
                      {f.producto_nombre} <span style={{ color: '#718096', fontWeight: 400 }}>· {f.producto_marca}</span>
                    </div>
                    <div style={{ fontSize: '0.83rem', color: '#4a5568', marginBottom: '4px' }}>🏪 {f.supermercado} · 📍 {f.localidad}</div>
                    <div style={{ fontSize: '0.76rem', color: '#a0aec0', marginBottom: '1rem' }}>
                      Subida por {f.usuario_nombre} · {new Date(f.created_at).toLocaleDateString('es-ES')}
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => handleAprobarFoto(f.id)} style={{ flex: 1, padding: '8px', background: '#276749', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem' }}>
                        ✅ Aprobar
                      </button>
                      <button onClick={() => handleRechazarFoto(f.id)} style={{ flex: 1, padding: '8px', background: '#c53030', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem' }}>
                        ❌ Rechazar
                      </button>
                      <button onClick={() => navigate(`/producto/${f.producto_id}`)} style={{ padding: '8px 10px', background: '#ebf8ff', color: '#2b6cb0', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.875rem' }}>
                        👁️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PanelValidadorPage;