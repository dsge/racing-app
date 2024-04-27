import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';
import { provideMockSupabaseClient } from '../providers/provide-mock-supabase-client';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../tokens/supabase-client';

describe('UserService', () => {
  let service: UserService;
  let supabaseClient: SupabaseClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockSupabaseClient()
      ]
    });
    service = TestBed.inject(UserService);
    supabaseClient = TestBed.inject(SUPABASE_CLIENT)
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('signInWithPassword', () => {
    it('should call supabase signInWithPassword', () => {
      supabaseClient.auth.signInWithPassword = jasmine.createSpy().and.resolveTo(null);
      service.signInWithPassword({
        email: 'foo',
        password: 'bar'
      });
      expect(supabaseClient.auth.signInWithPassword).toHaveBeenCalledTimes(1);
    })
  })

  describe('signOut', () => {
    it('should call supabase signOut', () => {
      supabaseClient.auth.signOut = jasmine.createSpy().and.resolveTo(null);
      service.signOut();
      expect(supabaseClient.auth.signOut).toHaveBeenCalledTimes(1);
    })
  })
});
