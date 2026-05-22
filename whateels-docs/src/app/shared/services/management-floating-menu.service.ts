import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ManagementFloatingMenuService {
  isOpen = signal(false);

  toggle() {
    this.isOpen.set(!this.isOpen());
  }
}
