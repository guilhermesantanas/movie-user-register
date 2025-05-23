
import React from 'react';
import { Check, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SelectField from '@/components/SelectField';

export interface MovieFilters {
  genre?: string;
  language?: string;
  rating?: string;
  year?: string;
}

interface MovieFilterProps {
  filters: MovieFilters;
  setFilters: React.Dispatch<React.SetStateAction<MovieFilters>>;
  clearFilters: () => void;
  genreOptions: { label: string; value: string }[];
  ratingOptions: { label: string; value: string }[];
  languageOptions: { label: string; value: string }[];
  yearOptions: { label: string; value: string }[];
}

const MovieFilter: React.FC<MovieFilterProps> = ({
  filters,
  setFilters,
  clearFilters,
  genreOptions,
  ratingOptions,
  languageOptions,
  yearOptions
}) => {
  const handleFilterChange = (filterType: keyof MovieFilters, value: string | null) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value || undefined
    }));
  };
  
  const hasActiveFilters = Object.values(filters).some(value => value !== undefined);
  
  return (
    <div className="bg-card p-4 rounded-lg shadow-sm mb-6">
      <div className="flex flex-wrap gap-4 items-center mb-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Filter size={16} />
          <h3 className="font-medium">Filtros</h3>
        </div>
        
        {hasActiveFilters && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={clearFilters}
            className="ml-auto flex items-center gap-1"
          >
            <X size={14} />
            Limpar filtros
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SelectField
          label="Gênero"
          options={genreOptions}
          value={filters.genre || ''}
          onChange={(e) => handleFilterChange('genre', e.target.value || null)}
          placeholder="Todos os gêneros"
        />
        
        <SelectField
          label="Classificação"
          options={ratingOptions}
          value={filters.rating || ''}
          onChange={(e) => handleFilterChange('rating', e.target.value || null)}
          placeholder="Todas as classificações"
        />
        
        <SelectField
          label="Idioma"
          options={languageOptions}
          value={filters.language || ''}
          onChange={(e) => handleFilterChange('language', e.target.value || null)}
          placeholder="Todos os idiomas"
        />
        
        <SelectField
          label="Ano"
          options={yearOptions}
          value={filters.year || ''}
          onChange={(e) => handleFilterChange('year', e.target.value || null)}
          placeholder="Todos os anos"
        />
      </div>
    </div>
  );
};

export default MovieFilter;
