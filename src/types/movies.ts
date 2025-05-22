
export interface Movie {
  id: string;
  title: string;
  release_date: string;
  duration: number;
  genre: string;
  director: string;
  synopsis: string;
  poster_url?: string;
  registered_by?: string;
  imdb_rating?: number;
  language?: string;
  rating?: string;
  trailer_url?: string;
  created_at: string; // Changed from optional to required
}
