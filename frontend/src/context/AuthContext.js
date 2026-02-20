// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.get('/auth/perfil')
        .then(res => setUsuario(res.data.usuario))
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setCargando(false));
    } else {
      setCargando(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    setUsuario(res.data.usuario);
    return res.data;
  };

  const register = async (datos) => {
    const res = await api.post('/auth/register', datos);
    localStorage.setItem('token', res.data.token);
    setUsuario(res.data.usuario);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, cargando, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
