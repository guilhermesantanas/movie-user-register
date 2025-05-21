
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Index from "./pages/Index";
import UserRegistration from "./pages/UserRegistration";
import MovieRegistration from "./pages/MovieRegistration";
import Movies from "./pages/Movies";
import MovieDetails from "./pages/MovieDetails";
import Login from "./pages/Login";
import UserProfile from "./pages/UserProfile";
import NotFound from "./pages/NotFound";
import Forum from "./pages/Forum";
import ProtectedRoute from "./components/ProtectedRoute";
import useSessionPersistence from "./hooks/useSessionPersistence";
import { AuthProvider } from "./contexts/auth";
import Navbar from "./components/Navbar";

// Create a client
const queryClient = new QueryClient();

// App wrapper to use hooks
const AppWithHooks = () => {
  useSessionPersistence();
  
  return (
    <>
      <Navbar />
      <div className="pt-16 md:pt-14"> {/* Padding top to account for fixed navbar */}
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
            <Route 
              path="/forum" 
              element={
                <ProtectedRoute>
                  <Forum />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </div>
    </>
  );
};

const App = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AuthProvider>
            <AppWithHooks />
            <Toaster />
            <Sonner />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;
