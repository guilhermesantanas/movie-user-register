
export interface Movie {
  id: string;
  title: string;
  release_date: string;
  duration: number;
  genre: string;
  director: string;
  synopsis: string;
  poster_url: string;  // Changed from optional to required
  registered_by: string;  // Changed from optional to required
  imdb_rating: number;  // Changed from optional to required
  language: string;  // Changed from optional to required
  rating: string;  // Changed from optional to required
  trailer_url: string;  // Changed from optional to required
  created_at: string;  // Already changed from optional to required
}
