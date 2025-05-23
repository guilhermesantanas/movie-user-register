
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { ensureAdminProfile } from './authUtils';

export const useAuthActions = () => {
  // Sign in function
  const signIn = async (identifier: string, password: string, rememberMe: boolean) => {
    try {
      console.log("Starting sign in process for:", identifier);
      
      // Handle admin login specifically
      if (identifier.toLowerCase() === 'admin' && password === 'admin123') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: 'admin@example.com',
          password: 'admin123'
        });
        
        if (error) throw error;
        
        // Create profile for admin if it doesn't exist
        await ensureAdminProfile(data.user);
        
        toast.success('Login administrativo realizado com sucesso!');
        localStorage.setItem('rememberMe', rememberMe ? 'true' : 'false');
        return;
      }
      
      // Determine if the identifier is an email or username
      const isEmail = identifier.includes('@');
      
      let authResponse;
      
      if (isEmail) {
        // Login with email
        console.log("Logging in with email");
        authResponse = await supabase.auth.signInWithPassword({
          email: identifier,
          password
        });
      } else {
        // For username login, find the email associated with username
        console.log("Looking up email for username:", identifier);
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('email')
          .eq('name', identifier)
          .maybeSingle();
          
        if (profileError) {
          console.error("Profile lookup error:", profileError);
          throw new Error('Usuário não encontrado');
        }
        
        if (!profileData?.email) {
          throw new Error('Email não encontrado para este nome de usuário');
        }
        
        console.log("Found email for username:", profileData.email);
        // Login with the retrieved email
        authResponse = await supabase.auth.signInWithPassword({
          email: profileData.email,
          password
        });
      }
      
      const { error, data } = authResponse;
      if (error) {
        console.error("Auth error:", error);
        throw error;
      }
      
      console.log("Login successful, user:", data.user?.email);
      // Set session persistence based on rememberMe
      localStorage.setItem('rememberMe', rememberMe ? 'true' : 'false');
      
      toast.success('Login realizado com sucesso!');
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || 'Credenciais inválidas');
      throw error;
    }
  };

  // Sign up function
  const signUp = async (email: string, password: string, userData: any) => {
    try {
      console.log("Starting signup process for:", email);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });
      
      if (error) {
        console.error("Signup error:", error);
        throw error;
      }
      
      return { data, error: null };
    } catch (error: any) {
      console.error("Error in signUp function:", error);
      toast.error(error.message || 'Erro ao registrar usuário');
      return { data: null, error };
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Logout realizado com sucesso!');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao fazer logout');
      throw error;
    }
  };
  
  return {
    signIn,
    signUp,
    signOut
  };
};
