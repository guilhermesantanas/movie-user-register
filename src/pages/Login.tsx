
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Lock, LogIn } from 'lucide-react';
import { toast } from 'sonner';

import PageTransition from '@/components/PageTransition';
import AppHeader from '@/components/AppHeader';
import InputField from '@/components/InputField';
import Button from '@/components/Button';

// Admin credentials
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simple login validation
    setTimeout(() => {
      // First check if it's the admin
      if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        // Store login state in localStorage
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', username);
        localStorage.setItem('userType', 'admin');
        
        toast.success('Login realizado com sucesso como Administrador!');
        navigate('/movies');
        setIsSubmitting(false);
        return;
      }
      
      // If not admin, check registered users
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find((u: any) => 
        (u.name === username || u.email === username) && u.password === password
      );
      
      if (user) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', user.name);
        localStorage.setItem('userType', user.userType);
        
        toast.success('Login realizado com sucesso!');
        navigate('/movies');
      } else {
        toast.error('Credenciais inválidas');
      }
      
      setIsSubmitting(false);
    }, 1000);
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
            <form onSubmit={handleSubmit}>
              <InputField
                label="Usuário ou Email"
                id="username"
                name="username"
                placeholder="Digite seu usuário ou email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
                
                <p className="text-center text-sm text-muted-foreground mt-2">
                  Credenciais de admin: admin / admin123
                </p>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Login;
