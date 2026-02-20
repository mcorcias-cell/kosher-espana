// src/components/layout/Layout.js
import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Layout = () => {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const esValidador = usuario && ['validador', 'administrador', 'intermedio'].includes(usuario.rol);
  const esAdmin = usuario?.rol === 'administrador';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'system-ui, sans-serif' }}>
      {/* Navbar */}
      <nav style={{ background: '#1a365d', color: 'white', padding: '0 1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.5rem' }}>✡️</span>
            <span style={{ fontWeight: 700, fontSize: '1.25rem' }}>Kosher España</span>
          </Link>

          {/* Desktop nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link to="/" style={{ color: '#bee3f8', textDecoration: 'none', fontSize: '0.9rem' }}>Buscar productos</Link>
            {usuario ? (
              <>
                <Link to="/subir-producto" style={{ color: '#bee3f8', textDecoration: 'none', fontSize: '0.9rem' }}>Subir producto</Link>
                <Link to="/mis-productos" style={{ color: '#bee3f8', textDecoration: 'none', fontSize: '0.9rem' }}>Mis productos</Link>
                {esValidador && <Link to="/panel-validador" style={{ color: '#fbd38d', textDecoration: 'none', fontSize: '0.9rem' }}>Panel validador</Link>}
                {esAdmin && <Link to="/panel-admin" style={{ color: '#fc8181', textDecoration: 'none', fontSize: '0.9rem' }}>Admin</Link>}
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setMenuAbierto(!menuAbierto)}
                    style={{ background: '#2b6cb0', border: 'none', color: 'white', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem' }}
                  >
                    {usuario.nombre} ▾
                  </button>
                  {menuAbierto && (
                    <div style={{ position: 'absolute', right: 0, top: '110%', background: 'white', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', minWidth: '150px', zIndex: 100 }}>
                      <Link to="/perfil" onClick={() => setMenuAbierto(false)} style={{ display: 'block', padding: '10px 16px', color: '#2d3748', textDecoration: 'none', fontSize: '0.9rem' }}>Mi perfil</Link>
                      <button onClick={handleLogout} style={{ width: '100%', textAlign: 'left', padding: '10px 16px', background: 'none', border: 'none', color: '#e53e3e', cursor: 'pointer', fontSize: '0.9rem' }}>Cerrar sesión</button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" style={{ color: '#bee3f8', textDecoration: 'none', fontSize: '0.9rem' }}>Iniciar sesión</Link>
                <Link to="/register" style={{ background: '#3182ce', color: 'white', textDecoration: 'none', padding: '6px 16px', borderRadius: '6px', fontSize: '0.9rem' }}>Registrarse</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Contenido principal */}
      <main style={{ flex: 1, background: '#f7fafc' }}>
        <Outlet />
      </main>

      {/* Footer */}
      <footer style={{ background: '#2d3748', color: '#a0aec0', textAlign: 'center', padding: '1.5rem', fontSize: '0.85rem' }}>
        <p>✡️ Kosher España — Plataforma de certificación de productos kosher</p>
        <p style={{ marginTop: '4px' }}>Las validaciones son realizadas por validadores certificados de las comunidades judías de España</p>
      </footer>
    </div>
  );
};

export default Layout;
