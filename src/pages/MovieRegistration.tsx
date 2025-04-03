
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import PageTransition from '@/components/PageTransition';
import MovieHeader from '@/components/MovieHeader';
import MovieForm from '@/components/MovieForm';
import { movieSchema, MovieFormData } from '@/schemas/movieSchema';

const MovieRegistration: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState<MovieFormData>({
    title: "",
    director: "",
    genre: "",
    release_date: "",
    duration: undefined,
    imdb_rating: undefined,
    language: "",
    rating: "",
    synopsis: "",
    poster_url: "",
    trailer_url: ""
  });
  const [errors, setErrors] = useState<Partial<Record<keyof MovieFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when field is changed
    if (errors[name as keyof MovieFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate form data
      const validatedData = movieSchema.parse(formData);
      
      // Get user session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        throw new Error("You must be logged in to register a movie");
      }

      // Insert movie into Supabase
      const { data, error } = await supabase
        .from('movies')
        .insert({
          ...validatedData,
          registered_by: session.user.email
        })
        .select();

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Movie registered successfully",
      });
      
      // Navigate to movies page after successful registration
      navigate('/movies');
    } catch (error: any) {
      if (error.name === "ZodError") {
        // Handle validation errors
        const fieldErrors: Partial<Record<keyof MovieFormData, string>> = {};
        error.errors.forEach((err: any) => {
          const path = err.path[0] as keyof MovieFormData;
          fieldErrors[path] = err.message;
        });
        setErrors(fieldErrors);
      } else {
        // Handle other errors
        toast({
          title: "Error",
          description: error.message || "Failed to register movie",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

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
