// src/pages/SubirProductoPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { productosService, categoriasService } from '../services/api';

const S = {
  page: { maxWidth: '700px', margin: '0 auto', padding: '2rem 1rem' },
  titulo: { fontSize: '1.75rem', fontWeight: 700, color: '#1a365d', marginBottom: '0.5rem' },
  subtitulo: { color: '#718096', marginBottom: '2rem' },
  card: { background: 'white', borderRadius: '12px', padding: '2rem', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' },
  grupo: { marginBottom: '1.25rem' },
  label: { display: 'block', fontWeight: 600, color: '#2d3748', marginBottom: '6px', fontSize: '0.9rem' },
  input: { width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.95rem', boxSizing: 'border-box', outline: 'none' },
  textarea: { width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.95rem', boxSizing: 'border-box', minHeight: '100px', resize: 'vertical', outline: 'none' },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
  btn: { width: '100%', padding: '12px', background: '#2b6cb0', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem', fontWeight: 600, marginTop: '0.5rem' },
  info: { background: '#ebf8ff', border: '1px solid #bee3f8', borderRadius: '8px', padding: '12px 16px', marginBottom: '1.5rem', color: '#2b6cb0', fontSize: '0.9rem' },
  imgPreview: { width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px', marginTop: '8px' },
  uploadArea: { border: '2px dashed #e2e8f0', borderRadius: '8px', padding: '2rem', textAlign: 'center', cursor: 'pointer', color: '#718096' },
  catGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px', marginTop: '6px' },
  catChip: (sel) => ({ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 10px', borderRadius: '8px', border: sel ? '2px solid #2b6cb0' : '2px solid #e2e8f0', background: sel ? '#ebf8ff' : 'white', cursor: 'pointer', fontSize: '0.82rem', fontWeight: sel ? 600 : 400, color: sel ? '#2b6cb0' : '#4a5568' }),
};

const SubirProductoPage = () => {
  const navigate = useNavigate();
  const [enviando, setEnviando] = useState(false);
  const [imagenPreview, setImagenPreview] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState([]);
  const [form, setForm] = useState({
    nombre: '', marca: '', gramaje: '', sabor_variante: '',
    fabricante: '', codigo_barras: '', justificacion: '', imagen: null,
  });

  useEffect(() => {
    categoriasService.listar().then(res => setCategorias(res.data)).catch(() => {});
  }, []);

  const toggleCategoria = (id) => {
    setCategoriasSeleccionadas(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
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
    if (!form.nombre || !form.marca || !form.justificacion) {
      return toast.error('Nombre, marca y justificación son obligatorios');
    }
    if (form.justificacion.length < 20) {
      return toast.error('La justificación debe tener al menos 20 caracteres');
    }
    if (!form.imagen) {
      return toast.error('La imagen del producto es obligatoria');
    }

    setEnviando(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v) formData.append(k, v); });
      const res = await productosService.crear(formData);
      const productoId = res.data.id;

      // Asignar categorías si se seleccionaron
      if (categoriasSeleccionadas.length > 0) {
        await categoriasService.asignarAProducto(productoId, categoriasSeleccionadas).catch(() => {});
      }

      toast.success('¡Producto subido correctamente! Está pendiente de validación.');
      navigate('/mis-productos');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al subir el producto');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div style={S.page}>
      <h1 style={S.titulo}>📤 Subir producto</h1>
      <p style={S.subtitulo}>Añade un nuevo producto para que sea revisado por nuestros validadores</p>

      <div style={S.info}>
        ℹ️ Tu producto aparecerá en el buscador una vez que un validador lo apruebe. Por favor, incluye toda la información disponible.
      </div>

      <div style={S.card}>
        <form onSubmit={handleSubmit}>
          <div style={S.grupo}>
            <label style={S.label}>Nombre del producto *</label>
            <input style={S.input} name="nombre" value={form.nombre} onChange={handleChange} placeholder="Ej: Galletas saladas" />
          </div>

          <div style={S.row}>
            <div style={S.grupo}>
              <label style={S.label}>Marca *</label>
              <input style={S.input} name="marca" value={form.marca} onChange={handleChange} placeholder="Ej: Gullón" />
            </div>
            <div style={S.grupo}>
              <label style={S.label}>Fabricante</label>
              <input style={S.input} name="fabricante" value={form.fabricante} onChange={handleChange} placeholder="Si es diferente a la marca" />
            </div>
          </div>

          <div style={S.row}>
            <div style={S.grupo}>
              <label style={S.label}>Gramaje / Tamaño</label>
              <input style={S.input} name="gramaje" value={form.gramaje} onChange={handleChange} placeholder="Ej: 200g, 1L" />
            </div>
            <div style={S.grupo}>
              <label style={S.label}>Sabor / Variante</label>
              <input style={S.input} name="sabor_variante" value={form.sabor_variante} onChange={handleChange} placeholder="Ej: Original, Chocolate" />
            </div>
          </div>

          <div style={S.grupo}>
            <label style={S.label}>Código de barras</label>
            <input style={S.input} name="codigo_barras" value={form.codigo_barras} onChange={handleChange} placeholder="Escanea o escribe el código" />
          </div>

          {/* Selector de categorías */}
          {categorias.length > 0 && (
            <div style={S.grupo}>
              <label style={S.label}>Categorías <span style={{fontWeight:400, color:'#718096'}}>(opcional, puedes elegir varias)</span></label>
              <div style={S.catGrid}>
                {categorias.map(cat => (
                  <button key={cat.id} type="button"
                    style={S.catChip(categoriasSeleccionadas.includes(cat.id))}
                    onClick={() => toggleCategoria(cat.id)}>
                    <span>{cat.icono}</span> {cat.nombre}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div style={S.grupo}>
            <label style={S.label}>¿Por qué crees que es kosher? *</label>
            <textarea style={S.textarea} name="justificacion" value={form.justificacion} onChange={handleChange}
              placeholder="Ej: El producto lleva el sello OU en el envase. Ingredientes verificables sin derivados animales..." />
          </div>

          <div style={S.grupo}>
            <label style={S.label}>Foto del producto *</label>
            {imagenPreview ? (
              <div>
                <img src={imagenPreview} alt="preview" style={S.imgPreview} />
                <button type="button" onClick={() => { setImagenPreview(null); setForm(f => ({...f, imagen: null})); }}
                  style={{marginTop:'8px', background:'none', border:'none', color:'#e53e3e', cursor:'pointer', fontSize:'0.9rem'}}>
                  🗑️ Cambiar imagen
                </button>
              </div>
            ) : (
              <label style={S.uploadArea}>
                <div style={{fontSize:'2.5rem'}}>📷</div>
                <div style={{marginTop:'8px'}}>Haz clic para seleccionar una foto</div>
                <div style={{fontSize:'0.8rem', marginTop:'4px'}}>JPG, PNG o WEBP · Máximo 5MB</div>
                <input type="file" name="imagen" accept="image/*" onChange={handleChange} style={{display:'none'}} />
              </label>
            )}
          </div>

          <button type="submit" style={S.btn} disabled={enviando}>
            {enviando ? '⏳ Subiendo...' : '📤 Subir producto'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubirProductoPage;
