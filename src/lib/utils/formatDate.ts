// Common timezones for Brazilian timezones and UTC
type TimeZone = 'America/Sao_Paulo' | 'America/Manaus' | 'America/Noronha' | 'UTC';

interface FormatDateOptions {
  locale?: string;
  timeZone?: TimeZone;
  includeTime?: boolean;
  format?: 'short' | 'medium' | 'long' | 'full';
}

/**
 * Formats a date according to the specified options
 * @param date - The date to format (string, Date, or timestamp)
 * @param options - Formatting options
 * @param includeTimeZone - Whether to include the timezone in the output
 * @returns Formatted date string or null if invalid
 */
export function formatDate(
  date: string | Date | number,
  options: FormatDateOptions = {},
  includeTimeZone?: boolean,
): string | null {
  const {
    locale = 'pt-BR',
    timeZone = 'America/Sao_Paulo',
    includeTime = false,
    format = 'short',
  } = options;

  try {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return null;

    const formatOptions: Intl.DateTimeFormatOptions = {
      dateStyle: format,
      timeZone,
    };

    if (includeTime) {
      formatOptions.timeStyle = 'short';
    }

    // Formata o fuso horário
    const timeZoneFormat = new Intl.DateTimeFormat('pt-BR', {
      timeZoneName: 'shortOffset',
      timeZone,
    });

    if (includeTimeZone) {
      return `${new Intl.DateTimeFormat(locale, formatOptions).format(dateObj)} (${timeZoneFormat.format(dateObj)})`;
    }

    return new Intl.DateTimeFormat(locale, formatOptions).format(dateObj);
  } catch {
    return null;
  }
}

/**
 * Formats a date to a simple DD/MM/YYYY string (Brazilian format)
 */
export function formatDateSimple(
  date: string | Date | number,
  includeTimeZone?: boolean,
): string | null {
  return formatDate(date, { format: 'short' }, includeTimeZone);
}
