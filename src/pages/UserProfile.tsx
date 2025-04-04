
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { User, Mail, MapPin, Calendar, Smartphone, ArrowLeft, Save } from 'lucide-react';

import { supabase } from '@/integrations/supabase/client';
import PageTransition from '@/components/PageTransition';
import AppHeader from '@/components/AppHeader';
import InputField from '@/components/InputField';
import Button from '@/components/Button';
import SelectField from '@/components/SelectField';

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

  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Check if user is authenticated with localStorage (temporary solution)
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        
        if (!isLoggedIn) {
          toast.error('Você precisa estar logado para acessar esta página');
          navigate('/login');
          return;
        }

        // For now, we'll get the profile data from localStorage
        // In the future, this should be updated to use Supabase auth
        const userName = localStorage.getItem('username') || '';
        const userType = localStorage.getItem('userType') || 'customer';
        
        // Get user from localStorage (for now)
        setProfile({
          id: 'temp-id',
          name: userName,
          email: '',
          phone: '',
          city: '',
          country: '',
          birth_date: '',
          user_type: userType
        });
        
        // In future update, we'll use:
        // const { data: { user } } = await supabase.auth.getUser();
        // if (!user) throw new Error("Usuário não autenticado");
        // const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        
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

      // Save to localStorage for the demo functionality
      localStorage.setItem('username', profile.name || '');
      localStorage.setItem('userType', profile.user_type || 'customer');
      
      // In the future, with Supabase authentication active:
      // const { error } = await supabase.from('profiles').update({
      //   name: profile.name,
      //   email: profile.email,
      //   phone: profile.phone,
      //   city: profile.city,
      //   country: profile.country,
      //   birth_date: profile.birth_date,
      //   user_type: profile.user_type,
      //   updated_at: new Date().toISOString()
      // }).eq('id', profile.id);
      
      // if (error) throw error;
      
      toast.success('Perfil atualizado com sucesso!');
    } catch (error: any) {
      console.error('Erro ao atualizar perfil:', error);
      toast.error(`Falha ao atualizar perfil: ${error.message || 'Erro desconhecido'}`);
    } finally {
      setIsSaving(false);
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
    </PageTransition>
  );
};

export default UserProfile;
