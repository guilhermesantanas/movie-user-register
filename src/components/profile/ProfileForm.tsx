
import React, { useState } from 'react';
import { toast } from 'sonner';
import { User, Mail, MapPin, Calendar, Smartphone, Save } from 'lucide-react';

import { supabase } from '@/integrations/supabase/client';
import InputField from '@/components/InputField';
import Button from '@/components/Button';
import SelectField from '@/components/SelectField';
import { UserProfileData } from '@/types/profile';

interface ProfileFormProps {
  profile: UserProfileData;
  setProfile: React.Dispatch<React.SetStateAction<UserProfileData | null>>;
}

const ProfileForm = ({ profile, setProfile }: ProfileFormProps) => {
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
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

  return (
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
  );
};

export default ProfileForm;
