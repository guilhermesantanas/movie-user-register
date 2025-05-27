
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { UserProfileData } from '@/types/profile';
import { handleApiError } from '@/utils/errorHandling';

export const useProfileManagement = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const updateProfile = async (userId: string, profileData: Partial<UserProfileData>) => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: profileData.name,
          phone: profileData.phone,
          city: profileData.city,
          country: profileData.country,
          birth_date: profileData.birthDate
        })
        .eq('id', userId);

      if (error) throw error;

      toast.success('Profile updated successfully');
      return { success: true };
    } catch (error) {
      handleApiError(error, 'Failed to update profile');
      return { success: false };
    } finally {
      setIsUpdating(false);
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    setIsChangingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast.success('Password changed successfully');
      return { success: true };
    } catch (error) {
      handleApiError(error, 'Failed to change password');
      return { success: false };
    } finally {
      setIsChangingPassword(false);
    }
  };

  const uploadAvatar = async (userId: string, file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', userId);

      if (updateError) throw updateError;

      toast.success('Avatar updated successfully');
      return { success: true, avatarUrl: publicUrl };
    } catch (error) {
      handleApiError(error, 'Failed to upload avatar');
      return { success: false };
    }
  };

  return {
    updateProfile,
    changePassword,
    uploadAvatar,
    isUpdating,
    isChangingPassword
  };
};
