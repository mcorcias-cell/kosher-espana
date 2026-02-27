// src/pages/BusquedaPage.js
import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productosService, categoriasService } from '../services/api';
import TarjetaProducto from '../components/products/TarjetaProducto';
import { useIsMobile } from '../hooks/useMediaQuery';

const KOSHER_TIPOS = [
  { valor: 'pareve',  label: '🔵 Páreve' },
  { valor: 'lacteo',  label: '🟡 Lácteo' },
  { valor: 'carnico', label: '🔴 Cárnico' },
  { valor: 'pescado', label: '🐟 Pescado' },
];

const BusquedaPage = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [filtros, setFiltros] = useState({ nombre: '', marca: '', fabricante: '', codigo_barras: '' });
  const [categoriaActiva, setCategoriaActiva] = useState(null);
  const [categoriaActivaNombre, setCategoriaActivaNombre] = useState('');
  const [tipoKosher, setTipoKosher] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [resultados, setResultados] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [pagina, setPagina] = useState(1);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [sidebarAbierto, setSidebarAbierto] = useState(false);

  useEffect(() => {
    categoriasService.listar().then(res => setCategorias(res.data)).catch(() => {});
    buscar(1, null, null);
  }, []);

  const buscar = useCallback(async (pag = 1, catId = categoriaActiva, tipo = tipoKosher) => {
    setCargando(true);
    try {
      const params = { ...filtros, page: pag, limit: 12 };
      if (catId) params.categoria_id = catId;
      if (tipo) params.tipo_kosher = tipo;
      Object.keys(params).forEach(k => !params[k] && delete params[k]);
      const res = await productosService.buscar(params);
      setResultados(res.data);
      setPagina(pag);
    } catch {
      setResultados({ productos: [], total: 0 });
    } finally {
      setCargando(false);
    }
  }, [filtros, categoriaActiva, tipoKosher]);

  const handleCategoriaClick = (cat) => {
    if (!cat || categoriaActiva === cat.id) {
      setCategoriaActiva(null); setCategoriaActivaNombre('');
      buscar(1, null, tipoKosher);
    } else {
      setCategoriaActiva(cat.id); setCategoriaActivaNombre(`${cat.icono} ${cat.nombre}`);
      buscar(1, cat.id, tipoKosher);
    }
    if (isMobile) setSidebarAbierto(false);
  };

  const handleTipoKosher = (valor) => {
    const nuevo = tipoKosher === valor ? null : valor;
    setTipoKosher(nuevo);
    buscar(1, categoriaActiva, nuevo);
    if (isMobile) setSidebarAbierto(false);
  };

  const handleSubmit = (e) => { e.preventDefault(); buscar(1); };

  const limpiar = () => {
    setFiltros({ nombre: '', marca: '', fabricante: '', codigo_barras: '' });
    setCategoriaActiva(null); setCategoriaActivaNombre(''); setTipoKosher(null);
    buscar(1, null, null);
  };

  const hayFiltrosActivos = categoriaActiva || tipoKosher;

  const Sidebar = () => (
    <div style={{ background: 'white', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
      <div style={{ fontWeight: 700, color: '#2d3748', fontSize: '0.8rem', marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Categorías</div>
      <button style={catBtnStyle(!categoriaActiva)} onClick={() => handleCategoriaClick(null)}>
        <span>📋</span><span style={{ flex: 1 }}>Todos</span>
      </button>
      {categorias.map(cat => (
        <button key={cat.id} style={catBtnStyle(categoriaActiva === cat.id)} onClick={() => handleCategoriaClick(cat)}>
          <span>{cat.icono}</span>
          <span style={{ flex: 1, fontSize: '0.79rem' }}>{cat.nombre}</span>
          {parseInt(cat.total_productos) > 0 && (
            <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: '#a0aec0', background: '#f7fafc', padding: '1px 6px', borderRadius: '10px' }}>{cat.total_productos}</span>
          )}
        </button>
      ))}

      <div style={{ borderTop: '1px solid #e2e8f0', margin: '0.75rem 0' }} />

      <div style={{ fontWeight: 700, color: '#2d3748', fontSize: '0.8rem', marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tipo Kosher</div>
      <button style={catBtnStyle(!tipoKosher)} onClick={() => handleTipoKosher(null)}>Todos los tipos</button>
      {KOSHER_TIPOS.map(t => (
        <button key={t.valor} style={catBtnStyle(tipoKosher === t.valor)} onClick={() => handleTipoKosher(t.valor)}>
          {t.label}
        </button>
      ))}
    </div>
  );

  return (
    <div style={{ maxWidth: '1300px', margin: '0 auto', padding: isMobile ? '1rem' : '2rem 1rem' }}>
      {/* Hero */}
      <div style={{ textAlign: 'center', marginBottom: isMobile ? '1rem' : '2rem' }}>
        <h1 style={{ fontSize: isMobile ? '1.3rem' : '1.75rem', fontWeight: 700, color: '#1a365d', marginBottom: '6px' }}>
          ✡️ Buscador de Productos Kosher
        </h1>
        {!isMobile && <p style={{ color: '#718096', fontSize: '0.95rem' }}>Encuentra productos certificados por las comunidades judías de España</p>}
      </div>

      {/* Botón abrir filtros en móvil */}
      {isMobile && (
        <button
          onClick={() => setSidebarAbierto(!sidebarAbierto)}
          style={{ width: '100%', padding: '10px', marginBottom: '0.75rem', background: hayFiltrosActivos ? '#ebf8ff' : 'white', border: `2px solid ${hayFiltrosActivos ? '#2b6cb0' : '#e2e8f0'}`, borderRadius: '10px', cursor: 'pointer', fontWeight: 600, color: hayFiltrosActivos ? '#2b6cb0' : '#4a5568', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.9rem' }}
        >
          🏷️ {hayFiltrosActivos ? 'Filtros activos' : 'Filtrar por categoría o tipo'} {sidebarAbierto ? '▲' : '▼'}
        </button>
      )}

      {/* Sidebar en móvil (desplegable) */}
      {isMobile && sidebarAbierto && (
        <div style={{ marginBottom: '1rem' }}>
          <Sidebar />
        </div>
      )}

      <div style={{ display: isMobile ? 'block' : 'grid', gridTemplateColumns: '220px 1fr', gap: '1.5rem', alignItems: 'start' }}>
        {/* Sidebar desktop */}
        {!isMobile && (
          <div style={{ position: 'sticky', top: '75px' }}>
            <Sidebar />
          </div>
        )}

        {/* Contenido principal */}
        <div>
          {/* Buscador */}
          <div style={{ background: 'white', borderRadius: '12px', padding: isMobile ? '1rem' : '1.25rem', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', marginBottom: '1rem' }}>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <input
                  style={{ flex: 1, minWidth: '140px', padding: '9px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.9rem', outline: 'none' }}
                  placeholder="🔍 Nombre del producto..."
                  value={filtros.nombre}
                  onChange={e => setFiltros(f => ({ ...f, nombre: e.target.value }))}
                />
                {!isMobile && (
                  <input
                    style={{ flex: 1, minWidth: '140px', padding: '9px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.9rem', outline: 'none' }}
                    placeholder="📦 Código de barras"
                    value={filtros.codigo_barras}
                    onChange={e => setFiltros(f => ({ ...f, codigo_barras: e.target.value }))}
                  />
                )}
                <button type="button" style={{ padding: '9px 14px', background: '#edf2f7', color: '#4a5568', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', whiteSpace: 'nowrap' }} onClick={() => setMostrarFiltros(!mostrarFiltros)}>
                  {mostrarFiltros ? '▲' : '▼'} {isMobile ? 'Más' : 'Más filtros'}
                </button>
              </div>

              {mostrarFiltros && (
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '0.5rem', marginTop: '0.5rem' }}>
                  {isMobile && (
                    <input style={{ padding: '9px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.9rem', outline: 'none' }} placeholder="📦 Código de barras" value={filtros.codigo_barras} onChange={e => setFiltros(f => ({ ...f, codigo_barras: e.target.value }))} />
                  )}
                  <input style={{ padding: '9px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.9rem', outline: 'none' }} placeholder="🏷️ Marca" value={filtros.marca} onChange={e => setFiltros(f => ({ ...f, marca: e.target.value }))} />
                  <input style={{ padding: '9px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.9rem', outline: 'none' }} placeholder="🏭 Fabricante" value={filtros.fabricante} onChange={e => setFiltros(f => ({ ...f, fabricante: e.target.value }))} />
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                <button type="submit" style={{ flex: 1, padding: '9px', background: '#2b6cb0', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }} disabled={cargando}>
                  {cargando ? 'Buscando...' : '🔍 Buscar'}
                </button>
                <button type="button" style={{ padding: '9px 14px', background: '#edf2f7', color: '#4a5568', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem' }} onClick={limpiar}>
                  Limpiar
                </button>
              </div>
            </form>
          </div>

          {/* Filtros activos */}
          {(categoriaActivaNombre || tipoKosher) && (
            <div style={{ marginBottom: '0.75rem', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {categoriaActivaNombre && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', background: '#ebf8ff', color: '#2b6cb0', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 600 }}>
                  {categoriaActivaNombre}
                  <button onClick={() => handleCategoriaClick(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2b6cb0', fontSize: '1rem', lineHeight: 1 }}>×</button>
                </span>
              )}
              {tipoKosher && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', background: '#ebf8ff', color: '#2b6cb0', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 600 }}>
                  {KOSHER_TIPOS.find(t => t.valor === tipoKosher)?.label}
                  <button onClick={() => handleTipoKosher(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2b6cb0', fontSize: '1rem', lineHeight: 1 }}>×</button>
                </span>
              )}
            </div>
          )}

          {cargando && <div style={{ textAlign: 'center', padding: '2rem', color: '#718096' }}>🔍 Buscando...</div>}

          {!cargando && resultados && (
            <>
              <p style={{ color: '#718096', marginBottom: '0.75rem', fontSize: '0.875rem' }}>
                {resultados.total} producto{resultados.total !== 1 ? 's' : ''} encontrado{resultados.total !== 1 ? 's' : ''}
              </p>
              {resultados.productos.length > 0 ? (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(240px, 1fr))', gap: isMobile ? '0.75rem' : '1.25rem' }}>
                    {resultados.productos.map(p => (
                      <TarjetaProducto key={p.id} producto={p} onClick={() => navigate(`/producto/${p.id}`)} />
                    ))}
                  </div>
                  {resultados.total_paginas > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
                      {Array.from({ length: resultados.total_paginas }, (_, i) => i + 1).map(n => (
                        <button key={n} style={{ padding: '7px 14px', border: '1px solid #e2e8f0', borderRadius: '6px', background: n === pagina ? '#2b6cb0' : 'white', color: n === pagina ? 'white' : '#4a5568', cursor: 'pointer' }} onClick={() => buscar(n)}>{n}</button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#718096' }}>
                  <div style={{ fontSize: '3rem' }}>🔍</div>
                  <p>No se encontraron productos</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const catBtnStyle = (activa) => ({
  display: 'flex', alignItems: 'center', gap: '8px', width: '100%', textAlign: 'left',
  padding: '7px 10px', border: 'none', borderRadius: '8px', cursor: 'pointer',
  fontSize: '0.83rem', fontWeight: activa ? 700 : 400,
  background: activa ? '#ebf8ff' : 'transparent',
  color: activa ? '#2b6cb0' : '#4a5568', marginBottom: '2px',
});

export default BusquedaPage;