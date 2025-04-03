
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import InputField from '@/components/InputField';
import MovieCard from '@/components/MovieCard';
import MoviesHeader from '@/components/MoviesHeader';
import EmptyMoviesList from '@/components/EmptyMoviesList';
import { useMoviesList } from '@/hooks/useMoviesList';

const Movies = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  
  const { 
    filteredMovies, 
    isLoading, 
    usesSampleData,
    searchTerm,
    handleSearch,
    handleDeleteMovie
  } = useMoviesList();
  
  const handleAddMovie = () => {
    if (isLoggedIn) {
      navigate('/register-movie');
    } else {
      navigate('/login');
    }
  };
  
  return (
    <PageTransition>
      <div className="min-h-screen py-12 px-6">
        <div className="w-full max-w-6xl mx-auto">
          <MoviesHeader usesSampleData={usesSampleData} />
          
          <div className="mb-8 max-w-md">
            <InputField
              label=""
              id="search"
              name="search"
              placeholder="Buscar por título, diretor ou gênero"
              value={searchTerm}
              onChange={handleSearch}
              icon={<Search size={18} />}
              className="mb-0"
            />
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : filteredMovies.length === 0 ? (
            <EmptyMoviesList 
              isEmpty={filteredMovies.length === 0}
              isSearching={searchTerm.trim() !== ''}
              isLoggedIn={isLoggedIn}
              onAddMovie={handleAddMovie}
            />
          ) : (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
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
              {filteredMovies.map((movie) => (
                <MovieCard 
                  key={movie.id} 
                  movie={movie} 
                  onDelete={handleDeleteMovie}
                />
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default Movies;
