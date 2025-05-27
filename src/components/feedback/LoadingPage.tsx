
import React from 'react';
import LoadingSpinner from './LoadingSpinner';
import { cn } from '@/lib/utils';

export interface LoadingPageProps {
  message?: string;
  className?: string;
}

const LoadingPage: React.FC<LoadingPageProps> = ({
  message = 'Loading...',
  className
}) => {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center min-h-[50vh] gap-4',
      className
    )}>
      <LoadingSpinner size="xl" />
      <p className="text-lg text-muted-foreground">{message}</p>
    </div>
  );
};

export default LoadingPage;
