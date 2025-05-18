import 'server-only';
import { Locale, i18n } from './i18n-config';
import { Dictionary } from 'src/types/i18n-types';

type DictionaryModule<T> = { default: T };

async function importDictionary<T>(locale: Locale): Promise<T> {
  try {
    // Importa o módulo TypeScript
    const dict = await import(`./dictionaries/${locale}.ts`);
    return (dict as DictionaryModule<T>).default;
  } catch (error) {
    console.error(`Error importing dictionary for ${locale}:`, error);
    return {} as T;
  }
}

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  try {
    // Garantir que o locale seja válido
    if (!locale || !i18n.locales.includes(locale)) {
      console.warn('Invalid locale provided to getDictionary');
      locale = i18n.defaultLocale;
    }

    const dict = await importDictionary<Dictionary>(locale);
    return dict as Dictionary;
  } catch (error) {
    console.error('Error in getDictionary:', error);
    return {} as Dictionary;
  }
}
