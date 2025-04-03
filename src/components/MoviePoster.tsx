
import React from 'react';
import RatingStars from '@/components/RatingStars';

interface MoviePosterProps {
  posterUrl: string;
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
  // Convert 10-scale rating to 5-scale for display
  const displayRating = averageRating / 2;
  
  return (
    <div className="md:col-span-1">
      <div className="relative rounded-lg overflow-hidden shadow-lg">
        <img 
          src={posterUrl || '/placeholder.svg'} 
          alt={title} 
          className="w-full h-auto object-cover"
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
                onRatingChange={(rating) => onRateMovie(rating * 2)} // Convert 5-scale back to 10-scale
                maxRating={5}
              />
            </div>
          )}
          
          {!userLoggedIn && (
            <p className="text-sm text-muted-foreground mt-2">
              Log in to rate this movie
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MoviePoster;
