
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { UserProfileData } from '@/types/profile';

const useUserProfile = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [profile, setProfile] = useState<UserProfileData | null>(null);

  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Check if user is authenticated
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          toast.error('Você precisa estar logado para acessar esta página');
          navigate('/login');
          return;
        }

        // Get current user data
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          throw new Error("Usuário não encontrado");
        }
        
        // Try to get user profile from profiles table
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
          user_type: profileData?.user_type || localStorage.getItem('userType') || 'customer'
        });
        
      } catch (error) {
        console.error('Erro ao carregar perfil:', error);
        toast.error('Falha ao carregar informações do perfil');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  return { profile, setProfile, isLoading };
};

export default useUserProfile;
