import 'server-only'

const dictionaries = {
  en: () => import('./en').then((module) => module.default),
  ru: () => import('./ru').then((module) => module.default)
}

export const getDictionary = async (locale: 'en' | 'ru') => {
  try {
    const dictionary = await dictionaries[locale]();
    return dictionary;
  } catch (error) {
    console.error(`Error loading dictionary for locale ${locale}:`, error);
    throw error;
  }
}
