
import { useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Profile, UserType } from './types';

export const useAuthState = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isModerator, setIsModerator] = useState(false);

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
          setIsModerator(false);
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
              
              if (data) {
                const userType = data.user_type as UserType || 'user';
                
                setProfile({
                  id: data.id,
                  name: data.name,
                  email: data.email,
                  phone: data.phone,
                  city: data.city,
                  country: data.country,
                  birth_date: data.birth_date,
                  user_type: userType,
                  avatar_url: data.avatar_url
                });
                
                setIsAdmin(userType === 'admin' || newSession.user.email === 'admin@example.com');
                setIsModerator(userType === 'moderator' || userType === 'admin');
                localStorage.setItem('userType', userType);
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
            
          if (data) {
            const userType = data.user_type as UserType || 'user';
            
            setProfile({
              id: data.id,
              name: data.name,
              email: data.email,
              phone: data.phone,
              city: data.city,
              country: data.country,
              birth_date: data.birth_date,
              user_type: userType,
              avatar_url: data.avatar_url
            });
            
            setIsAdmin(userType === 'admin' || initialSession.user.email === 'admin@example.com');
            setIsModerator(userType === 'moderator' || userType === 'admin');
            localStorage.setItem('userType', userType);
          }
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
  
  return {
    session,
    user,
    profile,
    isLoading,
    isAdmin,
    isModerator
  };
};

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

  // Helper function to ensure admin profile exists
  const ensureAdminProfile = async (user: User) => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
        
      if (!data) {
        // Create admin profile if it doesn't exist
        await supabase
          .from('profiles')
          .insert({
            id: user.id,
            name: 'Admin',
            email: user.email,
            user_type: 'admin'
          });
      } else if (data.user_type !== 'admin') {
        // Update user_type to admin if it's not already
        await supabase
          .from('profiles')
          .update({ user_type: 'admin' })
          .eq('id', user.id);
      }
    } catch (error) {
      console.error("Error ensuring admin profile:", error);
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
