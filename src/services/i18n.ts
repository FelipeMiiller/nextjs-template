import { Dictionary, Locale } from '../types/i18n-types';

// Importa os dicionários
import en from './i18n/dictionaries/en';
import pt from './i18n/dictionaries/pt';

// Mapa de dicionários disponíveis
const dictionaries: Record<Locale, Dictionary> = {
  en,
  pt,
};

// Função para obter o dicionário do idioma especificado
export async function getDictionary(locale: Locale): Promise<Dictionary> {
  // Retorna o dicionário do idioma ou o inglês como fallback
  return dictionaries[locale] || dictionaries.en;
}

// Função para obter apenas uma parte do dicionário
export async function getDictionarySection<K extends keyof Dictionary>(
  locale: Locale,
  section: K,
): Promise<Dictionary[K]> {
  const dict = await getDictionary(locale);
  return dict[section];
}

// Tipos úteis para as páginas
export type DictionaryProps = {
  params: { lang: Locale };
};

export type DictionaryPageProps<T = Dictionary> = {
  params: { lang: Locale };
} & T;
