
import React from 'react';
import { MapPin } from 'lucide-react';
import SelectField from '@/components/SelectField';

interface CountrySelectorProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  label?: string;
  id?: string;
  name?: string;
}

const CountrySelector: React.FC<CountrySelectorProps> = ({
  value,
  onChange,
  label = "País",
  id = "country",
  name = "country"
}) => {
  const countryOptions = [
    { value: "", label: "Selecione um país" },
    { value: "au", label: "Austrália" },
    { value: "br", label: "Brasil" },
    { value: "ca", label: "Canadá" },
    { value: "us", label: "Estados Unidos" },
    { value: "fr", label: "França" },
    { value: "de", label: "Alemanha" },
    { value: "jp", label: "Japão" },
    { value: "mx", label: "México" },
    { value: "uk", label: "Reino Unido" }
  ];

  return (
    <SelectField
      label={label}
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      options={countryOptions}
      icon={<MapPin size={18} />}
    />
  );
};

export default CountrySelector;
