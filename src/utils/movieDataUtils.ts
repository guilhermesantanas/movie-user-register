
import { Movie, CompleteMovie } from '@/types/movies';

/**
 * Ensures all movies have required fields with proper defaults
 */
export const validateMovieData = (movies: any[]): Movie[] => {
  return movies.map(movie => ({
    ...movie,
    created_at: movie.created_at || new Date().toISOString(),
    poster_url: movie.poster_url || undefined,
    registered_by: movie.registered_by || undefined,
    imdb_rating: movie.imdb_rating || undefined,
    language: movie.language || undefined,
    rating: movie.rating || undefined,
    trailer_url: movie.trailer_url || undefined
  }));
};

/**
 * Converts a movie to a complete movie with all required fields
 */
export const makeCompleteMovie = (movie: Movie): CompleteMovie => {
  return {
    ...movie,
    poster_url: movie.poster_url || '',
    registered_by: movie.registered_by || 'Unknown',
    imdb_rating: movie.imdb_rating || 0,
    language: movie.language || 'Unknown',
    rating: movie.rating || 'Unknown',
    trailer_url: movie.trailer_url || ''
  };
};

/**
 * Checks if a specific movie exists in the array
 */
export const movieExists = (movies: Movie[], titleToCheck: string): boolean => {
  return movies.some(movie => 
    movie.title.toLowerCase().includes(titleToCheck.toLowerCase())
  );
};
