
import { useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export const useAuthSession = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth state change listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log("Auth state change:", event, newSession?.user?.email);
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        if (event === 'SIGNED_OUT') {
          localStorage.removeItem('rememberMe');
          localStorage.removeItem('lastActivityTime');
          localStorage.removeItem('isLoggedIn');
          localStorage.removeItem('username');
          localStorage.removeItem('userType');
        } else if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && newSession) {
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('username', 
            newSession.user.user_metadata?.name || 
            newSession.user.email || 
            '');
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
    isLoading
  };
};
