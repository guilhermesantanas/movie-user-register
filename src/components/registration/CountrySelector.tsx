
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
    { value: "AU", label: "Australia" },
    { value: "BR", label: "Brazil" },
    { value: "CA", label: "Canada" },
    { value: "FR", label: "France" },
    { value: "DE", label: "Germany" },
    { value: "JP", label: "Japan" },
    { value: "MX", label: "Mexico" },
    { value: "GB", label: "United Kingdom" },
    { value: "US", label: "United States" }
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
