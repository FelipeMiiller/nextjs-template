import { hrefs } from '@/config/hrefs';
import { ColorModeSwitcher } from 'src/components/color-mode-switcher';
import { ReactLogo } from 'src/components/react-logo';
import { Button } from 'src/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'src/components/ui/card';
import { getDictionary } from 'src/services/i18n';
import { Locale } from 'src/types/i18n-types';

export default async function InterfacePage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  const { common, interface: intl } = dictionary;
  return (
    <div className="flex flex-col w-full min-h-screen bg-background">
      {/* Header with theme toggle */}
      <header className="flex justify-end p-4 w-full">
        <ColorModeSwitcher className="w-10 h-10" />
      </header>

      {/* Main content */}
      <main className="flex flex-1 justify-center items-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <ReactLogo size={80} className="animate-bounce" />
            </div>
            <CardTitle className="text-2xl font-bold text-center">{common.welcome}</CardTitle>
            <CardDescription className="text-center">{intl.accountStatus}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex justify-center mt-4">
              <Button variant="outline" className="w-full">
                {intl.actions.viewDashboard}
              </Button>
            </div>
            <div className="flex justify-center">
              <form action={hrefs.auth.signOut} method="POST" className="w-full">
                <Button type="submit" variant="destructive" className="mt-2 w-full">
                  {common.signOut}
                </Button>
              </form>
            </div>
            <div className="relative">
              <div className="flex absolute inset-0 items-center">
                <span className="w-full border-t" />
              </div>
              <div className="flex relative justify-center text-xs uppercase">
                <span className="px-2 text-muted-foreground">{intl.actions.quickActions}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm">
                {intl.actions.profile}
              </Button>
              <Button variant="outline" size="sm">
                {intl.actions.settings}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
