
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, Star, User, Video, Tag, Globe, FileText } from 'lucide-react';
import { toast } from 'sonner';

import { supabase } from '@/integrations/supabase/client';
import PageTransition from '@/components/PageTransition';
import AppHeader from '@/components/AppHeader';
import Button from '@/components/Button';
import RatingStars from '@/components/RatingStars';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Movie {
  id: string;
  title: string;
  release_date: string;
  duration: number;
  genre: string;
  director: string;
  synopsis: string;
  poster_url?: string;
  trailer_url?: string;
  registered_by?: string;
  imdb_rating?: number;
  language?: string;
  rating?: string;
}

interface MovieRating {
  movie_id: string;
  rating: number;
  user_id?: string;
  created_at: string;
}

const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [ratingCount, setRatingCount] = useState(0);
  const [isSampleMovie, setIsSampleMovie] = useState(false);
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  
  const fetchMovie = async () => {
    if (!id) return;
    
    setIsLoading(true);
    
    try {
      // Check if it's a sample movie (id starting with 'sample-')
      if (id.startsWith('sample-')) {
        // Get sample movies from local storage (if available) or use the default array
        const deletedSampleMovieIds = JSON.parse(localStorage.getItem('deletedSampleMovieIds') || '[]');
        
        // Import the sample movies array from Movies.tsx
        // For simplicity in this implementation, we'll hard-code the sample movies
        const sampleMovies = [
          {
            id: 'sample-1',
            title: 'The Shawshank Redemption',
            release_date: '1994-09-23',
            duration: 142,
            genre: 'drama',
            director: 'Frank Darabont',
            synopsis: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
            poster_url: 'https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_.jpg',
            imdb_rating: 9.3,
            language: 'English',
            rating: 'R',
            trailer_url: 'https://www.youtube.com/embed/6hB3S9bIaco'
          },
          {
            id: 'sample-2',
            title: 'The Godfather',
            release_date: '1972-03-24',
            duration: 175,
            genre: 'crime',
            director: 'Francis Ford Coppola',
            synopsis: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
            poster_url: 'https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg',
            imdb_rating: 9.2,
            language: 'English, Italian, Latin',
            rating: 'R',
            trailer_url: 'https://www.youtube.com/embed/sY1S34973zA'
          },
          {
            id: 'sample-3',
            title: 'Pulp Fiction',
            release_date: '1994-10-14',
            duration: 154,
            genre: 'crime',
            director: 'Quentin Tarantino',
            synopsis: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
            poster_url: 'https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg',
            imdb_rating: 8.9,
            language: 'English, Spanish, French',
            rating: 'R',
            trailer_url: 'https://www.youtube.com/embed/s7EdQ4FqbhY'
          },
          {
            id: 'sample-4',
            title: 'Inception',
            release_date: '2010-07-16',
            duration: 148,
            genre: 'sci-fi',
            director: 'Christopher Nolan',
            synopsis: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
            poster_url: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg',
            imdb_rating: 8.8,
            language: 'English, Japanese, French',
            rating: 'PG-13',
            trailer_url: 'https://www.youtube.com/embed/YoHD9XEInc0'
          },
          {
            id: 'sample-5',
            title: 'The Dark Knight',
            release_date: '2008-07-18',
            duration: 152,
            genre: 'action',
            director: 'Christopher Nolan',
            synopsis: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
            poster_url: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg',
            imdb_rating: 9.0,
            language: 'English, Mandarin',
            rating: 'PG-13',
            trailer_url: 'https://www.youtube.com/embed/EXeTwQWrcwY'
          },
          {
            id: 'sample-6',
            title: 'Parasite',
            release_date: '2019-11-08',
            duration: 132,
            genre: 'thriller',
            director: 'Bong Joon Ho',
            synopsis: 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.',
            poster_url: 'https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_.jpg',
            imdb_rating: 8.5,
            language: 'Korean, English',
            rating: 'R',
            trailer_url: 'https://www.youtube.com/embed/isOGD_7hNIY'
          }
        ];
        
        const foundMovie = sampleMovies.find(movie => movie.id === id);
        
        if (foundMovie && !deletedSampleMovieIds.includes(id)) {
          setMovie(foundMovie);
          setIsSampleMovie(true);
          setAverageRating(foundMovie.imdb_rating || null);
          setRatingCount(1); // Assume 1 rating for sample movies (IMDb)
        } else {
          toast.error('Movie not found');
          navigate('/movies');
        }
      } else {
        // Fetch from Supabase for real movies
        const { data: movieData, error: movieError } = await supabase
          .from('movies')
          .select('*')
          .eq('id', id)
          .single();
        
        if (movieError) {
          throw movieError;
        }
        
        if (!movieData) {
          toast.error('Movie not found');
          navigate('/movies');
          return;
        }
        
        setMovie(movieData);
        
        // Fetch all ratings for this movie
        const { data: ratingsData, error: ratingsError } = await supabase
          .from('movie_ratings')
          .select('*')
          .eq('movie_id', id);
        
        if (ratingsError) {
          console.error('Error fetching ratings:', ratingsError);
        } else if (ratingsData && ratingsData.length > 0) {
          // Calculate average rating
          const total = ratingsData.reduce((sum, rating) => sum + rating.rating, 0);
          setAverageRating(parseFloat((total / ratingsData.length).toFixed(1)));
          setRatingCount(ratingsData.length);
          
          // Check if the current user has already rated this movie
          if (isLoggedIn) {
            const { data: userData } = await supabase.auth.getSession();
            const userId = userData.session?.user.id;
            
            if (userId) {
              const userRatingData = ratingsData.find(rating => rating.user_id === userId);
              if (userRatingData) {
                setUserRating(userRatingData.rating);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error fetching movie details:', error);
      toast.error('Failed to load movie details');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchMovie();
  }, [id]);
  
  const handleRatingChange = async (newRating: number) => {
    if (!isLoggedIn) {
      toast.error('You must be logged in to rate movies');
      navigate('/login');
      return;
    }
    
    if (isSampleMovie) {
      toast.error('Rating sample movies is not supported');
      return;
    }
    
    try {
      const { data: userData } = await supabase.auth.getSession();
      const userId = userData.session?.user.id;
      
      if (!userId) {
        toast.error('Authentication error. Please log in again');
        navigate('/login');
        return;
      }
      
      if (userRating) {
        // Update existing rating
        const { error } = await supabase
          .from('movie_ratings')
          .update({ rating: newRating })
          .eq('movie_id', id)
          .eq('user_id', userId);
        
        if (error) throw error;
        toast.success('Your rating has been updated');
      } else {
        // Insert new rating
        const { error } = await supabase
          .from('movie_ratings')
          .insert({
            movie_id: id as string,
            user_id: userId,
            rating: newRating
          });
        
        if (error) throw error;
        toast.success('Your rating has been submitted');
      }
      
      // Update UI and refetch ratings
      setUserRating(newRating);
      fetchMovie();
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast.error('Failed to submit rating. Please try again');
    }
  };
  
  if (isLoading) {
    return (
      <PageTransition>
        <div className="min-h-screen py-12 px-6">
          <div className="w-full max-w-7xl mx-auto">
            <div className="flex justify-center items-center py-24">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }
  
  if (!movie) {
    return (
      <PageTransition>
        <div className="min-h-screen py-12 px-6">
          <div className="w-full max-w-7xl mx-auto">
            <Button 
              variant="outline" 
              className="mb-6" 
              onClick={() => navigate('/movies')}
              icon={<ArrowLeft size={16} />}
            >
              Back to Movies
            </Button>
            
            <div className="text-center p-12 border border-dashed rounded-lg">
              <h3 className="text-xl font-medium mb-2">Movie not found</h3>
              <p className="text-muted-foreground mb-4">
                The movie you're looking for doesn't exist or has been removed.
              </p>
              <Button onClick={() => navigate('/movies')}>
                Browse Movies
              </Button>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }
  
  return (
    <PageTransition>
      <div className="min-h-screen py-12 px-6">
        <div className="w-full max-w-7xl mx-auto">
          <Button 
            variant="outline" 
            className="mb-6" 
            onClick={() => navigate('/movies')}
            icon={<ArrowLeft size={16} />}
          >
            Back to Movies
          </Button>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Movie Poster */}
            <div className="lg:col-span-1">
              <motion.div 
                className="sticky top-6 aspect-[2/3] bg-muted rounded-xl overflow-hidden shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {movie.poster_url ? (
                  <img 
                    src={movie.poster_url} 
                    alt={movie.title} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                    <Video size={64} className="text-gray-600" />
                  </div>
                )}
              </motion.div>
            </div>
            
            {/* Movie Details */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{movie.title}</h1>
                
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
                  {movie.release_date && (
                    <div className="flex items-center gap-1">
                      <Calendar size={16} />
                      <span>{new Date(movie.release_date).getFullYear()}</span>
                    </div>
                  )}
                  
                  {movie.duration && (
                    <div className="flex items-center gap-1">
                      <Clock size={16} />
                      <span>{movie.duration} min</span>
                    </div>
                  )}
                  
                  {movie.genre && (
                    <div className="flex items-center gap-1">
                      <Tag size={16} />
                      <span className="capitalize">{movie.genre}</span>
                    </div>
                  )}
                  
                  {movie.rating && (
                    <span className="px-2 py-0.5 bg-secondary text-secondary-foreground rounded-md text-xs">
                      {movie.rating}
                    </span>
                  )}
                  
                  {movie.language && (
                    <div className="flex items-center gap-1">
                      <Globe size={16} />
                      <span>{movie.language}</span>
                    </div>
                  )}
                </div>
                
                {/* Movie Trailer */}
                {movie.trailer_url && (
                  <div className="mb-6">
                    <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                      <iframe 
                        width="100%" 
                        height="100%" 
                        src={movie.trailer_url} 
                        title={`${movie.title} trailer`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full object-cover"
                      ></iframe>
                    </div>
                  </div>
                )}
                
                {/* Ratings Section */}
                <Card className="mb-6">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Ratings</CardTitle>
                    {averageRating ? (
                      <CardDescription>
                        Average: <span className="font-medium">{averageRating}</span>/10 
                        <span className="text-xs ml-1">({ratingCount} {ratingCount === 1 ? 'rating' : 'ratings'})</span>
                      </CardDescription>
                    ) : (
                      <CardDescription>No ratings yet</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div>
                      <h4 className="text-sm font-medium mb-2">
                        {userRating ? 'Your rating' : 'Rate this movie'}
                      </h4>
                      <RatingStars 
                        maxRating={10}
                        currentRating={userRating || 0}
                        onRatingChange={handleRatingChange}
                        interactive={isLoggedIn && !isSampleMovie}
                      />
                      
                      {(!isLoggedIn && !isSampleMovie) && (
                        <p className="text-xs text-muted-foreground mt-2">
                          <a href="/login" className="text-primary hover:underline">Log in</a> to rate this movie
                        </p>
                      )}
                      
                      {isSampleMovie && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Rating not available for sample movies
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Synopsis */}
                <Card className="mb-6">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2">
                      <FileText size={18} />
                      Synopsis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {movie.synopsis || 'No synopsis available.'}
                    </p>
                  </CardContent>
                </Card>
                
                {/* Director */}
                {movie.director && (
                  <Card className="mb-6">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2">
                        <User size={18} />
                        Director
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{movie.director}</p>
                    </CardContent>
                  </Card>
                )}
                
                {/* IMDb Rating */}
                {movie.imdb_rating && (
                  <Card className="mb-6">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2">
                        <Star size={18} />
                        IMDb Rating
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-lg">{movie.imdb_rating}</span>
                        <span className="text-sm text-muted-foreground">/10</span>
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                {/* Added by */}
                {movie.registered_by && (
                  <div className="text-xs text-muted-foreground mt-8">
                    Added by: {movie.registered_by}
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default MovieDetails;
