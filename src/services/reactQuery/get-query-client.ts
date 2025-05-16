import {
  QueryClient,
  QueryClientConfig,
  defaultShouldDehydrateQuery,
  isServer,
} from '@tanstack/react-query';

export const queryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60 * 12, // 12 hours
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
      retry: 3,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    },
    mutations: {
      retry: 3,
    },
    dehydrate: {
      // include pending queries in dehydration
      shouldDehydrateQuery: (query) =>
        defaultShouldDehydrateQuery(query) || query.state.status === 'pending',
    },
  },
};

function makeQueryClient() {
  return new QueryClient({
    ...queryClientConfig,
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

export default function GetQueryClient() {
  if (isServer) {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

// Função para invalidar apenas a query do usuário
export function invalidateQueries(queryKey: string[]) {
  // React Query Client para invalidar cache
  const queryClient = GetQueryClient();
  queryClient.invalidateQueries({ queryKey });
}
