type FormatCurrencyOptions = {
  locale?: 'pt-BR' | 'en-US' | 'de-DE' | 'fr-FR';
  decimalPlaces?: number;
  currency?: string;
};

// Mapa de moedas por localidade
const CURRENCY_MAP: Record<string, string> = {
  'pt-BR': 'BRL',
  'en-US': 'USD',
  'de-DE': 'EUR',
  'fr-FR': 'EUR',
};

// Constantes para configurações padrão
const DEFAULT_FORMAT_OPTIONS = {
  locale: 'pt-BR',
  timeZone: 'America/Sao_Paulo',
  style: 'short',
  decimalPlaces: 2,
} as const;

// Função auxiliar para validação de número
function isValidNumber(value: unknown): value is number {
  return typeof value === 'number' && !Number.isNaN(value);
}

// Função auxiliar para validação de string numérica
function isValidNumericString(value: string): boolean {
  return /^\d+$/.test(value);
}

// Função principal de formatação de moeda
export function formatCurrency(
  value: number | string,
  options: FormatCurrencyOptions = {},
): string | null {
  try {
    // Validação do valor
    let numericValue: number;
    if (typeof value === 'string') {
      if (!isValidNumericString(value)) return null;
      numericValue = Number.parseInt(value, 10);
    } else if (isValidNumber(value)) {
      numericValue = value;
    } else {
      return null;
    }

    // Validação e normalização de opções
    const { locale, decimalPlaces, currency } = {
      ...DEFAULT_FORMAT_OPTIONS,
      ...options,
    };

    // Validação de locale
    try {
      new Intl.NumberFormat(locale);
    } catch {
      return null;
    }

    // Validação de decimalPlaces
    if (typeof decimalPlaces !== 'number' || decimalPlaces < 0 || decimalPlaces > 20) {
      return null;
    }

    // Determinação da moeda
    const currencyCode = currency || CURRENCY_MAP[locale] || 'BRL';

    // Normalização do valor
    const normalizedValue = numericValue / 10 ** decimalPlaces;

    // Formatação
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces,
    }).format(normalizedValue);
  } catch {
    return null;
  }
}
