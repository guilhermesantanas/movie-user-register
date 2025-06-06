
import React, { useState } from 'react';
import RatingStars from '@/components/RatingStars';
import { showToast } from '@/utils/toastUtils';

interface MoviePosterProps {
  posterUrl?: string;
  title: string;
  averageRating: number;
  ratingCount: number;
  userRating: number | null;
  userLoggedIn: boolean;
  onRateMovie: (rating: number) => Promise<void>;
}

const MoviePoster = ({ 
  posterUrl, 
  title, 
  averageRating, 
  ratingCount, 
  userRating, 
  userLoggedIn,
  onRateMovie 
}: MoviePosterProps) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  
  // Convert 10-scale rating to 5-scale for display
  const displayRating = averageRating / 2;
  
  const handleRateMovie = async (rating: number) => {
    try {
      if (!userLoggedIn) {
        showToast.info("You need to be logged in to rate this movie");
        return;
      }
      
      // Pass the rating to the parent component's handler
      await onRateMovie(rating);
      
    } catch (error) {
      console.error('Error rating movie:', error);
      showToast.error("An error occurred while submitting your rating");
    }
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };
  
  return (
    <div className="md:col-span-1">
      <div className="relative rounded-lg overflow-hidden shadow-lg bg-muted">
        {imageLoading && (
          <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
            <div className="text-muted-foreground">Loading...</div>
          </div>
        )}
        
        <img 
          src={imageError ? '/placeholder.svg' : (posterUrl || '/placeholder.svg')} 
          alt={`${title} movie poster`}
          className={`w-full h-auto object-cover transition-opacity duration-300 ${
            imageLoading ? 'opacity-0' : 'opacity-100'
          }`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          loading="lazy"
        />
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Movie Rating</h3>
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2">
            <RatingStars 
              currentRating={displayRating} 
              interactive={false} 
              maxRating={5}
            />
            <span className="text-sm text-muted-foreground">
              ({displayRating.toFixed(1)}/5 from {ratingCount} {ratingCount === 1 ? 'user' : 'users'})
            </span>
          </div>
          
          {userLoggedIn && (
            <div className="mt-4">
              <p className="text-sm mb-1">Your Rating:</p>
              <RatingStars
                currentRating={userRating ? userRating / 2 : 0}
                onRatingChange={(rating) => handleRateMovie(rating * 2)} // Convert 5-scale back to 10-scale
                maxRating={5}
                interactive={true}
              />
            </div>
          )}
          
          {!userLoggedIn && (
            <p className="text-sm text-muted-foreground mt-2">
              Please log in to rate this movie
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MoviePoster;
