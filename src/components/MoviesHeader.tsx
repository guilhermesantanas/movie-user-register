
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import { toast } from 'sonner';
import Button from '@/components/Button';
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
          className="mb-4" 
          onClick={() => navigate('/')}
          icon={<ArrowLeft size={16} />}
        >
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
          icon={<Plus size={18} />}
        >
          Cadastrar Novo Filme
        </Button>
      </div>
    </div>
  );
};

export default MoviesHeader;
