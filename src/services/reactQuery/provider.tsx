//https://tanstack.com/query/latest/docs/framework/react/guides/ssr

'use client';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type * as React from 'react';
import GetQueryClient from './get-query-client';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createIDBPersister } from './persister';

type ProviderQueryProps = {
  children: React.ReactNode;
  dehydratedState?: unknown;
};

export default function ProviderQuery({ children }: ProviderQueryProps) {
  return (
    <PersistQueryClientProvider
      client={GetQueryClient()}
      persistOptions={{ persister: createIDBPersister() }}
    >
      {children}

      <ReactQueryDevtools />
    </PersistQueryClientProvider>
  );
}
