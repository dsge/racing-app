import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
/**
 * A global singleton version of primeng's MessageService
 */
export class ToastService extends MessageService {}
