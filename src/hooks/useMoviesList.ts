
import { useState } from 'react';
import { useMoviesData } from './useMoviesData';
import { useMoviesSearch } from './useMoviesSearch';
import { useMovieManagement } from './useMovieManagement';

/**
 * Hook to manage the movies list, including fetching,
 * searching, filtering, and deletion functionality
 */
export const useMoviesList = () => {
  const { movies, setMovies, isLoading } = useMoviesData();
  const { 
    searchTerm, 
    filteredMovies, 
    handleSearch, 
    filters, 
    setFilters,
    clearFilters,
    genreOptions,
    ratingOptions,
    languageOptions,
    yearOptions
  } = useMoviesSearch(movies);
  const { handleDeleteMovie } = useMovieManagement(movies, setMovies);
  const usesSampleData = false;
  
  return {
    movies,
    filteredMovies,
    isLoading,
    searchTerm,
    handleSearch,
    handleDeleteMovie,
    usesSampleData,
    filters,
    setFilters,
    clearFilters,
    genreOptions,
    ratingOptions,
    languageOptions,
    yearOptions
  };
};
