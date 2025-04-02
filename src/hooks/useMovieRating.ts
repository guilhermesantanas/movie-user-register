
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UserRating {
  userRating: number | null;
  userRatingId: string | null;
}

export const useMovieRating = (movieId: string) => {
  const { toast } = useToast();
  const [averageRating, setAverageRating] = useState<number>(0);
  const [ratingCount, setRatingCount] = useState<number>(0);
  const [user, setUser] = useState<any>(null);
  const [userRating, setUserRating] = useState<UserRating>({
    userRating: null,
    userRatingId: null
  });

  useEffect(() => {
    const fetchUserAndRatings = async () => {
      try {
        // Get current user
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          
          // Fetch user's rating for this movie if they're logged in
          const { data: userRatingData, error: userRatingError } = await supabase
            .from('movie_ratings')
            .select('*')
            .eq('movie_id', movieId)
            .eq('user_id', session.user.id)
            .maybeSingle();
            
          if (!userRatingError && userRatingData) {
            setUserRating({
              userRating: userRatingData.rating,
              userRatingId: userRatingData.id
            });
          }
        }
        
        // Fetch average rating and count
        const { data: ratingsData, error: ratingsError } = await supabase
          .from('movie_ratings')
          .select('rating')
          .eq('movie_id', movieId);
          
        if (!ratingsError && ratingsData && ratingsData.length > 0) {
          const total = ratingsData.reduce((sum, item) => sum + item.rating, 0);
          setAverageRating(total / ratingsData.length);
          setRatingCount(ratingsData.length);
        }
      } catch (error) {
        console.error('Error fetching user or ratings:', error);
      }
    };

    fetchUserAndRatings();
  }, [movieId]);

  const handleRateMovie = async (rating: number) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to rate this movie",
        variant: "destructive",
      });
      return;
    }

    try {
      if (userRating.userRatingId) {
        // Update existing rating
        const { error } = await supabase
          .from('movie_ratings')
          .update({ rating })
          .eq('id', userRating.userRatingId);
          
        if (error) throw error;
        
        toast({
          title: "Rating Updated",
          description: "Your rating has been updated",
        });
      } else {
        // Insert new rating
        const { error } = await supabase
          .from('movie_ratings')
          .insert({ 
            movie_id: movieId,
            user_id: user.id,
            rating 
          });
          
        if (error) throw error;
        
        toast({
          title: "Rating Submitted",
          description: "Thanks for rating this movie!",
        });
      }

      // Refresh ratings
      const { data: ratingsData, error: ratingsError } = await supabase
        .from('movie_ratings')
        .select('*')
        .eq('movie_id', movieId);
        
      if (!ratingsError && ratingsData) {
        const total = ratingsData.reduce((sum, item) => sum + item.rating, 0);
        setAverageRating(ratingsData.length > 0 ? total / ratingsData.length : 0);
        setRatingCount(ratingsData.length);
        
        // Update user rating in state
        const userRatingData = ratingsData.find(item => item.user_id === user.id);
        if (userRatingData) {
          setUserRating({
            userRating: userRatingData.rating,
            userRatingId: userRatingData.id
          });
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit rating",
        variant: "destructive",
      });
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
