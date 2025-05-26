
import React, { createContext, useContext } from 'react';
import { useAuthState } from './useAuthState';
import { useAuthActions } from './useAuthActions';
import { AuthContextType } from './types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // Always call hooks in the same order
  const state = useAuthState();
  const actions = useAuthActions();

  const value: AuthContextType = {
    // Spread state first
    session: state.session,
    user: state.user,
    profile: state.profile,
    isLoading: state.isLoading,
    isAdmin: state.isAdmin,
    isModerator: state.isModerator,
    // Then actions
    signIn: actions.signIn,
    signUp: actions.signUp,
    signOut: actions.signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
