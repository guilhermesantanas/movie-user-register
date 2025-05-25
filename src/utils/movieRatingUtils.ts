
import { supabase } from '@/integrations/supabase/client';

export interface UserRating {
  userRating: number | null;
  userRatingId: string | null;
}

export const fetchUserRating = async (movieId: string, userId: string): Promise<UserRating> => {
  try {
    const { data, error } = await supabase
      .from('movie_ratings')
      .select('*')
      .eq('movie_id', movieId)
      .eq('user_id', userId)
      .maybeSingle();
      
    if (!error && data) {
      return {
        userRating: data.rating,
        userRatingId: data.id
      };
    }
  } catch (error) {
    console.error('Error fetching user rating:', error);
  }
  
  return {
    userRating: null,
    userRatingId: null
  };
};

export const fetchMovieRatings = async (movieId: string) => {
  try {
    const { data, error } = await supabase
      .from('movie_ratings')
      .select('rating')
      .eq('movie_id', movieId);
      
    if (!error && data && data.length > 0) {
      const total = data.reduce((sum, item) => sum + item.rating, 0);
      return {
        averageRating: total / data.length,
        ratingCount: data.length
      };
    }
  } catch (error) {
    console.error('Error fetching movie ratings:', error);
  }
  
  return {
    averageRating: 0,
    ratingCount: 0
  };
};

export const submitRating = async (movieId: string, userId: string, rating: number, existingRatingId?: string) => {
  if (existingRatingId) {
    // Update existing rating
    const { error } = await supabase
      .from('movie_ratings')
      .update({ rating })
      .eq('id', existingRatingId);
      
    if (error) throw error;
    return 'updated';
  } else {
    // Insert new rating
    const { error } = await supabase
      .from('movie_ratings')
      .insert({ 
        movie_id: movieId,
        user_id: userId,
        rating 
      });
      
    if (error) throw error;
    return 'created';
  }
};
