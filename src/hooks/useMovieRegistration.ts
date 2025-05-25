
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { movieSchema, MovieFormData } from '@/schemas/movieSchema';

export const useMovieRegistration = () => {
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
      const movieToInsert = {
        ...validatedData,
        registered_by: session.user.email
      };

      const { data, error } = await supabase
        .from('movies')
        .insert({
          ...movieToInsert,
          title: movieToInsert.title
        })
        .select();

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Movie registered successfully",
      });
      
      navigate('/movies');
    } catch (error: any) {
      if (error.name === "ZodError") {
        const fieldErrors: Partial<Record<keyof MovieFormData, string>> = {};
        error.errors.forEach((err: any) => {
          const path = err.path[0] as keyof MovieFormData;
          fieldErrors[path] = err.message;
        });
        setErrors(fieldErrors);
      } else {
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

  return {
    formData,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit
  };
};
