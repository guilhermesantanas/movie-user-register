
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Movie } from '@/types/movies';

/**
 * Hook for fetching movies data from Supabase
 */
export const useMoviesData = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
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
        
        if (data) {
          setMovies(data);
        } else {
          setMovies([]);
          toast.info('Nenhum filme encontrado no banco de dados');
        }
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
