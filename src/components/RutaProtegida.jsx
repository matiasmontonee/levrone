import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const RutaProtegida = ({ element: Element }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) { // Si el usuario no está autenticado, redirigir a la página de inicio de sesión
    return <Navigate to="/login" />;
  }

  return <Element />;
};

export default RutaProtegida;