
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import FormFields from '@/components/registration/FormFields';
import SubmitSection from '@/components/registration/SubmitSection';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';
import { getLanguageFromCountry } from '@/utils/languageUtils';

interface RegistrationFormProps {
  onSuccess?: () => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSuccess }) => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    dob: '',
    country: '',
    language: 'en'
  });
  
  const [userConsent, setUserConsent] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Auto-sync language when country changes
    if (name === 'country' && value) {
      const suggestedLanguage = getLanguageFromCountry(value);
      setFormData(prev => ({ 
        ...prev, 
        [name]: value,
        language: suggestedLanguage
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userConsent) {
      toast.error('You must agree to the terms and conditions to continue.');
      return;
    }

    // Validate email
    if (!formData.email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    // Validate password
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    // Validate username
    if (!formData.name.trim()) {
      toast.error('Please enter your username');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log("Starting registration process");
      // Register user with our signUp function
      const { error, data } = await signUp(formData.email, formData.password, {
        name: formData.name
      });
      
      if (error) throw error;
      
      console.log("User registered successfully:", data);
      
      // Create profile entry in profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: data.user?.id,
          name: formData.name,
          email: formData.email,
          birth_date: formData.dob,
          country: formData.country,
          language: formData.language,
          user_type: 'customer' // Default to customer
        });
      
      if (profileError) {
        console.error("Profile creation error:", profileError);
        throw profileError;
      }
      
      // Store language preference in localStorage
      localStorage.setItem('userLanguage', formData.language);
      
      toast.success('User registered successfully! Please log in to continue.');
      navigate('/login');
      onSuccess?.();
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(`Error registering user: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormFields 
        formData={formData}
        onChange={handleChange}
      />
      
      <SubmitSection 
        userConsent={userConsent}
        onConsentChange={setUserConsent}
        isSubmitting={isSubmitting}
      />
    </form>
  );
};

export default RegistrationForm;
