
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Movie } from '@/types/movies';

/**
 * Hook for managing movie operations like delete
 */
export const useMovieManagement = (movies: Movie[], setMovies: React.Dispatch<React.SetStateAction<Movie[]>>) => {
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleDeleteMovie = async (movieId: string) => {
    setIsDeleting(true);
    try {
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
      
      // Also clean up any local storage references
      const recentlyViewedMovies = JSON.parse(localStorage.getItem('recentlyViewedMovies') || '[]');
      const updatedRecentlyViewed = recentlyViewedMovies.filter((movie: any) => movie.id !== movieId);
      localStorage.setItem('recentlyViewedMovies', JSON.stringify(updatedRecentlyViewed));
      
      toast.success('Filme excluído com sucesso');
    } catch (error: any) {
      toast.error('Falha ao excluir filme. Por favor, tente novamente.');
      console.error("Deletion error:", error);
    } finally {
      setIsDeleting(false);
    }
  };
  
  return { handleDeleteMovie, isDeleting };
};
