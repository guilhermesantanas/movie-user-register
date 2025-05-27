
import React from 'react';
import { CheckCircle, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

export interface SuccessMessageProps {
  message: string;
  className?: string;
  variant?: 'inline' | 'alert';
  dismissible?: boolean;
  onDismiss?: () => void;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({
  message,
  className,
  variant = 'inline',
  dismissible = false,
  onDismiss
}) => {
  if (variant === 'inline') {
    return (
      <div className={cn('flex items-center gap-2 text-green-600', className)}>
        <CheckCircle className="h-4 w-4" />
        <p className="text-sm">{message}</p>
      </div>
    );
  }

  return (
    <Alert className={cn('border-green-200 bg-green-50 text-green-800 relative', className)}>
      <CheckCircle className="h-4 w-4 text-green-600" />
      <AlertDescription>{message}</AlertDescription>
      {dismissible && onDismiss && (
        <button
          onClick={onDismiss}
          className="absolute right-2 top-2 rounded-md p-1 text-green-600/50 opacity-0 transition-opacity hover:text-green-600 focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </Alert>
  );
};

export default SuccessMessage;
