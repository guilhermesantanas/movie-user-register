
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const useAuth = () => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Special case for admin user
      if (identifier === 'admin' && password === 'admin123') {
        // Use hardcoded admin email or create a session directly
        const adminEmail = 'admin@example.com'; // Use whatever email is associated with admin
        
        const authResponse = await supabase.auth.signInWithPassword({
          email: adminEmail,
          password
        });
        
        const { error } = authResponse;
        if (error) throw error;
        
        toast.success('Login administrativo realizado com sucesso!');
        navigate('/movies');
        return;
      }
      
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
      navigate('/login');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao fazer logout');
    }
  };

  return {
    identifier,
    setIdentifier,
    password,
    setPassword,
    rememberMe,
    setRememberMe,
    isSubmitting,
    handleLogin,
    handleLogout
  };
};
