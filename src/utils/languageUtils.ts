
export const countryLanguageMap: Record<string, string> = {
  'br': 'pt',
  'us': 'en',
  'ca': 'en',
  'mx': 'es',
  'fr': 'fr',
  'uk': 'en',
  'de': 'de',
  'jp': 'ja',
  'au': 'en'
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
