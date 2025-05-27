
import React from 'react';
import { Globe } from 'lucide-react';
import SelectField from '@/components/SelectField';
import { languageNames } from '@/utils/languageUtils';

interface LanguageSelectorProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  label?: string;
  id?: string;
  name?: string;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  value,
  onChange,
  label = "Preferred Language",
  id = "language",
  name = "language"
}) => {
  const languageOptions = Object.entries(languageNames).map(([code, name]) => ({
    value: code,
    label: name
  }));

  return (
    <SelectField
      label={label}
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      options={[
        { value: "", label: "Choose your language" },
        ...languageOptions
      ]}
      icon={<Globe size={18} />}
      placeholder="Choose your language"
    />
  );
};

export default LanguageSelector;
