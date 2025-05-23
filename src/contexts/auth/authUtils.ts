
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

/**
 * Helper function to ensure admin profile exists
 */
export const ensureAdminProfile = async (user: User) => {
  try {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();
      
    if (!data) {
      // Create admin profile if it doesn't exist
      await supabase
        .from('profiles')
        .insert({
          id: user.id,
          name: 'Admin',
          email: user.email,
          user_type: 'admin'
        });
    } else if (data.user_type !== 'admin') {
      // Update user_type to admin if it's not already
      await supabase
        .from('profiles')
        .update({ user_type: 'admin' })
        .eq('id', user.id);
    }
  } catch (error) {
    console.error("Error ensuring admin profile:", error);
  }
};
