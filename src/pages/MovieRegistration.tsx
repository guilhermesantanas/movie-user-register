
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import PageTransition from '@/components/PageTransition';
import MovieHeader from '@/components/MovieHeader';
import MovieForm from '@/components/MovieForm';
import { useMovieRegistration } from '@/hooks/useMovieRegistration';

const MovieRegistration: React.FC = () => {
  const {
    formData,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit
  } = useMovieRegistration();

  return (
    <PageTransition>
      <div className="container max-w-3xl mx-auto py-10 px-4">
        <div className="space-y-6">
          <MovieHeader title="Register a Movie" />
          
          <div>
            <h1 className="text-3xl font-bold">Register a Movie</h1>
            <p className="text-muted-foreground mt-2">
              Fill in the details below to add a new movie to the database.
            </p>
          </div>

          <MovieForm 
            formData={formData}
            errors={errors}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            onChange={handleChange}
          />
        </div>
        <Toaster />
      </div>
    </PageTransition>
  );
};

export default MovieRegistration;
