// src/pages/BusquedaPage.js
import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productosService, categoriasService } from '../services/api';
import TarjetaProducto from '../components/products/TarjetaProducto';

const KOSHER_TIPOS = [
  { valor: 'pareve',  label: '🔵 Páreve' },
  { valor: 'lacteo',  label: '🟡 Lácteo' },
  { valor: 'carnico', label: '🔴 Cárnico' },
  { valor: 'pescado', label: '🐟 Pescado' },
];

const S = {
  page: { maxWidth: '1300px', margin: '0 auto', padding: '2rem 1rem' },
  layout: { display: 'grid', gridTemplateColumns: '220px 1fr', gap: '1.5rem', alignItems: 'start' },
  hero: { textAlign: 'center', marginBottom: '2rem' },
  titulo: { fontSize: '1.75rem', fontWeight: 700, color: '#1a365d', marginBottom: '6px' },
  subtitulo: { color: '#718096', fontSize: '0.95rem' },
  sidebar: { background: 'white', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', position: 'sticky', top: '1rem' },
  sidebarTitulo: { fontWeight: 700, color: '#2d3748', fontSize: '0.85rem', marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.05em' },
  sidebarDivider: { borderTop: '1px solid #e2e8f0', margin: '0.75rem 0' },
  catBtn: (activa) => ({ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', textAlign: 'left', padding: '7px 10px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.83rem', fontWeight: activa ? 700 : 400, background: activa ? '#ebf8ff' : 'transparent', color: activa ? '#2b6cb0' : '#4a5568', marginBottom: '2px' }),
  catCount: { marginLeft: 'auto', fontSize: '0.72rem', color: '#a0aec0', background: '#f7fafc', padding: '1px 6px', borderRadius: '10px' },
  kosherBtn: (activa, color) => ({ display: 'flex', alignItems: 'center', gap: '6px', width: '100%', padding: '7px 10px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.83rem', fontWeight: activa ? 700 : 400, background: activa ? '#ebf8ff' : 'transparent', color: activa ? color : '#4a5568', marginBottom: '2px' }),
  searchBox: { background: 'white', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', marginBottom: '1.25rem' },
  inputGroup: { display: 'flex', gap: '0.75rem', flexWrap: 'wrap' },
  input: { flex: 1, minWidth: '160px', padding: '9px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.9rem', outline: 'none' },
  btn: { padding: '9px 22px', background: '#2b6cb0', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 },
  btnSecundario: { padding: '9px 16px', background: '#edf2f7', color: '#4a5568', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' },
  totalTexto: { color: '#718096', marginBottom: '0.75rem', fontSize: '0.875rem' },
  paginacion: { display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1.5rem' },
  pagBtn: (activa) => ({ padding: '7px 14px', border: '1px solid #e2e8f0', borderRadius: '6px', background: activa ? '#2b6cb0' : 'white', color: activa ? 'white' : '#4a5568', cursor: 'pointer' }),
  vacio: { textAlign: 'center', padding: '3rem 1rem', color: '#718096' },
  cargando: { textAlign: 'center', padding: '2rem', color: '#718096' },
  activeBadge: { display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', background: '#ebf8ff', color: '#2b6cb0', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1rem', marginRight: '6px' },
};

const BusquedaPage = () => {
  const navigate = useNavigate();
  const [filtros, setFiltros] = useState({ nombre: '', marca: '', fabricante: '', codigo_barras: '' });
  const [categoriaActiva, setCategoriaActiva] = useState(null);
  const [categoriaActivaNombre, setCategoriaActivaNombre] = useState('');
  const [tipoKosher, setTipoKosher] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [resultados, setResultados] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [pagina, setPagina] = useState(1);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

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
  };

  const handleTipoKosher = (valor) => {
    const nuevo = tipoKosher === valor ? null : valor;
    setTipoKosher(nuevo);
    buscar(1, categoriaActiva, nuevo);
  };

  const handleSubmit = (e) => { e.preventDefault(); buscar(1); };

  const limpiar = () => {
    setFiltros({ nombre: '', marca: '', fabricante: '', codigo_barras: '' });
    setCategoriaActiva(null); setCategoriaActivaNombre(''); setTipoKosher(null);
    buscar(1, null, null);
  };

  return (
    <div style={S.page}>
      <div style={S.hero}>
        <h1 style={S.titulo}>✡️ Buscador de Productos Kosher</h1>
        <p style={S.subtitulo}>Encuentra productos certificados por las comunidades judías de España</p>
      </div>
      <div style={S.layout}>
        {/* Sidebar */}
        <div style={S.sidebar}>
          <div style={S.sidebarTitulo}>Categorías</div>
          <button style={S.catBtn(!categoriaActiva)} onClick={() => handleCategoriaClick(null)}>
            <span>📋</span> <span style={{flex:1}}>Todos</span>
          </button>
          {categorias.map(cat => (
            <button key={cat.id} style={S.catBtn(categoriaActiva === cat.id)} onClick={() => handleCategoriaClick(cat)}>
              <span>{cat.icono}</span>
              <span style={{flex:1, fontSize:'0.8rem'}}>{cat.nombre}</span>
              {parseInt(cat.total_productos) > 0 && <span style={S.catCount}>{cat.total_productos}</span>}
            </button>
          ))}

          <div style={S.sidebarDivider} />

          <div style={S.sidebarTitulo}>Tipo Kosher</div>
          <button style={S.kosherBtn(!tipoKosher, '#2b6cb0')} onClick={() => handleTipoKosher(null)}>
            Todos los tipos
          </button>
          {KOSHER_TIPOS.map(t => (
            <button key={t.valor} style={S.kosherBtn(tipoKosher === t.valor, '#2b6cb0')} onClick={() => handleTipoKosher(t.valor)}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Contenido */}
        <div>
          <div style={S.searchBox}>
            <form onSubmit={handleSubmit}>
              <div style={S.inputGroup}>
                <input style={S.input} placeholder="🔍 Nombre del producto..." value={filtros.nombre} onChange={e => setFiltros(f => ({...f, nombre: e.target.value}))} />
                <input style={S.input} placeholder="📦 Código de barras" value={filtros.codigo_barras} onChange={e => setFiltros(f => ({...f, codigo_barras: e.target.value}))} />
                <button type="button" style={S.btnSecundario} onClick={() => setMostrarFiltros(!mostrarFiltros)}>{mostrarFiltros ? 'Menos ▲' : 'Más filtros ▼'}</button>
              </div>
              {mostrarFiltros && (
                <div style={{...S.inputGroup, marginTop:'0.75rem'}}>
                  <input style={S.input} placeholder="🏷️ Marca" value={filtros.marca} onChange={e => setFiltros(f => ({...f, marca: e.target.value}))} />
                  <input style={S.input} placeholder="🏭 Fabricante" value={filtros.fabricante} onChange={e => setFiltros(f => ({...f, fabricante: e.target.value}))} />
                </div>
              )}
              <div style={{display:'flex', gap:'0.75rem', marginTop:'0.75rem'}}>
                <button type="submit" style={S.btn} disabled={cargando}>{cargando ? 'Buscando...' : 'Buscar'}</button>
                <button type="button" style={S.btnSecundario} onClick={limpiar}>Limpiar</button>
              </div>
            </form>
          </div>

          {/* Filtros activos */}
          <div>
            {categoriaActivaNombre && (
              <span style={S.activeBadge}>
                {categoriaActivaNombre}
                <button onClick={() => handleCategoriaClick(null)} style={{background:'none',border:'none',cursor:'pointer',color:'#2b6cb0',fontSize:'1rem'}}>×</button>
              </span>
            )}
            {tipoKosher && (
              <span style={S.activeBadge}>
                {KOSHER_TIPOS.find(t => t.valor === tipoKosher)?.label}
                <button onClick={() => handleTipoKosher(null)} style={{background:'none',border:'none',cursor:'pointer',color:'#2b6cb0',fontSize:'1rem'}}>×</button>
              </span>
            )}
          </div>

          {cargando && <div style={S.cargando}>🔍 Buscando...</div>}

          {!cargando && resultados && (
            <>
              <p style={S.totalTexto}>{resultados.total} producto{resultados.total !== 1 ? 's' : ''} encontrado{resultados.total !== 1 ? 's' : ''}</p>
              {resultados.productos.length > 0 ? (
                <>
                  <div style={S.grid}>
                    {resultados.productos.map(p => <TarjetaProducto key={p.id} producto={p} onClick={() => navigate(`/producto/${p.id}`)} />)}
                  </div>
                  {resultados.total_paginas > 1 && (
                    <div style={S.paginacion}>
                      {Array.from({length: resultados.total_paginas}, (_, i) => i+1).map(n => (
                        <button key={n} style={S.pagBtn(n === pagina)} onClick={() => buscar(n)}>{n}</button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div style={S.vacio}><div style={{fontSize:'3rem'}}>🔍</div><p>No se encontraron productos</p></div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusquedaPage;