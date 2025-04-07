
import React from 'react';
import Button from '@/components/Button';

interface LoggedInStateProps {
  username: string;
  onProfileClick: () => void;
  onLogout: () => void;
}

const LoggedInState = ({ username, onProfileClick, onLogout }: LoggedInStateProps) => {
  return (
    <div className="text-center">
      <p className="mb-4">Você já está logado como {username}</p>
      <div className="flex flex-col gap-3">
        <Button onClick={onProfileClick}>
          Ir para Meu Perfil
        </Button>
        <Button 
          variant="outline" 
          onClick={onLogout}
        >
          Sair da conta
        </Button>
      </div>
    </div>
  );
};

export default LoggedInState;
