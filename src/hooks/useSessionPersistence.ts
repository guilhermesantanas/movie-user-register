
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

/**
 * Hook to manage session persistence based on Supabase auth and "Remember Me" setting
 */
const useSessionPersistence = () => {
  const navigate = useNavigate();
  const { session, user } = useAuth();
  
  useEffect(() => {
    // Check session persistence based on rememberMe
    const checkSessionExpiration = () => {
      try {
        const rememberMe = localStorage.getItem('rememberMe') === 'true';
        
        // If there's a session but "Remember Me" is false, enforce shorter session
        if (session && !rememberMe) {
          const lastActivity = localStorage.getItem('lastActivityTime');
          const now = new Date().getTime();
          
          // If last activity was more than 30 minutes ago, log user out
          if (lastActivity && now - parseInt(lastActivity) > 30 * 60 * 1000) {
            toast('Your session has expired. Please log in again.');
            navigate('/login');
          }
        }
        
        // Update last activity time if logged in
        if (session) {
          localStorage.setItem('lastActivityTime', new Date().getTime().toString());
        }
      } catch (error) {
        console.error("Error checking session:", error);
      }
    };
    
    // Check on mount
    checkSessionExpiration();
    
    // Set up interval and event listeners
    const activityInterval = setInterval(checkSessionExpiration, 60000);
    
    // Track user activity with a single function to avoid duplication
    const updateActivity = () => {
      if (user) {
        localStorage.setItem('lastActivityTime', new Date().getTime().toString());
      }
    };
    
    // Update activity on user interactions
    window.addEventListener('click', updateActivity);
    window.addEventListener('keypress', updateActivity);
    window.addEventListener('scroll', updateActivity);
    window.addEventListener('mousemove', updateActivity);
    
    return () => {
      // Clean up subscriptions and event listeners
      clearInterval(activityInterval);
      window.removeEventListener('click', updateActivity);
      window.removeEventListener('keypress', updateActivity);
      window.removeEventListener('scroll', updateActivity);
      window.removeEventListener('mousemove', updateActivity);
    };
  }, [navigate, session, user]);
};

export default useSessionPersistence;
