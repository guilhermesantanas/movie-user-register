
import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, LogIn } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import NavLink from '@/components/NavLink';
import AppHeader from '@/components/AppHeader';

const Index = () => {
  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md">
          <AppHeader 
            title="Gerenciamento de Cinema" 
            subtitle="Cadastre usuários e filmes com facilidade"
          />
          
          <motion.div 
            className="space-y-4"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
            initial="hidden"
            animate="show"
          >
            <NavLink 
              to="/login" 
              icon={<LogIn size={18} />}
              className="hover:border-primary/30"
            >
              Entrar
            </NavLink>
            
            <NavLink 
              to="/register-user" 
              icon={<UserPlus size={18} />}
              className="hover:border-primary/30"
            >
              Cadastrar Novo Usuário
            </NavLink>
          </motion.div>
          
          <motion.p 
            className="text-center text-sm text-muted-foreground mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            Selecione uma opção para começar
          </motion.p>
        </div>
      </div>
    </PageTransition>
  );
};

export default Index;
