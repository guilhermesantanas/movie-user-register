
import React, { useState, useRef } from 'react';
import { toast } from 'sonner';
import { User, Mail, MapPin, Calendar, Smartphone, Save, Upload, Camera } from 'lucide-react';

import { supabase } from '@/integrations/supabase/client';
import InputField from '@/components/InputField';
import Button from '@/components/Button';
import SelectField from '@/components/SelectField';
import { UserProfileData } from '@/types/profile';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ProfileFormProps {
  profile: UserProfileData;
  setProfile: React.Dispatch<React.SetStateAction<UserProfileData | null>>;
}

const ProfileForm = ({ profile, setProfile }: ProfileFormProps) => {
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione um arquivo de imagem válido');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('O arquivo deve ter no máximo 2MB');
      return;
    }

    setIsUploading(true);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("Usuário não autenticado");
      }

      // Upload file to Supabase storage
      const filePath = `avatars/${user.id}-${new Date().getTime()}`;
      const { error: uploadError, data } = await supabase.storage
        .from('profiles')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);

      // Update profile with new avatar URL
      setProfile({ ...profile, avatar_url: publicUrl });
      toast.success('Foto de perfil atualizada');
    } catch (error: any) {
      console.error('Erro ao fazer upload da imagem:', error);
      toast.error(`Falha ao atualizar foto de perfil: ${error.message || 'Erro desconhecido'}`);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
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
          avatar_url: profile.avatar_url,
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

  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col items-center mb-6">
        <div 
          className="relative cursor-pointer group"
          onClick={handleAvatarClick}
        >
          <Avatar className="h-24 w-24 border-2 border-primary">
            {profile?.avatar_url ? (
              <AvatarImage src={profile.avatar_url} alt={profile.name || 'Avatar'} />
            ) : null}
            <AvatarFallback className="text-xl">
              {getInitials(profile?.name)}
            </AvatarFallback>
          </Avatar>
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="h-8 w-8 text-white" />
          </div>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
        <p className="text-sm text-muted-foreground mt-2">
          Clique para alterar a foto de perfil
        </p>
        {isUploading && (
          <div className="mt-2 animate-pulse text-primary">
            Enviando...
          </div>
        )}
      </div>
      
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
