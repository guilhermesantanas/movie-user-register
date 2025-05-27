
import { useState, useCallback } from 'react';

export interface FormField<T = any> {
  value: T;
  error: string | null;
  touched: boolean;
}

export interface UseFormStateOptions<T> {
  initialValues: T;
  validators?: Partial<Record<keyof T, (value: any) => string | null>>;
}

export const useFormState = <T extends Record<string, any>>({
  initialValues,
  validators = {}
}: UseFormStateOptions<T>) => {
  const [fields, setFields] = useState<Record<keyof T, FormField<T[keyof T]>>>(() => {
    const initialFields: Record<keyof T, FormField<T[keyof T]>> = {} as any;
    
    Object.keys(initialValues).forEach(key => {
      const fieldKey = key as keyof T;
      initialFields[fieldKey] = {
        value: initialValues[fieldKey],
        error: null,
        touched: false
      };
    });
    
    return initialFields;
  });

  const updateField = useCallback((name: keyof T, value: T[keyof T]) => {
    setFields(prev => ({
      ...prev,
      [name]: {
        ...prev[name],
        value,
        touched: true,
        error: validators[name] ? validators[name]!(value) : null
      }
    }));
  }, [validators]);

  const validateField = useCallback((name: keyof T) => {
    const field = fields[name];
    const validator = validators[name];
    
    if (validator) {
      const error = validator(field.value);
      setFields(prev => ({
        ...prev,
        [name]: {
          ...prev[name],
          error,
          touched: true
        }
      }));
      return error === null;
    }
    
    return true;
  }, [fields, validators]);

  const validateAll = useCallback(() => {
    let isValid = true;
    const newFields = { ...fields };

    Object.keys(fields).forEach(key => {
      const fieldName = key as keyof T;
      const validator = validators[fieldName];
      
      if (validator) {
        const error = validator(fields[fieldName].value);
        newFields[fieldName] = {
          ...newFields[fieldName],
          error,
          touched: true
        };
        
        if (error !== null) {
          isValid = false;
        }
      }
    });

    setFields(newFields);
    return isValid;
  }, [fields, validators]);

  const reset = useCallback(() => {
    const resetFields: Record<keyof T, FormField<T[keyof T]>> = {} as any;
    
    Object.keys(initialValues).forEach(key => {
      const fieldKey = key as keyof T;
      resetFields[fieldKey] = {
        value: initialValues[fieldKey],
        error: null,
        touched: false
      };
    });
    
    setFields(resetFields);
  }, [initialValues]);

  const getValues = useCallback((): T => {
    const values = {} as T;
    
    Object.keys(fields).forEach(key => {
      const fieldKey = key as keyof T;
      values[fieldKey] = fields[fieldKey].value;
    });
    
    return values;
  }, [fields]);

  const hasErrors = Object.values(fields).some(field => field.error !== null);
  const isFormTouched = Object.values(fields).some(field => field.touched);

  return {
    fields,
    updateField,
    validateField,
    validateAll,
    reset,
    getValues,
    hasErrors,
    isFormTouched
  };
};
