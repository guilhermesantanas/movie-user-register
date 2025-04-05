
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { User, Mail, MapPin, Calendar, Smartphone, ArrowLeft, Save, Lock } from 'lucide-react';

import { supabase } from '@/integrations/supabase/client';
import PageTransition from '@/components/PageTransition';
import AppHeader from '@/components/AppHeader';
import InputField from '@/components/InputField';
import Button from '@/components/Button';
import SelectField from '@/components/SelectField';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

interface UserProfileData {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  city: string | null;
  country: string | null;
  birth_date: string | null;
  user_type: string | null;
}

const UserProfile = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState<boolean>(false);
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isChangingPassword, setIsChangingPassword] = useState<boolean>(false);

  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Check if user is authenticated
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          toast.error('Você precisa estar logado para acessar esta página');
          navigate('/login');
          return;
        }

        // Get current user data
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          throw new Error("Usuário não encontrado");
        }
        
        // Try to get user profile from profiles table
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
          console.error('Error fetching profile:', error);
        }
        
        // Use profile data from DB or create a new profile object from auth user
        setProfile({
          id: user.id,
          name: profileData?.name || user.user_metadata?.name || '',
          email: user.email || '',
          phone: profileData?.phone || '',
          city: profileData?.city || '',
          country: profileData?.country || '',
          birth_date: profileData?.birth_date || '',
          user_type: profileData?.user_type || localStorage.getItem('userType') || 'customer'
        });
        
      } catch (error) {
        console.error('Erro ao carregar perfil:', error);
        toast.error('Falha ao carregar informações do perfil');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (profile) {
      setProfile({ ...profile, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (!profile) return;

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("Usuário não autenticado");
      }
      
      // Update user name in Supabase auth
      const { error: updateAuthError } = await supabase.auth.updateUser({
        data: { name: profile.name }
      });
      
      if (updateAuthError) throw updateAuthError;

      // Update or insert profile record
      const { error: upsertError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          name: profile.name,
          email: profile.email,
          phone: profile.phone,
          city: profile.city,
          country: profile.country,
          birth_date: profile.birth_date,
          user_type: profile.user_type,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'id'
        });
      
      if (upsertError) throw upsertError;
      
      // Update localStorage for demo functionality
      localStorage.setItem('username', profile.name || '');
      localStorage.setItem('userType', profile.user_type || 'customer');
      
      toast.success('Perfil atualizado com sucesso!');
    } catch (error: any) {
      console.error('Erro ao atualizar perfil:', error);
      toast.error(`Falha ao atualizar perfil: ${error.message || 'Erro desconhecido'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsChangingPassword(true);

    try {
      // Validate password inputs
      if (newPassword !== confirmPassword) {
        toast.error('As senhas não coincidem');
        return;
      }
      
      if (newPassword.length < 6) {
        toast.error('A senha deve ter pelo menos 6 caracteres');
        return;
      }

      // Update password in Supabase Auth
      const { error } = await supabase.auth.updateUser({ 
        password: newPassword 
      });

      if (error) throw error;

      toast.success('Senha alterada com sucesso');
      setPasswordDialogOpen(false);
      
      // Clear password fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      console.error('Erro ao alterar senha:', error);
      toast.error(`Falha ao alterar senha: ${error.message || 'Erro desconhecido'}`);
    } finally {
      setIsChangingPassword(false);
    }
  };

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
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <InputField
                  label="Nome Completo"
                  id="name"
                  name="name"
                  value={profile?.name || ''}
                  onChange={handleInputChange}
                  placeholder="Digite seu nome completo"
                  icon={<User size={18} />}
                />
                
                <InputField
                  label="Email"
                  id="email"
                  name="email"
                  type="email"
                  value={profile?.email || ''}
                  onChange={handleInputChange}
                  placeholder="Digite seu endereço de email"
                  icon={<Mail size={18} />}
                  disabled={true} // Email can't be changed directly
                />
                
                <InputField
                  label="Telefone"
                  id="phone"
                  name="phone"
                  value={profile?.phone || ''}
                  onChange={handleInputChange}
                  placeholder="Digite seu número de telefone"
                  icon={<Smartphone size={18} />}
                />
                
                <InputField
                  label="Data de Nascimento"
                  id="birth_date"
                  name="birth_date"
                  type="date"
                  value={profile?.birth_date || ''}
                  onChange={handleInputChange}
                  icon={<Calendar size={18} />}
                />
                
                <InputField
                  label="Cidade"
                  id="city"
                  name="city"
                  value={profile?.city || ''}
                  onChange={handleInputChange}
                  placeholder="Digite sua cidade"
                  icon={<MapPin size={18} />}
                />
                
                <SelectField
                  label="País"
                  id="country"
                  name="country"
                  value={profile?.country || ''}
                  onChange={handleInputChange}
                  options={[
                    { value: "", label: "Selecione um país" },
                    { value: "br", label: "Brasil" },
                    { value: "us", label: "Estados Unidos" },
                    { value: "ca", label: "Canadá" },
                    { value: "mx", label: "México" },
                    { value: "fr", label: "França" },
                    { value: "uk", label: "Reino Unido" },
                    { value: "de", label: "Alemanha" },
                    { value: "jp", label: "Japão" },
                    { value: "au", label: "Austrália" }
                  ]}
                  icon={<MapPin size={18} />}
                />
              </div>
              
              <Button 
                type="button" 
                variant="outline" 
                className="w-full mt-4" 
                onClick={() => setPasswordDialogOpen(true)}
                icon={<Lock size={18} />}
              >
                Alterar Senha
              </Button>
              
              <div className="mt-6">
                <Button 
                  type="submit" 
                  className="w-full" 
                  isLoading={isSaving}
                  icon={<Save size={18} />}
                >
                  Salvar Alterações
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Change Password Dialog */}
      <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alterar Senha</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleChangePassword} className="space-y-4">
            <InputField
              label="Senha Atual"
              id="currentPassword"
              name="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Digite sua senha atual"
              icon={<Lock size={18} />}
            />
            
            <InputField
              label="Nova Senha"
              id="newPassword"
              name="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Digite sua nova senha"
              icon={<Lock size={18} />}
            />
            
            <InputField
              label="Confirmar Nova Senha"
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirme sua nova senha"
              icon={<Lock size={18} />}
            />

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline"
                onClick={() => setPasswordDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button 
                type="submit"
                isLoading={isChangingPassword}
              >
                Confirmar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </PageTransition>
  );
};

export default UserProfile;
