
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Film, MessageSquare, LogOut, User } from 'lucide-react';
import { useAuth } from '@/contexts/auth';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Logout realizado com sucesso');
      navigate('/');
    } catch (error) {
      toast.error('Erro ao fazer logout');
      console.error(error);
    }
  };
  
  if (!user) return null; // Não mostrar a navbar se o usuário não estiver logado
  
  return (
    <motion.nav 
      className="fixed top-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-md border-b border-border shadow-sm"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="text-xl font-semibold text-foreground flex items-center gap-2">
              <Film size={24} className="text-primary" />
              <span>CineDB</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-4">
              <NavLink to="/" active={isActive('/')}>
                <Home size={18} />
                <span>Início</span>
              </NavLink>
              
              <NavLink to="/movies" active={isActive('/movies')}>
                <Film size={18} />
                <span>Filmes</span>
              </NavLink>
              
              <NavLink to="/forum" active={isActive('/forum')}>
                <MessageSquare size={18} />
                <span>Fórum</span>
              </NavLink>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Link 
              to="/profile" 
              className={cn(
                "p-2 rounded-full transition-colors", 
                isActive('/profile') ? "bg-primary text-primary-foreground" : "hover:bg-accent"
              )}
            >
              <User size={20} />
            </Link>
            
            <button 
              onClick={handleSignOut}
              className="p-2 rounded-full hover:bg-accent transition-colors"
              aria-label="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-border">
        <div className="grid grid-cols-4 gap-1 px-2 py-1">
          <MobileNavLink to="/" active={isActive('/')}>
            <Home size={20} />
            <span className="text-xs">Início</span>
          </MobileNavLink>
          
          <MobileNavLink to="/movies" active={isActive('/movies')}>
            <Film size={20} />
            <span className="text-xs">Filmes</span>
          </MobileNavLink>
          
          <MobileNavLink to="/forum" active={isActive('/forum')}>
            <MessageSquare size={20} />
            <span className="text-xs">Fórum</span>
          </MobileNavLink>
          
          <MobileNavLink to="/profile" active={isActive('/profile')}>
            <User size={20} />
            <span className="text-xs">Perfil</span>
          </MobileNavLink>
        </div>
      </div>
    </motion.nav>
  );
};

const NavLink = ({ to, active, children }: { to: string, active: boolean, children: React.ReactNode }) => (
  <Link
    to={to}
    className={cn(
      "flex items-center gap-2 px-3 py-2 rounded-md transition-colors",
      active 
        ? "bg-primary text-primary-foreground" 
        : "hover:bg-accent text-foreground"
    )}
  >
    {children}
  </Link>
);

const MobileNavLink = ({ to, active, children }: { to: string, active: boolean, children: React.ReactNode }) => (
  <Link
    to={to}
    className={cn(
      "flex flex-col items-center justify-center py-2 rounded-md transition-colors",
      active 
        ? "text-primary" 
        : "text-muted-foreground"
    )}
  >
    {children}
  </Link>
);

export default Navbar;
