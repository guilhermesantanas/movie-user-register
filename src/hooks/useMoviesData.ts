
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Movie } from '@/types/movies';
import { sampleMovies } from '@/data/movieSampleData';
import { validateMovieData, movieExists } from '@/utils/movieDataUtils';

/**
 * Hook for fetching movies data from Supabase
 */
export const useMoviesData = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const insertSampleMovieIfNotExists = async (movieData: any, moviesData: Movie[]) => {
    const exists = movieExists(moviesData, movieData.title);
    if (!exists) {
      try {
        const movieWithId = {
          id: movieData.title.toLowerCase().replace(/\s+/g, '-'),
          ...movieData
        };
        
        const { error } = await supabase
          .from('movies')
          .insert([movieWithId]);
          
        if (!error) {
          return movieWithId;
        }
      } catch (insertErr) {
        console.error(`Failed to insert movie ${movieData.title}:`, insertErr);
      }
    }
    return null;
  };
  
  // Fetch movies from database
  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('movies')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) {
          throw error;
        }
        
        let moviesData = data || [];
        
        // Add sample movies if database is empty or missing key movies
        if (moviesData.length < 6) {
          for (const movieData of sampleMovies) {
            const insertedMovie = await insertSampleMovieIfNotExists(movieData, moviesData);
            if (insertedMovie) {
              moviesData.push(insertedMovie);
            }
          }
        }
        
        const validMoviesData = validateMovieData(moviesData);
        setMovies(validMoviesData as Movie[]);
        
      } catch (error: any) {
        console.error('Erro ao buscar filmes:', error);
        toast.error('Falha ao carregar filmes do banco de dados.');
        setMovies([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMovies();
  }, []);
  
  return { movies, setMovies, isLoading };
};
