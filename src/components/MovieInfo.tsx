
import React, { useState } from 'react';
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface MovieInfoProps {
  movie: {
    director: string;
    genre: string;
    release_date: string;
    duration: number;
    language?: string;  // Changed to optional
    imdb_rating?: number; // Changed to optional
    synopsis: string;
    trailer_url?: string;
  };
}

const MovieInfo = ({ movie }: MovieInfoProps) => {
  const [trailerOpen, setTrailerOpen] = useState(false);

  return (
    <>
      {movie.trailer_url && (
        <div className="mb-6">
          {trailerOpen ? (
            <div className="rounded-lg overflow-hidden">
              <AspectRatio ratio={16/9}>
                <iframe
                  src={movie.trailer_url}
                  title={`Trailer`}
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
        <p className="text-foreground">
          {movie.synopsis || 'No synopsis available.'}
        </p>
      </div>
    </>
  );
};

export default MovieInfo;
