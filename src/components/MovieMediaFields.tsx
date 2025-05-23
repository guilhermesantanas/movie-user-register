
import React from 'react';
import { Link, FileText } from "lucide-react";
import InputField from '@/components/InputField';
import TextareaField from '@/components/TextareaField';
import { MovieFormData } from '@/schemas/movieSchema';

interface MovieMediaFieldsProps {
  formData: MovieFormData;
  errors: Partial<Record<keyof MovieFormData, string>>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

const MovieMediaFields: React.FC<MovieMediaFieldsProps> = ({ 
  formData, 
  errors, 
  onChange 
}) => {
  return (
    <>
      <div className="md:col-span-2">
        <InputField
          label="URL do Poster"
          id="poster_url"
          name="poster_url"
          type="url"
          placeholder="Digite a URL da imagem do poster"
          value={formData.poster_url || ""}
          onChange={onChange}
          error={errors.poster_url}
          icon={<Link className="h-4 w-4 text-muted-foreground" />}
        />
      </div>
      
      <div className="md:col-span-2">
        <InputField
          label="URL do Trailer"
          id="trailer_url"
          name="trailer_url"
          type="url"
          placeholder="Digite a URL do trailer (YouTube, Vimeo, etc.)"
          value={formData.trailer_url || ""}
          onChange={onChange}
          error={errors.trailer_url}
          icon={<Link className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      <div className="md:col-span-2">
        <TextareaField
          label="Sinopse"
          id="synopsis"
          name="synopsis"
          placeholder="Digite a sinopse do filme"
          value={formData.synopsis || ""}
          onChange={onChange}
          error={errors.synopsis}
          rows={5}
        />
      </div>
    </>
  );
};

export default MovieMediaFields;
