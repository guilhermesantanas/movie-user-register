
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
          const currentDate = new Date().toISOString();
          const tropaDeElite: Movie = {
            id: 'tropa-de-elite',
            title: 'Tropa de Elite',
            release_date: '2007-10-12',
            duration: 115,
            genre: 'Crime, Ação, Drama',
            director: 'José Padilha',
            synopsis: 'Em 1997, no Rio de Janeiro, o Capitão Nascimento tem que encontrar um substituto enquanto tenta sobreviver às pressões diárias de seu trabalho. A BOPE, polícia de elite do Rio, está determinada a tirar da favela todos os traficantes, mas para isso precisa lutar contra seus próprios demônios.',
            poster_url: 'https://m.media-amazon.com/images/M/MV5BMjJiMmM1ZWYtNzZhZi00NDRmLWI3YzctYjRlZGVjYzhlYTUxXkEyXkFqcGdeQXVyMTU3NDU4MDg2._V1_.jpg',
            registered_by: 'Admin',
            imdb_rating: 8.1,
            language: 'Português',
            rating: '18+',
            created_at: currentDate,
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

        // Add more example movies if there are fewer than 6 movies
        if (moviesData.length < 6) {
          const additionalMovies: Movie[] = [
            {
              id: 'cidade-de-deus',
              title: 'Cidade de Deus',
              release_date: '2002-08-30',
              duration: 130,
              genre: 'Crime, Drama',
              director: 'Fernando Meirelles, Kátia Lund',
              synopsis: 'Buscapé é um jovem pobre, negro e sensível, que cresce em um universo de muita violência. Ele vive na Cidade de Deus, favela carioca conhecida por ser um dos locais mais violentos do Rio. Amedrontado com a possibilidade de se tornar um bandido, Buscapé é salvo de seu destino por causa de seu talento como fotógrafo, o qual permite que siga carreira na profissão.',
              poster_url: 'https://m.media-amazon.com/images/M/MV5BMGU5OWEwZDItNmNkMC00NzZmLTk1YTctNzVhZTJjM2NlZTVmXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg',
              registered_by: 'Admin',
              imdb_rating: 8.6,
              language: 'Português',
              rating: '18+',
              created_at: new Date('2024-01-15').toISOString(),
            },
            {
              id: 'central-do-brasil',
              title: 'Central do Brasil',
              release_date: '1998-04-03',
              duration: 113,
              genre: 'Drama',
              director: 'Walter Salles',
              synopsis: 'Dora, uma ex-professora, ganha a vida escrevendo cartas para pessoas analfabetas na estação de trem Central do Brasil, no Rio de Janeiro. Ela conhece um menino chamado Josué, cuja mãe acaba de ser atropelada, e relutantemente decide ajudá-lo a encontrar seu pai, que ele nunca conheceu, no remoto Nordeste do Brasil.',
              poster_url: 'https://m.media-amazon.com/images/M/MV5BNTJlNzM2NmQtYzZmNC00M2Q3LTljZmMtNDI0OTgwMGI5YzE3XkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_.jpg',
              registered_by: 'Admin',
              imdb_rating: 8.0,
              language: 'Português',
              rating: '12+',
              created_at: new Date('2024-02-10').toISOString(),
            },
            {
              id: 'o-auto-da-compadecida',
              title: 'O Auto da Compadecida',
              release_date: '2000-09-10',
              duration: 104,
              genre: 'Comédia, Aventura',
              director: 'Guel Arraes',
              synopsis: 'As aventuras de João Grilo e Chicó, dois nordestinos pobres que vivem de golpes para sobreviver. Eles estão sempre enganando o povo de um pequeno vilarejo no sertão da Paraíba, inclusive o temido cangaceiro Severino de Aracaju, que os persegue pela região.',
              poster_url: 'https://m.media-amazon.com/images/M/MV5BMmFkOGRmNWMtYTNiZC00NDEzLWE0YjItOTQ5ZWFhYjFjNGVmXkEyXkFqcGdeQXVyMTkzODUwNzk@._V1_.jpg',
              registered_by: 'Admin',
              imdb_rating: 8.6,
              language: 'Português',
              rating: 'Livre',
              created_at: new Date('2024-03-05').toISOString(),
            },
            {
              id: 'bacurau',
              title: 'Bacurau',
              release_date: '2019-08-23',
              duration: 131,
              genre: 'Drama, Mistério, Faroeste',
              director: 'Kleber Mendonça Filho, Juliano Dornelles',
              synopsis: 'Pouco após a morte de sua matriarca, os moradores de um pequeno povoado no sertão brasileiro, chamado Bacurau, descobrem que a comunidade não consta mais em qualquer mapa. Aos poucos, eles percebem algo estranho na região: enquanto drones passeiam pelos céus, estrangeiros chegam à cidade.',
              poster_url: 'https://m.media-amazon.com/images/M/MV5BZjQ0YWVmMDEtNjNjYi00MWFlLTk1ZWItYzU0YmVhNTM3NjNkXkEyXkFqcGdeQXVyMTkzODUwNzk@._V1_.jpg',
              registered_by: 'Admin',
              imdb_rating: 7.5,
              language: 'Português',
              rating: '16+',
              created_at: new Date('2024-04-12').toISOString(),
            }
          ];

          // Insert additional movies only if they don't exist
          for (const movie of additionalMovies) {
            const exists = moviesData.some(m => m.title === movie.title);
            if (!exists) {
              try {
                const { error: insertError } = await supabase
                  .from('movies')
                  .insert([movie]);
                  
                if (!insertError) {
                  moviesData.push(movie);
                }
              } catch (insertErr) {
                console.error(`Failed to insert movie ${movie.title}:`, insertErr);
              }
            }
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
