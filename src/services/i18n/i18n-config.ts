//https://github.com/vercel/next.js/blob/canary/examples/i18n-routing

export const LOCALES = ['en', 'pt'] as const;

export const i18n = {
  defaultLocale: 'pt',
  locales: LOCALES,
} as const;
