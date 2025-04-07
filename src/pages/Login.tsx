
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

import PageTransition from '@/components/PageTransition';
import AppHeader from '@/components/AppHeader';
import Button from '@/components/Button';
import { supabase } from '@/integrations/supabase/client';

import LoginForm from '@/components/login/LoginForm';
import LoggedInState from '@/components/login/LoggedInState';
import { useAuth } from '@/hooks/useAuth';

const Login = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  
  const { 
    identifier, 
    setIdentifier, 
    password, 
    setPassword, 
    rememberMe, 
    setRememberMe, 
    isSubmitting, 
    handleLogin, 
    handleLogout 
  } = useAuth();
  
  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsLoggedIn(true);
        const { data: { user: userData } } = await supabase.auth.getUser();
        setUsername(userData?.user_metadata?.name || userData?.email || 'Usuário');
      }
    };
    
    checkSession();
  }, []);
  
  return (
    <PageTransition>
      <div className="min-h-screen py-12 px-6 flex items-center justify-center">
        <div className="w-full max-w-md">
          <Button 
            variant="outline" 
            className="mb-6" 
            onClick={() => navigate('/')}
            icon={<ArrowLeft size={16} />}
          >
            Voltar para Início
          </Button>
          
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
            {isLoggedIn ? (
              <LoggedInState 
                username={username}
                onProfileClick={() => navigate('/profile')}
                onLogout={handleLogout}
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
