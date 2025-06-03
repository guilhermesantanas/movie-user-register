
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
