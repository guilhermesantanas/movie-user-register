
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import PageTransition from '@/components/PageTransition';
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play } from "lucide-react";
import RatingStars from '@/components/RatingStars';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import MovieComments from '@/components/MovieComments';

interface MovieRating {
  id: string;
  movie_id: string;
  user_id: string;
  rating: number;
  created_at: string;
}

interface Movie {
  id: string;
  title: string;
  director: string;
  genre: string;
  release_date: string;
  duration: number;
  imdb_rating: number;
  language: string;
  rating: string;
  synopsis: string;
  poster_url: string;
  trailer_url: string;
}

interface UserRating {
  userRating: number | null;
  userRatingId: string | null;
}

const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [ratingCount, setRatingCount] = useState<number>(0);
  const [user, setUser] = useState<any>(null);
  const [userRating, setUserRating] = useState<UserRating>({
    userRating: null,
    userRatingId: null
  });
  const [trailerOpen, setTrailerOpen] = useState(false);

  // Fetch movie details
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('movies')
          .select('*')
          .eq('id', id)
          .single();
          
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
  }, [id, toast]);

  // Fetch user session and ratings
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
            .eq('movie_id', id)
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
          .eq('movie_id', id);
          
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
  }, [id]);

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
          .insert([{ 
            movie_id: id,
            user_id: user.id,
            rating 
          }]);
          
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
        .eq('movie_id', id);
        
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

  if (loading) {
    return (
      <PageTransition>
        <div className="container max-w-6xl mx-auto py-10">
          <div className="flex justify-center items-center h-[60vh]">
            <p className="text-lg">Loading movie details...</p>
          </div>
        </div>
      </PageTransition>
    );
  }

  if (error || !movie) {
    return (
      <PageTransition>
        <div className="container max-w-6xl mx-auto py-10">
          <div className="flex flex-col justify-center items-center h-[60vh]">
            <p className="text-lg text-red-500 mb-4">{error || "Movie not found"}</p>
            <Button onClick={() => navigate('/movies')}>Back to Movies</Button>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="container max-w-6xl mx-auto py-10 px-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/movies')} 
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Movies
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Movie Poster */}
          <div className="md:col-span-1">
            <div className="relative rounded-lg overflow-hidden shadow-lg">
              <img 
                src={movie.poster_url || '/placeholder.svg'} 
                alt={movie.title} 
                className="w-full h-auto object-cover"
              />
            </div>

            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Movie Rating</h3>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <RatingStars 
                    currentRating={averageRating} 
                    interactive={false} 
                    maxRating={10}
                  />
                  <span className="text-sm text-muted-foreground">
                    ({averageRating.toFixed(1)}/10 from {ratingCount} {ratingCount === 1 ? 'user' : 'users'})
                  </span>
                </div>
                
                {user && (
                  <div className="mt-4">
                    <p className="text-sm mb-1">Your Rating:</p>
                    <RatingStars
                      currentRating={userRating.userRating || 0}
                      onRatingChange={handleRateMovie}
                      maxRating={10}
                    />
                  </div>
                )}
                
                {!user && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Log in to rate this movie
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Movie Information */}
          <div className="md:col-span-2">
            <h1 className="text-3xl font-bold mb-2">{movie.title}</h1>
            
            {movie.trailer_url && (
              <div className="mb-6">
                {trailerOpen ? (
                  <div className="rounded-lg overflow-hidden">
                    <AspectRatio ratio={16/9}>
                      <iframe
                        src={movie.trailer_url}
                        title={`${movie.title} Trailer`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                      ></iframe>
                    </AspectRatio>
                  </div>
                ) : (
                  <Button 
                    onClick={() => setTrailerOpen(true)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <Play className="mr-2 h-4 w-4" /> Watch Trailer
                  </Button>
                )}
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Director</h3>
                <p>{movie.director || 'Not specified'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Genre</h3>
                <p>{movie.genre || 'Not specified'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Release Date</h3>
                <p>{movie.release_date ? new Date(movie.release_date).toLocaleDateString() : 'Not specified'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Duration</h3>
                <p>{movie.duration ? `${movie.duration} min` : 'Not specified'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Language</h3>
                <p>{movie.language || 'Not specified'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">IMDb Rating</h3>
                <p>{movie.imdb_rating || 'Not rated'}</p>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Synopsis</h3>
              <p className="text-gray-700 dark:text-gray-300">
                {movie.synopsis || 'No synopsis available.'}
              </p>
            </div>

            {/* Comments Section */}
            {id && <MovieComments movieId={id} />}
          </div>
        </div>
      </div>
      <Toaster />
    </PageTransition>
  );
};

export default MovieDetails;
