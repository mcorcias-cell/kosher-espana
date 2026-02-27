// src/components/feedback/AportacionesSection.js
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { feedbackService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useIsMobile } from '../../hooks/useMediaQuery';

const AportacionesSection = ({ productoId }) => {
  const { usuario } = useAuth();
  const isMobile = useIsMobile();
  const [aportaciones, setAportaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [respondiendo, setRespondiendo] = useState(null); // id del feedback que se está respondiendo
  const [textoRespuesta, setTextoRespuesta] = useState('');
  const [form, setForm] = useState({ supermercado: '', localidad: '', precio: '', observaciones: '', foto: null });
  const [fotoPreview, setFotoPreview] = useState(null);

  const esValidadorOAdmin = usuario && ['validador', 'administrador', 'intermedio'].includes(usuario.rol);
  const esAdmin = usuario?.rol === 'administrador';

  const cargar = async () => {
    try {
      const res = await feedbackService.listar(productoId);
      setAportaciones(res.data);
    } catch {
      // silencioso
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { cargar(); }, [productoId]);

  const handleFoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm(f => ({ ...f, foto: file }));
      setFotoPreview(URL.createObjectURL(file));
    }
  };

  const handleEnviar = async (e) => {
    e.preventDefault();
    if (!form.supermercado || !form.localidad) return toast.error('Supermercado y localidad son obligatorios');
    setEnviando(true);
    try {
      const fd = new FormData();
      fd.append('supermercado', form.supermercado);
      fd.append('localidad', form.localidad);
      if (form.precio) fd.append('precio', form.precio);
      if (form.observaciones) fd.append('observaciones', form.observaciones);
      if (form.foto) fd.append('foto', form.foto);
      await feedbackService.agregar(productoId, fd);
      toast.success('¡Aportación añadida!');
      setForm({ supermercado: '', localidad: '', precio: '', observaciones: '', foto: null });
      setFotoPreview(null);
      setMostrarForm(false);
      cargar();
    } catch {
      toast.error('Error al enviar la aportación');
    } finally {
      setEnviando(false);
    }
  };

  const handleBorrar = async (id) => {
    if (!window.confirm('¿Eliminar esta aportación?')) return;
    try {
      await feedbackService.borrar(id);
      toast.success('Aportación eliminada');
      cargar();
    } catch {
      toast.error('No se pudo eliminar');
    }
  };

  const handleResponder = async (feedbackId) => {
    if (!textoRespuesta.trim()) return toast.error('Escribe una respuesta');
    try {
      await feedbackService.responder(feedbackId, textoRespuesta);
      toast.success('Respuesta añadida');
      setRespondiendo(null);
      setTextoRespuesta('');
      cargar();
    } catch {
      toast.error('Error al responder');
    }
  };

  const handleSolicitarRetirada = async (id) => {
    try {
      await feedbackService.solicitarRetirada(id);
      toast.success('Solicitud de retirada enviada al administrador');
      cargar();
    } catch {
      toast.error('Error al enviar solicitud');
    }
  };

  const handleDesestimar = async (id) => {
    try {
      await feedbackService.desestrimarRetirada(id);
      toast.success('Solicitud desestimada');
      cargar();
    } catch {
      toast.error('Error');
    }
  };

  const handleAprobarFoto = async (id) => {
    try {
      await feedbackService.aprobarFoto(id);
      toast.success('Foto aprobada');
      cargar();
    } catch {
      toast.error('Error');
    }
  };

  const handleRechazarFoto = async (id) => {
    try {
      await feedbackService.rechazarFoto(id);
      toast.success('Foto rechazada');
      cargar();
    } catch {
      toast.error('Error');
    }
  };

  const inputStyle = { width: '100%', padding: '9px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.9rem', boxSizing: 'border-box', outline: 'none' };

  return (
    <div style={{ padding: isMobile ? '1rem' : '1.5rem', borderTop: '1px solid #e2e8f0' }}>
      {/* Cabecera */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '8px' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#2d3748', margin: 0 }}>
          🛒 Dónde encontrarlo ({aportaciones.length})
        </h2>
        {usuario && !mostrarForm && (
          <button
            onClick={() => setMostrarForm(true)}
            style={{ padding: '7px 16px', background: '#2b6cb0', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
            + Añadir aportación
          </button>
        )}
      </div>

      {/* Formulario nueva aportación */}
      {mostrarForm && usuario && (
        <div style={{ background: '#f7fafc', borderRadius: '10px', padding: '1rem', marginBottom: '1rem', border: '1px solid #e2e8f0' }}>
          <form onSubmit={handleEnviar}>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <input style={inputStyle} placeholder="Supermercado *" value={form.supermercado} onChange={e => setForm(f => ({ ...f, supermercado: e.target.value }))} />
              <input style={inputStyle} placeholder="Localidad / ciudad *" value={form.localidad} onChange={e => setForm(f => ({ ...f, localidad: e.target.value }))} />
            </div>
            <div style={{ marginBottom: '0.5rem' }}>
              <input style={inputStyle} placeholder="Precio (ej: 2.99)" type="number" step="0.01" min="0" value={form.precio} onChange={e => setForm(f => ({ ...f, precio: e.target.value }))} />
            </div>

            {/* Foto del lineal */}
            <div style={{ marginBottom: '0.5rem' }}>
              {fotoPreview ? (
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <img src={fotoPreview} alt="preview" style={{ width: '100%', maxWidth: '280px', height: '160px', objectFit: 'cover', borderRadius: '8px', display: 'block' }} />
                  <button type="button" onClick={() => { setFotoPreview(null); setForm(f => ({ ...f, foto: null })); }}
                    style={{ position: 'absolute', top: '6px', right: '6px', background: 'rgba(0,0,0,0.6)', border: 'none', color: 'white', borderRadius: '50%', width: '26px', height: '26px', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    ✕
                  </button>
                </div>
              ) : (
                <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '1.25rem', border: '2px dashed #cbd5e0', borderRadius: '8px', cursor: 'pointer', color: '#718096', background: 'white', textAlign: 'center' }}>
                  <span style={{ fontSize: '1.75rem' }}>📷</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Foto del lineal (opcional)</span>
                  <span style={{ fontSize: '0.75rem' }}>Haz clic para seleccionar · JPG, PNG · máx 5MB</span>
                  <input type="file" accept="image/*" onChange={handleFoto} style={{ display: 'none' }} />
                </label>
              )}
            </div>
            <textarea
              style={{ ...inputStyle, minHeight: '70px', resize: 'vertical', marginBottom: '0.5rem' }}
              placeholder="Observaciones (opcional) — ej: solo en la sección bio, precio de oferta..."
              value={form.observaciones}
              onChange={e => setForm(f => ({ ...f, observaciones: e.target.value }))}
            />
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="submit" disabled={enviando} style={{ padding: '8px 18px', background: '#2b6cb0', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem' }}>
                {enviando ? 'Enviando...' : 'Publicar aportación'}
              </button>
              <button type="button" onClick={() => { setMostrarForm(false); setFotoPreview(null); }} style={{ padding: '8px 14px', background: '#edf2f7', color: '#4a5568', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.875rem' }}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de aportaciones */}
      {cargando ? (
        <p style={{ color: '#718096', fontSize: '0.9rem' }}>Cargando aportaciones...</p>
      ) : aportaciones.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#a0aec0' }}>
          <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🛒</div>
          <p style={{ fontSize: '0.9rem' }}>Todavía nadie ha reportado dónde encontrar este producto.</p>
          {usuario && <p style={{ fontSize: '0.85rem' }}>¡Sé el primero en aportarlo!</p>}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {aportaciones.map(a => (
            <div key={a.id} style={{ border: `1px solid ${a.solicitud_retirada ? '#fed7d7' : '#e2e8f0'}`, borderRadius: '10px', overflow: 'hidden', background: a.solicitud_retirada ? '#fff5f5' : 'white' }}>
              {/* Badge solicitud de retirada */}
              {a.solicitud_retirada && (
                <div style={{ background: '#fed7d7', padding: '6px 14px', fontSize: '0.8rem', color: '#c53030', fontWeight: 600, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                  ⚠️ Comentario en revisión
                  {esAdmin && (
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={() => handleBorrar(a.id)} style={{ padding: '3px 10px', background: '#c53030', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem' }}>Borrar</button>
                      <button onClick={() => handleDesestimar(a.id)} style={{ padding: '3px 10px', background: '#718096', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem' }}>Desestimar</button>
                    </div>
                  )}
                </div>
              )}

              <div style={{ padding: '12px 14px' }}>
                {/* Cabecera de la tarjeta */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '4px', marginBottom: '6px' }}>
                  <div>
                    <span style={{ fontWeight: 700, color: '#276749', fontSize: '0.95rem' }}>🏪 {a.supermercado}</span>
                    <span style={{ color: '#718096', fontSize: '0.85rem', marginLeft: '8px' }}>📍 {a.localidad}</span>
                    {a.precio && <span style={{ color: '#276749', fontWeight: 700, fontSize: '0.9rem', marginLeft: '10px' }}>💶 {parseFloat(a.precio).toFixed(2)} €</span>}
                  </div>
                  <span style={{ color: '#a0aec0', fontSize: '0.75rem' }}>{new Date(a.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                </div>

                {/* Observaciones */}
                {a.observaciones && <p style={{ margin: '0 0 8px', color: '#4a5568', fontSize: '0.875rem' }}>{a.observaciones}</p>}

                {/* Foto */}
                {a.foto_url && a.foto_aprobada && (
                  <img src={a.foto_url} alt="Foto del lineal" style={{ width: '100%', maxWidth: '300px', borderRadius: '8px', marginBottom: '8px', objectFit: 'cover', maxHeight: '180px' }} />
                )}
                {a.foto_url && !a.foto_aprobada && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.78rem', background: '#fefcbf', color: '#b7791f', padding: '3px 10px', borderRadius: '20px', border: '1px solid #f6e05e' }}>📷 Foto pendiente de verificación</span>
                    {esValidadorOAdmin && (
                      <>
                        <button onClick={() => handleAprobarFoto(a.id)} style={{ padding: '3px 10px', background: '#38a169', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem' }}>✅ Aprobar foto</button>
                        <button onClick={() => handleRechazarFoto(a.id)} style={{ padding: '3px 10px', background: '#e53e3e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem' }}>❌ Rechazar foto</button>
                      </>
                    )}
                  </div>
                )}

                {/* Autor + acciones */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                  <span style={{ fontSize: '0.78rem', color: '#718096', fontWeight: 500 }}>✍️ {a.usuario_nombre}</span>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {esValidadorOAdmin && !a.solicitud_retirada && (
                      <button onClick={() => setRespondiendo(respondiendo === a.id ? null : a.id)} style={{ padding: '3px 10px', background: '#ebf8ff', color: '#2b6cb0', border: '1px solid #bee3f8', borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}>
                        💬 Responder
                      </button>
                    )}
                    {esValidadorOAdmin && !a.solicitud_retirada && !esAdmin && (
                      <button onClick={() => handleSolicitarRetirada(a.id)} style={{ padding: '3px 10px', background: '#fff5f5', color: '#c53030', border: '1px solid #fed7d7', borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem' }}>
                        🚩 Solicitar retirada
                      </button>
                    )}
                    {(usuario?.id === a.usuario_id || esAdmin) && (
                      <button onClick={() => handleBorrar(a.id)} style={{ padding: '3px 10px', background: '#fff5f5', color: '#c53030', border: '1px solid #fed7d7', borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem' }}>
                        🗑️ Borrar
                      </button>
                    )}
                  </div>
                </div>

                {/* Formulario de respuesta */}
                {respondiendo === a.id && (
                  <div style={{ marginTop: '10px', padding: '10px', background: '#f7fafc', borderRadius: '8px' }}>
                    <textarea
                      style={{ width: '100%', padding: '8px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '0.875rem', resize: 'vertical', minHeight: '60px', boxSizing: 'border-box', outline: 'none' }}
                      placeholder="Escribe la respuesta del equipo..."
                      value={textoRespuesta}
                      onChange={e => setTextoRespuesta(e.target.value)}
                    />
                    <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                      <button onClick={() => handleResponder(a.id)} style={{ padding: '6px 14px', background: '#2b6cb0', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600 }}>Publicar respuesta</button>
                      <button onClick={() => { setRespondiendo(null); setTextoRespuesta(''); }} style={{ padding: '6px 12px', background: '#edf2f7', color: '#4a5568', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.82rem' }}>Cancelar</button>
                    </div>
                  </div>
                )}

                {/* Respuestas del equipo */}
                {a.respuestas && a.respuestas.length > 0 && (
                  <div style={{ marginTop: '10px', borderLeft: '3px solid #2b6cb0', paddingLeft: '12px' }}>
                    {a.respuestas.map((r, i) => (
                      <div key={i} style={{ marginBottom: i < a.respuestas.length - 1 ? '8px' : 0 }}>
                        <div style={{ fontSize: '0.78rem', color: '#2b6cb0', fontWeight: 700, marginBottom: '2px' }}>💬 Respuesta del equipo {r.respondido_por_nombre ? `· ${r.respondido_por_nombre}` : ''}</div>
                        <p style={{ margin: 0, color: '#2d3748', fontSize: '0.875rem' }}>{r.respuesta}</p>
                        <span style={{ fontSize: '0.72rem', color: '#a0aec0' }}>{new Date(r.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {!usuario && (
        <p style={{ textAlign: 'center', color: '#a0aec0', fontSize: '0.85rem', marginTop: '1rem' }}>
          <a href="/login" style={{ color: '#2b6cb0' }}>Inicia sesión</a> para añadir una aportación
        </p>
      )}
    </div>
  );
};

export default AportacionesSection;