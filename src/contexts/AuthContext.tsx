
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
  signUp: (email: string, password: string, userData: any) => Promise<{ error: any | null; data: any | null }>;
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
        console.log("Auth state change:", event, newSession?.user?.email);
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
        } else if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && newSession) {
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
                .maybeSingle();
              
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
        console.log("Initializing auth, getting session...");
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        console.log("Initial session:", initialSession?.user?.email);
        setSession(initialSession);
        setUser(initialSession?.user ?? null);
        
        if (initialSession?.user) {
          const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', initialSession.user.id)
            .maybeSingle();
            
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
      console.log("Starting sign in process for:", identifier);
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
          throw new Error('Email not found for username');
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

  const value = {
    session,
    user,
    profile,
    isLoading,
    isAdmin,
    signIn,
    signUp,
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
