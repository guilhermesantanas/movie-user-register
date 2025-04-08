
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { toast } from 'sonner';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: any | null;
  isLoading: boolean;
  isAdmin: boolean;
  signIn: (identifier: string, password: string, rememberMe: boolean) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Initialize auth state
  useEffect(() => {
    // Set up auth state change listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        if (event === 'SIGNED_OUT') {
          setProfile(null);
          setIsAdmin(false);
          localStorage.removeItem('rememberMe');
          localStorage.removeItem('lastActivityTime');
          localStorage.removeItem('isLoggedIn');
          localStorage.removeItem('username');
          localStorage.removeItem('userType');
        } else if (event === 'SIGNED_IN' && newSession) {
          // Set basic localStorage values
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('username', 
            newSession.user.user_metadata?.name || 
            newSession.user.email || 
            '');
          
          // Delay Supabase calls with setTimeout to avoid deadlocks
          setTimeout(async () => {
            try {
              const { data } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', newSession.user.id)
                .single();
              
              setProfile(data);
              
              if (data?.user_type === 'admin' || 
                  newSession.user.email === 'admin@example.com') {
                setIsAdmin(true);
                localStorage.setItem('userType', 'admin');
              } else {
                localStorage.setItem('userType', data?.user_type || 'customer');
              }
            } catch (error) {
              console.error('Error fetching user profile:', error);
            }
          }, 0);
        }
      }
    );
    
    // THEN check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        setSession(initialSession);
        setUser(initialSession?.user ?? null);
        
        if (initialSession?.user) {
          const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', initialSession.user.id)
            .single();
            
          setProfile(data);
          setIsAdmin(
            data?.user_type === 'admin' || 
            initialSession.user.email === 'admin@example.com'
          );
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeAuth();
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sign in function
  const signIn = async (identifier: string, password: string, rememberMe: boolean) => {
    try {
      // Special case for admin user
      if (identifier === 'admin' && password === 'admin123') {
        const adminEmail = 'admin@example.com';
        
        const { error } = await supabase.auth.signInWithPassword({
          email: adminEmail,
          password
        });
        
        if (error) throw error;
        toast.success('Login administrativo realizado com sucesso!');
        return;
      }
      
      // Determine if the identifier is an email or username
      const isEmail = identifier.includes('@');
      
      let authResponse;
      
      if (isEmail) {
        // Login with email
        authResponse = await supabase.auth.signInWithPassword({
          email: identifier,
          password
        });
      } else {
        // For username login, find the email associated with username
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('email')
          .eq('name', identifier)
          .single();
          
        if (profileError || !profileData?.email) {
          throw new Error('Usuário não encontrado');
        }
        
        // Login with the retrieved email
        authResponse = await supabase.auth.signInWithPassword({
          email: profileData.email,
          password
        });
      }
      
      const { error } = authResponse;
      if (error) throw error;
      
      // Set session persistence based on rememberMe
      localStorage.setItem('rememberMe', rememberMe ? 'true' : 'false');
      
      toast.success('Login realizado com sucesso!');
    } catch (error: any) {
      toast.error(error.message || 'Credenciais inválidas');
      throw error;
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

  const value = {
    session,
    user,
    profile,
    isLoading,
    isAdmin,
    signIn,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
