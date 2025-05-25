
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const useMoviesPage = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const [showFilters, setShowFilters] = useState(false);
  
  const handleAddMovie = () => {
    if (isLoggedIn) {
      navigate('/register-movie');
    } else {
      navigate('/login');
    }
  };
  
  return {
    isLoggedIn,
    showFilters,
    setShowFilters,
    handleAddMovie
  };
};
