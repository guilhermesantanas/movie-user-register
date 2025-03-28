
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Film, Plus, Search, X } from 'lucide-react';
import { toast } from 'sonner';

import { supabase } from '@/integrations/supabase/client';
import PageTransition from '@/components/PageTransition';
import AppHeader from '@/components/AppHeader';
import Button from '@/components/Button';
import InputField from '@/components/InputField';
import MovieCard from '@/components/MovieCard'; // Add this import
import { 
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface Movie {
  id: string;
  title: string;
  release_date: string;
  duration: number;
  genre: string;
  director: string;
  synopsis: string;
  poster_url?: string;
  registered_by?: string;
  imdb_rating?: number;
  language?: string;
  rating?: string;
}

// Sample movie data to show when database is empty
const sampleMovies: Movie[] = [
  {
    id: 'sample-1',
    title: 'The Shawshank Redemption',
    release_date: '1994-09-23',
    duration: 142,
    genre: 'drama',
    director: 'Frank Darabont',
    synopsis: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
    poster_url: 'https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_.jpg',
    imdb_rating: 9.3,
    language: 'English',
    rating: 'R'
  },
  {
    id: 'sample-2',
    title: 'The Godfather',
    release_date: '1972-03-24',
    duration: 175,
    genre: 'crime',
    director: 'Francis Ford Coppola',
    synopsis: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
    poster_url: 'https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg',
    imdb_rating: 9.2,
    language: 'English, Italian, Latin',
    rating: 'R'
  },
  {
    id: 'sample-3',
    title: 'Pulp Fiction',
    release_date: '1994-10-14',
    duration: 154,
    genre: 'crime',
    director: 'Quentin Tarantino',
    synopsis: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
    poster_url: 'https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg',
    imdb_rating: 8.9,
    language: 'English, Spanish, French',
    rating: 'R'
  },
  {
    id: 'sample-4',
    title: 'Inception',
    release_date: '2010-07-16',
    duration: 148,
    genre: 'sci-fi',
    director: 'Christopher Nolan',
    synopsis: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    poster_url: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg',
    imdb_rating: 8.8,
    language: 'English, Japanese, French',
    rating: 'PG-13'
  },
  {
    id: 'sample-5',
    title: 'The Dark Knight',
    release_date: '2008-07-18',
    duration: 152,
    genre: 'action',
    director: 'Christopher Nolan',
    synopsis: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    poster_url: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg',
    imdb_rating: 9.0,
    language: 'English, Mandarin',
    rating: 'PG-13'
  },
  {
    id: 'sample-6',
    title: 'Parasite',
    release_date: '2019-11-08',
    duration: 132,
    genre: 'thriller',
    director: 'Bong Joon Ho',
    synopsis: 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.',
    poster_url: 'https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_.jpg',
    imdb_rating: 8.5,
    language: 'Korean, English',
    rating: 'R'
  }
];

const Movies = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [usesSampleData, setUsesSampleData] = useState(false);
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  
  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true);
      try {
        const { data: authData } = await supabase.auth.getSession();
        
        const { data, error } = await supabase
          .from('movies')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) {
          throw error;
        }
        
        // Check if we got any data from Supabase
        if (data && data.length > 0) {
          // Combine sample movies with database movies
          const combinedMovies = [...data, ...sampleMovies];
          setMovies(combinedMovies);
          setFilteredMovies(combinedMovies);
          setUsesSampleData(true);
          console.log('Movies loaded from database and sample data combined:', combinedMovies);
        } else {
          // If no movies are in the database, use sample movies
          console.log('No movies in database, using sample data');
          setMovies(sampleMovies);
          setFilteredMovies(sampleMovies);
          setUsesSampleData(true);
          toast.info('Showing sample movie data for demonstration purposes');
        }
      } catch (error) {
        console.error('Error fetching movies:', error);
        
        // Fallback to sample data if there's an error
        setMovies(sampleMovies);
        setFilteredMovies(sampleMovies);
        setUsesSampleData(true);
        toast.error('Failed to load movies from database. Showing sample data instead.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMovies();
  }, []);
  
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredMovies(movies);
    } else {
      const filtered = movies.filter(movie => 
        movie.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.director?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.genre?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMovies(filtered);
    }
  }, [searchTerm, movies]);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleDeleteMovie = async (movieId: string) => {
    try {
      // Check if it's a sample movie (starts with 'sample-')
      if (movieId.startsWith('sample-')) {
        // For sample movies, just remove from the UI
        const updatedMovies = movies.filter(movie => movie.id !== movieId);
        setMovies(updatedMovies);
        setFilteredMovies(updatedMovies);
        toast.success('Sample movie removed from view');
        return;
      }
      
      // For real database movies, delete from Supabase
      const { error } = await supabase
        .from('movies')
        .delete()
        .eq('id', movieId);
        
      if (error) {
        throw error;
      }
      
      // Update UI after successful deletion
      const updatedMovies = movies.filter(movie => movie.id !== movieId);
      setMovies(updatedMovies);
      setFilteredMovies(updatedMovies);
      
      toast.success('Movie deleted successfully');
    } catch (error) {
      console.error('Error deleting movie:', error);
      toast.error('Failed to delete movie. Please try again.');
    }
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
          
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : filteredMovies.length === 0 ? (
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
