
import React from 'react';
import { Filter } from 'lucide-react';
import { SelectField } from '@/components/SelectField';
import InputField from '@/components/InputField';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

export type MovieFilters = {
  genre?: string;
  rating?: string;
  year?: string;
  language?: string;
}

interface MovieFilterProps {
  filters: MovieFilters;
  setFilters: React.Dispatch<React.SetStateAction<MovieFilters>>;
  genreOptions: { label: string, value: string }[];
  ratingOptions: { label: string, value: string }[];
  languageOptions: { label: string, value: string }[];
  yearOptions: { label: string, value: string }[];
  onClearFilters: () => void;
}

const MovieFilter: React.FC<MovieFilterProps> = ({ 
  filters, 
  setFilters, 
  genreOptions, 
  ratingOptions,
  languageOptions,
  yearOptions,
  onClearFilters 
}) => {
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleClearFilter = (filterName: keyof MovieFilters) => {
    setFilters(prev => ({ ...prev, [filterName]: undefined }));
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="mb-6">
      <div className="flex items-center mb-2 gap-2">
        <Filter size={18} />
        <h3 className="text-lg font-medium">Filtrar Filmes</h3>
        {activeFiltersCount > 0 && (
          <Badge variant="outline" className="ml-2">
            {activeFiltersCount} {activeFiltersCount === 1 ? 'filtro ativo' : 'filtros ativos'}
          </Badge>
        )}
        {activeFiltersCount > 0 && (
          <button 
            onClick={onClearFilters} 
            className="text-sm text-muted-foreground hover:text-primary ml-auto"
          >
            Limpar filtros
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        <SelectField
          label="Gênero"
          id="genre"
          name="genre"
          value={filters.genre || ''}
          onChange={handleFilterChange}
          options={[{ value: '', label: 'Todos os gêneros' }, ...genreOptions]}
        />

        <SelectField
          label="Classificação"
          id="rating"
          name="rating"
          value={filters.rating || ''}
          onChange={handleFilterChange}
          options={[{ value: '', label: 'Todas classificações' }, ...ratingOptions]}
        />

        <SelectField
          label="Idioma"
          id="language"
          name="language"
          value={filters.language || ''}
          onChange={handleFilterChange}
          options={[{ value: '', label: 'Todos idiomas' }, ...languageOptions]}
        />

        <SelectField
          label="Ano"
          id="year"
          name="year"
          value={filters.year || ''}
          onChange={handleFilterChange}
          options={[{ value: '', label: 'Todos os anos' }, ...yearOptions]}
        />
      </div>

      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {Object.entries(filters).map(([key, value]) => {
            if (!value) return null;
            const filterName = key as keyof MovieFilters;
            const getOptionLabel = (filterType: keyof MovieFilters, value: string) => {
              switch (filterType) {
                case 'genre':
                  return genreOptions.find(opt => opt.value === value)?.label || value;
                case 'rating':
                  return ratingOptions.find(opt => opt.value === value)?.label || value;
                case 'language':
                  return languageOptions.find(opt => opt.value === value)?.label || value;
                case 'year':
                  return yearOptions.find(opt => opt.value === value)?.label || value;
                default:
                  return value;
              }
            };

            return (
              <Badge key={key} variant="secondary" className="py-1 px-3 gap-2 flex items-center">
                {getOptionLabel(filterName, value)}
                <X 
                  size={14} 
                  className="cursor-pointer" 
                  onClick={() => handleClearFilter(filterName)}
                />
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MovieFilter;
