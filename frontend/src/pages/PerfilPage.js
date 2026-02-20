// src/pages/PerfilPage.js
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { usuariosService } from '../services/api';
import api from '../services/api';

const S = {
  page: { maxWidth: '600px', margin: '0 auto', padding: '2rem 1rem' },
  titulo: { fontSize: '1.75rem', fontWeight: 700, color: '#1a365d', marginBottom: '2rem' },
  card: { background: 'white', borderRadius: '12px', padding: '2rem', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', marginBottom: '1.5rem' },
  label: { display: 'block', fontWeight: 600, fontSize: '0.85rem', color: '#2d3748', marginBottom: '4px' },
  input: { width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.95rem', boxSizing: 'border-box', marginBottom: '1rem' },
  btn: { padding: '10px 24px', background: '#2b6cb0', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 },
  rolBadge: { display: 'inline-block', padding: '4px 12px', borderRadius: '20px', fontWeight: 600, fontSize: '0.85rem', background: '#bee3f8', color: '#2b6cb0' },
};

const SUSCRIPCIONES = [
  { value: 'ninguno', label: 'Sin suscripción' },
  { value: 'semanal', label: 'Reporte semanal' },
  { value: 'mensual', label: 'Reporte mensual' },
];

const PerfilPage = () => {
  const { usuario, login } = useAuth();
  const [form, setForm] = useState({ nombre: usuario.nombre, apellido: usuario.apellido, suscripcion_reporte: usuario.suscripcion_reporte || 'ninguno' });
  const [pwForm, setPwForm] = useState({ password_actual: '', password_nueva: '' });

  const actualizarPerfil = async (e) => {
    e.preventDefault();
    try {
      await usuariosService.actualizarPerfil(form);
      toast.success('Perfil actualizado');
    } catch {
      toast.error('Error al actualizar el perfil');
    }
  };

  const cambiarPassword = async (e) => {
    e.preventDefault();
    if (pwForm.password_nueva.length < 8) return toast.error('La contraseña nueva debe tener al menos 8 caracteres');
    try {
      await api.put('/auth/perfil/password', pwForm);
      toast.success('Contraseña actualizada');
      setPwForm({ password_actual: '', password_nueva: '' });
    } catch {
      toast.error('Contraseña actual incorrecta');
    }
  };

  return (
    <div style={S.page}>
      <h1 style={S.titulo}>Mi perfil</h1>

      <div style={S.card}>
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.85rem', color: '#718096', marginBottom: '4px' }}>Tu rol</div>
          <span style={S.rolBadge}>{usuario.rol}</span>
          {usuario.comunidad && <span style={{ marginLeft: '8px', color: '#718096', fontSize: '0.9rem' }}>· {usuario.comunidad}</span>}
        </div>

        <form onSubmit={actualizarPerfil}>
          <label style={S.label}>Nombre</label>
          <input style={S.input} value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} />
          <label style={S.label}>Apellido</label>
          <input style={S.input} value={form.apellido} onChange={e => setForm(f => ({ ...f, apellido: e.target.value }))} />
          <label style={S.label}>Email</label>
          <input style={S.input} value={usuario.email} disabled style={{ ...S.input, background: '#f7fafc', color: '#a0aec0' }} />

          <label style={S.label}>Suscripción a reportes</label>
          <select style={S.input} value={form.suscripcion_reporte} onChange={e => setForm(f => ({ ...f, suscripcion_reporte: e.target.value }))}>
            {SUSCRIPCIONES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>

          <button type="submit" style={S.btn}>Guardar cambios</button>
        </form>
      </div>

      <div style={S.card}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#2d3748', marginBottom: '1.25rem' }}>Cambiar contraseña</h2>
        <form onSubmit={cambiarPassword}>
          <label style={S.label}>Contraseña actual</label>
          <input style={S.input} type="password" value={pwForm.password_actual} onChange={e => setPwForm(f => ({ ...f, password_actual: e.target.value }))} />
          <label style={S.label}>Nueva contraseña (mín. 8 caracteres)</label>
          <input style={S.input} type="password" value={pwForm.password_nueva} onChange={e => setPwForm(f => ({ ...f, password_nueva: e.target.value }))} />
          <button type="submit" style={S.btn}>Cambiar contraseña</button>
        </form>
      </div>
    </div>
  );
};

export default PerfilPage;
