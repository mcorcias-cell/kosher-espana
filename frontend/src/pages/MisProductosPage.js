// src/pages/MisProductosPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { productosService } from '../services/api';

const ESTADO_BADGE = {
  pendiente: { texto: 'Pendiente', bg: '#fefcbf', color: '#d69e2e' },
  validado: { texto: 'Validado ✓', bg: '#c6f6d5', color: '#276749' },
  rechazado: { texto: 'Rechazado', bg: '#fed7d7', color: '#c53030' },
  retirado: { texto: 'Retirado', bg: '#e2e8f0', color: '#718096' },
};

const MisProductosPage = () => {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    productosService.misProductos()
      .then(res => setProductos(res.data))
      .catch(() => toast.error('Error cargando tus productos'))
      .finally(() => setCargando(false));
  }, []);

  const retirar = async (id) => {
    if (!window.confirm('¿Seguro que quieres retirar este producto?')) return;
    try {
      await productosService.retirar(id);
      toast.success('Producto retirado');
      setProductos(p => p.filter(x => x.id !== id));
    } catch {
      toast.error('Error al retirar el producto');
    }
  };

  const s = {
    page: { maxWidth: '900px', margin: '0 auto', padding: '2rem 1rem' },
    titulo: { fontSize: '1.75rem', fontWeight: 700, color: '#1a365d', marginBottom: '2rem' },
    card: { background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.25rem', marginBottom: '0.75rem', display: 'flex', gap: '1rem', alignItems: 'center' },
    img: { width: '70px', height: '70px', objectFit: 'cover', borderRadius: '8px', background: '#f7fafc', flexShrink: 0 },
    info: { flex: 1 },
    badge: (estado) => ({ display: 'inline-block', padding: '2px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, background: ESTADO_BADGE[estado]?.bg, color: ESTADO_BADGE[estado]?.color }),
    btn: (color) => ({ padding: '6px 14px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, background: color, color: 'white' }),
  };

  if (cargando) return <div style={{ textAlign: 'center', padding: '4rem', color: '#718096' }}>Cargando...</div>;

  return (
    <div style={s.page}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={s.titulo}>Mis productos</h1>
        <button onClick={() => navigate('/subir-producto')} style={{ ...s.btn('#2b6cb0'), fontSize: '0.9rem', padding: '10px 20px' }}>
          + Subir producto
        </button>
      </div>

      {productos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#718096' }}>
          <div style={{ fontSize: '3rem' }}>📦</div>
          <p>Aún no has subido ningún producto.</p>
          <button onClick={() => navigate('/subir-producto')} style={{ ...s.btn('#2b6cb0'), marginTop: '1rem', padding: '10px 20px', fontSize: '0.9rem' }}>
            Subir mi primer producto
          </button>
        </div>
      ) : productos.map(p => (
        <div key={p.id} style={s.card}>
          <div style={{ ...s.img, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {p.imagen_url ? <img src={p.imagen_url} alt="" style={s.img} /> : <span style={{ fontSize: '2rem' }}>📦</span>}
          </div>
          <div style={s.info}>
            <div style={{ fontWeight: 600, color: '#1a365d' }}>{p.nombre}</div>
            <div style={{ color: '#718096', fontSize: '0.85rem' }}>{p.marca}</div>
            <div style={{ marginTop: '6px' }}>
              <span style={s.badge(p.estado)}>{ESTADO_BADGE[p.estado]?.texto || p.estado}</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#a0aec0', marginTop: '4px' }}>
              Subido el {new Date(p.created_at).toLocaleDateString('es-ES')}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
            {p.estado === 'validado' && (
              <button onClick={() => navigate(`/producto/${p.id}`)} style={s.btn('#38a169')}>Ver</button>
            )}
            {p.estado === 'pendiente' && (
              <button onClick={() => retirar(p.id)} style={s.btn('#718096')}>Retirar</button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MisProductosPage;
