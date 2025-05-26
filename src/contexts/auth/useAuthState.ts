
import { useAuthSession } from './useAuthSession';
import { useUserProfile } from './useUserProfile';

export const useAuthState = () => {
  const { session, user, isLoading } = useAuthSession();
  const { profile, isAdmin, isModerator } = useUserProfile(user);

  return {
    session,
    user,
    profile,
    isLoading,
    isAdmin,
    isModerator
  };
};
