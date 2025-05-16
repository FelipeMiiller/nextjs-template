'use client';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from './ui/button';
import { cn } from 'src/lib/utils';

export function ColorModeSwitcher({ className }: React.HTMLAttributes<HTMLElement>) {
  const { setTheme } = useTheme();

  return (
    <>
      <Button
        variant="link"
        size="icon"
        onClick={() => setTheme('dark')}
        className={cn('dark:hidden cursor-pointer', className)}
      >
        <Moon />
      </Button>

      <Button
        variant="link"
        size="icon"
        onClick={() => setTheme('light')}
        className={cn('hidden dark:flex cursor-pointer', className)}
      >
        <Sun />
      </Button>
    </>
  );
}
