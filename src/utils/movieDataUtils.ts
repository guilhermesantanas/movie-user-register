
import { Movie } from '@/types/movies';

/**
 * Ensures all movies have required fields with proper defaults
 */
export const validateMovieData = (movies: any[]): Movie[] => {
  return movies.map(movie => ({
    ...movie,
    created_at: movie.created_at || new Date().toISOString(),
    poster_url: movie.poster_url || '',
    registered_by: movie.registered_by || 'Unknown',
    imdb_rating: movie.imdb_rating || 0,
    language: movie.language || 'Unknown',
    rating: movie.rating || 'Unknown',
    trailer_url: movie.trailer_url || ''
  }));
};

/**
 * Checks if a specific movie exists in the array
 */
export const movieExists = (movies: Movie[], titleToCheck: string): boolean => {
  return movies.some(movie => 
    movie.title.toLowerCase().includes(titleToCheck.toLowerCase())
  );
};
