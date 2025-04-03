
import React from 'react';
import { motion } from 'framer-motion';
import { Film, Plus } from 'lucide-react';
import Button from '@/components/Button';
import { useNavigate } from 'react-router-dom';

interface EmptyMoviesListProps {
  isEmpty: boolean;
  isSearching: boolean;
  isLoggedIn: boolean;
  onAddMovie: () => void;
}

const EmptyMoviesList = ({ isEmpty, isSearching, isLoggedIn, onAddMovie }: EmptyMoviesListProps) => {
  if (!isEmpty) return null;
  
  return (
    <motion.div 
      className="text-center p-12 border border-dashed rounded-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Film size={48} className="mx-auto text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium mb-2">Nenhum filme encontrado</h3>
      <p className="text-muted-foreground">
        {!isSearching 
          ? "Não há filmes no banco de dados ainda." 
          : "Nenhum filme corresponde aos seus critérios de busca."}
      </p>
      
      {isLoggedIn && !isSearching && (
        <Button 
          className="mt-4" 
          onClick={onAddMovie}
          icon={<Plus size={18} />}
        >
          Adicione Seu Primeiro Filme
        </Button>
      )}
    </motion.div>
  );
};

export default EmptyMoviesList;
