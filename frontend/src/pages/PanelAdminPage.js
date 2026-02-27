// src/pages/PanelAdminPage.js
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { usuariosService, feedbackService } from '../services/api';
import { useIsMobile } from '../hooks/useMediaQuery';

const ROLES = ['regular', 'intermedio', 'validador', 'administrador'];
const ROLES_COLORS = { regular: '#e2e8f0', intermedio: '#fefcbf', validador: '#bee3f8', administrador: '#fed7d7' };
const ROLES_TEXT = { regular: '#4a5568', intermedio: '#d69e2e', validador: '#2b6cb0', administrador: '#c53030' };

const PanelAdminPage = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [tab, setTab] = useState('usuarios');
  const [usuarios, setUsuarios] = useState([]);
  const [stats, setStats] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [filtroRol, setFiltroRol] = useState('');
  const [fotosPendientes, setFotosPendientes] = useState([]);
  const [solicitudesRetirada, setSolicitudesRetirada] = useState([]);
  const [cargandoFotos, setCargandoFotos] = useState(false);
  const [cargandoSolicitudes, setCargandoSolicitudes] = useState(false);

  const cargarUsuarios = async () => {
    setCargando(true);
    try {
      const [usRes, stRes] = await Promise.all([
        usuariosService.listar({ rol: filtroRol || undefined }),
        usuariosService.estadisticas(),
      ]);
      setUsuarios(usRes.data.usuarios);
      setStats(stRes.data);
    } catch {
      toast.error('Error cargando datos');
    } finally {
      setCargando(false);
    }
  };

  const cargarFotosPendientes = async () => {
    setCargandoFotos(true);
    try {
      const res = await feedbackService.fotosPendientes();
      setFotosPendientes(res.data);
    } catch {
      toast.error('Error cargando fotos pendientes');
    } finally {
      setCargandoFotos(false);
    }
  };

  const cargarSolicitudesRetirada = async () => {
    setCargandoSolicitudes(true);
    try {
      const res = await feedbackService.solicitudesRetirada();
      setSolicitudesRetirada(res.data);
    } catch {
      toast.error('Error cargando solicitudes');
    } finally {
      setCargandoSolicitudes(false);
    }
  };

  useEffect(() => { cargarUsuarios(); }, [filtroRol]);

  useEffect(() => {
    if (tab === 'fotos') cargarFotosPendientes();
    if (tab === 'retiradas') cargarSolicitudesRetirada();
  }, [tab]);

  const cambiarRol = async (id, nuevoRol) => {
    try {
      await usuariosService.actualizar(id, { rol: nuevoRol });
      toast.success('Rol actualizado');
      setUsuarios(u => u.map(x => x.id === id ? { ...x, rol: nuevoRol } : x));
    } catch { toast.error('Error al cambiar rol'); }
  };

  const toggleActivo = async (usuario) => {
    try {
      await usuariosService.actualizar(usuario.id, { activo: !usuario.activo });
      toast.success(usuario.activo ? 'Usuario desactivado' : 'Usuario activado');
      setUsuarios(u => u.map(x => x.id === usuario.id ? { ...x, activo: !x.activo } : x));
    } catch { toast.error('Error al cambiar estado'); }
  };

  const setComunidad = async (id, comunidad) => {
    try {
      await usuariosService.actualizar(id, { comunidad });
      toast.success('Comunidad actualizada');
    } catch { toast.error('Error al actualizar comunidad'); }
  };

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

  const handleBorrarAportacion = async (id) => {
    if (!window.confirm('¿Borrar esta aportación definitivamente?')) return;
    try {
      await feedbackService.borrar(id);
      toast.success('Aportación eliminada');
      setSolicitudesRetirada(s => s.filter(x => x.id !== id));
    } catch { toast.error('Error'); }
  };

  const handleDesestimar = async (id) => {
    try {
      await feedbackService.desestrimarRetirada(id);
      toast.success('Solicitud desestimada');
      setSolicitudesRetirada(s => s.filter(x => x.id !== id));
    } catch { toast.error('Error'); }
  };

  const productosPorEstado = (estado) => stats?.productos?.find(p => p.estado === estado)?.total || 0;
  const usuariosPorRol = (rol) => stats?.usuarios?.find(u => u.rol === rol)?.total || 0;

  const tabStyle = (activa) => ({
    padding: isMobile ? '8px 12px' : '10px 20px',
    border: 'none',
    borderBottom: activa ? '3px solid #2b6cb0' : '3px solid transparent',
    background: 'none',
    cursor: 'pointer',
    fontWeight: activa ? 700 : 400,
    color: activa ? '#2b6cb0' : '#718096',
    fontSize: isMobile ? '0.8rem' : '0.9rem',
    whiteSpace: 'nowrap',
  });

  const select = { padding: '6px 10px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '0.85rem' };
  const th = { background: '#f7fafc', padding: '10px 14px', textAlign: 'left', fontWeight: 600, color: '#4a5568', fontSize: '0.82rem', borderBottom: '1px solid #e2e8f0' };
  const td = { padding: '10px 14px', borderBottom: '1px solid #f0f0f0', fontSize: '0.875rem', color: '#2d3748' };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: isMobile ? '1rem' : '2rem 1rem' }}>
      <h1 style={{ fontSize: isMobile ? '1.3rem' : '1.75rem', fontWeight: 700, color: '#1a365d', marginBottom: '1.5rem' }}>⚙️ Panel de administración</h1>

      {/* Stats */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
          {[
            { color: '#e6fffa', num: productosPorEstado('validado'), label: 'Productos validados' },
            { color: '#fefcbf', num: productosPorEstado('pendiente'), label: 'Pendientes' },
            { color: '#fed7d7', num: productosPorEstado('rechazado'), label: 'Rechazados' },
            { color: '#ebf8ff', num: usuariosPorRol('validador'), label: 'Validadores' },
            { color: '#f0fff4', num: stats.validaciones_ultimo_mes, label: 'Validaciones este mes' },
          ].map((s, i) => (
            <div key={i} style={{ background: s.color, borderRadius: '10px', padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{s.num}</div>
              <div style={{ fontSize: '0.78rem', marginTop: '4px', opacity: 0.8 }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div style={{ borderBottom: '1px solid #e2e8f0', marginBottom: '1.5rem', display: 'flex', overflowX: 'auto' }}>
        <button style={tabStyle(tab === 'usuarios')} onClick={() => setTab('usuarios')}>👥 Usuarios</button>
        <button style={tabStyle(tab === 'fotos')} onClick={() => setTab('fotos')}>
          📷 Fotos pendientes {fotosPendientes.length > 0 && <span style={{ background: '#e53e3e', color: 'white', borderRadius: '10px', padding: '1px 6px', fontSize: '0.72rem', marginLeft: '4px' }}>{fotosPendientes.length}</span>}
        </button>
        <button style={tabStyle(tab === 'retiradas')} onClick={() => setTab('retiradas')}>
          🚩 Solicitudes de retirada {solicitudesRetirada.length > 0 && <span style={{ background: '#e53e3e', color: 'white', borderRadius: '10px', padding: '1px 6px', fontSize: '0.72rem', marginLeft: '4px' }}>{solicitudesRetirada.length}</span>}
        </button>
      </div>

      {/* TAB: Usuarios */}
      {tab === 'usuarios' && (
        <>
          <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <strong style={{ color: '#2d3748', fontSize: '0.9rem' }}>Filtrar por rol:</strong>
            <select style={select} value={filtroRol} onChange={e => setFiltroRol(e.target.value)}>
              <option value="">Todos</option>
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
            {isMobile ? (
              // Mobile: cards
              <div style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {cargando ? <p style={{ textAlign: 'center', color: '#718096', padding: '2rem' }}>Cargando...</p> :
                  usuarios.map(u => (
                    <div key={u.id} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.875rem' }}>
                      <div style={{ fontWeight: 600, marginBottom: '4px' }}>{u.nombre} {u.apellido}</div>
                      <div style={{ fontSize: '0.8rem', color: '#718096', marginBottom: '8px' }}>{u.email}</div>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                        <select style={select} value={u.rol} onChange={e => cambiarRol(u.id, e.target.value)}>
                          {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                        <button style={{ padding: '5px 12px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, background: u.activo ? '#c6f6d5' : '#fed7d7', color: u.activo ? '#276749' : '#c53030' }} onClick={() => toggleActivo(u)}>
                          {u.activo ? 'Activo' : 'Inactivo'}
                        </button>
                      </div>
                    </div>
                  ))
                }
              </div>
            ) : (
              // Desktop: table
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>{['Usuario', 'Email', 'Rol', 'Comunidad', 'Estado', ''].map(h => <th key={h} style={th}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {cargando ? (
                    <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: '#718096' }}>Cargando...</td></tr>
                  ) : usuarios.map(u => (
                    <tr key={u.id}>
                      <td style={td}>{u.nombre} {u.apellido}</td>
                      <td style={td}>{u.email}</td>
                      <td style={td}>
                        <select style={select} value={u.rol} onChange={e => cambiarRol(u.id, e.target.value)}>
                          {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                      </td>
                      <td style={td}>
                        {u.rol === 'validador' ? (
                          <input defaultValue={u.comunidad || ''} placeholder="Madrid..." style={{ ...select, border: '1px solid #e2e8f0' }} onBlur={e => setComunidad(u.id, e.target.value)} />
                        ) : <span style={{ color: '#a0aec0' }}>—</span>}
                      </td>
                      <td style={td}>
                        <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, background: ROLES_COLORS[u.rol], color: ROLES_TEXT[u.rol] }}>{u.rol}</span>
                      </td>
                      <td style={td}>
                        <button style={{ padding: '5px 12px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, background: u.activo ? '#c6f6d5' : '#fed7d7', color: u.activo ? '#276749' : '#c53030' }} onClick={() => toggleActivo(u)}>
                          {u.activo ? 'Activo' : 'Inactivo'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}

      {/* TAB: Fotos pendientes */}
      {tab === 'fotos' && (
        <div>
          {cargandoFotos ? (
            <p style={{ textAlign: 'center', color: '#718096', padding: '2rem' }}>Cargando...</p>
          ) : fotosPendientes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#a0aec0' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>✅</div>
              <p>No hay fotos pendientes de revisión</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
              {fotosPendientes.map(f => (
                <div key={f.id} style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                  <img src={f.foto_url} alt="Foto pendiente" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                  <div style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '4px' }}>{f.producto_nombre} <span style={{ color: '#718096', fontWeight: 400 }}>· {f.producto_marca}</span></div>
                    <div style={{ fontSize: '0.85rem', color: '#4a5568', marginBottom: '4px' }}>🏪 {f.supermercado} · 📍 {f.localidad}</div>
                    <div style={{ fontSize: '0.78rem', color: '#a0aec0', marginBottom: '1rem' }}>Subida por {f.usuario_nombre} · {new Date(f.created_at).toLocaleDateString('es-ES')}</div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => handleAprobarFoto(f.id)} style={{ flex: 1, padding: '8px', background: '#38a169', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem' }}>
                        ✅ Aprobar
                      </button>
                      <button onClick={() => handleRechazarFoto(f.id)} style={{ flex: 1, padding: '8px', background: '#e53e3e', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem' }}>
                        ❌ Rechazar
                      </button>
                      <button onClick={() => navigate(`/producto/${f.producto_id}`)} style={{ padding: '8px 12px', background: '#ebf8ff', color: '#2b6cb0', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.875rem' }}>
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

      {/* TAB: Solicitudes de retirada */}
      {tab === 'retiradas' && (
        <div>
          {cargandoSolicitudes ? (
            <p style={{ textAlign: 'center', color: '#718096', padding: '2rem' }}>Cargando...</p>
          ) : solicitudesRetirada.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#a0aec0' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>✅</div>
              <p>No hay solicitudes de retirada pendientes</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {solicitudesRetirada.map(s => (
                <div key={s.id} style={{ background: 'white', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderLeft: '4px solid #e53e3e' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                    <div>
                      <span style={{ fontWeight: 700 }}>{s.producto_nombre}</span>
                      <span style={{ color: '#718096', fontSize: '0.85rem' }}> · {s.producto_marca}</span>
                    </div>
                    <button onClick={() => navigate(`/producto/${s.producto_id}`)} style={{ padding: '4px 12px', background: '#ebf8ff', color: '#2b6cb0', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}>
                      Ver producto
                    </button>
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#4a5568', marginBottom: '4px' }}>🏪 {s.supermercado} · 📍 {s.localidad}{s.precio ? ` · 💶 ${parseFloat(s.precio).toFixed(2)} €` : ''}</div>
                  {s.observaciones && <p style={{ fontSize: '0.875rem', color: '#4a5568', margin: '6px 0' }}>"{s.observaciones}"</p>}
                  <div style={{ fontSize: '0.78rem', color: '#a0aec0', marginBottom: '1rem' }}>Aportado por {s.usuario_nombre} · {new Date(s.created_at).toLocaleDateString('es-ES')}</div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button onClick={() => handleBorrarAportacion(s.id)} style={{ padding: '8px 16px', background: '#e53e3e', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem' }}>
                      🗑️ Borrar aportación
                    </button>
                    <button onClick={() => handleDesestimar(s.id)} style={{ padding: '8px 16px', background: '#edf2f7', color: '#4a5568', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.875rem' }}>
                      Desestimar solicitud
                    </button>
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

export default PanelAdminPage;