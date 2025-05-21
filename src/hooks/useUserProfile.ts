
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { UserProfileData } from '@/types/profile';
import { useAuth } from '@/contexts/auth';

const useUserProfile = () => {
  const navigate = useNavigate();
  const { user, profile: authProfile } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [profile, setProfile] = useState<UserProfileData | null>(null);

  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Check if user is authenticated
        if (!user) {
          toast.error('Você precisa estar logado para acessar esta página');
          navigate('/login');
          return;
        }

        // Use profile from auth context if available
        if (authProfile) {
          setProfile({
            id: user.id,
            name: authProfile.name || user.user_metadata?.name || '',
            email: user.email || '',
            phone: authProfile.phone || '',
            city: authProfile.city || '',
            country: authProfile.country || '',
            birth_date: authProfile.birth_date || '',
            user_type: authProfile.user_type || localStorage.getItem('userType') || 'customer',
            avatar_url: authProfile.avatar_url || ''
          });
        } else {
          // Try to get user profile from profiles table if not in auth context
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          
          if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
            console.error('Error fetching profile:', error);
          }
          
          // Use profile data from DB or create a new profile object from auth user
          setProfile({
            id: user.id,
            name: profileData?.name || user.user_metadata?.name || '',
            email: user.email || '',
            phone: profileData?.phone || '',
            city: profileData?.city || '',
            country: profileData?.country || '',
            birth_date: profileData?.birth_date || '',
            user_type: profileData?.user_type || localStorage.getItem('userType') || 'customer',
            avatar_url: profileData?.avatar_url || ''
          });
        }
      } catch (error) {
        console.error('Erro ao carregar perfil:', error);
        toast.error('Falha ao carregar informações do perfil');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [navigate, user, authProfile]);

  return { profile, setProfile, isLoading };
};

export default useUserProfile;
