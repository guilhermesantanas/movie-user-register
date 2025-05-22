
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Movie } from '@/types/movies';

/**
 * Hook for fetching movies data from Supabase
 */
export const useMoviesData = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch movies from database
  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('movies')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) {
          throw error;
        }
        
        let moviesData = data || [];
        
        // Check if Tropa de Elite movie exists
        const tropaDaEliteExists = moviesData.some(movie => 
          movie.title.toLowerCase().includes('tropa de elite')
        );
        
        // If Tropa de Elite doesn't exist and there are no movies, add it
        if (!tropaDaEliteExists) {
          const tropaDeElite: Movie = {
            id: 'tropa-de-elite',
            title: 'Tropa de Elite',
            release_date: '2007-10-12',
            duration: 115,
            genre: 'Crime, Ação, Drama',
            director: 'José Padilha',
            synopsis: 'Em 1997, no Rio de Janeiro, o Capitão Nascimento tem que encontrar um substituto enquanto tenta sobreviver às pressões diárias de seu trabalho. A BOPE, polícia de elite do Rio, está determinada a tirar da favela todos os traficantes, mas para isso precisa lutar contra seus próprios demônios.',
            poster_url: 'https://image.tmdb.org/t/p/w500/bzj4kr3myuHuBsQqTknbDGc1lgl.jpg',
            registered_by: 'Admin',
            imdb_rating: 8.1,
            language: 'Português',
            rating: '18+',
            created_at: new Date().toISOString(),
          };
          
          try {
            const { error: insertError } = await supabase
              .from('movies')
              .insert([tropaDeElite]);
              
            if (insertError) {
              console.error('Error inserting Tropa de Elite:', insertError);
            } else {
              moviesData = [tropaDeElite, ...moviesData];
            }
          } catch (insertErr) {
            console.error('Failed to insert Tropa de Elite movie:', insertErr);
          }
        }
        
        setMovies(moviesData);
        
      } catch (error: any) {
        console.error('Erro ao buscar filmes:', error);
        toast.error('Falha ao carregar filmes do banco de dados.');
        setMovies([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMovies();
  }, []);
  
  return { movies, setMovies, isLoading };
};
