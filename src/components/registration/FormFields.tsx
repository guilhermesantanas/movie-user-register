
import React from 'react';
import { User, Mail, Lock, Calendar } from 'lucide-react';
import InputField from '@/components/InputField';
import LanguageSelector from '@/components/LanguageSelector';
import CountrySelector from '@/components/registration/CountrySelector';

interface FormFieldsProps {
  formData: {
    name: string;
    email: string;
    password: string;
    dob: string;
    country: string;
    language: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const FormFields: React.FC<FormFieldsProps> = ({ formData, onChange }) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <InputField
        label="Username"
        id="name"
        name="name"
        placeholder="Enter your username"
        required
        value={formData.name}
        onChange={onChange}
        icon={<User size={18} />}
      />
      
      <InputField
        label="Email"
        id="email"
        name="email"
        type="email"
        placeholder="Enter your email address"
        required
        value={formData.email}
        onChange={onChange}
        icon={<Mail size={18} />}
      />
      
      <InputField
        label="Password"
        id="password"
        name="password"
        type="password"
        placeholder="Create a strong password"
        required
        value={formData.password}
        onChange={onChange}
        icon={<Lock size={18} />}
      />
      
      <InputField
        label="Date of Birth"
        id="dob"
        name="dob"
        type="date"
        value={formData.dob}
        onChange={onChange}
        icon={<Calendar size={18} />}
      />
      
      <CountrySelector
        value={formData.country}
        onChange={onChange}
      />

      <LanguageSelector
        label="Preferred Language"
        value={formData.language}
        onChange={onChange}
      />
    </div>
  );
};

export default FormFields;
