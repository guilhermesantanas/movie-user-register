
import { useMovieForm } from './useMovieForm';
import { useMovieSubmission } from './useMovieSubmission';

export const useMovieRegistration = () => {
  const movieForm = useMovieForm();
  const movieSubmission = useMovieSubmission();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await movieSubmission.submitMovie(movieForm.formData);
    
    if (!result.success && result.fieldErrors) {
      // Set field errors from validation
      Object.entries(result.fieldErrors).forEach(([field, error]) => {
        if (error) {
          movieForm.setFieldError(field as keyof typeof movieForm.formData, error);
        }
      });
    }
  };

  return {
    ...movieForm,
    isSubmitting: movieSubmission.isSubmitting,
    handleSubmit
  };
};
