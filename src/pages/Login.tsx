
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut } from 'lucide-react';

import PageTransition from '@/components/PageTransition';
import AppHeader from '@/components/AppHeader';
import Button from '@/components/Button';
import { useAuth } from '@/contexts/auth';

import LoginForm from '@/components/login/LoginForm';
import LoggedInState from '@/components/login/LoggedInState';
import { toast } from 'sonner';

const Login = () => {
  const navigate = useNavigate();
  const { user, isLoading, profile, signOut, signIn } = useAuth();
  
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(() => {
    // Initialize from localStorage if available
    return localStorage.getItem('rememberMe') === 'true';
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [username, setUsername] = useState('');

  // Set username from profile when available
  useEffect(() => {
    if (user) {
      setUsername(
        profile?.name || 
        user.user_metadata?.name || 
        user.email || 
        'Usuário'
      );
    }
  }, [user, profile]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (!identifier.trim()) {
      toast.error('Por favor, insira seu email ou nome de usuário');
      setIsSubmitting(false);
      return;
    }

    if (!password) {
      toast.error('Por favor, insira sua senha');
      setIsSubmitting(false);
      return;
    }
    
    try {
      await signIn(identifier, password, rememberMe);
      navigate('/movies');
    } catch (error) {
      console.error('Login error:', error);
      // Toast is already shown in signIn function
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleProfileClick = () => navigate('/profile');
  
  const handleLogoutClick = async () => {
    try {
      await signOut();
      // Stay on login page after logout
      toast.success('Logout realizado com sucesso');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Erro ao fazer logout');
    }
  };
  
  return (
    <PageTransition>
      <div className="min-h-screen py-12 px-6 flex items-center justify-center">
        <div className="w-full max-w-md">
          {/* Only show the logout button if user is NOT logged in - this was the error! 
              The button was showing the opposite of what it should */}
          {!user && !isLoading && (
            <Button 
              variant="outline" 
              className="mb-6" 
              onClick={() => navigate('/')}
              icon={<LogOut size={16} />}
            >
              Voltar
            </Button>
          )}
          
          <AppHeader 
            title="Cinema Management" 
            subtitle="login"
          />
          
          <motion.div 
            className="card p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {isLoading ? (
              <div className="flex justify-center py-6">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : user ? (
              <LoggedInState 
                username={username}
                onProfileClick={handleProfileClick}
                onLogout={handleLogoutClick}
              />
            ) : (
              <LoginForm
                identifier={identifier}
                setIdentifier={setIdentifier}
                password={password}
                setPassword={setPassword}
                rememberMe={rememberMe}
                setRememberMe={setRememberMe}
                isSubmitting={isSubmitting}
                onSubmit={handleLogin}
              />
            )}
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Login;
