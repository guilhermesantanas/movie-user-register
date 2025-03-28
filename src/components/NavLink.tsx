
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

const NavLink = ({ to, children, className, icon }: NavLinkProps) => {
  return (
    <Link to={to} className="block">
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "flex items-center gap-2 p-3 rounded-xl transition-colors",
          "bg-secondary/90 hover:bg-secondary/70 backdrop-blur-md border border-border",
          "text-secondary-foreground shadow-sm hover:shadow",
          className
        )}
      >
        {icon && <span className="text-primary">{icon}</span>}
        <span className="font-medium">{children}</span>
      </motion.div>
    </Link>
  );
};

export default NavLink;
