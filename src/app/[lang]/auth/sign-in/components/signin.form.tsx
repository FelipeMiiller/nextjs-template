'use client';
import { cn } from 'src/lib/utils';
import { Input } from 'src/components/ui/input';
import { Label } from 'src/components/ui/label';
import { Button } from 'src/components/ui/button';
import { AuthTranslations } from 'src/types/i18n-types';
import { Icons } from 'src/components/icons';

import { useActionState } from 'react';
import { signIn } from 'src/server/actions/auth.actions';
import { toast } from 'sonner';
import { routesBackend } from 'src/config/routes';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { hrefs } from 'src/config/hrefs';

interface SignInFormProps extends React.ComponentPropsWithoutRef<'form'> {
  dictionary: AuthTranslations['signIn'];
}

export function SignInForm({ className, dictionary, ...props }: SignInFormProps) {
  const [state, action, isPending] = useActionState(signIn, undefined);

  useEffect(() => {
    if (state) {
      if (state.error) {
        // Show field validation errors
        Object.values(state.error).forEach((errors) => {
          if (Array.isArray(errors)) {
            errors.forEach((error) => {
              toast.error(error);
            });
          }
        });
      } else if (state.message) {
        // Show general error message
        toast.error(state.message);
      }
    }
  }, [state]);

  return (
    <form action={action} className={cn('flex flex-col gap-6', className)} {...props}>
      <div className="flex flex-col gap-2 items-center text-center">
        <h1 className="text-2xl font-bold">{dictionary.title}</h1>
        <p className="text-sm text-balance text-muted-foreground">{dictionary.subtitle}</p>
      </div>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">{dictionary.fields.email.label}</Label>
          <Input
            id="email"
            type="email"
            name="email"
            placeholder={dictionary.fields.email.placeholder}
            required
            disabled={isPending}
            aria-invalid={state?.error?.email ? 'true' : 'false'}
            aria-describedby="email-error"
            className={cn({
              'border-destructive focus-visible:ring-destructive': state?.error?.email,
            })}
          />
          {state?.error?.email && (
            <p id="email-error" className="text-sm font-medium text-destructive">
              {state.error.email.join(', ')}
            </p>
          )}
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">{dictionary.fields.password.label}</Label>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline text-muted-foreground"
              aria-disabled={isPending}
            >
              {dictionary.actions.forgotPassword}
            </a>
          </div>
          <Input
            id="password"
            type="password"
            name="password"
            required
            disabled={isPending}
            aria-invalid={state?.error?.password ? 'true' : 'false'}
            aria-describedby="password-error"
            className={cn({
              'border-destructive focus-visible:ring-destructive': state?.error?.password,
            })}
          />
          {state?.error?.password && (
            <p id="password-error" className="text-sm font-medium text-destructive">
              {state.error.password.join(', ')}
            </p>
          )}
        </div>
        <Button type="submit" data-testid="login-button" className="w-full" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 w-4 h-4 animate-spin" />
              {dictionary.actions.submit}
            </>
          ) : (
            dictionary.actions.submit
          )}
        </Button>
        <div className="relative">
          <div className="flex absolute inset-0 items-center">
            <span className="w-full border-t" />
          </div>
          <div className="flex relative justify-center text-xs uppercase">
            <span className="px-2 bg-background text-muted-foreground">
              {dictionary.footer.orContinueWith}
            </span>
          </div>
        </div>
        <Button variant="outline" type="button" className="w-full" disabled={isPending} asChild>
          <a
            href={routesBackend.auth.google.login}
            className="flex gap-2 justify-center items-center"
          >
            <Icons.google className="w-4 h-4" />
            {dictionary.footer.google}
          </a>
        </Button>
      </div>
      <div className="text-sm text-center">
        {dictionary.actions.noAccount}{' '}
        <a href={hrefs.auth.signUp} className="underline underline-offset-4">
          {dictionary.actions.signUp}
        </a>
      </div>
    </form>
  );
}
