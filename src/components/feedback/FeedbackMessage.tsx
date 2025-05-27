
import React from 'react';
import { CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

export type FeedbackType = 'success' | 'error' | 'warning' | 'info';

export interface FeedbackMessageProps {
  type: FeedbackType;
  message: string;
  className?: string;
  variant?: 'inline' | 'alert';
}

const iconMap = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info
};

const colorMap = {
  success: 'text-green-600',
  error: 'text-destructive',
  warning: 'text-orange-600',
  info: 'text-blue-600'
};

const alertColorMap = {
  success: 'border-green-200 bg-green-50 text-green-800',
  error: 'border-destructive bg-destructive/10 text-destructive',
  warning: 'border-orange-200 bg-orange-50 text-orange-800',
  info: 'border-blue-200 bg-blue-50 text-blue-800'
};

const FeedbackMessage: React.FC<FeedbackMessageProps> = ({
  type,
  message,
  className,
  variant = 'inline'
}) => {
  const Icon = iconMap[type];

  if (variant === 'inline') {
    return (
      <div className={cn('flex items-center gap-2', colorMap[type], className)}>
        <Icon className="h-4 w-4" />
        <p className="text-sm">{message}</p>
      </div>
    );
  }

  return (
    <Alert className={cn(alertColorMap[type], className)}>
      <Icon className="h-4 w-4" />
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
};

export default FeedbackMessage;
