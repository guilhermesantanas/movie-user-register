
export const countryLanguageMap: Record<string, string> = {
  'BR': 'pt',
  'US': 'en',
  'CA': 'en',
  'MX': 'es',
  'FR': 'fr',
  'GB': 'en',
  'DE': 'de',
  'JP': 'ja',
  'AU': 'en'
};

export const languageNames: Record<string, string> = {
  'en': 'English',
  'pt': 'Português',
  'es': 'Español',
  'fr': 'Français',
  'de': 'Deutsch',
  'ja': '日本語'
};

export const getLanguageFromCountry = (country: string): string => {
  return countryLanguageMap[country] || 'en';
};

export const getLanguageName = (code: string): string => {
  return languageNames[code] || 'English';
};

// Helper to get all available languages for dropdowns
export const getAllLanguages = () => {
  return Object.entries(languageNames).map(([code, name]) => ({
    value: code,
    label: name
  }));
};

// Helper to get all countries that have language mappings
export const getAllCountries = () => {
  const countryNames: Record<string, string> = {
    'BR': 'Brazil',
    'US': 'United States',
    'CA': 'Canada',
    'MX': 'Mexico',
    'FR': 'France',
    'GB': 'United Kingdom',
    'DE': 'Germany',
    'JP': 'Japan',
    'AU': 'Australia'
  };

  return Object.entries(countryNames).map(([code, name]) => ({
    value: code,
    label: name
  }));
};
