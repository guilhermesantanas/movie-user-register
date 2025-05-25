
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Calendar, MapPin, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

import PageTransition from '@/components/PageTransition';
import AppHeader from '@/components/AppHeader';
import InputField from '@/components/InputField';
import Button from '@/components/Button';
import SelectField from '@/components/SelectField';
import LanguageSelector from '@/components/LanguageSelector';
import { supabase } from '@/integrations/supabase/client';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/auth';
import { getLanguageFromCountry } from '@/utils/languageUtils';

const UserRegistration = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    dob: '',
    country: '',
    language: 'en'
  });
  
  const [userConsent, setUserConsent] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Auto-sync language when country changes
    if (name === 'country' && value) {
      const suggestedLanguage = getLanguageFromCountry(value);
      setFormData(prev => ({ 
        ...prev, 
        [name]: value,
        language: suggestedLanguage
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userConsent) {
      toast.error('Você precisa concordar com os termos e condições para continuar.');
      return;
    }

    // Validate email
    if (!formData.email.includes('@')) {
      toast.error('Por favor, insira um email válido');
      return;
    }

    // Validate password
    if (formData.password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    // Validate username
    if (!formData.name.trim()) {
      toast.error('Por favor, insira seu nome de usuário');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log("Starting registration process");
      // Register user with our signUp function
      const { error, data } = await signUp(formData.email, formData.password, {
        name: formData.name
      });
      
      if (error) throw error;
      
      console.log("User registered successfully:", data);
      
      // Create profile entry in profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: data.user?.id,
          name: formData.name,
          email: formData.email,
          birth_date: formData.dob,
          country: formData.country,
          language: formData.language,
          user_type: 'customer' // Default to customer
        });
      
      if (profileError) {
        console.error("Profile creation error:", profileError);
        throw profileError;
      }
      
      // Store language preference in localStorage
      localStorage.setItem('userLanguage', formData.language);
      
      toast.success('Usuário registrado com sucesso! Faça login para continuar.');
      navigate('/login');
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(`Erro ao registrar usuário: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
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
            subtitle="criar conta"
          />
          
          <motion.div 
            className="card p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <InputField
                  label="Nome de Usuário"
                  id="name"
                  name="name"
                  placeholder="Digite seu nome de usuário"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  icon={<User size={18} />}
                />
                
                <InputField
                  label="Email"
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Digite seu endereço de email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  icon={<Mail size={18} />}
                />
                
                <InputField
                  label="Senha"
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Crie uma senha forte"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  icon={<Lock size={18} />}
                />
                
                <InputField
                  label="Data de Nascimento"
                  id="dob"
                  name="dob"
                  type="date"
                  value={formData.dob}
                  onChange={handleChange}
                  icon={<Calendar size={18} />}
                />
                
                <SelectField
                  label="País"
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  options={[
                    { value: "", label: "Selecione um país" },
                    { value: "us", label: "Estados Unidos" },
                    { value: "ca", label: "Canadá" },
                    { value: "mx", label: "México" },
                    { value: "br", label: "Brasil" },
                    { value: "fr", label: "França" },
                    { value: "uk", label: "Reino Unido" },
                    { value: "de", label: "Alemanha" },
                    { value: "jp", label: "Japão" },
                    { value: "au", label: "Austrália" }
                  ]}
                  icon={<MapPin size={18} />}
                />

                <LanguageSelector
                  label="Idioma Preferido"
                  value={formData.language}
                  onChange={handleChange}
                />
              </div>
              
              <div className="mt-6 flex items-start space-x-2">
                <Checkbox 
                  id="terms" 
                  checked={userConsent}
                  onCheckedChange={(checked) => setUserConsent(checked === true)}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label 
                    htmlFor="terms" 
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Eu concordo com os termos e condições de uso do serviço
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Ao se cadastrar, você concorda com nossa política de privacidade e termos de uso.
                  </p>
                </div>
              </div>
              
              <div className="mt-6">
                <Button 
                  type="submit" 
                  className="w-full" 
                  isLoading={isSubmitting}
                >
                  Registrar Usuário
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default UserRegistration;
