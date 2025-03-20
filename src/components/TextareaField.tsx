
import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface TextareaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

const TextareaField = React.forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <motion.div 
        className="mb-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <label className="block text-sm font-medium mb-1" htmlFor={props.id || props.name}>
          {label}
        </label>
        <textarea
          ref={ref}
          className={cn(
            "input-field min-h-[100px] resize-y",
            error && "border-red-300 focus:border-red-400 focus:ring-red-200",
            className
          )}
          {...props}
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </motion.div>
    );
  }
);

TextareaField.displayName = 'TextareaField';

export default TextareaField;
