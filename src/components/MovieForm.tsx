
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { MovieFormData } from '@/schemas/movieSchema';
import MovieBasicInfoFields from './MovieBasicInfoFields';
import MovieDetailsFields from './MovieDetailsFields';
import MovieMediaFields from './MovieMediaFields';

interface MovieFormProps {
  formData: MovieFormData;
  errors: Partial<Record<keyof MovieFormData, string>>;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

const MovieForm: React.FC<MovieFormProps> = ({ 
  formData, 
  errors, 
  isSubmitting, 
  onSubmit, 
  onChange 
}) => {
  const navigate = useNavigate();
  
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information Section */}
        <MovieBasicInfoFields 
          formData={formData}
          errors={errors}
          onChange={onChange}
        />
        
        {/* Details Section */}
        <MovieDetailsFields 
          formData={formData}
          errors={errors}
          onChange={onChange}
        />
        
        {/* Media Section */}
        <MovieMediaFields 
          formData={formData}
          errors={errors}
          onChange={onChange}
        />
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => navigate('/movies')}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting}
        >
          {isSubmitting ? "Registering..." : "Register Movie"}
        </Button>
      </div>
    </form>
  );
};

export default MovieForm;
