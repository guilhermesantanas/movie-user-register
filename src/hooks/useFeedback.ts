
import { toast } from 'sonner';

export type FeedbackType = 'success' | 'error' | 'warning' | 'info';

export interface FeedbackOptions {
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const useFeedback = () => {
  const showSuccess = (message: string, options?: FeedbackOptions) => {
    toast.success(message, {
      duration: options?.duration,
      action: options?.action
    });
  };

  const showError = (message: string, options?: FeedbackOptions) => {
    toast.error(message, {
      duration: options?.duration,
      action: options?.action
    });
  };

  const showWarning = (message: string, options?: FeedbackOptions) => {
    toast.warning(message, {
      duration: options?.duration,
      action: options?.action
    });
  };

  const showInfo = (message: string, options?: FeedbackOptions) => {
    toast.info(message, {
      duration: options?.duration,
      action: options?.action
    });
  };

  const showLoading = (message: string = 'Loading...') => {
    return toast.loading(message);
  };

  const dismissToast = (toastId: string | number) => {
    toast.dismiss(toastId);
  };

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showLoading,
    dismissToast
  };
};
