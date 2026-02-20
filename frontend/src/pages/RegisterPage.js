// src/pages/RegisterPage.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const S = {
  wrap: { minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' },
  card: { background: 'white', borderRadius: '16px', padding: '2.5rem', boxShadow: '0 4px 24px rgba(0,0,0,0.1)', width: '100%', maxWidth: '440px' },
  titulo: { textAlign: 'center', fontSize: '1.5rem', fontWeight: 700, color: '#1a365d', marginBottom: '0.5rem' },
  sub: { textAlign: 'center', color: '#718096', marginBottom: '2rem', fontSize: '0.9rem' },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' },
  grupo: { marginBottom: '1rem' },
  label: { display: 'block', fontWeight: 600, fontSize: '0.85rem', color: '#2d3748', marginBottom: '4px' },
  input: { width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.95rem', boxSizing: 'border-box', outline: 'none' },
  btn: { width: '100%', padding: '12px', background: '#2b6cb0', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem', fontWeight: 600, marginTop: '0.5rem' },
  link: { textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: '#718096' },
};

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ nombre: '', apellido: '', email: '', password: '' });
  const [cargando, setCargando] = useState(false);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 8) return toast.error('La contraseña debe tener al menos 8 caracteres');
    setCargando(true);
    try {
      await register(form);
      toast.success('¡Cuenta creada! Bienvenido/a');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al registrarse');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={S.wrap}>
      <div style={S.card}>
        <div style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '0.5rem' }}>✡️</div>
        <h1 style={S.titulo}>Crear cuenta</h1>
        <p style={S.sub}>Únete a la comunidad Kosher España</p>
        <form onSubmit={handleSubmit}>
          <div style={S.row}>
            <div>
              <label style={S.label}>Nombre</label>
              <input style={S.input} value={form.nombre} onChange={set('nombre')} placeholder="Tu nombre" required />
            </div>
            <div>
              <label style={S.label}>Apellido</label>
              <input style={S.input} value={form.apellido} onChange={set('apellido')} placeholder="Tu apellido" required />
            </div>
          </div>
          <div style={S.grupo}>
            <label style={S.label}>Email</label>
            <input style={S.input} type="email" value={form.email} onChange={set('email')} placeholder="tu@email.com" required />
          </div>
          <div style={S.grupo}>
            <label style={S.label}>Contraseña (mín. 8 caracteres)</label>
            <input style={S.input} type="password" value={form.password} onChange={set('password')} placeholder="Elige una contraseña segura" required />
          </div>
          <button type="submit" style={S.btn} disabled={cargando}>{cargando ? 'Creando cuenta...' : 'Crear cuenta'}</button>
        </form>
        <p style={S.link}>¿Ya tienes cuenta? <Link to="/login" style={{ color: '#2b6cb0' }}>Inicia sesión</Link></p>
      </div>
    </div>
  );
};

export default RegisterPage;
