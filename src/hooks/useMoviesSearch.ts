
import { useState, useEffect } from 'react';
import { Movie } from '@/types/movies';
import { MovieFilters } from '@/components/MovieFilter';

/**
 * Hook for searching and filtering movies
 */
export const useMoviesSearch = (movies: Movie[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<MovieFilters>({});
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>(movies);
  
  // Extract all unique values for filter options
  const genreOptions = [...new Set(movies.filter(m => m.genre).map(m => m.genre))]
    .sort()
    .map(genre => ({ label: genre as string, value: genre as string }));
    
  const ratingOptions = [...new Set(movies.filter(m => m.rating).map(m => m.rating))]
    .sort()
    .map(rating => ({ label: rating as string, value: rating as string }));
    
  const languageOptions = [...new Set(movies.filter(m => m.language).map(m => m.language))]
    .sort()
    .map(language => ({ label: language as string, value: language as string }));
    
  const yearOptions = [...new Set(movies
    .filter(m => m.release_date)
    .map(m => new Date(m.release_date).getFullYear().toString()))]
    .sort((a, b) => parseInt(b) - parseInt(a))
    .map(year => ({ label: year, value: year }));
  
  // Clear all filters
  const clearFilters = () => {
    setFilters({});
  };
  
  // Filter movies based on search term and filter options
  useEffect(() => {
    let result = [...movies];
    
    // Apply search term filter
    if (searchTerm.trim() !== '') {
      const search = searchTerm.toLowerCase();
      result = result.filter(movie => 
        movie.title?.toLowerCase().includes(search) ||
        movie.director?.toLowerCase().includes(search) ||
        movie.genre?.toLowerCase().includes(search)
      );
    }
    
    // Apply genre filter
    if (filters.genre) {
      result = result.filter(movie => movie.genre === filters.genre);
    }
    
    // Apply rating filter
    if (filters.rating) {
      result = result.filter(movie => movie.rating === filters.rating);
    }
    
    // Apply language filter
    if (filters.language) {
      result = result.filter(movie => movie.language === filters.language);
    }
    
    // Apply year filter
    if (filters.year) {
      result = result.filter(movie => {
        if (!movie.release_date) return false;
        const releaseYear = new Date(movie.release_date).getFullYear().toString();
        return releaseYear === filters.year;
      });
    }
    
    setFilteredMovies(result);
  }, [searchTerm, movies, filters]);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  return { 
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
  };
};
