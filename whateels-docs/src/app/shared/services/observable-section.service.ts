import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class ObservableSectionService {
  private platformId = inject(PLATFORM_ID);
  activeSectionId = signal<string | null>(null);
  private observer: IntersectionObserver | null = null;
  private isInitialized = false;

  private initializeObserver(): void {
    if (!isPlatformBrowser(this.platformId) || this.isInitialized) {
      return;
    }

    const root = document.documentElement;
    const headerHeight = getComputedStyle(root)
      .getPropertyValue('--header-height')
      .trim();
    const headerHeightPx = parseFloat(headerHeight) * 16;
    const topMargin = -headerHeightPx;

    const options = {
      root: null,
      rootMargin: `${topMargin}px 0px -66% 0px`,
      threshold: 0,
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.activeSectionId.set(entry.target.id);
        }
      });
    }, options);

    this.isInitialized = true;
  }

  registerElement(element: HTMLElement): void {
    this.initializeObserver();
    this.observer?.observe(element);
  }

  unregisterElement(element: HTMLElement): void {
    this.observer?.unobserve(element);
  }
}
