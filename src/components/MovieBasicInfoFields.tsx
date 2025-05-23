
import React from 'react';
import { Film, User } from "lucide-react";
import InputField from '@/components/InputField';
import SelectField from '@/components/SelectField';
import { MovieFormData } from '@/schemas/movieSchema';
import { genreOptions } from '@/constants/movieFormOptions';

interface MovieBasicInfoFieldsProps {
  formData: MovieFormData;
  errors: Partial<Record<keyof MovieFormData, string>>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

const MovieBasicInfoFields: React.FC<MovieBasicInfoFieldsProps> = ({ 
  formData, 
  errors, 
  onChange 
}) => {
  return (
    <>
      <div className="md:col-span-2">
        <InputField
          label="Título do Filme"
          id="title"
          name="title"
          type="text"
          placeholder="Digite o título do filme"
          value={formData.title || ""}
          onChange={onChange}
          error={errors.title}
          icon={<Film className="h-4 w-4 text-muted-foreground" />}
          required
        />
      </div>

      <InputField
        label="Diretor"
        id="director"
        name="director"
        type="text"
        placeholder="Digite o nome do diretor"
        value={formData.director || ""}
        onChange={onChange}
        error={errors.director}
        icon={<User className="h-4 w-4 text-muted-foreground" />}
      />

      <SelectField
        label="Gênero"
        id="genre"
        name="genre"
        value={formData.genre || ""}
        onChange={onChange}
        options={genreOptions}
        error={errors.genre}
      />
    </>
  );
};

export default MovieBasicInfoFields;
