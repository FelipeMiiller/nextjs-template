//https://tanstack.com/query/latest/docs/framework/react/plugins/persistQueryClient/#building-a-persister

import { get, set, del } from 'idb-keyval';
import { PersistedClient, Persister } from '@tanstack/react-query-persist-client';

/**
 * Creates an Indexed DB persister
 * @see https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API
 */
export function createIDBPersister(idbValidKey: IDBValidKey = 'reactQueryLab42') {
  return {
    persistClient: async (client: PersistedClient) => {
      try {
        await set(idbValidKey, client);
      } catch (error) {
        // Tenta serializar para JSON para encontrar o campo problemático
        let serializable = true;
        try {
          JSON.stringify(client);
        } catch (jsonError) {
          serializable = false;
          console.error(
            '[React Query Persist] Erro ao serializar client para IndexedDB:',
            jsonError,
          );
          console.error('[React Query Persist] Conteúdo do client:', client);
        }
        if (serializable) {
          console.error('[React Query Persist] Erro ao salvar no IndexedDB:', error);
          console.error('[React Query Persist] Conteúdo do client (serializável):', client);
        }
        throw error;
      }
    },
    restoreClient: async () => {
      return await get<PersistedClient>(idbValidKey);
    },
    removeClient: async () => {
      await del(idbValidKey);
    },
  } satisfies Persister;
}
