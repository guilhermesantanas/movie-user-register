
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Calendar, MapPin, ArrowLeft, UserCheck, Smartphone } from 'lucide-react';
import { toast } from 'sonner';

import PageTransition from '@/components/PageTransition';
import AppHeader from '@/components/AppHeader';
import InputField from '@/components/InputField';
import Button from '@/components/Button';
import SelectField from '@/components/SelectField';

const UserRegistration = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Get form data
    const formData = new FormData(e.target as HTMLFormElement);
    const userData = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      password: formData.get('password'),
      dob: formData.get('dob'),
      userType: formData.get('userType'),
      city: formData.get('city'),
      country: formData.get('country')
    };
    
    // Simulate form submission - in a real app, you'd save to a database
    setTimeout(() => {
      // Save to localStorage for demo purposes
      const savedUsers = JSON.parse(localStorage.getItem('users') || '[]');
      savedUsers.push(userData);
      localStorage.setItem('users', JSON.stringify(savedUsers));
      
      setIsSubmitting(false);
      toast.success('Usuário registrado com sucesso!');
      
      // Automatically log in the new user
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('username', userData.name as string);
      localStorage.setItem('userType', userData.userType as string);
      
      navigate('/');
    }, 1500);
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
                  label="Nome Completo"
                  id="name"
                  name="name"
                  placeholder="Digite seu nome completo"
                  required
                  icon={<User size={18} />}
                />
                
                <InputField
                  label="Email"
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Digite seu endereço de email"
                  required
                  icon={<Mail size={18} />}
                />
                
                <InputField
                  label="Telefone"
                  id="phone"
                  name="phone"
                  placeholder="Digite seu número de telefone"
                  icon={<Smartphone size={18} />}
                />
                
                <InputField
                  label="Senha"
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Crie uma senha forte"
                  required
                  icon={<Lock size={18} />}
                />
                
                <InputField
                  label="Data de Nascimento"
                  id="dob"
                  name="dob"
                  type="date"
                  icon={<Calendar size={18} />}
                />
                
                <SelectField
                  label="Tipo de Usuário"
                  id="userType"
                  name="userType"
                  options={[
                    { value: "customer", label: "Cliente" },
                    { value: "admin", label: "Administrador" },
                    { value: "staff", label: "Funcionário" }
                  ]}
                  required
                  icon={<UserCheck size={18} />}
                />
                
                <InputField
                  label="Cidade"
                  id="city"
                  name="city"
                  placeholder="Digite sua cidade"
                  icon={<MapPin size={18} />}
                />
                
                <SelectField
                  label="País"
                  id="country"
                  name="country"
                  options={[
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
