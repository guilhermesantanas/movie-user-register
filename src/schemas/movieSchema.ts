
import { z } from 'zod';

// Form validation schema
export const movieSchema = z.object({
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

export type MovieFormData = z.infer<typeof movieSchema>;
