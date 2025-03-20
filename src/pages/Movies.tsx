
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Film, Search, Tag, Users, Star, Plus, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

import PageTransition from '@/components/PageTransition';
import AppHeader from '@/components/AppHeader';
import Button from '@/components/Button';
import InputField from '@/components/InputField';
import SelectField from '@/components/SelectField';

// Sample movie data - in a real app, this would come from an API
const SAMPLE_MOVIES = [
  {
    id: 1,
    title: "Inception",
    genre: "sci-fi",
    director: "Christopher Nolan",
    actors: ["Leonardo DiCaprio", "Ellen Page", "Tom Hardy"],
    rating: 8.8,
    releaseDate: "2010-07-16",
    poster: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg"
  },
  {
    id: 2,
    title: "The Godfather",
    genre: "drama",
    director: "Francis Ford Coppola",
    actors: ["Marlon Brando", "Al Pacino", "James Caan"],
    rating: 9.2,
    releaseDate: "1972-03-24",
    poster: "https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg"
  },
  {
    id: 3,
    title: "Pulp Fiction",
    genre: "crime",
    director: "Quentin Tarantino",
    actors: ["John Travolta", "Uma Thurman", "Samuel L. Jackson"],
    rating: 8.9,
    releaseDate: "1994-10-14",
    poster: "https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg"
  },
  {
    id: 4,
    title: "The Dark Knight",
    genre: "action",
    director: "Christopher Nolan",
    actors: ["Christian Bale", "Heath Ledger", "Aaron Eckhart"],
    rating: 9.0,
    releaseDate: "2008-07-18",
    poster: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg"
  }
];

const Movies = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState(SAMPLE_MOVIES);
  const [filteredMovies, setFilteredMovies] = useState(SAMPLE_MOVIES);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGenre, setFilterGenre] = useState('');
  const [filterDirector, setFilterDirector] = useState('');
  const [filterActor, setFilterActor] = useState('');
  const [filterRating, setFilterRating] = useState('');
  
  // Check if user is logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      toast.error('Please login to access this page');
      navigate('/login');
    }
  }, [navigate]);
  
  // Apply filters
  useEffect(() => {
    let result = movies;
    
    // Search term filter
    if (searchTerm) {
      result = result.filter(movie => 
        movie.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Genre filter
    if (filterGenre) {
      result = result.filter(movie => movie.genre === filterGenre);
    }
    
    // Director filter
    if (filterDirector) {
      result = result.filter(movie => 
        movie.director.toLowerCase().includes(filterDirector.toLowerCase())
      );
    }
    
    // Actor filter
    if (filterActor) {
      result = result.filter(movie => 
        movie.actors.some(actor => 
          actor.toLowerCase().includes(filterActor.toLowerCase())
        )
      );
    }
    
    // Rating filter
    if (filterRating) {
      const minRating = parseFloat(filterRating);
      result = result.filter(movie => movie.rating >= minRating);
    }
    
    setFilteredMovies(result);
  }, [movies, searchTerm, filterGenre, filterDirector, filterActor, filterRating]);
  
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    toast.success('Logged out successfully');
    navigate('/login');
  };
  
  return (
    <PageTransition>
      <div className="min-h-screen py-6 px-6">
        <div className="w-full max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              icon={<ArrowLeft size={16} />}
            >
              Back to Home
            </Button>
            
            <div className="flex gap-2">
              <Button 
                variant="primary" 
                onClick={() => navigate('/register-movie')}
                icon={<Plus size={16} />}
              >
                Add Movie
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          </div>
          
          <AppHeader 
            title="Movie Catalog" 
            subtitle="Browse and filter our collection of movies"
          />
          
          {/* Filters */}
          <motion.div 
            className="card p-6 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <h3 className="text-lg font-semibold mb-4">Filter Movies</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
              <InputField
                label="Search Title"
                id="search"
                placeholder="Search movies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search size={18} />}
              />
              
              <SelectField
                label="Genre"
                id="genre"
                value={filterGenre}
                onChange={(e) => setFilterGenre(e.target.value)}
                options={[
                  { value: "", label: "All Genres" },
                  { value: "action", label: "Action" },
                  { value: "comedy", label: "Comedy" },
                  { value: "drama", label: "Drama" },
                  { value: "horror", label: "Horror" },
                  { value: "sci-fi", label: "Science Fiction" },
                  { value: "crime", label: "Crime" }
                ]}
                icon={<Tag size={18} />}
              />
              
              <InputField
                label="Director"
                id="director"
                placeholder="Filter by director..."
                value={filterDirector}
                onChange={(e) => setFilterDirector(e.target.value)}
                icon={<Users size={18} />}
              />
              
              <InputField
                label="Actor/Actress"
                id="actor"
                placeholder="Filter by actor..."
                value={filterActor}
                onChange={(e) => setFilterActor(e.target.value)}
                icon={<Users size={18} />}
              />
              
              <SelectField
                label="Minimum Rating"
                id="rating"
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
                options={[
                  { value: "", label: "Any Rating" },
                  { value: "9", label: "9+ ★" },
                  { value: "8", label: "8+ ★" },
                  { value: "7", label: "7+ ★" },
                  { value: "6", label: "6+ ★" }
                ]}
                icon={<Star size={18} />}
              />
            </div>
          </motion.div>
          
          {/* Movies Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMovies.length > 0 ? (
              filteredMovies.map((movie) => (
                <motion.div 
                  key={movie.id}
                  className="card overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <div className="relative h-60 overflow-hidden bg-gray-100">
                    <img 
                      src={movie.poster} 
                      alt={movie.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-semibold">{movie.title}</h3>
                      <div className="flex items-center bg-amber-50 text-amber-600 px-2 py-1 rounded-md">
                        <Star size={14} className="mr-1" />
                        <span>{movie.rating}</span>
                      </div>
                    </div>
                    <p className="text-muted-foreground text-sm mt-1">
                      {movie.releaseDate.split('-')[0]} • {movie.genre.charAt(0).toUpperCase() + movie.genre.slice(1)}
                    </p>
                    <p className="mt-2 text-sm"><span className="font-medium">Director:</span> {movie.director}</p>
                    <p className="mt-1 text-sm"><span className="font-medium">Cast:</span> {movie.actors.join(', ')}</p>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Film size={48} className="mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No movies found</h3>
                <p className="text-muted-foreground">Try adjusting your filters</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Movies;
