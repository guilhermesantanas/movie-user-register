
import React from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import InputField from '@/components/InputField';
import MovieCard from '@/components/MovieCard';
import MoviesHeader from '@/components/MoviesHeader';
import EmptyMoviesList from '@/components/EmptyMoviesList';
import MovieFilter from '@/components/MovieFilter';
import { useMoviesList } from '@/hooks/useMoviesList';
import { useMoviesPage } from '@/hooks/useMoviesPage';

const Movies = () => {
  const { 
    filteredMovies, 
    isLoading, 
    usesSampleData,
    searchTerm,
    handleSearch,
    handleDeleteMovie,
    filters,
    setFilters,
    clearFilters,
    genreOptions,
    ratingOptions,
    languageOptions,
    yearOptions
  } = useMoviesList();

  const {
    isLoggedIn,
    showFilters,
    setShowFilters,
    handleAddMovie
  } = useMoviesPage();
  
  return (
    <PageTransition>
      <div className="min-h-screen py-12 px-6">
        <div className="w-full max-w-6xl mx-auto">
          <MoviesHeader usesSampleData={usesSampleData} />
          
          <div className="mb-6">
            <div className="flex flex-col md:flex-row gap-3 items-start md:items-end">
              <div className="w-full md:flex-1">
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
              <button 
                className="text-sm font-medium text-primary hover:underline"
                onClick={() => setShowFilters(!showFilters)}
              >
                {showFilters ? 'Ocultar filtros' : 'Mostrar filtros'}
              </button>
            </div>
            
            {showFilters && (
              <div className="mt-4">
                <MovieFilter
                  filters={filters}
                  setFilters={setFilters}
                  clearFilters={clearFilters}
                  genreOptions={genreOptions}
                  ratingOptions={ratingOptions}
                  languageOptions={languageOptions}
                  yearOptions={yearOptions}
                />
              </div>
            )}
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : filteredMovies.length === 0 ? (
            <EmptyMoviesList 
              isEmpty={filteredMovies.length === 0}
              isSearching={searchTerm.trim() !== '' || Object.values(filters).some(Boolean)}
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
