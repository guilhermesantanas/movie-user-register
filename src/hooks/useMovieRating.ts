
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';
import { 
  UserRating, 
  fetchUserRating, 
  fetchMovieRatings, 
  submitRating 
} from '@/utils/movieRatingUtils';

export const useMovieRating = (movieId: string) => {
  const [averageRating, setAverageRating] = useState<number>(0);
  const [ratingCount, setRatingCount] = useState<number>(0);
  const [user, setUser] = useState<any>(null);
  const [userRating, setUserRating] = useState<UserRating>({
    userRating: null,
    userRatingId: null
  });

  const loadRatings = async () => {
    const ratingsData = await fetchMovieRatings(movieId);
    setAverageRating(ratingsData.averageRating);
    setRatingCount(ratingsData.ratingCount);
  };

  useEffect(() => {
    const fetchUserAndRatings = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setUser({ id: session.user.id });
          const userRatingData = await fetchUserRating(movieId, session.user.id);
          setUserRating(userRatingData);
        }
        
        await loadRatings();
      } catch (error) {
        console.error('Error fetching user or ratings:', error);
      }
    };

    fetchUserAndRatings();
  }, [movieId]);

  const handleRateMovie = async (rating: number) => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      toast("Por favor, faça login para avaliar este filme");
      return;
    }

    try {
      const userId = session.user.id;
      const action = await submitRating(movieId, userId, rating, userRating.userRatingId || undefined);
      
      toast(action === 'updated' ? "Sua avaliação foi atualizada" : "Obrigado por avaliar este filme!");

      // Refresh ratings and user rating
      await loadRatings();
      const updatedUserRating = await fetchUserRating(movieId, userId);
      setUserRating(updatedUserRating);
    } catch (error: any) {
      toast("Erro ao enviar avaliação: " + (error.message || "Falha desconhecida"));
    }
  };

  return {
    averageRating,
    ratingCount,
    userRating: userRating.userRating,
    userRatingId: userRating.userRatingId,
    user,
    handleRateMovie
  };
};
