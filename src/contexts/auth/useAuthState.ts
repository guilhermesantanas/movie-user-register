
import { useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
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
