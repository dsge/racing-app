import { Injectable } from '@angular/core';
import { ConfirmationService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
/**
 * A global singleton version of primeng's ConfirmationService
 */
export class AppConfirmationService extends ConfirmationService {}
