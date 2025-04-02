
import React, { useState } from 'react';
import { z } from 'zod';
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import InputField from "@/components/InputField";
import SelectField from "@/components/SelectField";
import TextareaField from "@/components/TextareaField";
import PageTransition from '@/components/PageTransition';
import { Button } from "@/components/ui/button";
import { Calendar, Film, User, Clock, Star, Bookmark, Globe, FileText, Link } from "lucide-react";

// Form validation schema
const movieSchema = z.object({
  title: z.string().min(1, "Title is required"),
  director: z.string().optional(),
  genre: z.string().optional(),
  release_date: z.string().optional(),
  duration: z.coerce.number().positive().optional(),
  imdb_rating: z.coerce.number().min(0).max(10).optional(),
  language: z.string().optional(),
  rating: z.string().optional(),
  synopsis: z.string().optional(),
  poster_url: z.string().url("Please enter a valid URL").optional().or(z.string().length(0)),
  trailer_url: z.string().url("Please enter a valid URL").optional().or(z.string().length(0))
});

type MovieFormData = z.infer<typeof movieSchema>;

const genreOptions = [
  { value: "Action", label: "Action" },
  { value: "Adventure", label: "Adventure" },
  { value: "Comedy", label: "Comedy" },
  { value: "Drama", label: "Drama" },
  { value: "Fantasy", label: "Fantasy" },
  { value: "Horror", label: "Horror" },
  { value: "Mystery", label: "Mystery" },
  { value: "Romance", label: "Romance" },
  { value: "Sci-Fi", label: "Sci-Fi" },
  { value: "Thriller", label: "Thriller" },
  { value: "Western", label: "Western" },
  { value: "Animation", label: "Animation" },
  { value: "Documentary", label: "Documentary" },
];

const ratingOptions = [
  { value: "G", label: "G - General Audiences" },
  { value: "PG", label: "PG - Parental Guidance Suggested" },
  { value: "PG-13", label: "PG-13 - Parents Strongly Cautioned" },
  { value: "R", label: "R - Restricted" },
  { value: "NC-17", label: "NC-17 - Adults Only" },
];

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
        .insert([
          { 
            ...validatedData,
            registered_by: session.user.email
          }
        ])
        .select();

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Movie registered successfully",
      });
      
      // Navigate to movies page after successful registration
      navigate('/movies');
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        // Handle validation errors
        const fieldErrors: Partial<Record<keyof MovieFormData, string>> = {};
        error.errors.forEach((err) => {
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
          <div>
            <h1 className="text-3xl font-bold">Register a Movie</h1>
            <p className="text-muted-foreground mt-2">
              Fill in the details below to add a new movie to the database.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <InputField
                  label="Movie Title"
                  id="title"
                  name="title"
                  type="text"
                  placeholder="Enter movie title"
                  value={formData.title}
                  onChange={handleChange}
                  error={errors.title}
                  icon={<Film className="h-4 w-4 text-muted-foreground" />}
                  required
                />
              </div>

              <InputField
                label="Director"
                id="director"
                name="director"
                type="text"
                placeholder="Enter director's name"
                value={formData.director}
                onChange={handleChange}
                error={errors.director}
                icon={<User className="h-4 w-4 text-muted-foreground" />}
              />

              <SelectField
                label="Genre"
                id="genre"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                options={genreOptions}
                error={errors.genre}
                placeholder="Select a genre"
              />

              <InputField
                label="Release Date"
                id="release_date"
                name="release_date"
                type="date"
                value={formData.release_date}
                onChange={handleChange}
                error={errors.release_date}
                icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
              />

              <InputField
                label="Duration (minutes)"
                id="duration"
                name="duration"
                type="number"
                placeholder="Enter duration in minutes"
                value={formData.duration?.toString() || ""}
                onChange={handleChange}
                error={errors.duration}
                icon={<Clock className="h-4 w-4 text-muted-foreground" />}
              />

              <InputField
                label="IMDb Rating"
                id="imdb_rating"
                name="imdb_rating"
                type="number"
                placeholder="Enter IMDb rating (0-10)"
                value={formData.imdb_rating?.toString() || ""}
                onChange={handleChange}
                error={errors.imdb_rating}
                icon={<Star className="h-4 w-4 text-muted-foreground" />}
                min={0}
                max={10}
                step={0.1}
              />

              <InputField
                label="Language"
                id="language"
                name="language"
                type="text"
                placeholder="Enter movie language"
                value={formData.language}
                onChange={handleChange}
                error={errors.language}
                icon={<Globe className="h-4 w-4 text-muted-foreground" />}
              />

              <SelectField
                label="Rating"
                id="rating"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                options={ratingOptions}
                error={errors.rating}
                placeholder="Select a rating"
              />

              <div className="md:col-span-2">
                <InputField
                  label="Poster URL"
                  id="poster_url"
                  name="poster_url"
                  type="url"
                  placeholder="Enter poster image URL"
                  value={formData.poster_url}
                  onChange={handleChange}
                  error={errors.poster_url}
                  icon={<Link className="h-4 w-4 text-muted-foreground" />}
                />
              </div>
              
              <div className="md:col-span-2">
                <InputField
                  label="Trailer URL"
                  id="trailer_url"
                  name="trailer_url"
                  type="url"
                  placeholder="Enter trailer URL (YouTube, Vimeo, etc.)"
                  value={formData.trailer_url}
                  onChange={handleChange}
                  error={errors.trailer_url}
                  icon={<Link className="h-4 w-4 text-muted-foreground" />}
                />
              </div>

              <div className="md:col-span-2">
                <TextareaField
                  label="Synopsis"
                  id="synopsis"
                  name="synopsis"
                  placeholder="Enter movie synopsis"
                  value={formData.synopsis}
                  onChange={handleChange}
                  error={errors.synopsis}
                  icon={<FileText className="h-4 w-4 text-muted-foreground" />}
                  rows={5}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/movies')}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Registering..." : "Register Movie"}
              </Button>
            </div>
          </form>
        </div>
        <Toaster />
      </div>
    </PageTransition>
  );
};

export default MovieRegistration;
