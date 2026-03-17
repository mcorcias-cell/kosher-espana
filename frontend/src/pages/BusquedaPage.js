// src/pages/BusquedaPage.js
import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { productosService, categoriasService } from '../services/api';
import TarjetaProducto from '../components/products/TarjetaProducto';
import { useIsMobile } from '../hooks/useMediaQuery';

const KOSHER_TIPOS = [
  { valor: 'pareve',  label: '🔵 Páreve' },
  { valor: 'lacteo',  label: '🟡 Lácteo' },
  { valor: 'carnico', label: '🔴 Cárnico' },
  { valor: 'pescado', label: '🐟 Pescado' },
];

const FILTROS_INICIALES = { nombre: '', marca: '', fabricante: '', codigo_barras: '', supermercado: '' };

const calcularVentanaPaginas = (actual, total) => {
  const size = 8;
  let inicio = Math.max(1, actual - Math.floor(size / 2));
  let fin = inicio + size - 1;
  if (fin > total) { fin = total; inicio = Math.max(1, fin - size + 1); }
  return Array.from({ length: fin - inicio + 1 }, (_, i) => inicio + i);
};

const BusquedaPage = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const location = useLocation();
  const [filtros, setFiltros] = useState(FILTROS_INICIALES);
  const [categoriaActiva, setCategoriaActiva] = useState(null);
  const [categoriaActivaNombre, setCategoriaActivaNombre] = useState('');
  const [tipoKosher, setTipoKosher] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [busquedaCategoria, setBusquedaCategoria] = useState('');
  const [resultados, setResultados] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [pagina, setPagina] = useState(1);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [sidebarAbierto, setSidebarAbierto] = useState(false);

  useEffect(() => {
    categoriasService.listar().then(res => {
      setCategorias(res.data);
      const params = new URLSearchParams(location.search);
      const marcaParam = params.get('marca');
      const catParam = params.get('categoria_id');

      if (marcaParam) {
        sessionStorage.removeItem('kosher_busqueda_estado');
        const newFiltros = { ...FILTROS_INICIALES, marca: marcaParam };
        setFiltros(newFiltros);
        buscar(1, null, null, newFiltros);
      } else if (catParam) {
        sessionStorage.removeItem('kosher_busqueda_estado');
        setCategoriaActiva(catParam);
        const cat = res.data.find(c => String(c.id) === String(catParam));
        if (cat) setCategoriaActivaNombre(`${cat.icono} ${cat.nombre}`);
        buscar(1, catParam, null);
      } else {
        const saved = sessionStorage.getItem('kosher_busqueda_estado');
        if (saved) {
          try {
            const estado = JSON.parse(saved);
            const filtrosGuardados = estado.filtros || FILTROS_INICIALES;
            setFiltros(filtrosGuardados);
            setCategoriaActiva(estado.categoriaActiva || null);
            setCategoriaActivaNombre(estado.categoriaActivaNombre || '');
            setTipoKosher(estado.tipoKosher || null);
            buscar(estado.pagina || 1, estado.categoriaActiva || null, estado.tipoKosher || null, filtrosGuardados);
            return;
          } catch (e) {}
        }
        buscar(1, null, null);
      }
    }).catch(() => { buscar(1, null, null); });
  }, []);

  const buscar = useCallback(async (pag = 1, catId = categoriaActiva, tipo = tipoKosher, filtrosOverride = null) => {
    setCargando(true);
    try {
      const params = { ...(filtrosOverride !== null ? filtrosOverride : filtros), page: pag, limit: 12 };
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
    setFiltros(FILTROS_INICIALES);
    setCategoriaActiva(null); setCategoriaActivaNombre(''); setTipoKosher(null);
    setBusquedaCategoria('');
    sessionStorage.removeItem('kosher_busqueda_estado');
    buscar(1, null, null, FILTROS_INICIALES);
  };

  const hayFiltrosActivos = categoriaActiva || tipoKosher || filtros.supermercado;

  const categoriasFiltradas = busquedaCategoria
    ? categorias.filter(c => c.nombre.toLowerCase().includes(busquedaCategoria.toLowerCase()))
    : categorias;

  const renderSidebar = () => (
    <div style={{ background: 'white', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
      <div style={{ fontWeight: 700, color: '#2d3748', fontSize: '0.8rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Categorías</div>

      <input
        style={{ width: '100%', padding: '6px 10px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '0.8rem', marginBottom: '0.5rem', outline: 'none', boxSizing: 'border-box' }}
        placeholder="🔍 Buscar categoría..."
        value={busquedaCategoria}
        onChange={e => setBusquedaCategoria(e.target.value)}
      />

      {!busquedaCategoria && (
        <button style={catBtnStyle(!categoriaActiva)} onClick={() => handleCategoriaClick(null)}>
          <span>📋</span><span style={{ flex: 1 }}>Todos</span>
        </button>
      )}
      {categoriasFiltradas.map(cat => (
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
          {renderSidebar()}
        </div>
      )}

      <div style={{ display: isMobile ? 'block' : 'grid', gridTemplateColumns: '220px 1fr', gap: '1.5rem', alignItems: 'start' }}>
        {/* Sidebar desktop */}
        {!isMobile && (
          <div style={{ position: 'sticky', top: '75px' }}>
            {renderSidebar()}
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
                  <input
                    style={{ padding: '9px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.9rem', outline: 'none', gridColumn: isMobile ? undefined : 'span 2' }}
                    placeholder="🏪 Supermercado (Donde encontrarlo)"
                    value={filtros.supermercado}
                    onChange={e => setFiltros(f => ({ ...f, supermercado: e.target.value }))}
                  />
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
          {(categoriaActivaNombre || tipoKosher || filtros.supermercado) && (
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
              {filtros.supermercado && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', background: '#ebf8ff', color: '#2b6cb0', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 600 }}>
                  🏪 {filtros.supermercado}
                  <button onClick={() => {
                    const nf = { ...filtros, supermercado: '' };
                    setFiltros(nf);
                    buscar(1, categoriaActiva, tipoKosher, nf);
                  }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2b6cb0', fontSize: '1rem', lineHeight: 1 }}>×</button>
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

              {/* Banner productos sin supermercado */}
              {filtros.supermercado && resultados.total_sin_supermercado > 0 && (
                <div style={{ background: '#fffbea', border: '1px solid #f6e05e', borderRadius: '8px', padding: '10px 14px', marginBottom: '0.75rem', fontSize: '0.875rem', color: '#744210' }}>
                  ℹ️ {resultados.total_sin_supermercado} producto{resultados.total_sin_supermercado !== 1 ? 's' : ''} no {resultados.total_sin_supermercado !== 1 ? 'tienen' : 'tiene'} supermercado definido y no aparece{resultados.total_sin_supermercado !== 1 ? 'n' : ''} en estos resultados.
                </div>
              )}

              {resultados.productos.length > 0 ? (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(240px, 1fr))', gap: isMobile ? '0.75rem' : '1.25rem' }}>
                    {resultados.productos.map(p => (
                      <TarjetaProducto key={p.id} producto={p} onClick={() => {
                        sessionStorage.setItem('kosher_nav_ids', JSON.stringify(resultados.productos.map(x => x.id)));
                        sessionStorage.setItem('kosher_nav_pagina', pagina);
                        sessionStorage.setItem('kosher_busqueda_estado', JSON.stringify({
                          filtros, categoriaActiva, categoriaActivaNombre, tipoKosher, pagina,
                        }));
                        navigate(`/producto/${p.id}`);
                      }} />
                    ))}
                  </div>

                  {resultados.total_paginas > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.25rem', marginTop: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                      <button
                        onClick={() => buscar(pagina - 1)}
                        disabled={pagina === 1}
                        style={paginaBtnStyle(false, pagina === 1)}
                      >‹</button>
                      {calcularVentanaPaginas(pagina, resultados.total_paginas).map(n => (
                        <button key={n} style={paginaBtnStyle(n === pagina)} onClick={() => buscar(n)}>{n}</button>
                      ))}
                      <button
                        onClick={() => buscar(pagina + 1)}
                        disabled={pagina === resultados.total_paginas}
                        style={paginaBtnStyle(false, pagina === resultados.total_paginas)}
                      >›</button>
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

const paginaBtnStyle = (activa, deshabilitado = false) => ({
  padding: '7px 12px',
  border: '1px solid #e2e8f0',
  borderRadius: '6px',
  background: activa ? '#2b6cb0' : 'white',
  color: activa ? 'white' : deshabilitado ? '#cbd5e0' : '#4a5568',
  cursor: deshabilitado ? 'default' : 'pointer',
  fontSize: '0.9rem',
  fontWeight: activa ? 600 : 400,
  minWidth: '36px',
});

export default BusquedaPage;
