
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Profile, UserType } from './types';

export const useUserProfile = (user: User | null) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isModerator, setIsModerator] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) {
        setProfile(null);
        setIsAdmin(false);
        setIsModerator(false);
        return;
      }

      try {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
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
          
          setIsAdmin(userType === 'admin' || user.email === 'admin@example.com');
          setIsModerator(userType === 'moderator' || userType === 'admin');
          localStorage.setItem('userType', userType);
        } else {
          // Reset states when no profile data
          setProfile(null);
          setIsAdmin(false);
          setIsModerator(false);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        // Reset states on error
        setProfile(null);
        setIsAdmin(false);
        setIsModerator(false);
      }
    };

    fetchUserProfile();
  }, [user?.id, user?.email]); // Only depend on user id and email to prevent unnecessary re-renders
  
  return {
    profile,
    isAdmin,
    isModerator
  };
};
