
import { MovieFormData } from '@/schemas/movieSchema';

export const createEmptyMovieForm = (): MovieFormData => ({
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

export const validateMovieUrls = (formData: MovieFormData) => {
  const errors: string[] = [];
  
  if (formData.poster_url && !isValidUrl(formData.poster_url)) {
    errors.push("Please enter a valid poster URL");
  }
  
  if (formData.trailer_url && !isValidUrl(formData.trailer_url)) {
    errors.push("Please enter a valid trailer URL");
  }
  
  return errors;
};

const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const prepareMovieDataForSubmission = (formData: MovieFormData, userEmail: string) => {
  return {
    title: formData.title, // Ensure title is explicitly included and required
    director: formData.director,
    genre: formData.genre,
    release_date: formData.release_date,
    duration: formData.duration,
    imdb_rating: formData.imdb_rating,
    language: formData.language,
    rating: formData.rating,
    synopsis: formData.synopsis,
    poster_url: formData.poster_url,
    trailer_url: formData.trailer_url,
    registered_by: userEmail
  };
};
