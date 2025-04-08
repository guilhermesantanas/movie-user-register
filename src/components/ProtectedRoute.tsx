
import { Navigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectPath?: string;
}

const ProtectedRoute = ({ 
  children, 
  redirectPath = '/login' 
}: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  
  useEffect(() => {
    // Only show toast when redirecting from a non-login page
    if (!isLoading && !user && location.pathname !== '/login') {
      toast.error('Você precisa estar logado para acessar esta página');
    }
  }, [user, isLoading, location.pathname]);
  
  // Show loading while checking auth status
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={redirectPath} replace state={{ from: location }} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
