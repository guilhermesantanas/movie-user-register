
import React from 'react';
import LoadingSpinner from './LoadingSpinner';
import { cn } from '@/lib/utils';

export interface LoadingOverlayProps {
  show: boolean;
  message?: string;
  className?: string;
  backdrop?: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  show,
  message = 'Loading...',
  className,
  backdrop = true
}) => {
  if (!show) return null;

  return (
    <div className={cn(
      'absolute inset-0 flex items-center justify-center z-50',
      backdrop && 'bg-background/80 backdrop-blur-sm',
      className
    )}>
      <div className="flex flex-col items-center gap-3 p-6 rounded-lg bg-card border shadow-lg">
        <LoadingSpinner size="lg" />
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
