
import React from 'react';
import { motion } from 'framer-motion';
import { Film, UserPlus, ArrowRight, LogIn, Eye } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import NavLink from '@/components/NavLink';
import AppHeader from '@/components/AppHeader';

const Index = () => {
  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md">
          <AppHeader 
            title="Cinema Management" 
            subtitle="Register users and movies with ease"
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
              className="hover:border-blue-100"
            >
              Login to Admin Panel
            </NavLink>
            
            <NavLink 
              to="/movies" 
              icon={<Eye size={18} />}
              className="hover:border-blue-100"
            >
              Browse Movies
            </NavLink>
            
            <NavLink 
              to="/register-user" 
              icon={<UserPlus size={18} />}
              className="hover:border-blue-100"
            >
              Register New User
            </NavLink>
            
            <NavLink 
              to="/register-movie" 
              icon={<Film size={18} />}
              className="hover:border-blue-100"
            >
              Register New Movie
            </NavLink>
          </motion.div>
          
          <motion.p 
            className="text-center text-sm text-muted-foreground mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            Select an option to get started
          </motion.p>
        </div>
      </div>
    </PageTransition>
  );
};

export default Index;
