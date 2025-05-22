
import React, { useState } from 'react';
import Button from '@/components/Button';
import { LogOut, PowerOff } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface LoggedInStateProps {
  username: string;
  onProfileClick: () => void;
  onLogout: () => void;
}

const LoggedInState = ({ username, onProfileClick, onLogout }: LoggedInStateProps) => {
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  const handleDisconnectAll = async () => {
    try {
      setIsDisconnecting(true);
      // Sign out from all devices
      await supabase.auth.signOut({ scope: 'global' });
      toast.success('Desconectado de todas as sessões');
      // Standard onLogout will handle the redirect
      onLogout();
    } catch (error) {
      console.error('Error disconnecting sessions:', error);
      toast.error('Erro ao desconectar sessões');
    } finally {
      setIsDisconnecting(false);
    }
  };

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
          icon={<LogOut size={18} />}
        >
          Sair da conta
        </Button>
        <Button 
          variant="outline" 
          onClick={handleDisconnectAll}
          isLoading={isDisconnecting}
          icon={<PowerOff size={18} />}
          className="text-destructive border-destructive hover:bg-destructive/10"
        >
          Desconectar de todos os dispositivos
        </Button>
      </div>
    </div>
  );
};

export default LoggedInState;
