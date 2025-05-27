
import { toast } from 'sonner';

export interface ApiError {
  message: string;
  code?: string;
  field?: string;
}

export const handleApiError = (error: any, defaultMessage: string = 'An unexpected error occurred'): void => {
  console.error('API Error:', error);
  
  let message = defaultMessage;
  
  if (error?.message) {
    message = error.message;
  } else if (typeof error === 'string') {
    message = error;
  }
  
  toast.error(message);
};

export const handleFormError = (error: any, fieldName?: string): string => {
  if (error?.message) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return fieldName ? `Error in ${fieldName}` : 'Form validation error';
};

export const handleAuthError = (error: any): void => {
  const authErrorMessages: Record<string, string> = {
    'Invalid login credentials': 'Invalid email or password',
    'Email not confirmed': 'Please check your email and confirm your account',
    'Too many requests': 'Too many login attempts. Please try again later',
    'User not found': 'No account found with this email address',
    'Weak password': 'Password is too weak. Please choose a stronger password'
  };
  
  const message = authErrorMessages[error?.message] || error?.message || 'Authentication error';
  toast.error(message);
};
