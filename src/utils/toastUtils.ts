
import { toast as sonnerToast } from 'sonner';
import { toast as uiToast } from '@/hooks/use-toast';

/**
 * Unified toast utility that provides consistent toast notifications across the app
 */
export const showToast = {
  success: (message: string, description?: string) => {
    sonnerToast.success(message);
    if (description) {
      uiToast({
        title: message,
        description,
      });
    }
  },

  error: (message: string, description?: string) => {
    sonnerToast.error(message);
    if (description) {
      uiToast({
        title: message,
        description,
        variant: "destructive",
      });
    }
  },

  info: (message: string, description?: string) => {
    sonnerToast(message);
    if (description) {
      uiToast({
        title: message,
        description,
      });
    }
  },

  loading: (message: string) => {
    return sonnerToast.loading(message);
  },

  dismiss: (toastId?: string | number) => {
    sonnerToast.dismiss(toastId);
  }
};
