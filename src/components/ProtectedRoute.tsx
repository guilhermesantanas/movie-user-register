
import { Navigate } from 'react-router-dom';
import { toast } from 'sonner';
import React, { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectPath?: string;
}

const ProtectedRoute = ({ 
  children, 
  redirectPath = '/login' 
}: ProtectedRouteProps) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  
  useEffect(() => {
    if (!isLoggedIn) {
      toast.error('Você precisa estar logado para acessar esta página');
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
