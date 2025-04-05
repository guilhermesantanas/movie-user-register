
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock } from 'lucide-react';

import PageTransition from '@/components/PageTransition';
import AppHeader from '@/components/AppHeader';
import Button from '@/components/Button';
import ProfileForm from '@/components/profile/ProfileForm';
import PasswordChangeDialog from '@/components/profile/PasswordChangeDialog';
import useUserProfile from '@/hooks/useUserProfile';

const UserProfile = () => {
  const navigate = useNavigate();
  const { profile, setProfile, isLoading } = useUserProfile();
  const [passwordDialogOpen, setPasswordDialogOpen] = useState<boolean>(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen py-12 px-6">
        <div className="w-full max-w-md mx-auto">
          <Button 
            variant="outline" 
            className="mb-6" 
            onClick={() => navigate('/')}
            icon={<ArrowLeft size={16} />}
          >
            Voltar para Início
          </Button>
          
          <AppHeader 
            title="Cinema Management" 
            subtitle="meu perfil"
          />
          
          <div className="card p-6 mt-6">
            {profile && <ProfileForm profile={profile} setProfile={setProfile} />}
            
            <Button 
              type="button" 
              variant="outline" 
              className="w-full mt-4" 
              onClick={() => setPasswordDialogOpen(true)}
              icon={<Lock size={18} />}
            >
              Alterar Senha
            </Button>
          </div>
        </div>
      </div>

      <PasswordChangeDialog 
        open={passwordDialogOpen} 
        onOpenChange={setPasswordDialogOpen} 
      />
    </PageTransition>
  );
};

export default UserProfile;
