import { Provider } from '@angular/core';
import { SUPABASE_CLIENT } from '../tokens/supabase-client';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { Observable, firstValueFrom } from 'rxjs';

const createFakeFetch =
  (supabaseApiResponse$: Observable<Response>) =>
  (): ReturnType<typeof fetch> => {
    return firstValueFrom(supabaseApiResponse$);
  };

const mockSupabaseFactory = (supabaseApiResponse$?: Observable<Response>) => {
  const originalWarn: typeof console.warn = console.warn;
  console.warn = () => {};
  const client: SupabaseClient = createClient('http://fake-url/', 'fake-key', {
    auth: {
      autoRefreshToken: false,
      storageKey: undefined,
      persistSession: false,
      detectSessionInUrl: false,
    },
    global: {
      fetch: supabaseApiResponse$
        ? createFakeFetch(supabaseApiResponse$)
        : undefined,
    },
  });
  console.warn = originalWarn;
  return client;
};

export const provideMockSupabaseClient: (
  supabaseApiResponse$?: Observable<Response>
) => Provider[] = (supabaseApiResponse$?: Observable<Response>): Provider[] => {
  return [
    {
      provide: SUPABASE_CLIENT,
      useFactory: () => mockSupabaseFactory(supabaseApiResponse$),
    },
  ];
};
