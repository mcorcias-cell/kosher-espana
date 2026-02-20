// src/pages/PanelAdminPage.js
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { usuariosService } from '../services/api';

const ROLES = ['regular', 'intermedio', 'validador', 'administrador'];
const ROLES_COLORS = { regular: '#e2e8f0', intermedio: '#fefcbf', validador: '#bee3f8', administrador: '#fed7d7' };
const ROLES_TEXT = { regular: '#4a5568', intermedio: '#d69e2e', validador: '#2b6cb0', administrador: '#c53030' };

const S = {
  page: { maxWidth: '1100px', margin: '0 auto', padding: '2rem 1rem' },
  titulo: { fontSize: '1.75rem', fontWeight: 700, color: '#1a365d', marginBottom: '2rem' },
  stats: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' },
  statCard: (color) => ({ background: color, borderRadius: '12px', padding: '1.25rem', textAlign: 'center' }),
  statNum: { fontSize: '2rem', fontWeight: 700 },
  statLabel: { fontSize: '0.85rem', marginTop: '4px', opacity: 0.8 },
  tabla: { background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' },
  th: { background: '#f7fafc', padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#4a5568', fontSize: '0.85rem', borderBottom: '1px solid #e2e8f0' },
  td: { padding: '12px 16px', borderBottom: '1px solid #f0f0f0', fontSize: '0.9rem', color: '#2d3748' },
  badge: (rol) => ({ display: 'inline-block', padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, background: ROLES_COLORS[rol], color: ROLES_TEXT[rol] }),
  select: { padding: '6px 10px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '0.85rem' },
  btnToggle: (activo) => ({ padding: '5px 12px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, background: activo ? '#c6f6d5' : '#fed7d7', color: activo ? '#276749' : '#c53030' }),
};

const PanelAdminPage = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [stats, setStats] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [filtroRol, setFiltroRol] = useState('');

  const cargar = async () => {
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

  useEffect(() => { cargar(); }, [filtroRol]);

  const cambiarRol = async (id, nuevoRol) => {
    try {
      await usuariosService.actualizar(id, { rol: nuevoRol });
      toast.success('Rol actualizado');
      setUsuarios(u => u.map(x => x.id === id ? { ...x, rol: nuevoRol } : x));
    } catch {
      toast.error('Error al cambiar rol');
    }
  };

  const toggleActivo = async (usuario) => {
    try {
      await usuariosService.actualizar(usuario.id, { activo: !usuario.activo });
      toast.success(usuario.activo ? 'Usuario desactivado' : 'Usuario activado');
      setUsuarios(u => u.map(x => x.id === usuario.id ? { ...x, activo: !x.activo } : x));
    } catch {
      toast.error('Error al cambiar estado');
    }
  };

  const setComunidad = async (id, comunidad) => {
    try {
      await usuariosService.actualizar(id, { comunidad });
      toast.success('Comunidad actualizada');
    } catch {
      toast.error('Error al actualizar comunidad');
    }
  };

  const productosPorEstado = (estado) => stats?.productos?.find(p => p.estado === estado)?.total || 0;
  const usuariosPorRol = (rol) => stats?.usuarios?.find(u => u.rol === rol)?.total || 0;

  return (
    <div style={S.page}>
      <h1 style={S.titulo}>⚙️ Panel de administración</h1>

      {stats && (
        <div style={S.stats}>
          <div style={S.statCard('#e6fffa')}>
            <div style={S.statNum}>{productosPorEstado('validado')}</div>
            <div style={S.statLabel}>Productos validados</div>
          </div>
          <div style={S.statCard('#fefcbf')}>
            <div style={S.statNum}>{productosPorEstado('pendiente')}</div>
            <div style={S.statLabel}>Pendientes</div>
          </div>
          <div style={S.statCard('#fed7d7')}>
            <div style={S.statNum}>{productosPorEstado('rechazado')}</div>
            <div style={S.statLabel}>Rechazados</div>
          </div>
          <div style={S.statCard('#ebf8ff')}>
            <div style={S.statNum}>{usuariosPorRol('validador')}</div>
            <div style={S.statLabel}>Validadores</div>
          </div>
          <div style={S.statCard('#f0fff4')}>
            <div style={S.statNum}>{stats.validaciones_ultimo_mes}</div>
            <div style={S.statLabel}>Validaciones este mes</div>
          </div>
        </div>
      )}

      <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        <strong style={{ color: '#2d3748' }}>Gestión de usuarios</strong>
        <select style={S.select} value={filtroRol} onChange={e => setFiltroRol(e.target.value)}>
          <option value="">Todos los roles</option>
          {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      <div style={S.tabla}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Usuario', 'Email', 'Rol', 'Comunidad', 'Estado', ''].map(h => (
                <th key={h} style={S.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cargando ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: '#718096' }}>Cargando...</td></tr>
            ) : usuarios.map(u => (
              <tr key={u.id}>
                <td style={S.td}>{u.nombre} {u.apellido}</td>
                <td style={S.td}>{u.email}</td>
                <td style={S.td}>
                  <select
                    style={S.select}
                    value={u.rol}
                    onChange={e => cambiarRol(u.id, e.target.value)}
                  >
                    {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </td>
                <td style={S.td}>
                  {u.rol === 'validador' ? (
                    <input
                      defaultValue={u.comunidad || ''}
                      placeholder="Madrid, Barcelona..."
                      style={{ ...S.select, border: '1px solid #e2e8f0', borderRadius: '6px' }}
                      onBlur={e => setComunidad(u.id, e.target.value)}
                    />
                  ) : (
                    <span style={{ color: '#a0aec0', fontSize: '0.85rem' }}>—</span>
                  )}
                </td>
                <td style={S.td}>
                  <span style={S.badge(u.rol)}>{u.rol}</span>
                </td>
                <td style={S.td}>
                  <button style={S.btnToggle(u.activo)} onClick={() => toggleActivo(u)}>
                    {u.activo ? 'Activo' : 'Inactivo'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PanelAdminPage;
