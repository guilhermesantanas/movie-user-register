
import React, { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { supabase } from "./integrations/supabase/client";

import Index from "./pages/Index";
import UserRegistration from "./pages/UserRegistration";
import MovieRegistration from "./pages/MovieRegistration";
import Movies from "./pages/Movies";
import MovieDetails from "./pages/MovieDetails";
import Login from "./pages/Login";
import UserProfile from "./pages/UserProfile";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import useSessionPersistence from "./hooks/useSessionPersistence";

// Create a client
const queryClient = new QueryClient();

// Auth wrapper to handle global auth state
const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT') {
          localStorage.removeItem('isLoggedIn');
          localStorage.removeItem('username');
          localStorage.removeItem('userType');
        } else if (event === 'SIGNED_IN' && session) {
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('username', session.user.user_metadata.name || session.user.email || '');
          
          // Fetch user profile to get user_type
          setTimeout(async () => {
            const { data } = await supabase
              .from('profiles')
              .select('user_type')
              .eq('id', session.user.id)
              .single();
              
            if (data?.user_type) {
              localStorage.setItem('userType', data.user_type);
            }
          }, 0);
        }
      }
    );
    
    // Check initial session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoading(false);
    };
    
    checkSession();
    
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  return children;
};

// App wrapper to use hooks
const AppWithHooks = () => {
  useSessionPersistence();
  
  return (
    <AuthProvider>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/register-user" element={<UserRegistration />} />
          <Route 
            path="/register-movie" 
            element={
              <ProtectedRoute>
                <MovieRegistration />
              </ProtectedRoute>
            } 
          />
          <Route path="/movies" element={<Movies />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/login" element={<Login />} />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
    </AuthProvider>
  );
};

const App = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppWithHooks />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;
