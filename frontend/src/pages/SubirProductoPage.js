// src/pages/SubirProductoPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { productosService, categoriasService } from '../services/api';
import { useIsMobile } from '../hooks/useMediaQuery';

const SubirProductoPage = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [enviando, setEnviando] = useState(false);
  const [imagenPreview, setImagenPreview] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState([]);
  const [form, setForm] = useState({
    nombre: '', marca: '', gramaje: '', sabor_variante: '',
    fabricante: '', codigo_barras: '', justificacion: '', imagen: null, tipo_kosher: '',
  });

  useEffect(() => {
    categoriasService.listar().then(res => setCategorias(res.data)).catch(() => {});
  }, []);

  const toggleCategoria = (id) => {
    setCategoriasSeleccionadas(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'imagen' && files[0]) {
      setForm(f => ({ ...f, imagen: files[0] }));
      setImagenPreview(URL.createObjectURL(files[0]));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombre || !form.marca || !form.justificacion) return toast.error('Nombre, marca y justificación son obligatorios');
    if (form.justificacion.length < 20) return toast.error('La justificación debe tener al menos 20 caracteres');
    if (!form.imagen) return toast.error('La imagen del producto es obligatoria');
    setEnviando(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v) formData.append(k, v); });
      const res = await productosService.crear(formData);
      if (categoriasSeleccionadas.length > 0) {
        await categoriasService.asignarAProducto(res.data.id, categoriasSeleccionadas).catch(() => {});
      }
      toast.success('¡Producto subido! Está pendiente de validación.');
      navigate('/mis-productos');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al subir el producto');
    } finally {
      setEnviando(false);
    }
  };

  const input = { width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.95rem', boxSizing: 'border-box', outline: 'none' };
  const label = { display: 'block', fontWeight: 600, color: '#2d3748', marginBottom: '6px', fontSize: '0.88rem' };
  const grupo = { marginBottom: '1.1rem' };

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: isMobile ? '1rem' : '2rem 1rem' }}>
      <h1 style={{ fontSize: isMobile ? '1.3rem' : '1.6rem', fontWeight: 700, color: '#1a365d', marginBottom: '4px' }}>📤 Subir producto</h1>
      <p style={{ color: '#718096', marginBottom: '1.25rem', fontSize: '0.9rem' }}>Añade un nuevo producto para que sea revisado por nuestros validadores</p>

      <div style={{ background: '#ebf8ff', border: '1px solid #bee3f8', borderRadius: '8px', padding: '10px 14px', marginBottom: '1.25rem', color: '#2b6cb0', fontSize: '0.85rem' }}>
        ℹ️ Tu producto aparecerá en el buscador una vez que un validador lo apruebe.
      </div>

      <div style={{ background: 'white', borderRadius: '12px', padding: isMobile ? '1.25rem' : '2rem', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
        <form onSubmit={handleSubmit}>
          <div style={grupo}>
            <label style={label}>Nombre del producto *</label>
            <input style={input} name="nombre" value={form.nombre} onChange={handleChange} placeholder="Ej: Galletas saladas" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '0.75rem' }}>
            <div style={grupo}>
              <label style={label}>Marca *</label>
              <input style={input} name="marca" value={form.marca} onChange={handleChange} placeholder="Ej: Gullón" />
            </div>
            <div style={grupo}>
              <label style={label}>Fabricante</label>
              <input style={input} name="fabricante" value={form.fabricante} onChange={handleChange} placeholder="Si es diferente a la marca" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '0.75rem' }}>
            <div style={grupo}>
              <label style={label}>Gramaje / Tamaño</label>
              <input style={input} name="gramaje" value={form.gramaje} onChange={handleChange} placeholder="Ej: 200g, 1L" />
            </div>
            <div style={grupo}>
              <label style={label}>Sabor / Variante</label>
              <input style={input} name="sabor_variante" value={form.sabor_variante} onChange={handleChange} placeholder="Ej: Original, Chocolate" />
            </div>
          </div>

          <div style={grupo}>
            <label style={label}>Código de barras</label>
            <input style={input} name="codigo_barras" value={form.codigo_barras} onChange={handleChange} placeholder="Escanea o escribe el código" />
          </div>

          {/* Tipo Kosher */}
          <div style={grupo}>
            <label style={label}>Tipo Kosher <span style={{ fontWeight: 400, color: '#718096' }}>(opcional)</span></label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px', marginTop: '6px' }}>
              {[{ v: 'pareve', l: '🔵 Páreve' }, { v: 'lacteo', l: '🟡 Lácteo' }, { v: 'carnico', l: '🔴 Cárnico' }, { v: 'pescado', l: '🐟 Pescado' }].map(t => (
                <button key={t.v} type="button"
                  style={{ padding: '9px', borderRadius: '8px', border: form.tipo_kosher === t.v ? '2px solid #2b6cb0' : '2px solid #e2e8f0', background: form.tipo_kosher === t.v ? '#ebf8ff' : 'white', color: form.tipo_kosher === t.v ? '#2b6cb0' : '#4a5568', cursor: 'pointer', fontWeight: form.tipo_kosher === t.v ? 700 : 400, fontSize: '0.875rem' }}
                  onClick={() => setForm(f => ({ ...f, tipo_kosher: f.tipo_kosher === t.v ? '' : t.v }))}>
                  {t.l}
                </button>
              ))}
            </div>
          </div>

          {/* Categorías */}
          {categorias.length > 0 && (
            <div style={grupo}>
              <label style={label}>Categorías <span style={{ fontWeight: 400, color: '#718096' }}>(opcional)</span></label>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '5px', marginTop: '6px', maxHeight: '280px', overflowY: 'auto', padding: '4px' }}>
                {categorias.map(cat => {
                  const sel = categoriasSeleccionadas.includes(cat.id);
                  return (
                    <button key={cat.id} type="button"
                      style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 10px', borderRadius: '8px', border: sel ? '2px solid #2b6cb0' : '2px solid #e2e8f0', background: sel ? '#ebf8ff' : 'white', cursor: 'pointer', fontSize: '0.82rem', fontWeight: sel ? 600 : 400, color: sel ? '#2b6cb0' : '#4a5568', textAlign: 'left' }}
                      onClick={() => toggleCategoria(cat.id)}>
                      <span>{cat.icono}</span> {cat.nombre}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div style={grupo}>
            <label style={label}>¿Por qué crees que es kosher? *</label>
            <textarea
              style={{ ...input, minHeight: '90px', resize: 'vertical' }}
              name="justificacion" value={form.justificacion} onChange={handleChange}
              placeholder="Ej: El producto lleva el sello OU en el envase. Ingredientes verificables sin derivados animales..." />
          </div>

          <div style={grupo}>
            <label style={label}>Foto del producto *</label>
            {imagenPreview ? (
              <div>
                <img src={imagenPreview} alt="preview" style={{ width: '100%', height: isMobile ? '180px' : '200px', objectFit: 'cover', borderRadius: '8px' }} />
                <button type="button" onClick={() => { setImagenPreview(null); setForm(f => ({ ...f, imagen: null })); }}
                  style={{ marginTop: '8px', background: 'none', border: 'none', color: '#e53e3e', cursor: 'pointer', fontSize: '0.9rem' }}>
                  🗑️ Cambiar imagen
                </button>
              </div>
            ) : (
              <label style={{ border: '2px dashed #e2e8f0', borderRadius: '8px', padding: '1.75rem', textAlign: 'center', cursor: 'pointer', color: '#718096', display: 'block' }}>
                <div style={{ fontSize: '2.5rem' }}>📷</div>
                <div style={{ marginTop: '8px', fontSize: '0.9rem' }}>Haz clic para seleccionar una foto</div>
                <div style={{ fontSize: '0.78rem', marginTop: '4px' }}>JPG, PNG o WEBP · Máximo 5MB</div>
                <input type="file" name="imagen" accept="image/*" onChange={handleChange} style={{ display: 'none' }} />
              </label>
            )}
          </div>

          <button type="submit" style={{ width: '100%', padding: '13px', background: '#2b6cb0', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem', fontWeight: 600 }} disabled={enviando}>
            {enviando ? '⏳ Subiendo...' : '📤 Subir producto'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubirProductoPage;