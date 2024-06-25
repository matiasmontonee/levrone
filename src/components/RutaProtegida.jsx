import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const RutaProtegida = ({ children }) => {
  const { user } = useAuth();

  if (!user) { // Redirige al login si el usuario no está autenticado
    return <Navigate to="/login" />;
  }

  // Renderiza el componente hijo si el usuario está autenticado
  return children;
};

export default RutaProtegida;