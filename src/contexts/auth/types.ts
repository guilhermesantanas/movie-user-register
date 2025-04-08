
import { Session, User } from '@supabase/supabase-js';

export type Profile = {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  city?: string;
  country?: string;
  birth_date?: string;
  user_type?: string;
};

export type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  isAdmin: boolean;
  signIn: (identifier: string, password: string, rememberMe: boolean) => Promise<void>;
  signUp: (email: string, password: string, userData: any) => Promise<{ error: any | null; data: any | null }>;
  signOut: () => Promise<void>;
};
