// src/pages/BusquedaPage.js
import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productosService } from '../services/api';
import TarjetaProducto from '../components/products/TarjetaProducto';

const S = {
  page: { maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' },
  hero: { textAlign: 'center', marginBottom: '2.5rem' },
  titulo: { fontSize: '2rem', fontWeight: 700, color: '#1a365d', marginBottom: '8px' },
  subtitulo: { color: '#718096', fontSize: '1rem' },
  searchBox: { background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', marginBottom: '2rem' },
  inputGroup: { display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' },
  input: { flex: 1, minWidth: '180px', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.95rem', outline: 'none' },
  btn: { padding: '10px 24px', background: '#2b6cb0', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.95rem', fontWeight: 600 },
  btnSecundario: { padding: '10px 20px', background: '#edf2f7', color: '#4a5568', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.95rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' },
  totalTexto: { color: '#718096', marginBottom: '1rem', fontSize: '0.9rem' },
  paginacion: { display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem' },
  pagBtn: (activa) => ({ padding: '8px 16px', border: '1px solid #e2e8f0', borderRadius: '6px', background: activa ? '#2b6cb0' : 'white', color: activa ? 'white' : '#4a5568', cursor: 'pointer' }),
  vacio: { textAlign: 'center', padding: '4rem 1rem', color: '#718096' },
  cargando: { textAlign: 'center', padding: '3rem', color: '#718096' },
};

const BusquedaPage = () => {
  const navigate = useNavigate();
  const [filtros, setFiltros] = useState({ nombre: '', marca: '', fabricante: '', codigo_barras: '' });
  const [resultados, setResultados] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [pagina, setPagina] = useState(1);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  // Cargar todos los productos al entrar
  useEffect(() => { buscar(1); }, []);

  const buscar = useCallback(async (pag = 1) => {
    setCargando(true);
    try {
      const params = { ...filtros, page: pag, limit: 12 };
      // Limpiar filtros vacíos
      Object.keys(params).forEach(k => !params[k] && delete params[k]);
      const res = await productosService.buscar(params);
      setResultados(res.data);
      setPagina(pag);
    } catch {
      setResultados({ productos: [], total: 0 });
    } finally {
      setCargando(false);
    }
  }, [filtros]);

  const handleSubmit = (e) => {
    e.preventDefault();
    buscar(1);
  };

  const limpiar = () => {
    setFiltros({ nombre: '', marca: '', fabricante: '', codigo_barras: '' });
    setResultados(null);
  };

  return (
    <div style={S.page}>
      <div style={S.hero}>
        <h1 style={S.titulo}>✡️ Buscador de Productos Kosher</h1>
        <p style={S.subtitulo}>Encuentra productos certificados por las comunidades judías de España</p>
      </div>

      <div style={S.searchBox}>
        <form onSubmit={handleSubmit}>
          <div style={S.inputGroup}>
            <input
              style={S.input}
              placeholder="🔍 Nombre del producto..."
              value={filtros.nombre}
              onChange={e => setFiltros(f => ({ ...f, nombre: e.target.value }))}
            />
            <input
              style={S.input}
              placeholder="📦 Código de barras"
              value={filtros.codigo_barras}
              onChange={e => setFiltros(f => ({ ...f, codigo_barras: e.target.value }))}
            />
            <button type="button" style={S.btnSecundario} onClick={() => setMostrarFiltros(!mostrarFiltros)}>
              {mostrarFiltros ? 'Menos filtros ▲' : 'Más filtros ▼'}
            </button>
          </div>

          {mostrarFiltros && (
            <div style={S.inputGroup}>
              <input
                style={S.input}
                placeholder="🏷️ Marca"
                value={filtros.marca}
                onChange={e => setFiltros(f => ({ ...f, marca: e.target.value }))}
              />
              <input
                style={S.input}
                placeholder="🏭 Fabricante"
                value={filtros.fabricante}
                onChange={e => setFiltros(f => ({ ...f, fabricante: e.target.value }))}
              />
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button type="submit" style={S.btn} disabled={cargando}>
              {cargando ? 'Buscando...' : 'Buscar productos'}
            </button>
            {resultados && (
              <button type="button" style={S.btnSecundario} onClick={limpiar}>Limpiar</button>
            )}
          </div>
        </form>
      </div>

      {/* Resultados */}
      {cargando && <div style={S.cargando}>🔍 Buscando productos...</div>}

      {!cargando && resultados && (
        <>
          <p style={S.totalTexto}>
            {resultados.total > 0
              ? `${resultados.total} producto${resultados.total !== 1 ? 's' : ''} encontrado${resultados.total !== 1 ? 's' : ''}`
              : 'No se encontraron productos'}
          </p>

          {resultados.productos.length > 0 ? (
            <>
              <div style={S.grid}>
                {resultados.productos.map(p => (
                  <TarjetaProducto key={p.id} producto={p} onClick={() => navigate(`/producto/${p.id}`)} />
                ))}
              </div>

              {/* Paginación */}
              {resultados.total_paginas > 1 && (
                <div style={S.paginacion}>
                  {Array.from({ length: resultados.total_paginas }, (_, i) => i + 1).map(n => (
                    <button key={n} style={S.pagBtn(n === pagina)} onClick={() => buscar(n)}>{n}</button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div style={S.vacio}>
              <div style={{ fontSize: '3rem' }}>🔍</div>
              <p>No se encontraron productos con esos criterios</p>
              <p style={{ fontSize: '0.85rem', marginTop: '8px' }}>¿Conoces un producto kosher? <a href="/subir-producto" style={{ color: '#2b6cb0' }}>Súbelo aquí</a></p>
            </div>
          )}
        </>
      )}

      {!resultados && !cargando && (
        <div style={S.vacio}>
          <div style={{ fontSize: '4rem' }}>✡️</div>
          <p style={{ marginTop: '1rem', fontSize: '1.1rem', color: '#4a5568' }}>Busca productos por nombre, marca o código de barras</p>
        </div>
      )}
    </div>
  );
};

export default BusquedaPage;