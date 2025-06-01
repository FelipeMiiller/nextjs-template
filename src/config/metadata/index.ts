import { Metadata } from 'next';
import { enMetadata } from './en';
import { ptMetadata } from './pt';
import { Locale } from '@/types/i18n-types';

export const metadataByLocale: Record<Locale, Metadata> = {
  en: enMetadata,
  pt: ptMetadata,
};

export const defaultMetadata: Metadata = {
  metadataBase: new URL('https://yoursite.com'),
  title: 'Next.js Template',
  description: 'A modern and feature-rich Next.js template',
  authors: [{ name: 'Your Company' }],
  openGraph: {
    type: 'website',
    siteName: 'Next.js Template',
  },
  twitter: {
    card: 'summary_large_image',
  },
};
