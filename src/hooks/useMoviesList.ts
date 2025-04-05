
import { useMoviesData } from './useMoviesData';
import { useMoviesSearch } from './useMoviesSearch';
import { useMovieManagement } from './useMovieManagement';

export const useMoviesList = () => {
  const { movies, setMovies, isLoading } = useMoviesData();
  const { searchTerm, filteredMovies, handleSearch } = useMoviesSearch(movies);
  const { handleDeleteMovie } = useMovieManagement(movies, setMovies);
  
  return {
    movies,
    filteredMovies,
    isLoading,
    usesSampleData: false, // Always false now that we use Supabase
    searchTerm,
    handleSearch,
    handleDeleteMovie
  };
};
