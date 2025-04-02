
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
      toast.error('You must be logged in to add a movie');
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
          Back to Home
        </Button>
        
        <AppHeader 
          title="Movie Collection" 
          subtitle={usesSampleData ? "Browsing sample movie data" : "Browse our movie database"}
          className="mb-0"
        />
      </div>
      
      <div className="flex gap-3">
        <Button 
          onClick={handleAddMovie}
          icon={<Plus size={18} />}
        >
          Register New Movie
        </Button>
      </div>
    </div>
  );
};

export default MoviesHeader;
