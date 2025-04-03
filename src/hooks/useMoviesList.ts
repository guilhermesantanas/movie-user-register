import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Movie {
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
}

// Sample movie data for when database is empty
const sampleMovies: Movie[] = [
  {
    id: 'sample-1',
    title: 'The Shawshank Redemption',
    release_date: '1994-09-23',
    duration: 142,
    genre: 'drama',
    director: 'Frank Darabont',
    synopsis: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
    poster_url: 'https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_.jpg',
    imdb_rating: 9.3,
    language: 'English',
    rating: 'R'
  },
  {
    id: 'sample-2',
    title: 'The Godfather',
    release_date: '1972-03-24',
    duration: 175,
    genre: 'crime',
    director: 'Francis Ford Coppola',
    synopsis: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
    poster_url: 'https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg',
    imdb_rating: 9.2,
    language: 'English, Italian, Latin',
    rating: 'R'
  },
  {
    id: 'sample-3',
    title: 'Pulp Fiction',
    release_date: '1994-10-14',
    duration: 154,
    genre: 'crime',
    director: 'Quentin Tarantino',
    synopsis: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
    poster_url: 'https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg',
    imdb_rating: 8.9,
    language: 'English, Spanish, French',
    rating: 'R'
  },
  {
    id: 'sample-4',
    title: 'Inception',
    release_date: '2010-07-16',
    duration: 148,
    genre: 'sci-fi',
    director: 'Christopher Nolan',
    synopsis: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    poster_url: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg',
    imdb_rating: 8.8,
    language: 'English, Japanese, French',
    rating: 'PG-13'
  },
  {
    id: 'sample-5',
    title: 'The Dark Knight',
    release_date: '2008-07-18',
    duration: 152,
    genre: 'action',
    director: 'Christopher Nolan',
    synopsis: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    poster_url: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg',
    imdb_rating: 9.0,
    language: 'English, Mandarin',
    rating: 'PG-13'
  },
  {
    id: 'sample-6',
    title: 'Parasite',
    release_date: '2019-11-08',
    duration: 132,
    genre: 'thriller',
    director: 'Bong Joon Ho',
    synopsis: 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.',
    poster_url: 'https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_.jpg',
    imdb_rating: 8.5,
    language: 'Korean, English',
    rating: 'R'
  },
  {
    id: 'sample-7',
    title: 'Everything Everywhere All at Once',
    release_date: '2022-03-25',
    duration: 139,
    genre: 'action',
    director: 'Daniel Kwan, Daniel Scheinert',
    synopsis: 'An aging Chinese immigrant is swept up in an insane adventure, where she alone can save the world by exploring other universes connecting with the lives she could have led.',
    poster_url: 'https://m.media-amazon.com/images/M/MV5BYTdiOTIyZTQtNmQ1OS00NjZlLWIyMTgtYzk5Y2M3ZDVmMDk1XkEyXkFqcGdeQXVyMTAzMDg4NzU0._V1_.jpg',
    imdb_rating: 7.9,
    language: 'English, Mandarin, Cantonese',
    rating: 'R'
  },
  {
    id: 'sample-8',
    title: 'The Matrix',
    release_date: '1999-03-31',
    duration: 136,
    genre: 'sci-fi',
    director: 'Lana Wachowski, Lilly Wachowski',
    synopsis: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.',
    poster_url: 'https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg',
    imdb_rating: 8.7,
    language: 'English',
    rating: 'R'
  }
];

export const useMoviesList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [usesSampleData, setUsesSampleData] = useState(false);
  
  // Fetch movies from database only
  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true);
      try {
        // Fetch movies from Supabase
        const { data: authData } = await supabase.auth.getSession();
        const { data, error } = await supabase
          .from('movies')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) {
          throw error;
        }
        
        // Use database movies (we've added sample movies to the database)
        if (data) {
          setMovies(data);
          setFilteredMovies(data);
          setUsesSampleData(false);
          console.log('Filmes carregados do banco de dados:', data);
        } else {
          // This should not happen anymore since we've added movies to the database
          setMovies([]);
          setFilteredMovies([]);
          setUsesSampleData(false);
          toast.info('Nenhum filme encontrado no banco de dados');
        }
      } catch (error) {
        console.error('Erro ao buscar filmes:', error);
        toast.error('Falha ao carregar filmes do banco de dados.');
        setMovies([]);
        setFilteredMovies([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMovies();
  }, []);
  
  // Filter movies based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredMovies(movies);
    } else {
      const filtered = movies.filter(movie => 
        movie.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.director?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.genre?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMovies(filtered);
    }
  }, [searchTerm, movies]);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleDeleteMovie = async (movieId: string) => {
    try {
      // We only have database movies now, so always delete from Supabase
      const { error } = await supabase
        .from('movies')
        .delete()
        .eq('id', movieId);
        
      if (error) {
        throw error;
      }
      
      // Update UI after successful deletion
      const updatedMovies = movies.filter(movie => movie.id !== movieId);
      setMovies(updatedMovies);
      setFilteredMovies(updatedMovies);
      
      // Also clean up any local storage references
      const recentlyViewedMovies = JSON.parse(localStorage.getItem('recentlyViewedMovies') || '[]');
      const updatedRecentlyViewed = recentlyViewedMovies.filter((movie: any) => movie.id !== movieId);
      localStorage.setItem('recentlyViewedMovies', JSON.stringify(updatedRecentlyViewed));
      
      toast.success('Filme excluído com sucesso');
    } catch (error) {
      console.error('Erro ao excluir filme:', error);
      toast.error('Falha ao excluir filme. Por favor, tente novamente.');
    }
  };
  
  return {
    movies,
    filteredMovies,
    isLoading,
    usesSampleData,
    searchTerm,
    handleSearch,
    handleDeleteMovie
  };
};
