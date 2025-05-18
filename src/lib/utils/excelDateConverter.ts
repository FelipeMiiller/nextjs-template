// Lista de fusos horários comuns
export const COMMON_TIMEZONES = {
  'America/Noronha': '-2', // Fernando de Noronha
  'America/Sao_Paulo': '-3', // São Paulo (Horário de Brasília)
  'America/Manaus': '-4', // Manaus (Horário do Amazonas)
  'America/Maceio': '-3', // Maceió (Horário de Brasília)
  'America/Porto_Acre': '-5', // Porto Acre (Horário do Acre)
  'UTC': '0',
} as const;

/**
 * Converte um número serial do Excel para um objeto Date ajustado para um fuso horário específico.
 *
 * O Excel usa um sistema de numeração onde o dia 1 representa 1/1/1900. Esta função
 * converte esse número serial para uma data válida, ajustando automaticamente para
 * o fuso horário desejado.
 *
 * @param excelSerial - Número serial do Excel (1 = 1/1/1900)
 * @param targetTimeZone - Fuso horário de destino (padrão: 'America/Sao_Paulo')
 * @returns Objeto Date ajustado para o fuso horário especificado
 * @throws Se o excelSerial não for um número válido ou se o fuso horário for inválido
 */
export function convertExcelSerialToDate(
  excelSerial: number,
  targetTimeZone: keyof typeof COMMON_TIMEZONES = 'America/Sao_Paulo',
): Date {
  // Validação do parâmetro
  if (typeof excelSerial !== 'number' || Number.isNaN(excelSerial)) {
    throw new Error('O número serial do Excel deve ser um número válido');
  }

  // Constante para a base do Excel (1/1/1900)
  const EXCEL_BASE_DATE = new Date(Date.UTC(1900, 0, 1));

  // Cálculo do timestamp
  const timestamp = EXCEL_BASE_DATE.getTime() + (excelSerial - 1) * 86400000;

  // Criação do objeto Date
  const date = new Date(timestamp);

  // Validação do fuso horário
  try {
    new Intl.DateTimeFormat('pt-BR', { timeZone: targetTimeZone });
  } catch {
    throw new Error(`Fuso horário inválido: ${targetTimeZone}`);
  }

  // Ajuste para o fuso horário especificado
  const utcOffset = date.getTimezoneOffset() * 60000; // Converte minutos para milissegundos
  const adjustedDate = new Date(date.getTime() + utcOffset);

  return adjustedDate;
}

/**
 * Converte uma data do Excel (em formato serial) para uma string formatada.
 *
 * @param excelSerial - Número serial do Excel
 * @param options - Opções de formatação
 * @returns String formatada da data
 */
export function formatExcelDate(
  excelSerial: number,
  options: {
    locale?: string;
    timeZone?: keyof typeof COMMON_TIMEZONES;
    format?: 'short' | 'medium' | 'long' | 'full';
  } = {},
): string {
  const date = convertExcelSerialToDate(excelSerial, options.timeZone);
  return date.toLocaleString(options.locale ?? 'pt-BR', {
    dateStyle: options.format ?? 'medium',
    timeZone: options.timeZone ?? 'America/Sao_Paulo',
  });
}
