import { Injectable } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';

@Injectable({
  providedIn: 'root',
})
/**
 * A global singleton version of primeng's DialogService
 */
export class ModalService extends DialogService {}
