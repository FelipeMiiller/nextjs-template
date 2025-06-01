import { GalleryVerticalEnd } from 'lucide-react';
import { ReactLogo } from 'src/components/react-logo';
import { getDictionary } from 'src/services/i18n/get-dictionary';
import { Locale } from 'src/types/i18n-types';
import { SignUpForm } from './components/signup-form';
import { Dictionary } from 'src/types/i18n-types';
import { hrefs } from '@/config/hrefs';

export default async function SignUpPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  const { common, auth } = dictionary as Dictionary;

  return (
    <div data-testid="home-page" className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex gap-2 justify-center md:justify-start">
          <a href={hrefs.home} className="flex gap-2 items-center font-medium">
            <div className="flex justify-center items-center w-6 h-6 rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            {common.companyName}
          </a>
        </div>
        <div className="flex flex-1 justify-center items-center">
          <div className="w-full max-w-xs">
            <SignUpForm dictionary={auth.signUp} />
          </div>
        </div>
      </div>
      <div className="hidden relative justify-center items-center bg-muted lg:flex">
        <div className="flex flex-col gap-4 items-center">
          <span data-testid="react-logo" className="mb-2">
            {/* Ícone React animado */}
            <ReactLogo size={128} />
          </span>
          <h1 data-testid="title" className="text-2xl font-bold">
            {auth.signUp.title}
          </h1>
          <span data-testid="subtitle" className="text-sm text-muted-foreground">
            {auth.signUp.subtitle}
          </span>
        </div>
      </div>
    </div>
  );
}
