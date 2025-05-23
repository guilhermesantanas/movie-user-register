
import React from 'react';
import { Calendar, Clock, Star, Globe } from "lucide-react";
import InputField from '@/components/InputField';
import SelectField from '@/components/SelectField';
import { MovieFormData } from '@/schemas/movieSchema';
import { ratingOptions } from '@/constants/movieFormOptions';

interface MovieDetailsFieldsProps {
  formData: MovieFormData;
  errors: Partial<Record<keyof MovieFormData, string>>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

const MovieDetailsFields: React.FC<MovieDetailsFieldsProps> = ({ 
  formData, 
  errors, 
  onChange 
}) => {
  return (
    <>
      <InputField
        label="Data de Lançamento"
        id="release_date"
        name="release_date"
        type="date"
        value={formData.release_date || ""}
        onChange={onChange}
        error={errors.release_date}
        icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
      />

      <InputField
        label="Duração (minutos)"
        id="duration"
        name="duration"
        type="number"
        placeholder="Digite a duração em minutos"
        value={formData.duration?.toString() || ""}
        onChange={onChange}
        error={errors.duration}
        icon={<Clock className="h-4 w-4 text-muted-foreground" />}
      />

      <InputField
        label="Avaliação IMDb"
        id="imdb_rating"
        name="imdb_rating"
        type="number"
        placeholder="Digite a avaliação IMDb (0-10)"
        value={formData.imdb_rating?.toString() || ""}
        onChange={onChange}
        error={errors.imdb_rating}
        icon={<Star className="h-4 w-4 text-muted-foreground" />}
        min={0}
        max={10}
        step={0.1}
      />

      <InputField
        label="Idioma"
        id="language"
        name="language"
        type="text"
        placeholder="Digite o idioma do filme"
        value={formData.language || ""}
        onChange={onChange}
        error={errors.language}
        icon={<Globe className="h-4 w-4 text-muted-foreground" />}
      />

      <SelectField
        label="Classificação"
        id="rating"
        name="rating"
        value={formData.rating || ""}
        onChange={onChange}
        options={ratingOptions}
        error={errors.rating}
      />
    </>
  );
};

export default MovieDetailsFields;
