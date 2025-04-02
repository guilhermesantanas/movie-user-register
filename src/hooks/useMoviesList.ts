
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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

// Sample movie data for when database is empty
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

export const useMoviesList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [usesSampleData, setUsesSampleData] = useState(false);
  
  // Fetch movies from database or sample data
  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true);
      try {
        // Get the array of deleted sample movie IDs from localStorage
        const deletedSampleMovieIds = JSON.parse(localStorage.getItem('deletedSampleMovieIds') || '[]');
        
        // Filter out any sample movies that were previously deleted
        const filteredSampleMovies = sampleMovies.filter(movie => 
          !deletedSampleMovieIds.includes(movie.id)
        );
        
        // Fetch movies from Supabase
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
          // Only use database movies, no sample movies
          setMovies(data);
          setFilteredMovies(data);
          setUsesSampleData(false);
          console.log('Movies loaded from database:', data);
        } else {
          // If no movies are in the database, use filtered sample movies
          console.log('No movies in database, using sample data');
          setMovies(filteredSampleMovies);
          setFilteredMovies(filteredSampleMovies);
          setUsesSampleData(true);
          toast.info('Showing sample movie data for demonstration purposes');
        }
      } catch (error) {
        console.error('Error fetching movies:', error);
        
        // Get the array of deleted sample movie IDs from localStorage
        const deletedSampleMovieIds = JSON.parse(localStorage.getItem('deletedSampleMovieIds') || '[]');
        
        // Filter out any sample movies that were previously deleted
        const filteredSampleMovies = sampleMovies.filter(movie => 
          !deletedSampleMovieIds.includes(movie.id)
        );
        
        // Fallback to filtered sample data if there's an error
        setMovies(filteredSampleMovies);
        setFilteredMovies(filteredSampleMovies);
        setUsesSampleData(true);
        toast.error('Failed to load movies from database. Showing sample data instead.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMovies();
  }, []);
  
  // Filter movies based on search term
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
        // For sample movies, remove from local UI state
        const updatedMovies = movies.filter(movie => movie.id !== movieId);
        setMovies(updatedMovies);
        setFilteredMovies(updatedMovies);
        
        // Add to deleted sample movie IDs in localStorage
        const deletedSampleMovieIds = JSON.parse(localStorage.getItem('deletedSampleMovieIds') || '[]');
        if (!deletedSampleMovieIds.includes(movieId)) {
          deletedSampleMovieIds.push(movieId);
          localStorage.setItem('deletedSampleMovieIds', JSON.stringify(deletedSampleMovieIds));
        }
        
        // Also check if this movie is in localStorage as a viewed movie
        const recentlyViewedMovies = JSON.parse(localStorage.getItem('recentlyViewedMovies') || '[]');
        const updatedRecentlyViewed = recentlyViewedMovies.filter((movie: any) => movie.id !== movieId);
        localStorage.setItem('recentlyViewedMovies', JSON.stringify(updatedRecentlyViewed));
        
        toast.success('Sample movie removed');
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
      
      // Also clean up any local storage references
      const recentlyViewedMovies = JSON.parse(localStorage.getItem('recentlyViewedMovies') || '[]');
      const updatedRecentlyViewed = recentlyViewedMovies.filter((movie: any) => movie.id !== movieId);
      localStorage.setItem('recentlyViewedMovies', JSON.stringify(updatedRecentlyViewed));
      
      toast.success('Movie deleted successfully');
    } catch (error) {
      console.error('Error deleting movie:', error);
      toast.error('Failed to delete movie. Please try again.');
    }
  };
  
  return {
    movies,
    filteredMovies,
    isLoading,
    usesSampleData,
    searchTerm,
    handleSearch,
    handleDeleteMovie
  };
};
