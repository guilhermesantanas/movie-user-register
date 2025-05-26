
import { useState } from 'react';
import { MovieFormData } from '@/schemas/movieSchema';
import { createEmptyMovieForm } from '@/utils/movieFormUtils';

export const useMovieForm = (initialData?: Partial<MovieFormData>) => {
  const [formData, setFormData] = useState<MovieFormData>({
    ...createEmptyMovieForm(),
    ...initialData
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof MovieFormData, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when field is changed
    if (errors[name as keyof MovieFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const setFieldError = (field: keyof MovieFormData, error: string) => {
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const clearErrors = () => {
    setErrors({});
  };

  const resetForm = () => {
    setFormData(createEmptyMovieForm());
    clearErrors();
  };

  return {
    formData,
    errors,
    handleChange,
    setFieldError,
    clearErrors,
    resetForm,
    setFormData
  };
};
