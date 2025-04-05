
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Movie } from '@/types/movies';

export const useMovieData = (movieId: string | undefined) => {
  const { toast } = useToast();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchMovie = async () => {
      if (!movieId) {
        setError('Movie ID is required');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('movies')
          .select('*')
          .eq('id', movieId)
          .maybeSingle(); // Use maybeSingle instead of single to avoid errors when no rows are returned
          
        if (error) throw error;
        
        if (data) {
          setMovie(data as Movie);
        } else {
          setError('Movie not found');
        }
      } catch (error: any) {
        setError(error.message);
        toast({
          title: "Error",
          description: "Failed to load movie details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [movieId, toast]);
  
  return { movie, loading, error };
};
