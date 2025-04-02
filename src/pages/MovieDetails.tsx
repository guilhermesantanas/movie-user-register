
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageTransition from '@/components/PageTransition';
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";

import MovieHeader from '@/components/MovieHeader';
import MoviePoster from '@/components/MoviePoster';
import MovieInfo from '@/components/MovieInfo';
import MovieComments from '@/components/MovieComments';
import { useMovieData } from '@/hooks/useMovieData';
import { useMovieRating } from '@/hooks/useMovieRating';

const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { movie, loading, error } = useMovieData(id);
  const { averageRating, ratingCount, userRating, user, handleRateMovie } = useMovieRating(id || '');

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
        <MovieHeader title={movie.title} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Movie Poster with Rating */}
          <MoviePoster 
            posterUrl={movie.poster_url}
            title={movie.title}
            averageRating={averageRating}
            ratingCount={ratingCount}
            userRating={userRating}
            userLoggedIn={!!user}
            onRateMovie={handleRateMovie}
          />

          {/* Movie Information */}
          <div className="md:col-span-2">
            <MovieInfo movie={movie} />

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
