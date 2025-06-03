
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Film, X } from 'lucide-react';
import { useAuth } from '@/contexts/auth';
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
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const { profile } = useAuth();
  const isAdmin = profile?.user_type === 'admin';
  
  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (isDeleting) return;
    
    if (window.confirm(`Are you sure you want to delete the movie "${movie.title}"?`)) {
      try {
        setIsDeleting(true);
        await onDelete(movie.id);
      } catch (error) {
        console.error('Error deleting movie:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };
  
  const handleCardClick = () => {
    navigate(`/movie/${movie.id}`);
  };
  
  return (
    <motion.div 
      className="card overflow-hidden relative cursor-pointer"
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      {isHovered && isAdmin && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                className={`absolute top-2 right-2 z-10 p-1 ${isDeleting ? 'bg-gray-400' : 'bg-destructive'} rounded-full hover:bg-destructive/80 transition-colors`}
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <div className="h-[18px] w-[18px] animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <X size={18} className="text-white" />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isDeleting ? 'Deleting...' : 'Delete movie'}</p>
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
