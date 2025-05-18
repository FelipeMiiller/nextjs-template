import * as React from 'react';
import { Icons } from './icons';
import { cn } from 'src/lib/utils';

export function ReactLogo({ size = 64, className = '' }: { size?: number; className?: string }) {
  return (
    <Icons.reactLogo width={size} height={size} className={cn('animate-spin-slow-5s', className)} />
  );
}
