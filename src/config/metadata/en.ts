import { Metadata } from 'next';
import { envPublic } from '../env.public';

const appUrl = envPublic.appUrl;

export const enMetadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: 'Next.js Template - EN',
  description: 'A modern and feature-rich Next.js template',
  keywords: ['next.js', 'template', 'typescript', 'react', 'english'],
  authors: [{ name: 'Your Company' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: appUrl,
    siteName: 'Next.js Template',
    title: 'Next.js Template - EN',
    description: 'A modern and feature-rich Next.js template',
    images: [
      {
        url: '/og-image-en.jpg',
        width: 1200,
        height: 630,
        alt: 'Next.js Template',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Next.js Template - EN',
    description: 'A modern and feature-rich Next.js template',
    images: ['/twitter-image-en.jpg'],
  },
  alternates: {
    canonical: appUrl,
    languages: {
      'en-US': appUrl + '/en',
      'pt-BR': appUrl + '/pt',
    },
  },
};
