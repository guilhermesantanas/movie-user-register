
import React from 'react';
import { AlertCircle, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

export interface ErrorDisplayProps {
  error: string | string[] | null;
  className?: string;
  variant?: 'inline' | 'alert' | 'toast';
  dismissible?: boolean;
  onDismiss?: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  className,
  variant = 'inline',
  dismissible = false,
  onDismiss
}) => {
  if (!error) return null;

  const errors = Array.isArray(error) ? error : [error];

  if (variant === 'inline') {
    return (
      <div className={cn('space-y-1', className)}>
        {errors.map((err, index) => (
          <p key={index} className="text-sm text-destructive flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            {err}
          </p>
        ))}
      </div>
    );
  }

  if (variant === 'alert') {
    return (
      <Alert variant="destructive" className={cn('relative', className)}>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {errors.length === 1 ? (
            errors[0]
          ) : (
            <ul className="list-disc list-inside space-y-1">
              {errors.map((err, index) => (
                <li key={index}>{err}</li>
              ))}
            </ul>
          )}
        </AlertDescription>
        {dismissible && onDismiss && (
          <button
            onClick={onDismiss}
            className="absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </Alert>
    );
  }

  return null;
};

export default ErrorDisplay;
