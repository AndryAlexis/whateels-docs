import { Component, signal, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-right-sidebar',
  imports: [],
  templateUrl: './right-sidebar.html',
  styleUrl: './right-sidebar.css',
})
export class RightSidebar implements OnInit {
  activeSectionId = signal<string | null>(null);
  private platformId = inject(PLATFORM_ID);

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // Get CSS variables
    const root = document.documentElement;
    const headerHeight = getComputedStyle(root).getPropertyValue('--header-height').trim();
    const marginHeaderContent = getComputedStyle(root).getPropertyValue('--margin-header-content').trim();

    // Convert to pixels (assuming rem base is 16px)
    const headerHeightPx = parseFloat(headerHeight) * 16;
    const marginPx = parseFloat(marginHeaderContent) * 16;
    const topMargin = -(headerHeightPx + marginPx);

    const options = {
      root: null,
      rootMargin: `${topMargin}px 0px -66% 0px`,
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.activeSectionId.set(entry.target.id);
        }
      });
    }, options);

    // Observe all h2 elements with ids
    document.querySelectorAll('h2[id]').forEach((heading) => {
      observer.observe(heading);
    });
  }

  isActive(fragmentId: string): boolean {
    return this.activeSectionId() === fragmentId;
  }
}
