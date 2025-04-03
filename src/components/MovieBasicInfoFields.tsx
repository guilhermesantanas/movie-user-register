
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
          label="Movie Title"
          id="title"
          name="title"
          type="text"
          placeholder="Enter movie title"
          value={formData.title || ""}
          onChange={onChange}
          error={errors.title}
          icon={<Film className="h-4 w-4 text-muted-foreground" />}
          required
        />
      </div>

      <InputField
        label="Director"
        id="director"
        name="director"
        type="text"
        placeholder="Enter director's name"
        value={formData.director || ""}
        onChange={onChange}
        error={errors.director}
        icon={<User className="h-4 w-4 text-muted-foreground" />}
      />

      <SelectField
        label="Genre"
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
