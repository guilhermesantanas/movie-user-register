
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FieldErrorProps {
  error?: string | null;
  className?: string;
  show?: boolean;
}

const FieldError: React.FC<FieldErrorProps> = ({
  error,
  className,
  show = true
}) => {
  if (!error || !show) return null;

  return (
    <p className={cn(
      'text-sm text-destructive flex items-center gap-1 mt-1 animate-fade-in',
      className
    )}>
      <AlertCircle className="h-3 w-3 flex-shrink-0" />
      {error}
    </p>
  );
};

export default FieldError;
