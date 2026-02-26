// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
});

// Adjuntar token automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Manejar errores globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const productosService = {
  buscar: (params) => api.get('/productos', { params }),
  obtener: (id) => api.get(`/productos/${id}`),
  crear: (formData) => api.post('/productos', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  pendientes: () => api.get('/productos/pendientes'),
  misProductos: () => api.get('/productos/mis-productos'),
  retirar: (id) => api.delete(`/productos/${id}`),
};

export const validacionesService = {
  validar: (id, datos) => api.post(`/validaciones/producto/${id}`, datos),
  revalidar: (id, datos) => api.post(`/validaciones/producto/${id}/revalidar`, datos),
  paraRevalidar: () => api.get('/validaciones/para-revalidar'),
  misValidaciones: (params) => api.get('/validaciones/mis-validaciones', { params }),
};

export const feedbackService = {
  agregar: (productoId, datos) => api.post(`/feedback/producto/${productoId}`, datos),
  agregarInfo: (productoId, datos) => api.post(`/feedback/producto/${productoId}/info-intermedia`, datos),
  verificar: (id) => api.put(`/feedback/${id}/verificar`),
};

export const usuariosService = {
  listar: (params) => api.get('/usuarios', { params }),
  actualizar: (id, datos) => api.put(`/usuarios/${id}`, datos),
  actualizarPerfil: (datos) => api.put('/usuarios/perfil', datos),
  estadisticas: () => api.get('/usuarios/admin/estadisticas'),
  suscripcion: (tipo) => api.put('/reportes/suscripcion', { tipo }),
};

export const categoriasService = {
  listar: () => api.get('/categorias'),
  listarAdmin: () => api.get('/categorias/admin'),
  crear: (datos) => api.post('/categorias', datos),
  actualizar: (id, datos) => api.put(`/categorias/${id}`, datos),
  eliminar: (id) => api.delete(`/categorias/${id}`),
  asignarAProducto: (productoId, categoria_ids) => api.put(`/categorias/producto/${productoId}`, { categoria_ids }),
};

export default api;
