
import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
  error?: string;
  icon?: React.ReactNode;
  placeholder?: string;
}

const SelectField = React.forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ label, options, error, className, icon, placeholder = "Selecione uma opção", ...props }, ref) => {
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
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}
          <select
            ref={ref}
            className={cn(
              "input-field appearance-none",
              icon && "pl-10",
              error && "border-red-300 focus:border-red-400 focus:ring-red-200",
              className
            )}
            {...props}
          >
            <option value="">{placeholder}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <ChevronDown size={18} />
          </div>
        </div>
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </motion.div>
    );
  }
);

SelectField.displayName = 'SelectField';

export default SelectField;
