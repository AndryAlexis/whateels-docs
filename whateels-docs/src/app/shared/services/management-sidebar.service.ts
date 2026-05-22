import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ManagementSidebarService {
  isOpen = signal<boolean>(false);

  open(): void {
    console.log('Opening management sidebar');
    this.isOpen.set(true);
    document.body.style.overflow = 'hidden';
  }

  close(): void {
    console.log('Closing management sidebar');
    this.isOpen.set(false);
    document.body.style.overflow = '';
  }
}