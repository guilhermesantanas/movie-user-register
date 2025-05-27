
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
  label = "Country",
  id = "country",
  name = "country"
}) => {
  const countryOptions = [
    { value: "", label: "Choose your country" },
    { value: "au", label: "Australia" },
    { value: "br", label: "Brazil" },
    { value: "ca", label: "Canada" },
    { value: "fr", label: "France" },
    { value: "de", label: "Germany" },
    { value: "jp", label: "Japan" },
    { value: "mx", label: "Mexico" },
    { value: "uk", label: "United Kingdom" },
    { value: "us", label: "United States" }
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
      placeholder="Choose your country"
    />
  );
};

export default CountrySelector;
