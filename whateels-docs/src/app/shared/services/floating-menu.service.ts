import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FloatingMenu {
  isOpen = signal<boolean>(false);

  get isOpenValue(): boolean {
    return this.isOpen();
  }
  
  toggle(): void {
    this.isOpen.set(!this.isOpen());
  }
}