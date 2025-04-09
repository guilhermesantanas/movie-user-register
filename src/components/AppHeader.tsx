
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

const AppHeader = ({ title, subtitle, className }: AppHeaderProps) => {
  return (
    <header className={cn("text-center mb-8", className)}>
      <motion.h1 
        className="text-4xl font-semibold tracking-tight text-foreground"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {title}
      </motion.h1>
      {subtitle && (
        <motion.p 
          className="text-muted-foreground mt-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {subtitle}
        </motion.p>
      )}
    </header>
  );
};

export default AppHeader;
