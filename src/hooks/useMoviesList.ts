
import { useState } from 'react';
import { useMoviesData } from './useMoviesData';
import { useMoviesSearch } from './useMoviesSearch';
import { useMovieManagement } from './useMovieManagement';

/**
 * Hook to manage the movies list, including fetching,
 * searching, and deletion functionality
 */
export const useMoviesList = () => {
  const { movies, setMovies, isLoading } = useMoviesData();
  const { searchTerm, filteredMovies, handleSearch } = useMoviesSearch(movies);
  const { handleDeleteMovie } = useMovieManagement(movies, setMovies);
  // Adding usesSampleData property (default to false since we're using real Supabase data)
  const usesSampleData = false;
  
  return {
    movies,
    filteredMovies,
    isLoading,
    searchTerm,
    handleSearch,
    handleDeleteMovie,
    usesSampleData
  };
};
