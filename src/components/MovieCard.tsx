
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Film, X } from 'lucide-react';
import { 
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface Movie {
  id: string;
  title: string;
  release_date: string;
  duration: number;
  genre: string;
  director: string;
  synopsis: string;
  poster_url?: string;
  registered_by?: string;
  imdb_rating?: number;
  language?: string;
  rating?: string;
}

interface MovieCardProps {
  movie: Movie;
  onDelete: (id: string) => Promise<void>;
}

const MovieCard = ({ movie, onDelete }: MovieCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    await onDelete(movie.id);
  };
  
  return (
    <motion.div 
      className="card overflow-hidden relative"
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                className="absolute top-2 right-2 z-10 p-1 bg-destructive rounded-full hover:bg-destructive/80 transition-colors"
                onClick={handleDelete}
              >
                <X size={18} className="text-white" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete movie</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      
      <div className="aspect-[2/3] bg-muted relative overflow-hidden">
        {movie.poster_url ? (
          <img 
            src={movie.poster_url} 
            alt={movie.title} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
            <Film size={48} className="text-gray-600" />
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1">{movie.title}</h3>
        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <span>{movie.release_date?.split('-')[0]}</span>
          <span className="mx-2">•</span>
          <span>{movie.duration} min</span>
          <span className="mx-2">•</span>
          <span>{movie.genre}</span>
        </div>
        <p className="text-sm text-muted-foreground mb-2">
          Director: {movie.director}
        </p>
        
        <HoverCard>
          <HoverCardTrigger asChild>
            <p className="text-sm line-clamp-3 cursor-pointer hover:text-primary transition-colors">
              {movie.synopsis}
            </p>
          </HoverCardTrigger>
          <HoverCardContent className="w-96 text-sm">
            <h4 className="font-bold mb-2">Synopsis</h4>
            {movie.synopsis}
          </HoverCardContent>
        </HoverCard>
        
        {movie.registered_by && (
          <p className="text-xs text-muted-foreground mt-3">
            Added by: {movie.registered_by}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default MovieCard;
