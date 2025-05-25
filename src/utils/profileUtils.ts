
import { supabase } from '@/integrations/supabase/client';
import { UserProfileData } from '@/types/profile';
import { User } from '@supabase/supabase-js';

export const createProfileFromUser = (user: User, profileData?: any): UserProfileData => {
  return {
    id: user.id,
    name: profileData?.name || user.user_metadata?.name || '',
    email: user.email || '',
    phone: profileData?.phone || '',
    city: profileData?.city || '',
    country: profileData?.country || '',
    birth_date: profileData?.birth_date || '',
    user_type: profileData?.user_type || localStorage.getItem('userType') || 'customer',
    avatar_url: profileData?.avatar_url || ''
  };
};

export const fetchUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
      console.error('Error fetching profile:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error in fetchUserProfile:', error);
    return null;
  }
};
