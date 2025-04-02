
import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingStarsProps {
  maxRating?: number;
  currentRating: number;
  onRatingChange?: (rating: number) => void;
  interactive?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const RatingStars: React.FC<RatingStarsProps> = ({
  maxRating = 10,
  currentRating = 0,
  onRatingChange,
  interactive = true,
  size = 'md'
}) => {
  const [hoverRating, setHoverRating] = React.useState(0);
  
  const starSizes = {
    sm: 16,
    md: 20,
    lg: 24
  };
  
  const starSize = starSizes[size];
  
  const handleMouseEnter = (rating: number) => {
    if (interactive) {
      setHoverRating(rating);
    }
  };
  
  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0);
    }
  };
  
  const handleClick = (rating: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(rating);
    }
  };
  
  return (
    <div 
      className={cn(
        "flex", 
        interactive ? "cursor-pointer" : "cursor-default"
      )}
    >
      {[...Array(maxRating)].map((_, index) => {
        const rating = index + 1;
        const filled = hoverRating ? rating <= hoverRating : rating <= currentRating;
        const halfFilled = !filled && (rating - 0.5 <= currentRating);
        
        return (
          <span
            key={index}
            onMouseEnter={() => handleMouseEnter(rating)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(rating)}
            className={cn(
              "transition-colors",
              interactive && "hover:scale-110 transition-transform"
            )}
          >
            <Star
              size={starSize}
              className={cn(
                filled ? "text-yellow-400 fill-yellow-400" : 
                halfFilled ? "text-yellow-400 fill-yellow-400/50" : "text-muted-foreground",
                interactive && !filled && "hover:text-yellow-200",
                "transition-colors"
              )}
            />
          </span>
        );
      })}
    </div>
  );
};

export default RatingStars;
