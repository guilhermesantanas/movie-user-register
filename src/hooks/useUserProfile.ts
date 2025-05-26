
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { UserProfileData } from '@/types/profile';
import { useAuth } from '@/contexts/auth';
import { createProfileFromUser, fetchUserProfile } from '@/utils/profileUtils';

const useUserProfile = () => {
  const navigate = useNavigate();
  const { user, profile: authProfile } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [profile, setProfile] = useState<UserProfileData | null>(null);

  // Fetch user profile data
  useEffect(() => {
    const loadProfile = async () => {
      try {
        // Check if user is authenticated
        if (!user) {
          toast.error('You need to be logged in to access this page');
          navigate('/login');
          return;
        }

        // Use profile from auth context if available
        if (authProfile) {
          setProfile(createProfileFromUser(user, authProfile));
        } else {
          // Try to get user profile from profiles table
          const profileData = await fetchUserProfile(user.id);
          setProfile(createProfileFromUser(user, profileData));
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        toast.error('Failed to load profile information');
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [navigate, user, authProfile]);

  return { profile, setProfile, isLoading };
};

export default useUserProfile;
