import { Provider } from '@angular/core';
import { ApiService } from '../api.service';

/**
 * Use this in your tests when you need to use the ApiService
 */
export const provideMockApiService: () => Provider[] = (): Provider[] => {
  return [
    {
      provide: ApiService,
      useFactory: (): ApiService => {
        return jasmine.createSpyObj('MockApiService', ['getSupabaseClient'])
      }
    }
  ];
}
