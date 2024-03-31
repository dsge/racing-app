import { AuthChangeEvent, AuthError, Session } from '@supabase/supabase-js';

export type SupabaseUserSession = {
  data: {
      session: Session;
  };
  error: null;
} | {
  data: {
      session: null;
  };
  error: AuthError;
} | {
  data: {
      session: null;
  };
  error: null;
}

export interface SupabaseAuthStateChangeEvent {
  event: AuthChangeEvent;
  session: Session | null
}
