import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Film, Plus, Search } from 'lucide-react';
import { toast } from 'sonner';

import PageTransition from '@/components/PageTransition';
import AppHeader from '@/components/AppHeader';
import Button from '@/components/Button';
import InputField from '@/components/InputField';

interface Movie {
  title: string;
  releaseDate: string;
  duration: string;
  genre: string;
  director: string;
  synopsis: string;
  posterUrl?: string;
  registeredBy?: string;
}

const Movies = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  
  useEffect(() => {
    // Load movies from localStorage
    const savedMovies = JSON.parse(localStorage.getItem('movies') || '[]');
    setMovies(savedMovies);
    setFilteredMovies(savedMovies);
  }, []);
  
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredMovies(movies);
    } else {
      const filtered = movies.filter(movie => 
        movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.director.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.genre.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMovies(filtered);
    }
  }, [searchTerm, movies]);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleAddMovie = () => {
    if (isLoggedIn) {
      navigate('/register-movie');
    } else {
      toast.error('You must be logged in to add a movie');
      navigate('/login');
    }
  };
  
  return (
    <PageTransition>
      <div className="min-h-screen py-12 px-6">
        <div className="w-full max-w-6xl mx-auto">
          <Button 
            variant="outline" 
            className="mb-6" 
            onClick={() => navigate('/')}
            icon={<ArrowLeft size={16} />}
          >
            Back to Home
          </Button>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <AppHeader 
              title="Movie Collection" 
              subtitle="Browse our movie database"
              className="mb-0"
            />
            
            {isLoggedIn && (
              <Button 
                onClick={handleAddMovie}
                icon={<Plus size={18} />}
              >
                Add Movie
              </Button>
            )}
          </div>
          
          <div className="mb-8 max-w-md">
            <InputField
              label=""
              id="search"
              name="search"
              placeholder="Search by title, director, or genre"
              value={searchTerm}
              onChange={handleSearch}
              icon={<Search size={18} />}
              className="mb-0"
            />
          </div>
          
          {filteredMovies.length === 0 ? (
            <motion.div 
              className="text-center p-12 border border-dashed rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Film size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No movies found</h3>
              <p className="text-muted-foreground">
                {movies.length === 0 
                  ? "There are no movies in the database yet." 
                  : "No movies match your search criteria."}
              </p>
              
              {isLoggedIn && movies.length === 0 && (
                <Button 
                  className="mt-4" 
                  onClick={handleAddMovie}
                  icon={<Plus size={18} />}
                >
                  Add Your First Movie
                </Button>
              )}
            </motion.div>
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
              {filteredMovies.map((movie, index) => (
                <MovieCard key={index} movie={movie} />
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

const MovieCard = ({ movie }: { movie: Movie }) => {
  return (
    <motion.div 
      className="card overflow-hidden"
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
      }}
    >
      <div className="aspect-[2/3] bg-muted relative overflow-hidden">
        {movie.posterUrl ? (
          <img 
            src={movie.posterUrl} 
            alt={movie.title} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
            <Film size={48} className="text-gray-600" />
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1">{movie.title}</h3>
        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <span>{movie.releaseDate?.split('-')[0]}</span>
          <span className="mx-2">•</span>
          <span>{movie.duration} min</span>
          <span className="mx-2">•</span>
          <span>{movie.genre}</span>
        </div>
        <p className="text-sm text-muted-foreground mb-2">
          Director: {movie.director}
        </p>
        <p className="text-sm line-clamp-3">
          {movie.synopsis}
        </p>
        {movie.registeredBy && (
          <p className="text-xs text-muted-foreground mt-3">
            Added by: {movie.registeredBy}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default Movies;
