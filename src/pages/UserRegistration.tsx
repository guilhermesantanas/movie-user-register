
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

import PageTransition from '@/components/PageTransition';
import AppHeader from '@/components/AppHeader';
import Button from '@/components/Button';
import RegistrationForm from '@/components/registration/RegistrationForm';

const UserRegistration = () => {
  const navigate = useNavigate();
  
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
            <RegistrationForm />
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default UserRegistration;
