
import React from 'react';
import { Button } from '@/components/ui/button';
import LoadingSpinner from './LoadingSpinner';
import { cn } from '@/lib/utils';

export interface LoadingButtonProps extends React.ComponentProps<typeof Button> {
  loading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
  loading = false,
  loadingText,
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <Button
      {...props}
      disabled={disabled || loading}
      className={cn(className)}
    >
      {loading && <LoadingSpinner size="sm" className="mr-2" />}
      {loading ? (loadingText || children) : children}
    </Button>
  );
};

export default LoadingButton;
