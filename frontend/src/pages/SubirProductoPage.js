// src/pages/SubirProductoPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { productosService } from '../services/api';

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
};

const SubirProductoPage = () => {
  const navigate = useNavigate();
  const [enviando, setEnviando] = useState(false);
  const [imagenPreview, setImagenPreview] = useState(null);
  const [form, setForm] = useState({
    nombre: '', marca: '', gramaje: '', sabor_variante: '',
    fabricante: '', codigo_barras: '', justificacion: '', imagen: null,
  });

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
      Object.entries(form).forEach(([k, v]) => { if (v) formData.append(k === 'imagen' ? 'imagen' : k, v); });

      await productosService.crear(formData);
      toast.success('¡Producto enviado! Estará visible una vez que un validador lo apruebe.');
      navigate('/mis-productos');
    } catch (err) {
      const msg = err.response?.data?.error || 'Error al enviar el producto';
      toast.error(msg);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div style={S.page}>
      <h1 style={S.titulo}>Subir nuevo producto</h1>
      <p style={S.subtitulo}>Envía un producto para que sea validado por nuestros expertos</p>

      <div style={S.info}>
        ℹ️ El producto no será visible para otros usuarios hasta que un validador lo revise y apruebe.
      </div>

      <div style={S.card}>
        <form onSubmit={handleSubmit}>
          <div style={S.row}>
            <div style={S.grupo}>
              <label style={S.label}>Nombre del producto *</label>
              <input style={S.input} name="nombre" value={form.nombre} onChange={handleChange} placeholder="Ej: Galletas integrales" />
            </div>
            <div style={S.grupo}>
              <label style={S.label}>Marca *</label>
              <input style={S.input} name="marca" value={form.marca} onChange={handleChange} placeholder="Ej: Hacendado" />
            </div>
          </div>

          <div style={S.row}>
            <div style={S.grupo}>
              <label style={S.label}>Gramaje / Cantidad</label>
              <input style={S.input} name="gramaje" value={form.gramaje} onChange={handleChange} placeholder="Ej: 200g" />
            </div>
            <div style={S.grupo}>
              <label style={S.label}>Sabor / Variante</label>
              <input style={S.input} name="sabor_variante" value={form.sabor_variante} onChange={handleChange} placeholder="Ej: Original, Sin sal..." />
            </div>
          </div>

          <div style={S.row}>
            <div style={S.grupo}>
              <label style={S.label}>Fabricante</label>
              <input style={S.input} name="fabricante" value={form.fabricante} onChange={handleChange} placeholder="Nombre del fabricante" />
            </div>
            <div style={S.grupo}>
              <label style={S.label}>Código de barras</label>
              <input style={S.input} name="codigo_barras" value={form.codigo_barras} onChange={handleChange} placeholder="EAN / UPC" />
            </div>
          </div>

          <div style={S.grupo}>
            <label style={S.label}>Imagen del producto *</label>
            <label style={S.uploadArea}>
              {imagenPreview ? (
                <img src={imagenPreview} alt="preview" style={S.imgPreview} />
              ) : (
                <div>
                  <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📷</div>
                  <div>Haz clic para subir una imagen</div>
                  <div style={{ fontSize: '0.8rem', marginTop: '4px' }}>JPG, PNG o WEBP · Máx 5MB</div>
                </div>
              )}
              <input type="file" name="imagen" accept="image/*" onChange={handleChange} style={{ display: 'none' }} />
            </label>
          </div>

          <div style={S.grupo}>
            <label style={S.label}>¿Por qué crees que es kosher? *</label>
            <textarea
              style={S.textarea}
              name="justificacion"
              value={form.justificacion}
              onChange={handleChange}
              placeholder="Explica por qué crees que este producto es kosher: ingredientes que no tienen prohibidos, símbolo kosher en el envase, etc."
            />
            <div style={{ fontSize: '0.8rem', color: '#a0aec0', marginTop: '4px' }}>{form.justificacion.length} caracteres (mínimo 20)</div>
          </div>

          <button type="submit" style={{ ...S.btn, opacity: enviando ? 0.7 : 1 }} disabled={enviando}>
            {enviando ? '⏳ Enviando...' : '📤 Enviar producto para validación'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubirProductoPage;
