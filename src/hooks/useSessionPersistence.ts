
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook to manage session persistence based on "Remember Me" setting
 * This is a simplified version that works with the localStorage approach
 */
const useSessionPersistence = () => {
  useEffect(() => {
    const checkSession = () => {
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      const rememberMe = localStorage.getItem('rememberMe') === 'true';
      
      // If user is logged in but didn't check "Remember Me", handle session expiry
      // For now, this is simulated with localStorage only
      if (isLoggedIn && !rememberMe) {
        // In a real app with Supabase auth, we would check session expiration
        // and handle token refresh differently
        
        // Here we're just simulating session expiry for demo purposes
        const lastActivity = localStorage.getItem('lastActivityTime');
        const now = new Date().getTime();
        
        // If last activity was more than 30 minutes ago, log user out
        // This simulates session expiry
        if (lastActivity && now - parseInt(lastActivity) > 30 * 60 * 1000) {
          localStorage.removeItem('isLoggedIn');
          localStorage.removeItem('username');
          localStorage.removeItem('userType');
          localStorage.removeItem('lastActivityTime');
          window.location.href = '/login'; // Force redirect to login
        }
      }
      
      // Update last activity time
      if (isLoggedIn) {
        localStorage.setItem('lastActivityTime', new Date().getTime().toString());
      }
    };
    
    // Check on mount
    checkSession();
    
    // Set up intervals and event listeners
    const activityInterval = setInterval(checkSession, 60000); // Check every minute
    
    // Track user activity
    const updateActivity = () => {
      if (localStorage.getItem('isLoggedIn') === 'true') {
        localStorage.setItem('lastActivityTime', new Date().getTime().toString());
      }
    };
    
    // Update activity on user interactions
    window.addEventListener('click', updateActivity);
    window.addEventListener('keypress', updateActivity);
    window.addEventListener('scroll', updateActivity);
    window.addEventListener('mousemove', updateActivity);
    
    return () => {
      clearInterval(activityInterval);
      window.removeEventListener('click', updateActivity);
      window.removeEventListener('keypress', updateActivity);
      window.removeEventListener('scroll', updateActivity);
      window.removeEventListener('mousemove', updateActivity);
    };
  }, []);
};

export default useSessionPersistence;
