import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Providers from 'src/components/providers';

import { Metadata } from 'next';

import { metadataByLocale } from 'src/config/metadata';
import { Locale } from '@/types/i18n-types';
import { i18n } from '@/services/i18n/i18n-config';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
  const { lang } = await params;

  // Obter os metadados específicos do idioma
  const localeMetadata = metadataByLocale[lang];
  // Mesclar os metadados padrão com os específicos do idioma
  return {
    ...localeMetadata,
  };
}

export default async function RootLayout(props: {
  children: React.ReactNode;
  params: Promise<{ lang: Locale }>;
}) {
  const params = await props.params;

  const { children } = props;

  return (
    <html lang={params.lang} suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          lang={params.lang}
        >
          {children}
        </Providers>
      </body>
    </html>
  );
}
