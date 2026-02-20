// src/pages/LoginPage.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const S = {
  wrap: { minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' },
  card: { background: 'white', borderRadius: '16px', padding: '2.5rem', boxShadow: '0 4px 24px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' },
  titulo: { textAlign: 'center', fontSize: '1.5rem', fontWeight: 700, color: '#1a365d', marginBottom: '0.5rem' },
  sub: { textAlign: 'center', color: '#718096', marginBottom: '2rem', fontSize: '0.9rem' },
  grupo: { marginBottom: '1rem' },
  label: { display: 'block', fontWeight: 600, fontSize: '0.85rem', color: '#2d3748', marginBottom: '4px' },
  input: { width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.95rem', boxSizing: 'border-box', outline: 'none' },
  btn: { width: '100%', padding: '12px', background: '#2b6cb0', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem', fontWeight: 600, marginTop: '0.5rem' },
  link: { textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: '#718096' },
};

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    try {
      await login(form.email, form.password);
      toast.success('¡Bienvenido!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al iniciar sesión');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={S.wrap}>
      <div style={S.card}>
        <div style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '0.5rem' }}>✡️</div>
        <h1 style={S.titulo}>Iniciar sesión</h1>
        <p style={S.sub}>Kosher España</p>
        <form onSubmit={handleSubmit}>
          <div style={S.grupo}>
            <label style={S.label}>Email</label>
            <input style={S.input} type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="tu@email.com" required />
          </div>
          <div style={S.grupo}>
            <label style={S.label}>Contraseña</label>
            <input style={S.input} type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="Tu contraseña" required />
          </div>
          <button type="submit" style={S.btn} disabled={cargando}>{cargando ? 'Entrando...' : 'Iniciar sesión'}</button>
        </form>
        <p style={S.link}>¿No tienes cuenta? <Link to="/register" style={{ color: '#2b6cb0' }}>Regístrate</Link></p>
      </div>
    </div>
  );
};

export default LoginPage;
