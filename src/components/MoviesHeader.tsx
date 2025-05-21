
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import AppHeader from '@/components/AppHeader';

interface MoviesHeaderProps {
  usesSampleData: boolean;
}

const MoviesHeader = ({ usesSampleData }: MoviesHeaderProps) => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  
  const handleAddMovie = () => {
    if (isLoggedIn) {
      navigate('/register-movie');
    } else {
      toast.error('Você precisa estar logado para adicionar um filme');
      navigate('/login');
    }
  };
  
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
      <div>
        <Button 
          variant="outline" 
          size="sm"
          className="mb-4" 
          onClick={() => navigate('/')}
        >
          <ArrowLeft size={16} className="mr-2" />
          Voltar para Início
        </Button>
        
        <AppHeader 
          title="Coleção de Filmes" 
          subtitle={usesSampleData ? "Navegando por dados de filmes de exemplo" : "Navegue pelo nosso banco de dados de filmes"}
          className="mb-0"
        />
      </div>
      
      <div className="flex gap-3">
        <Button 
          onClick={handleAddMovie}
          className="w-full md:w-auto"
        >
          <Plus size={18} className="mr-2" />
          Cadastrar Novo Filme
        </Button>
      </div>
    </div>
  );
};

export default MoviesHeader;
