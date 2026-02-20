// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

import Layout from './components/layout/Layout';
import BusquedaPage from './pages/BusquedaPage';
import ProductoDetallePage from './pages/ProductoDetallePage';
import SubirProductoPage from './pages/SubirProductoPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PanelValidadorPage from './pages/PanelValidadorPage';
import PanelAdminPage from './pages/PanelAdminPage';
import MisProductosPage from './pages/MisProductosPage';
import PerfilPage from './pages/PerfilPage';

const RutaProtegida = ({ children, roles }) => {
  const { usuario, cargando } = useAuth();
  if (cargando) return <div className="flex justify-center items-center h-screen"><div className="spinner" /></div>;
  if (!usuario) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(usuario.rol)) return <Navigate to="/" replace />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<BusquedaPage />} />
            <Route path="producto/:id" element={<ProductoDetallePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="subir-producto" element={
              <RutaProtegida roles={['regular', 'administrador']}>
                <SubirProductoPage />
              </RutaProtegida>
            } />
            <Route path="mis-productos" element={
              <RutaProtegida><MisProductosPage /></RutaProtegida>
            } />
            <Route path="perfil" element={
              <RutaProtegida><PerfilPage /></RutaProtegida>
            } />
            <Route path="panel-validador" element={
              <RutaProtegida roles={['validador', 'administrador', 'intermedio']}>
                <PanelValidadorPage />
              </RutaProtegida>
            } />
            <Route path="panel-admin" element={
              <RutaProtegida roles={['administrador']}>
                <PanelAdminPage />
              </RutaProtegida>
            } />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
