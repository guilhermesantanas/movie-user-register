
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Lock, LogIn } from 'lucide-react';
import { toast } from 'sonner';

import PageTransition from '@/components/PageTransition';
import AppHeader from '@/components/AppHeader';
import InputField from '@/components/InputField';
import Button from '@/components/Button';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';

const Login = () => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState(''); // Changed from email to identifier
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  
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
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Determine if the identifier is an email (contains @) or username
      const isEmail = identifier.includes('@');
      
      let authResponse;
      
      if (isEmail) {
        // Login with email
        authResponse = await supabase.auth.signInWithPassword({
          email: identifier,
          password
        });
      } else {
        // For username login, we need a different approach since Supabase doesn't directly support username auth
        // First, query the profiles table to find the email associated with the username
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('email')
          .eq('name', identifier)
          .single();
          
        if (profileError || !profileData?.email) {
          throw new Error('Usuário não encontrado');
        }
        
        // Now login with the retrieved email
        authResponse = await supabase.auth.signInWithPassword({
          email: profileData.email,
          password
        });
      }
      
      const { error } = authResponse;
      if (error) throw error;
      
      // Set session persistence based on rememberMe
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.setItem('rememberMe', 'false');
      }
      
      toast.success('Login realizado com sucesso!');
      navigate('/movies');
    } catch (error: any) {
      toast.error(error.message || 'Credenciais inválidas');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('rememberMe');
      toast.success('Logout realizado com sucesso!');
      setIsLoggedIn(false);
      navigate('/login');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao fazer logout');
    }
  };
  
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
              <div className="text-center">
                <p className="mb-4">Você já está logado como {username}</p>
                <div className="flex flex-col gap-3">
                  <Button onClick={() => navigate('/profile')}>
                    Ir para Meu Perfil
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleLogout}
                  >
                    Sair da conta
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <InputField
                  label="Email ou Nome de Usuário"
                  id="identifier"
                  name="identifier"
                  type="text"
                  placeholder="Digite seu email ou nome de usuário"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                  icon={<User size={18} />}
                />
                
                <InputField
                  label="Senha"
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  icon={<Lock size={18} />}
                />
                
                <div className="flex items-center space-x-2 mt-4">
                  <Checkbox 
                    id="rememberMe" 
                    checked={rememberMe} 
                    onCheckedChange={(checked) => setRememberMe(checked === true)}
                  />
                  <label 
                    htmlFor="rememberMe" 
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Manter-me conectado
                  </label>
                </div>
                
                <div className="mt-6">
                  <Button 
                    type="submit" 
                    className="w-full" 
                    isLoading={isSubmitting}
                    icon={<LogIn size={18} />}
                  >
                    Entrar
                  </Button>
                  
                  <p className="text-center text-sm text-muted-foreground mt-4">
                    Não tem uma conta? <a href="/register-user" className="text-primary hover:underline">Registre-se aqui</a>
                  </p>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Login;
