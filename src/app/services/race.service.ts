import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RaceService {

  constructor() {
    /*from(this.supabaseClient.from('races').select().returns<object>()).subscribe((value: unknown) => {
      console.log('races', value)
    })*/
  }
}
