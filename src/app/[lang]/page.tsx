import { ReactLogo } from 'src/components/react-logo';
import { getDictionary } from 'src/services/i18n/get-dictionary';

import { Button } from 'src/components/ui/button';
import { hrefs } from 'src/config/hrefs';
import Link from 'next/link';
import { Locale } from '@/types/i18n-types';
import { ArrowRight } from 'lucide-react';

export default async function HomePage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  const { home } = dictionary;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary/10">
        <div className="container px-4 py-8 mx-auto">
          <div className="flex flex-col gap-4 items-center">
            <ReactLogo size={128} />
            <h1 className="text-4xl font-bold text-center">{home.title}</h1>
            <p className="text-lg text-center text-muted-foreground">{home.description}</p>
          </div>
        </div>
      </header>

      {/* Features */}
      <section className="py-16">
        <div className="container px-4 mx-auto">
          <h2 className="mb-12 text-3xl font-bold text-center">{home.features.title}</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {home.features.items.map((feature: string) => (
              <div key={feature} className="p-6 rounded-lg shadow-sm bg-card">
                <h3 className="mb-2 text-xl font-semibold">{feature}</h3>
                <div className="mb-4 w-full h-2 rounded-full bg-primary/20" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary/5">
        <div className="container px-4 mx-auto">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{home.cta.title}</h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
              {home.cta.description}
            </p>
            <div className="flex flex-wrap gap-4 justify-center mt-8">
              <Button size="lg" className="gap-2" asChild>
                <Link href={hrefs.auth.signIn}>
                  {home.cta.button}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
