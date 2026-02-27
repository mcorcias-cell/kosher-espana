// src/components/layout/Layout.js
import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useIsMobile } from '../../hooks/useMediaQuery';

const Layout = () => {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [userMenuAbierto, setUserMenuAbierto] = useState(false);

  const handleLogout = () => { logout(); setMenuAbierto(false); navigate('/'); };
  const cerrarMenu = () => setMenuAbierto(false);
  const esValidador = usuario && ['validador', 'administrador', 'intermedio'].includes(usuario.rol);
  const esAdmin = usuario?.rol === 'administrador';
  const linkStyle = { color: '#bee3f8', textDecoration: 'none', fontSize: '0.9rem' };
  const isActive = (path) => location.pathname === path;
  const activeLinkStyle = { ...linkStyle, color: 'white', fontWeight: 600 };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'system-ui, sans-serif' }}>
      <nav style={{ background: '#1a365d', color: 'white', padding: '0 1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.3)', position: 'sticky', top: 0, zIndex: 200 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px' }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.4rem' }}>✡️</span>
            <span style={{ fontWeight: 700, fontSize: isMobile ? '1rem' : '1.2rem' }}>Kosher España</span>
          </Link>

          {!isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <Link to="/" style={isActive('/') ? activeLinkStyle : linkStyle}>Buscar</Link>
              {usuario ? (
                <>
                  <Link to="/subir-producto" style={isActive('/subir-producto') ? activeLinkStyle : linkStyle}>Subir producto</Link>
                  <Link to="/mis-productos" style={isActive('/mis-productos') ? activeLinkStyle : linkStyle}>Mis productos</Link>
                  {esValidador && <Link to="/panel-validador" style={{ ...linkStyle, color: '#fbd38d' }}>Validador</Link>}
                  {esAdmin && <Link to="/panel-admin" style={{ ...linkStyle, color: '#fc8181' }}>Admin</Link>}
                  <div style={{ position: 'relative' }}>
                    <button onClick={() => setUserMenuAbierto(!userMenuAbierto)} style={{ background: '#2b6cb0', border: 'none', color: 'white', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem' }}>
                      {usuario.nombre} ▾
                    </button>
                    {userMenuAbierto && (
                      <div style={{ position: 'absolute', right: 0, top: '110%', background: 'white', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', minWidth: '150px', zIndex: 100 }}>
                        <Link to="/perfil" onClick={() => setUserMenuAbierto(false)} style={{ display: 'block', padding: '10px 16px', color: '#2d3748', textDecoration: 'none', fontSize: '0.9rem' }}>Mi perfil</Link>
                        <button onClick={handleLogout} style={{ width: '100%', textAlign: 'left', padding: '10px 16px', background: 'none', border: 'none', color: '#e53e3e', cursor: 'pointer', fontSize: '0.9rem' }}>Cerrar sesión</button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Link to="/login" style={linkStyle}>Iniciar sesión</Link>
                  <Link to="/register" style={{ background: '#3182ce', color: 'white', textDecoration: 'none', padding: '6px 16px', borderRadius: '6px', fontSize: '0.9rem' }}>Registrarse</Link>
                </>
              )}
            </div>
          )}

          {isMobile && (
            <button onClick={() => setMenuAbierto(!menuAbierto)} style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.6rem', cursor: 'pointer', padding: '4px 8px', lineHeight: 1 }}>
              {menuAbierto ? '✕' : '☰'}
            </button>
          )}
        </div>

        {isMobile && menuAbierto && (
          <div style={{ background: '#2a4a7f', borderTop: '1px solid rgba(255,255,255,0.1)', padding: '0.5rem 0 1rem' }}>
            <Link to="/" onClick={cerrarMenu} style={{ display: 'block', padding: '13px 1.5rem', color: '#bee3f8', textDecoration: 'none', fontSize: '0.95rem' }}>🔍 Buscar productos</Link>
            {usuario ? (
              <>
                <Link to="/subir-producto" onClick={cerrarMenu} style={{ display: 'block', padding: '13px 1.5rem', color: '#bee3f8', textDecoration: 'none', fontSize: '0.95rem' }}>📤 Subir producto</Link>
                <Link to="/mis-productos" onClick={cerrarMenu} style={{ display: 'block', padding: '13px 1.5rem', color: '#bee3f8', textDecoration: 'none', fontSize: '0.95rem' }}>📦 Mis productos</Link>
                <Link to="/perfil" onClick={cerrarMenu} style={{ display: 'block', padding: '13px 1.5rem', color: '#bee3f8', textDecoration: 'none', fontSize: '0.95rem' }}>👤 Mi perfil</Link>
                {esValidador && <Link to="/panel-validador" onClick={cerrarMenu} style={{ display: 'block', padding: '13px 1.5rem', color: '#fbd38d', textDecoration: 'none', fontSize: '0.95rem' }}>✅ Panel validador</Link>}
                {esAdmin && <Link to="/panel-admin" onClick={cerrarMenu} style={{ display: 'block', padding: '13px 1.5rem', color: '#fc8181', textDecoration: 'none', fontSize: '0.95rem' }}>⚙️ Administración</Link>}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '0.5rem', paddingTop: '0.5rem' }}>
                  <button onClick={handleLogout} style={{ width: '100%', textAlign: 'left', padding: '13px 1.5rem', background: 'none', border: 'none', color: '#fc8181', cursor: 'pointer', fontSize: '0.95rem' }}>🚪 Cerrar sesión</button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" onClick={cerrarMenu} style={{ display: 'block', padding: '13px 1.5rem', color: '#bee3f8', textDecoration: 'none', fontSize: '0.95rem' }}>🔑 Iniciar sesión</Link>
                <Link to="/register" onClick={cerrarMenu} style={{ display: 'block', padding: '13px 1.5rem', color: '#bee3f8', textDecoration: 'none', fontSize: '0.95rem' }}>📝 Registrarse</Link>
              </>
            )}
          </div>
        )}
      </nav>

      <main style={{ flex: 1, background: '#f7fafc' }}>
        <Outlet />
      </main>

      <footer style={{ background: '#2d3748', color: '#a0aec0', textAlign: 'center', padding: '1.25rem 1rem', fontSize: '0.82rem' }}>
        <p>✡️ Kosher España — Plataforma de certificación de productos kosher</p>
        <p style={{ marginTop: '4px', fontSize: '0.75rem' }}>Las validaciones son realizadas por validadores certificados de las comunidades judías de España</p>
      </footer>
    </div>
  );
};

export default Layout;