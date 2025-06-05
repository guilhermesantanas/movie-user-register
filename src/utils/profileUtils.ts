
import { supabase } from '@/integrations/supabase/client';
import { UserProfileData } from '@/types/profile';
import { User } from '@supabase/supabase-js';
import { getLanguageFromCountry } from './languageUtils';

export const createProfileFromUser = (user: User, profileData?: any): UserProfileData => {
  // Auto-detect language from country if not explicitly set
  const detectedLanguage = profileData?.country 
    ? getLanguageFromCountry(profileData.country)
    : 'en';

  return {
    id: user.id,
    name: profileData?.name || user.user_metadata?.name || '',
    email: user.email || '',
    phone: profileData?.phone || '',
    city: profileData?.city || '',
    country: profileData?.country || '',
    birth_date: profileData?.birth_date || '',
    user_type: profileData?.user_type || localStorage.getItem('userType') || 'customer',
    avatar_url: profileData?.avatar_url || '',
    language: profileData?.language || detectedLanguage
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

/**
 * Updates user profile and auto-detects language from country if language is not set
 */
export const updateUserProfile = async (userId: string, updates: Partial<UserProfileData>) => {
  // If country is being updated but language isn't, auto-detect language
  if (updates.country && !updates.language) {
    updates.language = getLanguageFromCountry(updates.country);
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};
