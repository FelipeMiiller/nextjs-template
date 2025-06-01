import { Metadata } from 'next';
import { envPublic } from '../env.public';

const appUrl = envPublic.appUrl;

export const ptMetadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: 'Template Next.js - PT',
  description: 'Um template moderno e rico em recursos para Next.js',
  keywords: ['next.js', 'template', 'typescript', 'react', 'pt-br'],
  authors: [{ name: 'Sua Empresa' }],
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: appUrl,
    siteName: 'Template Next.js',
    title: 'Template Next.js - PT',
    description: 'Um template moderno e rico em recursos para Next.js',
    images: [
      {
        url: '/og-image-pt.jpg',
        width: 1200,
        height: 630,
        alt: 'Template Next.js',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Template Next.js - PT',
    description: 'Um template moderno e rico em recursos para Next.js',
    images: ['/twitter-image-pt.jpg'],
  },
  alternates: {
    canonical: appUrl,
    languages: {
      'pt-BR': appUrl + '/pt',
      'en-US': appUrl + '/en',
    },
  },
};
