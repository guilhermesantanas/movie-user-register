
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { movieSchema, MovieFormData } from '@/schemas/movieSchema';
import { prepareMovieDataForSubmission } from '@/utils/movieFormUtils';

export const useMovieSubmission = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitMovie = async (formData: MovieFormData) => {
    setIsSubmitting(true);

    try {
      // Validate form data
      const validatedData = movieSchema.parse(formData);
      
      // Get user session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        throw new Error("You must be logged in to register a movie");
      }

      // Prepare and insert movie data
      const movieToInsert = prepareMovieDataForSubmission(validatedData, session.user.email!);

      const { data, error } = await supabase
        .from('movies')
        .insert(movieToInsert)
        .select();

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Movie registered successfully",
      });
      
      navigate('/movies');
      return { success: true, data };
    } catch (error: any) {
      if (error.name === "ZodError") {
        const fieldErrors: Partial<Record<keyof MovieFormData, string>> = {};
        error.errors.forEach((err: any) => {
          const path = err.path[0] as keyof MovieFormData;
          fieldErrors[path] = err.message;
        });
        return { success: false, fieldErrors };
      } else {
        toast({
          title: "Error",
          description: error.message || "Failed to register movie",
          variant: "destructive",
        });
        return { success: false, error: error.message };
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitMovie,
    isSubmitting
  };
};
